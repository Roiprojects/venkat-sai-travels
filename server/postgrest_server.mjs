import express from 'express'
import { Pool } from 'pg'
import crypto from 'crypto'
import { readFileSync, existsSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

for (const envPath of [join(__dirname, '.env'), join(__dirname, '..', '.env')]) {
  if (existsSync(envPath)) {
    for (const line of readFileSync(envPath, 'utf8').split('\n')) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      const eqIdx = trimmed.indexOf('=')
      if (eqIdx < 0) continue
      const key = trimmed.slice(0, eqIdx).trim()
      const val = trimmed.slice(eqIdx + 1).trim()
      if (key && !(key in process.env)) process.env[key] = val
    }
  }
}

const PORT = parseInt(process.env.PORT || '3003')
const DB_URL     = process.env.DATABASE_URL
if (!DB_URL) { console.error('FATAL: DATABASE_URL env var is not set'); process.exit(1) }
const JWT_SECRET = process.env.JWT_SECRET
const CORS_ORIGIN = process.env.CORS_ORIGIN?.split(',')?.map(s => s.trim()) || ['https://venkatsai.roiclients.co.in']
const NODE_ENV = process.env.NODE_ENV || 'development'

const app = express()
app.set('query parser', 'simple')
let _db = null
const pool = new Pool({ connectionString: DB_URL, max: 20 })

function b64urlDecode(s) {
  s = s.replace(/-/g, '+').replace(/_/g, '/')
  while (s.length % 4) s += '='
  return Buffer.from(s, 'base64')
}

function verifyJWT(token) {
  try {
    const [h, p, sig] = token.split('.')
    if (!h || !p || !sig) return null
    const signingInput = `${h}.${p}`
    const expected = crypto.createHmac('sha256', JWT_SECRET).update(signingInput).digest('base64').replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')
    const normalize = (s) => s.replace(/-/g,'+').replace(/_/g,'/')
    const expectedBuf = Buffer.from(normalize(expected), 'base64')
    const givenBuf = Buffer.from(normalize(sig), 'base64')
    if (!crypto.timingSafeEqual(expectedBuf, givenBuf)) return null
    const payload = JSON.parse(b64urlDecode(p).toString())
    if (payload.exp && Date.now() / 1000 > payload.exp) return null
    return payload
  } catch { return null }
}

