import { useState, useEffect } from 'react'
import { adminFetch } from '../api/client'

const STATUSES = ['all','new','confirmed','completed','cancelled']

const HEADERS = ['ID','Name','Phone','Email','Trip Type','Vehicle','Date','Time','Pickup','Drop','Passengers','Notes','Status']

export default function AdminBookings() {
  const [bookings, setBookings] = useState<any[]>([])
  const [statusFilter, setStatusFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [msg, setMsg] = useState('')

  useEffect(() => { load() }, [])

  const load = async () => { try { const data = await adminFetch<any[]>('/bookings'); setBookings(data); setMsg('') } catch (e: any) { setMsg(e.message) } }

  const updateStatus = async (id: number, status: string) => {
    try { await adminFetch(`/bookings/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) }); setMsg('Updated'); load() }
    catch (e: any) { setMsg(e.message) }
  }

  const filtered = bookings.filter(b => {
    if (statusFilter !== 'all' && b.status !== statusFilter) return false
    if (search && !`${b.name} ${b.phone} ${b.vehicle} ${b.pickup} ${b.drop}`.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const downloadCsv = () => {
    const rows = filtered.map(b => [b.id, b.name, b.phone, b.email || '', b.trip_type, b.vehicle, b.date, b.time, b.pickup, b.drop, b.passengers || '', (b.notes || '').replace(/"/g, '""'), b.status])
    const csv = [HEADERS.join(','), ...rows.map(r => r.map(c => typeof c === 'string' && (c.includes(',') || c.includes('"')) ? `"${c}"` : c).join(','))].join('\n')
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `bookings_${new Date().toISOString().slice(0,10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Bookings ({bookings.length})</h1>
          {msg && <p className={`text-sm mt-1 ${msg.includes('Updated') ? 'text-green-600' : 'text-red-600'}`}>{msg}</p>}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white">
            {STATUSES.map(s => <option key={s} value={s}>{s === 'all' ? 'All Statuses' : s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
          </select>
          <input type="text" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-40" />
          <button onClick={downloadCsv} disabled={filtered.length === 0}
            className="bg-green-600 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1">
            Download .csv
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-gray-600">ID</th>
              <th className="px-4 py-3 text-left text-gray-600">Name</th>
              <th className="px-4 py-3 text-left text-gray-600">Phone</th>
              <th className="px-4 py-3 text-left text-gray-600">Email</th>
              <th className="px-4 py-3 text-left text-gray-600">Trip</th>
              <th className="px-4 py-3 text-left text-gray-600">Vehicle</th>
              <th className="px-4 py-3 text-left text-gray-600">Date</th>
              <th className="px-4 py-3 text-left text-gray-600">Time</th>
              <th className="px-4 py-3 text-left text-gray-600">Pickup</th>
              <th className="px-4 py-3 text-left text-gray-600">Drop</th>
              <th className="px-4 py-3 text-left text-gray-600">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map(b => (
              <tr key={b.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">#{b.id}</td>
                <td className="px-4 py-3">{b.name}</td>
                <td className="px-4 py-3">{b.phone}</td>
                <td className="px-4 py-3 text-xs">{b.email}</td>
                <td className="px-4 py-3">{b.trip_type}</td>
                <td className="px-4 py-3">{b.vehicle}</td>
                <td className="px-4 py-3 whitespace-nowrap">{b.date}</td>
                <td className="px-4 py-3 whitespace-nowrap">{b.time}</td>
                <td className="px-4 py-3 text-xs max-w-[160px] truncate" title={b.pickup}>{b.pickup}</td>
                <td className="px-4 py-3 text-xs max-w-[160px] truncate" title={b.drop}>{b.drop}</td>
                <td className="px-4 py-3">
                  <select value={b.status} onChange={e => updateStatus(b.id, e.target.value)}
                    className={`text-xs rounded px-2 py-1 font-medium border ${b.status === 'new' ? 'bg-yellow-50 border-yellow-200 text-yellow-700' : b.status === 'confirmed' ? 'bg-blue-50 border-blue-200 text-blue-700' : b.status === 'completed' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
                    {STATUSES.filter(s => s !== 'all').map(s => <option key={s} value={s}>{s.toUpperCase()}</option>)}
                  </select>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={11} className="px-4 py-8 text-center text-gray-400">No bookings found</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}
