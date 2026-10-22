/**
 * Production Remote Database Connectivity & Health Verification Script
 * Run with: node scripts/verify-db.mjs
 */
import net from 'node:net'
import pg from 'pg'
import { readFileSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const rootDir = resolve(__dirname, '..')

// Load environment variables
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
        if (process.env[k] === undefined) process.env[k] = v
      }
      break
    } catch {}
  }
}

const host = process.env.DB_HOST || process.env.PGHOST || '127.0.0.1'
const port = Number(process.env.DB_PORT || process.env.PGPORT || 5432)
const database = process.env.DB_DATABASE || process.env.PGDATABASE || process.env.DB_NAME || 'postgres'
const user = process.env.DB_USERNAME || process.env.PGUSER || process.env.DB_USER || 'postgres'
const password = process.env.DB_PASSWORD || process.env.PGPASSWORD
const connectionString = process.env.DATABASE_URL || undefined

console.log('=====================================================================')
console.log(' Venkat Sai Travels - Remote Database Verification')
console.log('=====================================================================')
console.log(`Target: ${user}@${host}:${port}/${database}`)
console.log('---------------------------------------------------------------------')

// Step 1: TCP Port Reachability
function checkTcp() {
  return new Promise((resolve) => {
    const socket = net.createConnection(port, host, () => {
      console.log(`[PASS] Step 1: TCP reachability confirmed to ${host}:${port}`)
      socket.end()
      resolve(true)
    })
    socket.setTimeout(5000)
    socket.on('error', (err) => {
      console.error(`[FAIL] Step 1: TCP reachability failed: ${err.message}`)
      resolve(false)
    })
    socket.on('timeout', () => {
      console.error(`[FAIL] Step 1: TCP connection timed out`)
      socket.destroy()
      resolve(false)
    })
  })
}

// Step 2: PostgreSQL Client & Authentication
async function checkPg() {
  const isTcpOk = await checkTcp()
  if (!isTcpOk) {
    console.error('Cannot proceed with database checks: TCP port unreachable.')
    process.exit(1)
  }

  const rawSslMode = (process.env.DB_SSLMODE || process.env.PGSSLMODE || 'disable').toLowerCase()
  const ssl = rawSslMode === 'disable' || rawSslMode === 'off' || rawSslMode === 'false'
    ? false
    : { rejectUnauthorized: false }

  const poolConfig = connectionString
    ? { connectionString, ssl }
    : { host, port, database, user, password, ssl }

  const client = new pg.Client({
    ...poolConfig,
    connectionTimeoutMillis: 10_000,
  })

  try {
    await client.connect()
    console.log('[PASS] Step 2: PostgreSQL remote authentication succeeded')

    // Step 3: Server metadata
    const meta = await client.query(`
      SELECT 
        version(),
        current_database() AS db_name,
        current_user AS db_user,
        current_schema() AS db_schema,
        inet_server_addr() AS server_ip,
        inet_server_port() AS server_port;
    `)
    const row = meta.rows[0]
    console.log(`[PASS] Step 3: Server version: ${row.version.split(' on ')[0]}`)
    console.log(`       Connected to database '${row.db_name}' as user '${row.db_user}' (schema: ${row.db_schema})`)

    // Step 4: Schema & Tables Audit
    const tablesRes = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `)
    const tables = tablesRes.rows.map((r) => r.table_name)
    console.log(`[PASS] Step 4: Database schema audit: found ${tables.length} tables in 'public' schema`)
    
    // Sample counts on key tables
    const sampleTables = ['fleets', 'services', 'bookings', 'admin_users', 'admin_sessions', 'settings', 'testimonials']
    for (const st of sampleTables) {
      if (tables.includes(st)) {
        const cRes = await client.query(`SELECT count(*) FROM "${st}";`)
        console.log(`       - ${st}: ${cRes.rows[0].count} records`)
      } else {
        console.warn(`       - [WARN] Table '${st}' missing!`)
      }
    }

    // Step 5: Privileges
    const privRes = await client.query(`
      SELECT has_schema_privilege('${user}', 'public', 'USAGE') as can_usage,
             has_schema_privilege('${user}', 'public', 'CREATE') as can_create;
    `)
    console.log(`[PASS] Step 5: User '${user}' privileges on 'public': USAGE=${privRes.rows[0].can_usage}, CREATE=${privRes.rows[0].can_create}`)

    // Step 6: Safe Transactional Write & Rollback Check
    await client.query('BEGIN')
    const insertRes = await client.query(`
      INSERT INTO contact_inquiries (name, phone, email, subject, message)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id;
    `, ['__VERIFY_CHECK__', '0000000000', 'verify@domain.com', 'Verification', 'Test write'])
    const insertedId = insertRes.rows[0].id
    await client.query('ROLLBACK')
    console.log(`[PASS] Step 6: Reversible read/write transaction verified (inserted ID: ${insertedId}, cleanly rolled back)`)

    console.log('---------------------------------------------------------------------')
    console.log('[STATUS: ALL DATABASE CHECKS PASSED SUCCESSFULLY]')
    console.log('=====================================================================')
  } catch (err) {
    console.error(`[FAIL] Database verification error: ${err.message}`)
    process.exit(1)
  } finally {
    await client.end()
  }
}

checkPg()
