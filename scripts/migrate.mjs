import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import pg from 'pg'

const __dirname = dirname(fileURLToPath(import.meta.url))
const rootDir = resolve(__dirname, '..')

// Load env if .env exists
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

const connectionString = process.env.DATABASE_URL
if (!connectionString && !process.env.PGHOST) {
  console.error('Neither DATABASE_URL nor PGHOST is set. Cannot run migrations.')
  process.exit(1)
}

const isSsl = Boolean(
  process.env.DATABASE_SSL === 'true' ||
  process.env.PGSSL === 'true' ||
  process.env.PGSSLMODE === 'require' ||
  (connectionString && (connectionString.includes('sslmode=require') || connectionString.includes('ssl=true')))
)

const pool = new pg.Pool({
  connectionString,
  ssl: isSsl ? { rejectUnauthorized: false } : undefined,
})

async function run() {
  const client = await pool.connect()
  try {
    console.log('Applying migrations...')
    const migrationsDir = resolve(rootDir, 'src', 'server', 'migrations')
    const files = readdirSync(migrationsDir)
      .filter((f) => f.endsWith('.sql'))
      .sort()

    for (const file of files) {
      const sqlPath = resolve(migrationsDir, file)
      const sql = readFileSync(sqlPath, 'utf8')
      await client.query('BEGIN')
      await client.query(sql)
      await client.query('COMMIT')
      console.log(`Migration ${file} applied successfully.`)
    }
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
