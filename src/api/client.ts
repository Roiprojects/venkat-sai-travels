const API_TIMEOUT = 10000
const API_BASE = '/api/'

const PATH_MAP: Record<string, string> = {
  '/fleet':         '/fleets',
  '/fleet/':        '/fleets',
  '/services':      '/services',
  '/services/':     '/services',
  '/destinations':  '/destinations',
  '/destinations/': '/destinations',
  '/blogs':         '/blogs',
  '/blogs/':        '/blogs',
  '/awards':        '/awards',
  '/awards/':       '/awards',
  '/faqs':          '/faqs',
  '/faqs/':         '/faqs',
  '/gallery':       '/gallery',
  '/gallery/':      '/gallery',
  '/testimonials':  '/testimonials',
  '/testimonials/': '/testimonials',
  '/availability':  '/vehicle_availability',
  '/availability/': '/vehicle_availability',
  '/safety':        '/safety_features',
  '/safety/':       '/safety_features',
  '/trusted-by':    '/trusted_by',
  '/trusted-by/':   '/trusted_by',
  '/contact':       '/contact_inquiries',
  '/contact/':      '/contact_inquiries',
  '/settings':      '/settings',
  '/about/founder': '/about_founder',
  '/about/timeline':'/about_timeline',
  '/about/timeline/':'/about_timeline',
  '/about/values':  '/about_values',
  '/about/values/': '/about_values',
}

function translatePath(raw: string): string {
  const [pathPart, queryPart] = raw.split('?')
  const entries = Object.entries(PATH_MAP).sort((a, b) => b[0].length - a[0].length)
  for (const [old, nw] of entries) {
    if (pathPart === old) {
      return queryPart ? `${nw}?${queryPart}` : nw
    }
    const oldSlash = old.endsWith('/') ? old.slice(0, -1) : old
    if (pathPart.startsWith(oldSlash + '/')) {
      const suffix = pathPart.slice(oldSlash.length)
      return queryPart ? `${nw}${suffix}?${queryPart}` : `${nw}${suffix}`
    }
  }
  return raw
}

function applyQuery(method: string, path: string, id?: number): string {
  const [pathPart, queryPart] = path.split('?')
  const idMatch = pathPart.match(/^(.*)\/(\d+)(?:\/.*)?$/)
  const baseTable = idMatch ? idMatch[1] : pathPart.replace(/\/$/, '')
  const pathId = idMatch ? parseInt(idMatch[2]) : undefined
  const effectiveId = id ?? pathId
  let result = baseTable
  if (effectiveId) {
    result = `${result}?id=eq.${effectiveId}`
    if (queryPart) result += `&${queryPart}`
  } else if (queryPart) {
    result = `${result}?${queryPart}`
  }
  return result
}

async function fetchJSON<T>(path: string, options?: RequestInit): Promise<T> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), API_TIMEOUT)

  const cleanPath = path.startsWith('/') ? path.slice(1) : path
  const url = `${API_BASE}${cleanPath}`

  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...(options?.headers as Record<string, string> || {}),
  }

  try {
    const res = await fetch(url, {
      ...options,
      credentials: 'include', // Includes session cookie automatically
      headers,
      signal: controller.signal,
    })
    clearTimeout(timer)

    if (!res.ok) {
      let msg = `API error ${res.status}`
      try {
        const body = await res.text()
        if (body) {
          const j = JSON.parse(body)
          msg = j.message || j.error || j.statusText || msg
        }
      } catch {}
      throw new Error(msg)
    }

    if (res.status === 204) return undefined as T
    return res.json()
  } catch (e: any) {
    clearTimeout(timer)
    if (e.name === 'AbortError') throw new Error('Request timed out — please check the server is running')
    throw e
  }
}

export function pr<T>(path: string, options?: RequestInit): Promise<T> {
  return fetchJSON<T>(path, options)
}

export function prAuth<T>(path: string, options?: RequestInit): Promise<T> {
  return fetchJSON<T>(path, options)
}

export function adminFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const translated = translatePath(path)
  const prPath = applyQuery(options?.method || 'GET', translated)
  return prAuth<T>(prPath, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers as Record<string, string> || {}),
    },
  })
}

