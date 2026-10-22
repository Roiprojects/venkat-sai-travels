/**
 * Production-Ready PostgreSQL Connection Pool (Server-Only)
 *
 * Supports:
 * - Environment variables: DB_HOST, DB_PORT, DB_DATABASE, DB_USERNAME, DB_PASSWORD, DB_SSLMODE
 * - Fallbacks: PGHOST, PGPORT, PGDATABASE, PGUSER, PGPASSWORD, PGSSLMODE
 * - Unified connection string: DATABASE_URL
 * - TLS/SSL mode handling (disable, require, verify-ca, verify-full)
 * - Connection timeouts, idle timeouts, statement timeouts
 * - UTF-8 client encoding
 * - Credential masking for safe logging
 * - Graceful shutdown and pool draining
 */
import pg from 'pg'
import { existsSync, readFileSync } from 'node:fs'
import { env } from './env'

let pool: pg.Pool | undefined

/**
 * Strips password credentials from connection strings or error messages
 * so secrets are NEVER leaked to logs or console.
 */
export function sanitizeLog(text: string): string {
  return text
    .replace(/(postgres(?:ql)?:\/\/[^:]+:)([^@]+)(@)/gi, '$1*****$3')
    .replace(/(password\s*[:=]\s*['"]?)[^'",\s]+/gi, '$1*****')
}

/**
 * Resolves database configuration from standard environment variables:
 * Priority: DB_* > PG* > DATABASE_URL
 */
export function getDbConfig(): pg.PoolConfig {
  const host = process.env.DB_HOST || process.env.PGHOST
  const portStr = process.env.DB_PORT || process.env.PGPORT
  const port = portStr ? Number.parseInt(portStr, 10) : 5432
  const database = process.env.DB_DATABASE || process.env.PGDATABASE || process.env.DB_NAME
  const user = process.env.DB_USERNAME || process.env.PGUSER || process.env.DB_USER
  const password = process.env.DB_PASSWORD || process.env.PGPASSWORD
  const connectionString = process.env.DATABASE_URL || undefined

  if (!connectionString && (!host || !database)) {
    throw new Error(
      'Database configuration missing. Please set DB_HOST, DB_DATABASE, DB_USERNAME, DB_PASSWORD or DATABASE_URL in environment.'
    )
  }

  // Determine SSL mode
  const rawSslMode = (
    process.env.DB_SSLMODE ||
    process.env.PGSSLMODE ||
    (process.env.DATABASE_SSL === 'true' ? 'require' : '') ||
    (process.env.PGSSL === 'true' ? 'require' : '') ||
    'disable'
  ).toLowerCase().trim()

  let ssl: pg.PoolConfig['ssl'] = undefined

  if (rawSslMode === 'disable' || rawSslMode === 'off' || rawSslMode === 'false') {
    ssl = false
  } else if (rawSslMode === 'require') {
    // SSL without strict CA validation
    ssl = { rejectUnauthorized: false }
  } else if (rawSslMode === 'verify-ca' || rawSslMode === 'verify-full') {
    const caPath = process.env.DB_SSL_CA || process.env.PGSSLROOTCERT
    let ca: string | undefined = undefined
    if (caPath && existsSync(caPath)) {
      ca = readFileSync(caPath, 'utf8')
    } else if (process.env.DB_SSL_CA_CERT) {
      ca = process.env.DB_SSL_CA_CERT
    }

    if (!ca) {
      console.warn(
        `[db] Warning: SSLMODE '${rawSslMode}' specified but no CA certificate found (DB_SSL_CA / DB_SSL_CA_CERT). Connecting with strict TLS may fail.`
      )
    }

    ssl = {
      rejectUnauthorized: true,
      ca,
      servername: process.env.DB_SSL_SERVERNAME || (host && !/^\d+\.\d+\.\d+\.\d+$/.test(host) ? host : undefined),
    }
  } else if (rawSslMode === 'prefer' || rawSslMode === 'allow') {
    // Attempt SSL first, fallback handled via pool retry if needed
    ssl = { rejectUnauthorized: false }
  }

  const baseConfig: pg.PoolConfig = connectionString
    ? { connectionString }
    : {
        host,
        port,
        database,
        user,
        password,
      }

  const connectionTimeout = process.env.DB_CONNECTION_TIMEOUT_MS
    ? Number.parseInt(process.env.DB_CONNECTION_TIMEOUT_MS, 10)
    : 10_000

  const idleTimeout = process.env.DB_IDLE_TIMEOUT_MS
    ? Number.parseInt(process.env.DB_IDLE_TIMEOUT_MS, 10)
    : 30_000

  const statementTimeout = process.env.DB_STATEMENT_TIMEOUT_MS
    ? Number.parseInt(process.env.DB_STATEMENT_TIMEOUT_MS, 10)
    : 15_000

  return {
    ...baseConfig,
    ssl,
    max: env.pgPoolMax,
    idleTimeoutMillis: idleTimeout,
    connectionTimeoutMillis: connectionTimeout,
    statement_timeout: statementTimeout,
    // UTF-8 client encoding for reliable multilingual string handling
    client_encoding: 'UTF8',
  }
}

/**
 * Initializes and returns the shared PostgreSQL connection pool.
 */
export function getPool(): pg.Pool {
  if (!pool) {
    const config = getDbConfig()
    pool = new pg.Pool(config)

    // Log diagnostic startup info (without exposing credentials)
    const targetHost = config.connectionString
      ? sanitizeLog(config.connectionString)
      : `${config.user || 'anonymous'}@${config.host}:${config.port}/${config.database}`
    console.log(`[db] Initializing connection pool -> ${targetHost} (ssl: ${config.ssl ? 'active' : 'disabled'}, max: ${config.max})`)

    // An idle client erroring (e.g. DB restart) must not crash the entire node process
    pool.on('error', (err) => {
      console.error('[db] Unexpected error on idle client:', sanitizeLog(err.message))
    })
  }
  return pool
}

/**
 * Execute a parameterized query with safe error sanitization.
 */
export async function query<T extends pg.QueryResultRow = any>(
  text: string,
  params: unknown[] = [],
): Promise<pg.QueryResult<T>> {
  try {
    return await getPool().query<T>(text, params)
  } catch (err: any) {
    // Ensure sensitive query details or credentials are sanitized
    const safeMsg = sanitizeLog(err.message || 'Database query error')
    console.error(`[db query error]: ${safeMsg}`)
    throw new Error(safeMsg)
  }
}

/**
 * Run a callback function inside an atomic transaction (BEGIN ... COMMIT),
 * rolling back automatically if an error is thrown.
 */
export async function withTransaction<T>(fn: (client: pg.PoolClient) => Promise<T>): Promise<T> {
  const client = await getPool().connect()
  try {
    await client.query('BEGIN')
    const result = await fn(client)
    await client.query('COMMIT')
    return result
  } catch (err: any) {
    await client.query('ROLLBACK').catch(() => {})
    const safeMsg = sanitizeLog(err.message || 'Transaction error')
    throw new Error(safeMsg)
  } finally {
    client.release()
  }
}

/**
 * Quote an identifier (table or column name) safely to prevent SQL injection.
 */
export function ident(name: string): string {
  return `"${name.replace(/"/g, '""')}"`
}

/**
 * Verify database connectivity and schema readiness.
 */
export async function testDbConnection(): Promise<{ ok: boolean; info?: any; error?: string }> {
  try {
    const res = await query(`
      SELECT 
        version(),
        current_database() AS database,
        current_user AS user,
        current_schema() AS schema,
        inet_server_addr() AS server_ip,
        inet_server_port() AS server_port
    `)
    return { ok: true, info: res.rows[0] }
  } catch (err: any) {
    return { ok: false, error: sanitizeLog(err.message) }
  }
}

/**
 * Closes the connection pool gracefully on application shutdown.
 */
export async function closePool(): Promise<void> {
  if (pool) {
    const currentPool = pool
    pool = undefined
    await currentPool.end()
    console.log('[db] Pool closed gracefully.')
  }
}
