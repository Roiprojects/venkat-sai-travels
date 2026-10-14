import { api, adminFetch } from '../api/client'

export const contactApi = {
  list: () => adminFetch<any[]>('/contact'),
}

export { api as default }