export function authFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const cleanPath = path.startsWith('/') ? path.slice(1) : path
  return fetchJSON<T>(`auth/${cleanPath}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers as Record<string, string> || {}),
    },
  })
}

export async function getCurrentAdmin(): Promise<{ id: number; username: string } | null> {
  try {
    const res = await authFetch<{ authenticated: boolean; user: { id: number; username: string } }>('me')
    return res.user || null
  } catch {
    return null
  }
}

export const api = {
  settings: async () => {
    const rows = await pr<any[]>('settings?order=key')
    return Object.fromEntries(rows.map((r: any) => [r.key, r.value]))
  },
  fleet:        () => pr<any[]>('fleets?order=id'),
  services:     () => pr<any[]>('services?order=id'),
  testimonials: () => pr<any[]>('testimonials?order=id'),
  faqs:         () => pr<any[]>('faqs?order=id'),
  gallery:      () => pr<any[]>('gallery?order=id'),
  destinations: () => pr<any[]>('destinations?order=id'),
  blogs:        () => pr<any[]>('blogs?order=created_at.desc'),
  awards:       () => pr<any[]>('awards?order=year.desc'),
  availability: () => pr<any[]>('vehicle_availability?order=id'),
  safety:       () => pr<any[]>('safety_features?order=id'),
  trustedBy:    () => pr<any[]>('trusted_by?order=id'),
  companies:    () => pr<any>('companies?limit=1'),
  bookings:     () => prAuth<any[]>('bookings?order=created_at.desc'),
  contact:      () => prAuth<any[]>('contact_inquiries?order=created_at.desc'),
  aboutFounder: () => pr<any>('about_founder?limit=1'),
  aboutTimeline:() => pr<any[]>('about_timeline?order=year'),
  aboutValues:  () => pr<any[]>('about_values?order=id'),
  about:        () =>
    Promise.all([
      pr<any>('about_founder?limit=1'),
      pr<any[]>('about_timeline?order=year'),
      pr<any[]>('about_values?order=id'),
    ]).then(([founder, timeline, values]) => ({ founder, timeline, values })),
  stats:        () => pr<any[]>('stats?order=display_order'),
  adminUsers:   () => prAuth<any[]>('admin_users'),
  inquiries:    () => prAuth<any[]>('inquiries?order=created_at.desc'),
  vehicles:     () => prAuth<any[]>('vehicles?order=display_order'),
  submitBooking:(data: any) =>
    pr<any>('bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),
  submitContact:(data: any) =>
    pr<any>('contact_inquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),
}

export const adminApi = {
  upsertFleet:      (data: any) => prAuth<any>('fleets', { method: 'POST', body: JSON.stringify(data) }),
  upsertService:    (data: any) => prAuth<any>('services', { method: 'POST', body: JSON.stringify(data) }),
  upsertTestimonial:(data: any) => prAuth<any>('testimonials', { method: 'POST', body: JSON.stringify(data) }),
  upsertFaq:        (data: any) => prAuth<any>('faqs', { method: 'POST', body: JSON.stringify(data) }),
  upsertGallery:    (data: any) => prAuth<any>('gallery', { method: 'POST', body: JSON.stringify(data) }),
  upsertDestination:(data: any) => prAuth<any>('destinations', { method: 'POST', body: JSON.stringify(data) }),
  upsertBlog:       (data: any) => prAuth<any>('blogs', { method: 'POST', body: JSON.stringify(data) }),
  upsertAward:      (data: any) => prAuth<any>('awards', { method: 'POST', body: JSON.stringify(data) }),
  upsertAvailability:(data: any)=> prAuth<any>('vehicle_availability', { method: 'POST', body: JSON.stringify(data) }),
  upsertSafety:     (data: any) => prAuth<any>('safety_features', { method: 'POST', body: JSON.stringify(data) }),
  upsertTrustedBy:  (data: any) => prAuth<any>('trusted_by', { method: 'POST', body: JSON.stringify(data) }),
  updateSettings:   (data: any) => prAuth<any>('settings', { method: 'POST', body: JSON.stringify(data) }),
  updateFounder:    (data: any) => prAuth<any>('about_founder', { method: 'PATCH', body: JSON.stringify(data) }),
  upsertTimeline:   (data: any) => prAuth<any>('about_timeline', { method: 'POST', body: JSON.stringify(data) }),
  upsertValue:      (data: any) => prAuth<any>('about_values', { method: 'POST', body: JSON.stringify(data) }),
  upsertStat:       (data: any) => prAuth<any>('stats', { method: 'POST', body: JSON.stringify(data) }),
  patchBooking:     (id: number, data: any) => prAuth<any>(`bookings/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteItem:       (table: string, id: number) => prAuth<any>(`${table}/${id}`, { method: 'DELETE' }),
  deleteTimeline:   (id: number) => prAuth<any>(`about_timeline/${id}`, { method: 'DELETE' }),
  deleteValue:      (id: number) => prAuth<any>(`about_values/${id}`, { method: 'DELETE' }),
}
