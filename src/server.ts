import handler, { createServerEntry } from '@tanstack/react-start/server-entry'
import { apiApp } from './server/api/app'

export default createServerEntry({
  async fetch(request, opts) {
    const url = new URL(request.url)

    // Intercept all /api/* requests before TanStack Start SSR
    if (url.pathname.startsWith('/api/') || url.pathname === '/api') {
      return apiApp.fetch(request)
    }

    // All other requests fall through to TanStack Start for SSR
    return handler.fetch(request, opts)
  },
})
