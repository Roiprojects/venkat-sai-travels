import { useState, useEffect } from 'react'
import { adminFetch } from '../api/client'

export default function AdminTrustedBy() {
  const [items, setItems] = useState<any[]>([])
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState({ name: '', image: '' })
  const [msg, setMsg] = useState('')

  useEffect(() => { load() }, [])
  const load = async () => { try { const data = await adminFetch<any[]>('/trusted-by'); setItems(data); setMsg('') } catch (e: any) { setMsg(e.message) } }
  const reset = () => { setEditing(null); setForm({ name: '', image: '' }); setMsg('') }
  const openEdit = (c: any) => { setEditing(c); setForm({ name: c.name, image: c.image || '' }); setMsg('') }
  const save = async () => {
    try {
      if (editing) await adminFetch(`/trusted-by/${editing.id}`, { method: 'PUT', body: JSON.stringify(form) })
      else await adminFetch('/trusted-by', { method: 'POST', body: JSON.stringify(form) })
      setMsg('Saved successfully'); reset(); load()
    } catch (e: any) { setMsg(e.message) }
  }
  const del = async (id: number) => { try { if (!confirm('Delete?')) return; await adminFetch(`/trusted-by/${id}`, { method: 'DELETE' }); setMsg('Deleted'); load() } catch (e: any) { setMsg(e.message) } }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Trusted By ({items.length})</h1>
      {msg && <p className={`mb-4 text-sm ${msg.includes('Saved') || msg.includes('Deleted') ? 'text-green-600' : 'text-red-600'}`}>{msg}</p>}
      <div className="bg-white p-5 rounded-xl shadow mb-6 flex gap-3 items-end">
        <input placeholder="Company name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="border rounded-lg px-3 py-2 text-sm flex-1" />
        <input placeholder="Image path (optional)" value={form.image} onChange={e => setForm(f => ({ ...f, image: e.target.value }))} className="border rounded-lg px-3 py-2 text-sm flex-1" />
        <button onClick={save} className="bg-brand-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-brand-800">{editing ? 'Update' : 'Add'}</button>
        {editing && <button onClick={reset} className="border border-gray-300 px-4 py-2 rounded-lg text-sm">Cancel</button>}
      </div>
      <div className="bg-white rounded-xl shadow divide-y divide-gray-100">
        {items.map(item => (
          <div key={item.id} className="p-4 flex justify-between items-center">
            <div>
              <p className="font-medium text-gray-800">{item.name}</p>
              <p className="text-xs text-gray-500">{item.image || 'No image'}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => openEdit(item)} className="text-blue-600 text-sm hover:underline">Edit</button>
              <button onClick={() => del(item.id)} className="text-red-600 text-sm hover:underline">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
