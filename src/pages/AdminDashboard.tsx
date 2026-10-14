import { useState, useEffect } from 'react'
import { adminFetch } from '../api/client'

type Stats = {
  bookings: number
  inquiries: number
  fleet: number
  services: number
  faqs: number
  gallery: number
  testimonials: number
  destinations: number
  blogs: number
  awards: number
  availability: number
  safety: number
  trustedBy: number
}

const STAT_CARDS = [
  { key: 'bookings',    label: 'Bookings',        color: 'bg-blue-50 text-blue-700 border-blue-200' },
  { key: 'inquiries',   label: 'Inquiries',       color: 'bg-green-50 text-green-700 border-green-200' },
  { key: 'fleet',       label: 'Fleet',           color: 'bg-amber-50 text-amber-700 border-amber-200' },
  { key: 'services',    label: 'Services',        color: 'bg-purple-50 text-purple-700 border-purple-200' },
  { key: 'faqs',        label: 'FAQs',            color: 'bg-teal-50 text-teal-700 border-teal-200' },
  { key: 'gallery',     label: 'Gallery',         color: 'bg-pink-50 text-pink-700 border-pink-200' },
  { key: 'testimonials',label: 'Testimonials',    color: 'bg-orange-50 text-orange-700 border-orange-200' },
  { key: 'destinations',label: 'Destinations',    color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  { key: 'blogs',       label: 'Blogs',           color: 'bg-cyan-50 text-cyan-700 border-cyan-200' },
  { key: 'awards',      label: 'Awards',          color: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  { key: 'availability',label: 'Availability',    color: 'bg-lime-50 text-lime-700 border-lime-200' },
  { key: 'safety',      label: 'Safety',          color: 'bg-rose-50 text-rose-700 border-rose-200' },
  { key: 'trustedBy',   label: 'Trusted By',      color: 'bg-violet-50 text-violet-700 border-violet-200' },
]

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    bookings: 0, inquiries: 0, fleet: 0, services: 0, faqs: 0,
    gallery: 0, testimonials: 0, destinations: 0, blogs: 0, awards: 0,
    availability: 0, safety: 0, trustedBy: 0,
  })
  const [recent, setRecent] = useState<any[]>([])

  useEffect(() => { load() }, [])
  const load = async () => {
    try {
      const [b, c, f, svc, faq, gal, t, d, bl, aw, av, sf, tb] = await Promise.all([
        adminFetch<any[]>('/bookings'),
        adminFetch<any[]>('/contact'),
        adminFetch<any[]>('/fleet'),
        adminFetch<any[]>('/services'),
        adminFetch<any[]>('/faqs'),
        adminFetch<any[]>('/gallery'),
        adminFetch<any[]>('/testimonials'),
        adminFetch<any[]>('/destinations'),
        adminFetch<any[]>('/blogs'),
        adminFetch<any[]>('/awards'),
        adminFetch<any[]>('/availability'),
        adminFetch<any[]>('/safety'),
        adminFetch<any[]>('/trusted-by'),
      ])
      setStats({
        bookings: b.length, inquiries: c.length, fleet: f.length, services: svc.length,
        faqs: faq.length, gallery: gal.length, testimonials: t.length, destinations: d.length,
        blogs: bl.length, awards: aw.length, availability: av.length, safety: sf.length, trustedBy: tb.length,
      })
      setRecent(b.slice(0, 5))
    } catch (e: any) {
      if (!e.message?.includes('401')) console.error('Dashboard load error:', e.message)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-8">
        {STAT_CARDS.map(s => (
          <div key={s.key} className={`p-4 rounded-xl border ${s.color}`}>
            <p className="text-xs font-medium opacity-70">{s.label}</p>
            <p className="text-2xl font-bold mt-1">{stats[s.key as keyof Stats]}</p>
          </div>
        ))}
      </div>
      <h2 className="text-lg font-semibold text-gray-700 mb-3">Recent Bookings</h2>
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-gray-600">ID</th>
              <th className="px-4 py-3 text-left text-gray-600">Name</th>
              <th className="px-4 py-3 text-left text-gray-600">Phone</th>
              <th className="px-4 py-3 text-left text-gray-600">Vehicle</th>
              <th className="px-4 py-3 text-left text-gray-600">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {recent.map(b => (
              <tr key={b.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">#{b.id}</td>
                <td className="px-4 py-3">{b.name}</td>
                <td className="px-4 py-3">{b.phone}</td>
                <td className="px-4 py-3">{b.vehicle}</td>
                <td className="px-4 py-3">{b.date}</td>
              </tr>
            ))}
            {recent.length === 0 && <tr><td colSpan={5} className="px-4 py-6 text-center text-gray-400">No bookings yet</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}
