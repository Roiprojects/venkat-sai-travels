import { useState, useEffect } from 'react'
import { adminFetch } from '../api/client'

export default function AdminDestinations() {
  const [items, setItems] = useState<any[]>([])
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState({ name: '', distance: '', time: '', tag: '', gradient: '', image: '' })
  const [msg, setMsg] = useState('')

  useEffect(() => { load() }, [])
  const load = async () => { try { const data = await adminFetch<any[]>('/destinations'); setItems(data); setMsg('') } catch (e: any) { setMsg(e.message) } }
  const reset = () => { setEditing(null); setForm({ name: '', distance: '', time: '', tag: '', gradient: '', image: '' }); setMsg('') }
  const openEdit = (d: any) => { setEditing(d); setForm({ name: d.name, distance: d.distance, time: d.time, tag: d.tag, gradient: d.gradient || '', image: d.image || '' }); setMsg('') }
  const save = async () => {
    try {
      if (editing) await adminFetch(`/destinations/${editing.id}`, { method: 'PUT', body: JSON.stringify(form) })
      else await adminFetch('/destinations', { method: 'POST', body: JSON.stringify(form) })
      setMsg('Saved successfully'); reset(); load()
    } catch (e: any) { setMsg(e.message) }
  }
  const del = async (id: number) => { try { if (!confirm('Delete?')) return; await adminFetch(`/destinations/${id}`, { method: 'DELETE' }); setMsg('Deleted'); load() } catch (e: any) { setMsg(e.message) } }
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Destinations ({items.length})</h1>
      {msg && <p className={`mb-4 text-sm ${msg.includes('Saved') || msg.includes('Deleted') ? 'text-green-600' : 'text-red-600'}`}>{msg}</p>}
      <div className="bg-white p-5 rounded-xl shadow mb-6">
        <h3 className="font-semibold text-gray-700 mb-3">{editing ? 'Edit' : 'Add'} Destination</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <input placeholder="Name" value={form.name} onChange={e => set('name', e.target.value)} className="border rounded-lg px-3 py-2 text-sm" />
          <input placeholder="Distance" value={form.distance} onChange={e => set('distance', e.target.value)} className="border rounded-lg px-3 py-2 text-sm" />
          <input placeholder="Time" value={form.time} onChange={e => set('time', e.target.value)} className="border rounded-lg px-3 py-2 text-sm" />
          <input placeholder="Tag" value={form.tag} onChange={e => set('tag', e.target.value)} className="border rounded-lg px-3 py-2 text-sm" />
          <input placeholder="Image path" value={form.image} onChange={e => set('image', e.target.value)} className="border rounded-lg px-3 py-2 text-sm" />
          <input placeholder="Gradient" value={form.gradient} onChange={e => set('gradient', e.target.value)} className="border rounded-lg px-3 py-2 text-sm" />
        </div>
        <div className="flex gap-2 mt-4">
          <button onClick={save} className="bg-brand-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-brand-800">{editing ? 'Update' : 'Add'}</button>
          {editing && <button onClick={reset} className="border border-gray-300 px-4 py-2 rounded-lg text-sm">Cancel</button>}
        </div>
      </div>
      <div className="bg-white rounded-xl shadow divide-y divide-gray-100">
        {items.map(d => (
          <div key={d.id} className="p-4 flex justify-between items-center">
            <div>
              <p className="font-medium text-gray-800">{d.name}</p>
              <p className="text-xs text-gray-500">{d.distance} • {d.time} • {d.tag}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => openEdit(d)} className="text-blue-600 text-sm hover:underline">Edit</button>
              <button onClick={() => del(d.id)} className="text-red-600 text-sm hover:underline">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
