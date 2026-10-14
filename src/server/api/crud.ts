import { query, withTransaction, ident } from '../db'
import { RESOURCE_REGISTRY, TABLE_ALIASES, ResourceConfig } from './resources'
import { AdminUser } from '../../lib/admin-auth'

export interface ParsedFilter {
  col: string
  op: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'like'
  val: string
}

export interface ParsedRequestQuery {
  table: string
  config: ResourceConfig
  filter: ParsedFilter[]
  order?: { col: string; dir: 'ASC' | 'DESC' }
  limit?: number
  select?: string[]
}

export function resolveResource(pathTable: string): { tableName: string; config: ResourceConfig } | null {
  const normalized = pathTable.toLowerCase().trim()
  const tableName = TABLE_ALIASES[normalized]
  if (!tableName || !RESOURCE_REGISTRY[tableName]) {
    return null
  }
  return { tableName, config: RESOURCE_REGISTRY[tableName] }
}

export function parseQueryParams(url: URL, config: ResourceConfig): {
  filter: ParsedFilter[]
  order?: { col: string; dir: 'ASC' | 'DESC' }
  limit?: number
  select?: string[]
} {
  const filter: ParsedFilter[] = []
  let order: { col: string; dir: 'ASC' | 'DESC' } | undefined
  let limit: number | undefined
  let select: string[] | undefined

  for (const [key, rawVal] of url.searchParams.entries()) {
    if (key === 'order') {
      const [col, dirRaw] = rawVal.split('.')
      if (config.allowedColumns.includes(col)) {
        order = { col, dir: dirRaw?.toLowerCase() === 'desc' ? 'DESC' : 'ASC' }
      } else {
        throw new Error(`Invalid order column: ${col}`)
      }
    } else if (key === 'limit') {
      const n = Number.parseInt(rawVal, 10)
      if (Number.isFinite(n) && n > 0 && n <= 500) {
        limit = n
      }
    } else if (key === 'select') {
      const cols = rawVal.split(',').map((c) => c.trim())
      for (const c of cols) {
        if (!config.allowedColumns.includes(c)) {
          throw new Error(`Invalid select column: ${c}`)
        }
      }
      select = cols
    } else {
      // Column filter, e.g. key=col.eq or key=col with value eq.val or key=status&status=eq.new
      let col = key
      let op: ParsedFilter['op'] = 'eq'
      let val = rawVal

      const dotIdx = key.indexOf('.')
      if (dotIdx > 0) {
        col = key.substring(0, dotIdx)
        const opCandidate = key.substring(dotIdx + 1)
        if (['eq', 'neq', 'gt', 'gte', 'lt', 'lte', 'like'].includes(opCandidate)) {
          op = opCandidate as ParsedFilter['op']
        }
      }

      // If value starts with op. e.g. eq.new or like.%test%
      const valDotIdx = val.indexOf('.')
      if (valDotIdx > 0) {
        const opCandidate = val.substring(0, valDotIdx)
        if (['eq', 'neq', 'gt', 'gte', 'lt', 'lte', 'like'].includes(opCandidate)) {
          op = opCandidate as ParsedFilter['op']
          val = val.substring(valDotIdx + 1)
        }
      }

      if (!config.allowedColumns.includes(col)) {
        throw new Error(`Invalid filter column: ${col}`)
      }

      filter.push({ col, op, val })
    }
  }

  return { filter, order, limit, select }
}

export async function handleGet(
  config: ResourceConfig,
  queryParams: ReturnType<typeof parseQueryParams>,
  idParam?: string | number
) {
  const { filter, order, limit, select } = queryParams
  const params: unknown[] = []
  let paramIdx = 1

  const selectCols = select && select.length > 0
    ? select.map((c) => ident(c)).join(', ')
    : config.allowedColumns.map((c) => ident(c)).join(', ')

  let sql = `SELECT ${selectCols} FROM ${ident(config.table)}`
  const whereClauses: string[] = []

  if (idParam !== undefined) {
    const pk = config.primaryKey || 'id'
    whereClauses.push(`${ident(pk)} = $${paramIdx++}`)
    params.push(idParam)
  }

  for (const f of filter) {
    const colName = ident(f.col)
    const ph = `$${paramIdx++}`
    switch (f.op) {
      case 'eq':
        whereClauses.push(`${colName} = ${ph}`)
        params.push(f.val)
        break
      case 'neq':
        whereClauses.push(`${colName} != ${ph}`)
        params.push(f.val)
        break
      case 'gt':
        whereClauses.push(`${colName} > ${ph}`)
        params.push(f.val)
        break
      case 'gte':
        whereClauses.push(`${colName} >= ${ph}`)
        params.push(f.val)
        break
      case 'lt':
        whereClauses.push(`${colName} < ${ph}`)
        params.push(f.val)
        break
      case 'lte':
        whereClauses.push(`${colName} <= ${ph}`)
        params.push(f.val)
        break
      case 'like':
        whereClauses.push(`${colName} ILIKE ${ph}`)
        params.push(f.val)
        break
    }
  }

  if (whereClauses.length > 0) {
    sql += ` WHERE ${whereClauses.join(' AND ')}`
  }

  if (order) {
    sql += ` ORDER BY ${ident(order.col)} ${order.dir}`
  }

  if (limit) {
    sql += ` LIMIT ${limit}`
  }

  const res = await query(sql, params)
  return res.rows
}

