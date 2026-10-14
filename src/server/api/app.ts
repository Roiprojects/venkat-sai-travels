import {
  H3,
  createError,
  readBody,
  getCookie,
  setResponseHeader,
  setResponseStatus,
  getRequestURL,
  getMethod,
  getRequestIP,
  getRequestHeader,
} from 'h3'
import {
  COOKIE_NAME,
  createSession,
  getClearSessionCookie,
  validateSession,
  invalidateSession,
  verifyPassword,
  hashPassword,
  validateCsrf,
  AdminUser,
} from '../../lib/admin-auth'
import { query } from '../db'
import { env } from '../env'
import { resolveResource, parseQueryParams, handleGet, handleInsert, handleUpdate, handleDelete } from './crud'

export const apiApp = new H3()

// Helper to authenticate request from cookie
async function getAuthUser(event: any): Promise<AdminUser | null> {
  const token = getCookie(event, COOKIE_NAME)
  return validateSession(token || null)
}

// 1. Health check
apiApp.get('/api/health', async () => {
  let dbStatus = 'ok'
  try {
    await query('SELECT 1')
  } catch (err: any) {
    dbStatus = `error: ${err.message}`
  }
  return {
    status: 'ok',
    db: dbStatus,
    timestamp: new Date().toISOString(),
  }
})

// 2. Auth: login
apiApp.post('/api/auth/login', async (event) => {
  const body: any = await readBody(event).catch(() => ({}))
  const username = (body.username || '').trim()
  const password = body.password || ''

  if (!username || !password) {
    throw createError({ statusCode: 400, message: 'Username and password required' })
  }

  // Look up in admin_users first
  let userRow: any = null
  let table = 'admin_users'

  const res1 = await query(
    'SELECT id, username, password_hash FROM admin_users WHERE username = $1 AND is_active = true',
    [username]
  )
  if (res1.rows.length > 0) {
    userRow = res1.rows[0]
  } else {
    // Fallback to admins table
    const res2 = await query(
      'SELECT id, username, password_hash FROM admins WHERE username = $1',
      [username]
    )
    if (res2.rows.length > 0) {
      userRow = res2.rows[0]
      table = 'admins'
    }
  }

  if (!userRow) {
    throw createError({ statusCode: 401, message: 'Invalid credentials' })
  }

  const valid = await verifyPassword(password, userRow.password_hash)
  if (!valid) {
    throw createError({ statusCode: 401, message: 'Invalid credentials' })
  }

  // Check if legacy PBKDF2 hash needs migration to bcrypt
  if (!userRow.password_hash.startsWith('$2')) {
    try {
      const newHash = await hashPassword(password)
      await query(`UPDATE ${table} SET password_hash = $1 WHERE id = $2`, [newHash, userRow.id])
    } catch (e) {
      console.error('[auth] failed to upgrade password hash:', e)
    }
  }

  const user: AdminUser = { id: userRow.id, username: userRow.username }
  const ip = getRequestIP(event, { xForwardedFor: env.trustProxy })
  const userAgent = getRequestHeader(event, 'user-agent')

  const session = await createSession(user, ip, userAgent)
  setResponseHeader(event, 'Set-Cookie', session.cookieValue)

  return {
    success: true,
    user: {
      id: user.id,
      username: user.username,
    },
  }
})

// 3. Auth: logout
apiApp.post('/api/auth/logout', async (event) => {
  const token = getCookie(event, COOKIE_NAME)
  if (token) {
    await invalidateSession(token)
  }
  setResponseHeader(event, 'Set-Cookie', getClearSessionCookie())
  return { success: true }
})

// 4. Auth: me
apiApp.get('/api/auth/me', async (event) => {
  const user = await getAuthUser(event)
  if (!user) {
    throw createError({ statusCode: 401, message: 'Not authenticated' })
  }
  return {
    authenticated: true,
    user: {
      id: user.id,
      username: user.username,
    },
  }
})

// 5. Auth: password reset
apiApp.post('/api/auth/reset', async (event) => {
  const user = await getAuthUser(event)
  if (!user) {
    throw createError({ statusCode: 401, message: 'Admin authentication required to reset password' })
  }

  if (!env.allowPasswordReset) {
    throw createError({ statusCode: 403, message: 'Password reset is disabled on this server' })
  }

  const body: any = await readBody(event).catch(() => ({}))
  const targetUsername = (body.username || user.username).trim()
  const newPassword = body.password || ''

  if (!newPassword || newPassword.length < 6) {
    throw createError({ statusCode: 400, message: 'New password must be at least 6 characters' })
  }

  const newHash = await hashPassword(newPassword)
  await query('UPDATE admin_users SET password_hash = $1, updated_at = NOW() WHERE username = $2', [newHash, targetUsername])
  await query('UPDATE admins SET password_hash = $1 WHERE username = $2', [newHash, targetUsername])

  return { success: true, message: `Password reset successfully for ${targetUsername}` }
})

