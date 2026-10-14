import { api, adminFetch } from '../api/client'

export const adminBookingsApi = {
  list: () => adminFetch<any[]>('/bookings'),
  updateStatus: (id: number, status: string) => adminFetch<any>(`/bookings/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
}

export { api as default }
