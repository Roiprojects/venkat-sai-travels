import crypto from 'node:crypto'
import bcrypt from 'bcryptjs'
import { query } from '../server/db'
import { env } from '../server/env'

export interface AdminUser {
  id: number
  username: string
  role?: string
}

export interface SessionInfo {
  token: string
  cookieValue: string
  expiresAt: Date
  user: AdminUser
}

export const COOKIE_NAME = env.cookieSecure ? '__Host-vst_session' : 'vst_session'

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(12)
  return bcrypt.hash(password, salt)
}

export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  if (!storedHash || !password) return false

  // Standard bcrypt
  if (storedHash.startsWith('$2a$') || storedHash.startsWith('$2b$') || storedHash.startsWith('$2y$')) {
    return bcrypt.compare(password, storedHash)
  }

  // Fallback for legacy PBKDF2 hash if present
  try {
    const salt = storedHash.slice(0, 16)
    const check = crypto.pbkdf2Sync(password, salt, 100000, 32, 'sha256').toString('hex')
    return crypto.timingSafeEqual(Buffer.from(check), Buffer.from(storedHash))
  } catch {
    return false
  }
}

export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex')
}

export async function createSession(
  user: AdminUser,
  ip?: string | null,
  userAgent?: string | null
): Promise<SessionInfo> {
  const token = crypto.randomBytes(32).toString('base64url')
  const tokenHash = hashToken(token)

  const ttlSeconds = env.sessionTtlDays * 24 * 60 * 60
  const expiresAt = new Date(Date.now() + ttlSeconds * 1000)

  await query(
    `INSERT INTO admin_sessions (token_hash, admin_id, admin_username, ip, user_agent, expires_at)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [tokenHash, user.id, user.username, ip || null, userAgent || null, expiresAt]
  )

  const secureFlag = env.cookieSecure ? '; Secure' : ''
  const cookieValue = `${COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${ttlSeconds}${secureFlag}`

  return { token, cookieValue, expiresAt, user }
}

export function parseCookie(cookieHeader?: string | null, name: string = COOKIE_NAME): string | null {
  if (!cookieHeader) return null
  const cookies = cookieHeader.split(';')
  for (const part of cookies) {
    const [k, v] = part.trim().split('=')
    if (k === name && v) return decodeURIComponent(v)
  }
  return null
}

export function getClearSessionCookie(): string {
  const secureFlag = env.cookieSecure ? '; Secure' : ''
  return `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT${secureFlag}`
}

export async function validateSession(token: string | null): Promise<AdminUser | null> {
  if (!token) return null
  const tokenHash = hashToken(token)

  const res = await query(
    `SELECT admin_id, admin_username, expires_at, revoked_at
     FROM admin_sessions
     WHERE token_hash = $1`,
    [tokenHash]
  )

  if (res.rows.length === 0) return null
  const row = res.rows[0]

  if (row.revoked_at || new Date(row.expires_at) < new Date()) {
    return null
  }

  // Update last_seen_at non-blocking
  query('UPDATE admin_sessions SET last_seen_at = NOW() WHERE token_hash = $1', [tokenHash]).catch(() => {})

  return {
    id: row.admin_id,
    username: row.admin_username,
  }
}

export async function invalidateSession(token: string | null): Promise<void> {
  if (!token) return
  const tokenHash = hashToken(token)
  await query('UPDATE admin_sessions SET revoked_at = NOW() WHERE token_hash = $1', [tokenHash])
}

export function validateCsrf(
  originHeader?: string | null,
  refererHeader?: string | null,
  hostHeader?: string | null
): boolean {
  const source = originHeader || (refererHeader ? new URL(refererHeader).origin : null)
  if (!source) return true

  const cleanSource = source.replace(/\/$/, '')

  // 1. Explicitly configured APP_ORIGIN list (or wildcard *)
  if (env.appOrigins.length > 0) {
    if (env.appOrigins.includes(cleanSource) || env.appOrigins.includes('*')) {
      return true
    }
  }

  // 2. Automatically allow same-host and subdomains matching the current request Host
  if (hostHeader) {
    try {
      const sourceUrl = new URL(cleanSource)
      const cleanHost = hostHeader.split(':')[0].toLowerCase()
      const sourceHost = sourceUrl.hostname.toLowerCase()

      // Exact host match (works on main domain or any subdomain)
      if (sourceHost === cleanHost) return true

      // Allow www <-> apex domain or sibling subdomains on the same parent domain
      if (sourceHost.endsWith(`.${cleanHost}`) || cleanHost.endsWith(`.${sourceHost}`)) {
        return true
      }
    } catch {}
  }

  // 3. Fallback: if no APP_ORIGIN is specified, permit same-host
  return env.appOrigins.length === 0
}