// 6. Admin Dashboard Stats
apiApp.get('/api/admin/dashboard', async (event) => {
  const user = await getAuthUser(event)
  if (!user) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  const tables = [
    { key: 'bookings', table: 'bookings' },
    { key: 'inquiries', table: 'contact_inquiries' },
    { key: 'fleet', table: 'fleets' },
    { key: 'services', table: 'services' },
    { key: 'faqs', table: 'faqs' },
    { key: 'gallery', table: 'gallery' },
    { key: 'testimonials', table: 'testimonials' },
    { key: 'destinations', table: 'destinations' },
    { key: 'blogs', table: 'blogs' },
    { key: 'awards', table: 'awards' },
    { key: 'availability', table: 'vehicle_availability' },
    { key: 'safety', table: 'safety_features' },
    { key: 'trustedBy', table: 'trusted_by' },
  ]

  const stats: Record<string, number> = {}
  await Promise.all(
    tables.map(async ({ key, table }) => {
      try {
        const res = await query(`SELECT COUNT(*)::int AS count FROM "${table}"`)
        stats[key] = res.rows[0]?.count ?? 0
      } catch {
        stats[key] = 0
      }
    })
  )

  let recent: any[] = []
  try {
    const recentRes = await query('SELECT * FROM bookings ORDER BY created_at DESC LIMIT 5')
    recent = recentRes.rows
  } catch {}

  return { stats, recent }
})

// 7. Generic REST Resource CRUD Catch-all
apiApp.all('/api/**', async (event) => {
  const url = getRequestURL(event)
  const method = getMethod(event).toUpperCase()

  // Extract path parts after /api/
  const subPath = url.pathname.replace(/^\/api\/?/, '')
  const parts = subPath.split('/').filter(Boolean)

  if (parts.length === 0) {
    throw createError({ statusCode: 404, message: 'Not found' })
  }

  const resourcePart = parts[0]
  const idPart = parts.length > 1 ? parts[1] : undefined

  const resolved = resolveResource(resourcePart)
  if (!resolved) {
    throw createError({ statusCode: 404, message: `Resource '${resourcePart}' not found` })
  }

  const { config } = resolved
  const user = await getAuthUser(event)

  // CSRF verification for state-changing operations
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
    const origin = getRequestHeader(event, 'origin')
    const referer = getRequestHeader(event, 'referer')
    if (!validateCsrf(origin, referer)) {
      throw createError({ statusCode: 403, message: 'Forbidden: invalid request origin' })
    }
  }

  try {
    if (method === 'GET') {
      if (!config.publicRead && !user) {
        throw createError({ statusCode: 401, message: 'Authentication required' })
      }
      const queryParams = parseQueryParams(url, config)
      const data = await handleGet(config, queryParams, idPart)
      return data
    }

    if (method === 'POST') {
      if (!config.publicCreate && !user) {
        throw createError({ statusCode: 401, message: 'Admin authentication required' })
      }
      const body = await readBody(event).catch(() => ({}))
      const created = await handleInsert(config, body, user)
      setResponseStatus(event, 201)
      return created
    }

    if (method === 'PUT' || method === 'PATCH') {
      if (!user) {
        throw createError({ statusCode: 401, message: 'Admin authentication required' })
      }
      const id = idPart || url.searchParams.get('id')
      if (!id) {
        throw createError({ statusCode: 400, message: 'Record ID required for update' })
      }
      const body = await readBody(event).catch(() => ({}))
      const updated = await handleUpdate(config, id, body, user)
      return updated
    }

    if (method === 'DELETE') {
      if (!user) {
        throw createError({ statusCode: 401, message: 'Admin authentication required' })
      }
      const id = idPart || url.searchParams.get('id')
      if (!id) {
        throw createError({ statusCode: 400, message: 'Record ID required for delete' })
      }
      await handleDelete(config, id, user)
      setResponseStatus(event, 204)
      return null
    }

    throw createError({ statusCode: 405, message: `Method ${method} not allowed` })
  } catch (err: any) {
    if (err.statusCode) throw err
    throw createError({
      statusCode: err.message.includes('not found') ? 404 : 400,
      message: err.message,
    })
  }
})
