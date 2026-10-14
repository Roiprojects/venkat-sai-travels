import { useState, useEffect } from 'react'
import { adminFetch } from '../api/client'

export default function AdminAwards() {
  const [items, setItems] = useState<any[]>([])
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState({ year: new Date().getFullYear(), title: '' })
  const [msg, setMsg] = useState('')

  useEffect(() => { load() }, [])
  const load = async () => { try { const data = await adminFetch<any[]>('/awards'); setItems(data); setMsg('') } catch (e: any) { setMsg(e.message) } }
  const reset = () => { setEditing(null); setForm({ year: new Date().getFullYear(), title: '' }); setMsg('') }
  const openEdit = (a: any) => { setEditing(a); setForm({ year: a.year, title: a.title }); setMsg('') }
  const save = async () => {
    try {
      if (editing) await adminFetch(`/awards/${editing.id}`, { method: 'PUT', body: JSON.stringify(form) })
      else await adminFetch('/awards', { method: 'POST', body: JSON.stringify(form) })
      setMsg('Saved successfully'); reset(); load()
    } catch (e: any) { setMsg(e.message) }
  }
  const del = async (id: number) => { try { if (!confirm('Delete?')) return; await adminFetch(`/awards/${id}`, { method: 'DELETE' }); setMsg('Deleted'); load() } catch (e: any) { setMsg(e.message) } }
  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }))

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Awards ({items.length})</h1>
      {msg && <p className={`mb-4 text-sm ${msg.includes('Saved') || msg.includes('Deleted') ? 'text-green-600' : 'text-red-600'}`}>{msg}</p>}
      <div className="bg-white p-5 rounded-xl shadow mb-6 flex gap-3 items-end">
        <input type="number" placeholder="Year" value={form.year} onChange={e => set('year', +e.target.value)} className="border rounded-lg px-3 py-2 text-sm" />
        <input placeholder="Title" value={form.title} onChange={e => set('title', e.target.value)} className="border rounded-lg px-3 py-2 text-sm flex-1" />
        <button onClick={save} className="bg-brand-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-brand-800">{editing ? 'Update' : 'Add'}</button>
        {editing && <button onClick={reset} className="border border-gray-300 px-4 py-2 rounded-lg text-sm">Cancel</button>}
      </div>
      <div className="bg-white rounded-xl shadow divide-y divide-gray-100">
        {items.map(a => (
          <div key={a.id} className="p-4 flex justify-between items-center">
            <div><span className="font-medium text-brand-700">{a.year}</span> — {a.title}</div>
            <div className="flex gap-2">
              <button onClick={() => openEdit(a)} className="text-blue-600 text-sm hover:underline">Edit</button>
              <button onClick={() => del(a.id)} className="text-red-600 text-sm hover:underline">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
