/**
 * Server-only environment loading and typed config.
 *
 * Loads `.env` from the working directory via Node's built-in
 * `process.loadEnvFile` (does not override variables already set by the
 * process manager). Never import this module from client code.
 */
import { existsSync, readFileSync } from 'node:fs'

let loaded = false

function loadEnvOnce() {
  if (loaded) return
  loaded = true
  const candidates = [process.env.ENV_FILE, '.env', 'server/.env', '../.env'].filter(Boolean) as string[]
  for (const file of candidates) {
    if (existsSync(file)) {
      try {
        if (typeof process.loadEnvFile === 'function') {
          process.loadEnvFile(file)
          return
        }
      } catch {}
      try {
        const text = readFileSync(file, 'utf8')
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
        return
      } catch {}
    }
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
