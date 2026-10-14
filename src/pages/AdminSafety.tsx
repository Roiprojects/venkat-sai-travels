import { useState, useEffect } from 'react'
import { adminFetch } from '../api/client'

export default function AdminSafety() {
  const [items, setItems] = useState<any[]>([])
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState({ icon: '', title: '', description: '' })
  const [msg, setMsg] = useState('')

  useEffect(() => { load() }, [])
  const load = async () => { try { const data = await adminFetch<any[]>('/safety'); setItems(data); setMsg('') } catch (e: any) { setMsg(e.message) } }
  const reset = () => { setEditing(null); setForm({ icon: '', title: '', description: '' }); setMsg('') }
  const openEdit = (s: any) => { setEditing(s); setForm({ icon: s.icon, title: s.title, description: s.description }); setMsg('') }
  const save = async () => {
    try {
      if (editing) await adminFetch(`/safety/${editing.id}`, { method: 'PUT', body: JSON.stringify(form) })
      else await adminFetch('/safety', { method: 'POST', body: JSON.stringify(form) })
      setMsg('Saved successfully'); reset(); load()
    } catch (e: any) { setMsg(e.message) }
  }
  const del = async (id: number) => { try { if (!confirm('Delete?')) return; await adminFetch(`/safety/${id}`, { method: 'DELETE' }); setMsg('Deleted'); load() } catch (e: any) { setMsg(e.message) } }
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Safety Features ({items.length})</h1>
      {msg && <p className={`mb-4 text-sm ${msg.includes('Saved') || msg.includes('Deleted') ? 'text-green-600' : 'text-red-600'}`}>{msg}</p>}
      <div className="bg-white p-5 rounded-xl shadow mb-6 space-y-3">
        <h3 className="font-semibold text-gray-700">{editing ? 'Edit' : 'Add'} Feature</h3>
        <div className="grid grid-cols-3 gap-3">
          <input placeholder="Icon name" value={form.icon} onChange={e => set('icon', e.target.value)} className="border rounded-lg px-3 py-2 text-sm" />
          <input placeholder="Title" value={form.title} onChange={e => set('title', e.target.value)} className="border rounded-lg px-3 py-2 text-sm" />
          <input placeholder="Description" value={form.description} onChange={e => set('description', e.target.value)} className="border rounded-lg px-3 py-2 text-sm" />
        </div>
        <div className="flex gap-2">
          <button onClick={save} className="bg-brand-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-brand-800">{editing ? 'Update' : 'Add'}</button>
          {editing && <button onClick={reset} className="border border-gray-300 px-4 py-2 rounded-lg text-sm">Cancel</button>}
        </div>
      </div>
      <div className="bg-white rounded-xl shadow divide-y divide-gray-100">
        {items.map(s => (
          <div key={s.id} className="p-4 flex justify-between">
            <div>
              <p className="font-medium text-gray-800">{s.icon} {s.title}</p>
              <p className="text-xs text-gray-500">{s.description}</p>
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
