/**
 * Shared PostgreSQL connection pool (server-only).
 *
 * Uses DATABASE_URL when set; otherwise `pg` falls back to the standard
 * PGHOST / PGPORT / PGDATABASE / PGUSER / PGPASSWORD variables.
 */
import pg from 'pg'
import { env } from './env'

let pool: pg.Pool | undefined

export function getPool(): pg.Pool {
  if (!pool) {
    const hasDiscreteVars = Boolean(process.env.PGHOST || process.env.PGDATABASE)
    if (!process.env.DATABASE_URL && !hasDiscreteVars) {
      throw new Error('Database is not configured: set DATABASE_URL or PGHOST/PGDATABASE/PGUSER/PGPASSWORD')
    }
    const connectionString = process.env.DATABASE_URL || undefined
    const isSsl = Boolean(
      process.env.DATABASE_SSL === 'true' ||
      process.env.PGSSL === 'true' ||
      process.env.PGSSLMODE === 'require' ||
      (connectionString && (connectionString.includes('sslmode=require') || connectionString.includes('ssl=true')))
    )
    pool = new pg.Pool({
      connectionString,
      ssl: isSsl ? { rejectUnauthorized: false } : undefined,
      max: env.pgPoolMax,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 5_000,
    })
    // An idle client erroring (e.g. DB restart) must not crash the process.
    pool.on('error', (err) => console.error('[db] idle client error:', err.message))
  }
  return pool
}

export async function query<T extends pg.QueryResultRow = any>(
  text: string,
  params: unknown[] = [],
): Promise<pg.QueryResult<T>> {
  return getPool().query<T>(text, params)
}

/** Run `fn` inside BEGIN/COMMIT; rolls back on any thrown error. */
export async function withTransaction<T>(fn: (client: pg.PoolClient) => Promise<T>): Promise<T> {
  const client = await getPool().connect()
  try {
    await client.query('BEGIN')
    const result = await fn(client)
    await client.query('COMMIT')
    return result
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {})
    throw err
  } finally {
    client.release()
  }
}

/** Quote a SQL identifier. Only ever called with allowlisted names. */
export function ident(name: string): string {
  return `"${name.replace(/"/g, '""')}"`
}
