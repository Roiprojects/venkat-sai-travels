import { useState, useEffect } from 'react'
import { adminFetch } from '../api/client'

export default function AdminAvailability() {
  const [items, setItems] = useState<any[]>([])
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState({ vehicle_name: '', seats: 0, available: true, status: 'Available Now' })
  const [msg, setMsg] = useState('')

  useEffect(() => { load() }, [])
  const load = async () => { try { const data = await adminFetch<any[]>('/availability'); setItems(data); setMsg('') } catch (e: any) { setMsg(e.message) } }
  const reset = () => { setEditing(null); setForm({ vehicle_name: '', seats: 0, available: true, status: 'Available Now' }); setMsg('') }
  const openEdit = (item: any) => { setEditing(item); setForm({ vehicle_name: item.vehicle_name, seats: item.seats || 0, available: item.available, status: item.status || 'Available Now' }); setMsg('') }
  const save = async () => {
    try {
      if (editing) await adminFetch(`/availability/${editing.id}`, { method: 'PUT', body: JSON.stringify(form) })
      else await adminFetch('/availability', { method: 'POST', body: JSON.stringify(form) })
      setMsg('Saved successfully'); reset(); load()
    } catch (e: any) { setMsg(e.message) }
  }
  const toggleAvailable = async (item: any) => {
    try {
      await adminFetch(`/availability/${item.id}`, {
        method: 'PUT',
        body: JSON.stringify({ available: !item.available, status: !item.available ? 'Available Now' : 'Book in Advance', vehicle_name: item.vehicle_name, seats: item.seats }),
      })
      setMsg('Updated'); load()
    } catch (e: any) { setMsg(e.message) }
  }
  const del = async (id: number) => { try { if (!confirm('Delete?')) return; await adminFetch(`/availability/${id}`, { method: 'DELETE' }); setMsg('Deleted'); load() } catch (e: any) { setMsg(e.message) } }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Vehicle Availability ({items.length})</h1>
      {msg && <p className={`mb-4 text-sm ${msg.includes('Saved') || msg.includes('Deleted') || msg.includes('Updated') ? 'text-green-600' : 'text-red-600'}`}>{msg}</p>}
      <div className="bg-white p-5 rounded-xl shadow mb-6 space-y-3">
        <h3 className="font-semibold text-gray-700">{editing ? 'Edit' : 'Add'} Vehicle</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <input placeholder="Vehicle name" value={form.vehicle_name} onChange={e => setForm(f => ({ ...f, vehicle_name: e.target.value }))} className="border rounded-lg px-3 py-2 text-sm col-span-2" />
          <input type="number" placeholder="Seats" value={form.seats} onChange={e => setForm(f => ({ ...f, seats: +e.target.value }))} className="border rounded-lg px-3 py-2 text-sm" />
          <input placeholder="Status" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} className="border rounded-lg px-3 py-2 text-sm" />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.available} onChange={e => setForm(f => ({ ...f, available: e.target.checked }))} className="rounded" /> Available
          </label>
        </div>
        <div className="flex gap-2">
          <button onClick={save} className="bg-brand-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-brand-800">{editing ? 'Update' : 'Add'}</button>
          {editing && <button onClick={reset} className="border border-gray-300 px-4 py-2 rounded-lg text-sm">Cancel</button>}
        </div>
      </div>
      <div className="bg-white rounded-xl shadow divide-y divide-gray-100">
        {items.map(item => (
          <div key={item.id} className="p-4 flex justify-between items-center">
            <div>
              <p className="font-medium text-gray-800">{item.vehicle_name}</p>
              <p className="text-xs text-gray-500">{item.status} · {item.seats || 0} seats</p>
            </div>
            <div className="flex gap-2 items-center">
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={item.available} onChange={() => toggleAvailable(item)} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-checked:bg-green-500 rounded-full peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all" />
              </label>
              <button onClick={() => openEdit(item)} className="text-blue-600 text-xs hover:underline">Edit</button>
              <button onClick={() => del(item.id)} className="text-red-600 text-xs hover:underline">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
