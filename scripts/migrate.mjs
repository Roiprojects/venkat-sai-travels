import { readFileSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import pg from 'pg'

const __dirname = dirname(fileURLToPath(import.meta.url))
const rootDir = resolve(__dirname, '..')

// Load env if .env exists
for (const envFile of [resolve(rootDir, '.env'), resolve(rootDir, 'server', '.env')]) {
  if (existsSync(envFile) && typeof process.loadEnvFile === 'function') {
    process.loadEnvFile(envFile)
    break
  }
}

const connectionString = process.env.DATABASE_URL
if (!connectionString && !process.env.PGHOST) {
  console.error('Neither DATABASE_URL nor PGHOST is set. Cannot run migrations.')
  process.exit(1)
}

const pool = new pg.Pool({ connectionString })

async function run() {
  const client = await pool.connect()
  try {
    console.log('Applying migrations...')
    const sqlPath = resolve(rootDir, 'src', 'server', 'migrations', '001_admin_sessions.sql')
    const sql = readFileSync(sqlPath, 'utf8')
    await client.query('BEGIN')
    await client.query(sql)
    await client.query('COMMIT')
    console.log('Migration 001_admin_sessions applied successfully.')
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {})
    console.error('Migration failed:', err)
    process.exit(1)
  } finally {
    client.release()
    await pool.end()
  }
}

run()
