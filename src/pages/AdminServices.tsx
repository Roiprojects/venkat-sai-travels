import { useState, useEffect } from 'react'
import { adminFetch } from '../api/client'

export default function AdminServices() {
  const [items, setItems] = useState<any[]>([])
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState({ icon: '', title: '', description: '', vehicles: '' })
  const [msg, setMsg] = useState('')

  useEffect(() => { load() }, [])
  const load = async () => { try { const data = await adminFetch<any[]>('/services'); setItems(data); setMsg('') } catch (e: any) { setMsg(e.message) } }
  const reset = () => { setEditing(null); setForm({ icon: '', title: '', description: '', vehicles: '' }); setMsg('') }
  const openEdit = (s: any) => { setEditing(s); setForm({ icon: s.icon, title: s.title, description: s.description, vehicles: Array.isArray(s.vehicles) ? s.vehicles.join(', ') : s.vehicles }); setMsg('') }
  const save = async () => {
    try {
      const body = { ...form, vehicles: form.vehicles.split(',').map((v: string) => v.trim()).filter(Boolean) }
      if (editing) await adminFetch(`/services/${editing.id}`, { method: 'PUT', body: JSON.stringify(body) })
      else await adminFetch('/services', { method: 'POST', body: JSON.stringify(body) })
      setMsg('Saved successfully'); reset(); load()
    } catch (e: any) { setMsg(e.message) }
  }
  const del = async (id: number) => { try { if (!confirm('Delete?')) return; await adminFetch(`/services/${id}`, { method: 'DELETE' }); setMsg('Deleted'); load() } catch (e: any) { setMsg(e.message) } }
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Services ({items.length})</h1>
      {msg && <p className={`mb-4 text-sm ${msg.includes('Saved') || msg.includes('Deleted') ? 'text-green-600' : 'text-red-600'}`}>{msg}</p>}
      <div className="bg-white p-5 rounded-xl shadow mb-6 space-y-3">
        <h3 className="font-semibold text-gray-700">{editing ? 'Edit' : 'Add'} Service</h3>
        <div className="grid grid-cols-2 gap-3">
          <input placeholder="Icon (Lucide name)" value={form.icon} onChange={e => set('icon', e.target.value)} className="border rounded-lg px-3 py-2 text-sm" />
          <input placeholder="Title" value={form.title} onChange={e => set('title', e.target.value)} className="border rounded-lg px-3 py-2 text-sm" />
          <textarea placeholder="Description" value={form.description} onChange={e => set('description', e.target.value)} className="border rounded-lg px-3 py-2 text-sm col-span-2" rows={2} />
          <input placeholder="Vehicles (comma-separated)" value={form.vehicles} onChange={e => set('vehicles', e.target.value)} className="border rounded-lg px-3 py-2 text-sm col-span-2" />
        </div>
        <div className="flex gap-2">
          <button onClick={save} className="bg-brand-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-brand-800">{editing ? 'Update' : 'Add'}</button>
          {editing && <button onClick={reset} className="border border-gray-300 px-4 py-2 rounded-lg text-sm">Cancel</button>}
        </div>
      </div>
      <div className="bg-white rounded-xl shadow divide-y divide-gray-100">
        {items.map(s => (
          <div key={s.id} className="p-4 flex justify-between items-center">
            <div>
              <p className="font-medium text-gray-800">{s.icon} {s.title}</p>
              <p className="text-xs text-gray-500">{s.description?.slice(0, 80)}...</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => openEdit(s)} className="text-blue-600 text-sm hover:underline">Edit</button>
              <button onClick={() => del(s.id)} className="text-red-600 text-sm hover:underline">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