function parseQuery(req) {
  const table = req.path.replace(/^\//, '').replace(/\/$/, '') || ''
  const filter = []
  let order
  let limit
  let select

  const rawQS = req.url.includes('?') ? req.url.split('?')[1] : ''
  for (const pair of rawQS.split('&')) {
    if (!pair) continue
    const eqIdx = pair.indexOf('=')
    const rawKey = eqIdx >= 0 ? decodeURIComponent(pair.substring(0, eqIdx)) : decodeURIComponent(pair)
    const rawVal = eqIdx >= 0 ? decodeURIComponent(pair.substring(eqIdx + 1)) : ''

    if (rawKey === 'order') order = rawVal
    else if (rawKey === 'limit') limit = parseInt(rawVal)
    else if (rawKey === 'select') select = rawVal.split(',')
    else {
      const dotIdx = rawKey.indexOf('.')
      const col = dotIdx >= 0 ? rawKey.substring(0, dotIdx) : rawKey
      const op = dotIdx >= 0 ? rawKey.substring(dotIdx + 1) : 'eq'
      // Strip operator prefix from value (e.g. "eq.9" → "9")
      const opPrefix = `${op}.`
      const val = rawVal.startsWith(opPrefix) ? rawVal.slice(opPrefix.length) : rawVal
      filter.push({ col, op, val })
    }
  }
  return { table, filter, order, limit, select }
}

app.use((req, res, next) => {
  const origin = req.headers.origin || ''
  if (CORS_ORIGIN.some(o => origin === o || (origin && o === '*'))) {
    res.header('Access-Control-Allow-Origin', origin)
  }
  res.header('Vary', 'Origin')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Prefer')
  if (req.method === 'OPTIONS') return res.status(204).end()
  next()
})

app.use(express.json({ limit: '10mb' }))

app.get('/health', (_req, res) => res.json({ status: 'ok' }))

const PUBLIC_POST_TABLES = new Set(['bookings', 'contact_inquiries'])

app.all('/*', async (req, res) => {
  let dbConn = null
  try {
    const authHeader = req.headers.authorization || ''
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null
    let isAdmin = false
    if (token) {
      const payload = verifyJWT(token)
      isAdmin = payload && (payload.role === 'authenticator' || payload.role === 'service_role')
    }

    const { table, filter, order, limit, select } = parseQuery(req)
    if (!table) return res.status(404).json({ message: 'Not found' })

    dbConn = await pool.connect()

    if (req.method === 'GET') {
      let sql = `SELECT * FROM "${table}"`
      const params = []
      let idx = 1
      if (filter.length) {
        const clauses = filter.map(f => {
          const ph = `$${idx++}`
          if (f.op === 'eq') return `"${f.col}" = ${ph}`
          if (f.op === 'neq') return `"${f.col}" != ${ph}`
          if (f.op === 'gt') return `"${f.col}" > ${ph}`
          if (f.op === 'gte') return `"${f.col}" >= ${ph}`
          if (f.op === 'lt') return `"${f.col}" < ${ph}`
          if (f.op === 'lte') return `"${f.col}" <= ${ph}`
          if (f.op === 'like') return `"${f.col}" ILIKE ${ph}`
          return `"${f.col}" = ${ph}`
        })
        sql += ' WHERE ' + clauses.join(' AND ')
        filter.forEach(f => params.push(f.val))
      }
      if (order) {
        const orderParts = order.split('.')
        const orderCol = orderParts[0]
        const orderDir = orderParts[1] === 'desc' ? 'DESC' : 'ASC'
        sql += ` ORDER BY "${orderCol}" ${orderDir}`
      }
      if (limit) sql += ` LIMIT ${limit}`
      if (select) sql = `SELECT ${select.map(c => `"${c}"`).join(',')} FROM "${table}"` + (filter.length ? sql.slice(sql.indexOf(' WHERE')) : '')
      const result = await dbConn.query(sql, params)
      return res.json(result.rows)
    }

    if (req.method === 'POST') {
      if (!isAdmin && !PUBLIC_POST_TABLES.has(table)) return res.status(401).json({ message: 'Unauthorized' })
      const cols = Object.keys(req.body)
      const vals = Object.values(req.body).map(v => (v !== null && typeof v === 'object') ? JSON.stringify(v) : v)
      const ph = cols.map((_, i) => `$${i + 1}`).join(',')
      const sql = `INSERT INTO "${table}" (${cols.map(c => `"${c}"`).join(',')}) VALUES (${ph}) RETURNING *`
      const result = await dbConn.query(sql, vals)
      return res.status(201).json(result.rows[0])
    }

    if (req.method === 'PATCH' || req.method === 'PUT') {
      if (!isAdmin) return res.status(401).json({ message: 'Unauthorized' })
      const setClause = Object.keys(req.body).map((c, i) => `"${c}" = $${i + 1}`).join(', ')
      const params = Object.values(req.body).map(v => (v !== null && typeof v === 'object') ? JSON.stringify(v) : v)
      let sql = `UPDATE "${table}" SET ${setClause}`
      if (filter.length) {
        sql += ' WHERE ' + filter.map(f => {
          const ph = `$${params.length + 1}`
          params.push(f.val)
          return `"${f.col}" = ${ph}`
        }).join(' AND ')
      }
      sql += ' RETURNING *'
      const result = await dbConn.query(sql, params)
      return res.json(result.rows[0] || {})
    }

    if (req.method === 'DELETE') {
      if (!isAdmin) return res.status(401).json({ message: 'Unauthorized' })
      let sql = `DELETE FROM "${table}"`
      const params = []
      if (filter.length) {
        sql += ' WHERE ' + filter.map(f => {
          const ph = `$${params.length + 1}`
          params.push(f.val)
          return `"${f.col}" = ${ph}`
        }).join(' AND ')
      }
      await dbConn.query(sql, params)
      return res.status(204).end()
    }

    res.status(405).json({ message: 'Method not allowed' })
  } catch (e) {
    console.error(`[${req.method} ${req.path}]`, e.message)
    const details = NODE_ENV === 'development' ? e.detail : undefined
    res.status(500).json({ message: e.message, ...(details && { details }) })
  } finally {
    if (dbConn) dbConn.release()
  }
})

app.listen(PORT, () => console.log(`PostgREST-compatible server running on port ${PORT}`))
