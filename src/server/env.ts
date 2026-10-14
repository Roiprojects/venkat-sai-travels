/**
 * Server-only environment loading and typed config.
 *
 * Loads `.env` from the working directory via Node's built-in
 * `process.loadEnvFile` (does not override variables already set by the
 * process manager). Never import this module from client code.
 */
import { existsSync } from 'node:fs'

let loaded = false

function loadEnvOnce() {
  if (loaded) return
  loaded = true
  const file = process.env.ENV_FILE || '.env'
  if (existsSync(file) && typeof process.loadEnvFile === 'function') {
    process.loadEnvFile(file)
  }
}

loadEnvOnce()

function int(name: string, fallback: number): number {
  const raw = process.env[name]
  const n = raw ? Number.parseInt(raw, 10) : Number.NaN
  return Number.isFinite(n) && n > 0 ? n : fallback
}

function list(name: string): string[] {
  return (process.env[name] || '')
    .split(',')
    .flatMap((s) => {
      const trimmed = s.trim().replace(/\/$/, '')
      if (!trimmed) return []
      if (!/^https?:\/\//i.test(trimmed)) {
        return [trimmed, `https://${trimmed}`, `http://${trimmed}`]
      }
      return [trimmed]
    })
    .filter(Boolean)
}

const isProduction = process.env.NODE_ENV === 'production'

export const env = {
  isProduction,
  /** Allowed browser origins for state-changing requests, e.g. https://venkatsai.roiclients.co.in */
  appOrigins: list('APP_ORIGIN'),
  /** Trust X-Forwarded-For / X-Real-IP (set true behind Nginx). */
  trustProxy: process.env.TRUST_PROXY === 'true',
  sessionTtlDays: int('SESSION_TTL_DAYS', 7),
  sessionTable: process.env.SESSION_TABLE || 'admin_sessions',
  /** Secure cookies (and the __Host- prefix) default on in production. */
  cookieSecure: process.env.COOKIE_SECURE ? process.env.COOKIE_SECURE === 'true' : isProduction,
  allowPasswordReset: process.env.ALLOW_PASSWORD_RESET === 'true',
  pgPoolMax: int('PG_POOL_MAX', 10),
} as const
