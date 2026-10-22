import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import pg from 'pg'

const __dirname = dirname(fileURLToPath(import.meta.url))
const rootDir = resolve(__dirname, '..')

// Load environment variables from .env
for (const envFile of [resolve(rootDir, '.env'), resolve(rootDir, 'server', '.env')]) {
  if (existsSync(envFile)) {
    try {
      if (typeof process.loadEnvFile === 'function') {
        process.loadEnvFile(envFile)
        break
      }
    } catch {}
    try {
      const text = readFileSync(envFile, 'utf8')
      for (const line of text.split(/\r?\n/)) {
        const trimmed = line.trim()
        if (!trimmed || trimmed.startsWith('#')) continue
        const eq = trimmed.indexOf('=')
        if (eq === -1) continue
        const k = trimmed.slice(0, eq).trim()
        let v = trimmed.slice(eq + 1).trim()
        if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
          v = v.slice(1, -1)
        }
        if (process.env[k] === undefined) {
          process.env[k] = v
        }
      }
      break
    } catch {}
  }
}

const host = process.env.DB_HOST || process.env.PGHOST
const port = Number(process.env.DB_PORT || process.env.PGPORT || 5432)
const database = process.env.DB_DATABASE || process.env.PGDATABASE || process.env.DB_NAME
const user = process.env.DB_USERNAME || process.env.PGUSER || process.env.DB_USER
const password = process.env.DB_PASSWORD || process.env.PGPASSWORD
const connectionString = process.env.DATABASE_URL || undefined

if (!connectionString && (!host || !database)) {
  console.error('[migrate] Database is not configured: set DB_HOST/DB_DATABASE/DB_USERNAME/DB_PASSWORD or DATABASE_URL.')
  process.exit(1)
}

const rawSslMode = (
  process.env.DB_SSLMODE ||
  process.env.PGSSLMODE ||
  (process.env.DATABASE_SSL === 'true' ? 'require' : '') ||
  'disable'
).toLowerCase()

const ssl = rawSslMode === 'disable' || rawSslMode === 'off' || rawSslMode === 'false'
  ? false
  : { rejectUnauthorized: false }

const poolConfig = connectionString
  ? { connectionString, ssl }
  : { host, port, database, user, password, ssl }

const pool = new pg.Pool({
  ...poolConfig,
  connectionTimeoutMillis: 10_000,
})

async function run() {
  const client = await pool.connect()
  try {
    console.log(`[migrate] Connecting to database ${database || 'from URL'}...`)

    // Ensure migration tracking table exists
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        version VARCHAR(255) PRIMARY KEY,
        applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `)

    const migrationsDir = resolve(rootDir, 'src', 'server', 'migrations')
    const files = readdirSync(migrationsDir)
      .filter((f) => f.endsWith('.sql'))
      .sort()

    const appliedRes = await client.query('SELECT version FROM schema_migrations;')
    const appliedVersions = new Set(appliedRes.rows.map((r) => r.version))

    for (const file of files) {
      if (appliedVersions.has(file)) {
        console.log(`[migrate] Skipping ${file} (already applied)`)
        continue
      }

      console.log(`[migrate] Applying ${file}...`)
      const sqlPath = resolve(migrationsDir, file)
      const sql = readFileSync(sqlPath, 'utf8')

      await client.query('BEGIN')
      await client.query(sql)
      await client.query('INSERT INTO schema_migrations (version) VALUES ($1)', [file])
      await client.query('COMMIT')
      console.log(`[migrate] Successfully applied ${file}`)
    }

    console.log('[migrate] All migrations are up to date.')
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {})
    console.error('[migrate] Migration error:', err.message)
    process.exit(1)
  } finally {
    client.release()
    await pool.end()
  }
}

run()