export async function handleInsert(
  config: ResourceConfig,
  body: any,
  user: AdminUser | null
) {
  const allowed = user ? config.writableColumns : (config.publicWritableColumns || [])

  // Handle batch insert or settings array
  if (Array.isArray(body)) {
    if (config.table === 'settings') {
      // Upsert settings
      return withTransaction(async (client) => {
        for (const item of body) {
          if (item.key && typeof item.key === 'string') {
            await client.query(
              `INSERT INTO settings ("key", "value", updated_at)
               VALUES ($1, $2, NOW())
               ON CONFLICT ("key") DO UPDATE SET "value" = EXCLUDED."value", updated_at = NOW()`,
              [item.key, item.value ?? '']
            )
          }
        }
        return { success: true }
      })
    }
    throw new Error('Batch insertion not supported for this resource')
  }

  if (!body || typeof body !== 'object') {
    throw new Error('Request body must be an object')
  }

  const cols: string[] = []
  const vals: unknown[] = []
  const placeholders: string[] = []

  let idx = 1
  for (const [key, val] of Object.entries(body)) {
    if (allowed.includes(key)) {
      cols.push(ident(key))
      placeholders.push(`$${idx++}`)
      // Convert arrays/objects to JSON strings if needed
      if (config.jsonColumns?.includes(key) && (Array.isArray(val) || typeof val === 'object')) {
        vals.push(JSON.stringify(val))
      } else {
        vals.push(val)
      }
    }
  }

  if (cols.length === 0) {
    throw new Error('No writable fields provided')
  }

  const sql = `INSERT INTO ${ident(config.table)} (${cols.join(', ')}) VALUES (${placeholders.join(', ')}) RETURNING *`
  const res = await query(sql, vals)
  return res.rows[0]
}

export async function handleUpdate(
  config: ResourceConfig,
  id: string | number,
  body: any,
  user: AdminUser | null
) {
  if (!user) {
    throw new Error('Unauthorized')
  }

  if (!body || typeof body !== 'object') {
    throw new Error('Request body must be an object')
  }

  const allowed = config.writableColumns
  const setClauses: string[] = []
  const vals: unknown[] = []

  let idx = 1
  for (const [key, val] of Object.entries(body)) {
    if (allowed.includes(key)) {
      setClauses.push(`${ident(key)} = $${idx++}`)
      if (config.jsonColumns?.includes(key) && (Array.isArray(val) || typeof val === 'object')) {
        vals.push(JSON.stringify(val))
      } else {
        vals.push(val)
      }
    }
  }

  if (setClauses.length === 0) {
    throw new Error('No writable fields provided')
  }

  const pk = config.primaryKey || 'id'
  vals.push(id)
  const pkParam = `$${idx}`

  const sql = `UPDATE ${ident(config.table)} SET ${setClauses.join(', ')} WHERE ${ident(pk)} = ${pkParam} RETURNING *`
  const res = await query(sql, vals)
  if (res.rows.length === 0) {
    throw new Error('Record not found')
  }
  return res.rows[0]
}

export async function handleDelete(
  config: ResourceConfig,
  id: string | number,
  user: AdminUser | null
) {
  if (!user) {
    throw new Error('Unauthorized')
  }

  const pk = config.primaryKey || 'id'
  const sql = `DELETE FROM ${ident(config.table)} WHERE ${ident(pk)} = $1`
  await query(sql, [id])
  return { success: true }
}
