import { useState, useEffect } from 'react'
import { adminFetch } from '../api/client'

export default function AdminBlogs() {
  const [items, setItems] = useState<any[]>([])
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState({ tag: '', title: '', excerpt: '', read_time: '', date: '', image: '' })
  const [msg, setMsg] = useState('')

  useEffect(() => { load() }, [])
  const load = async () => { try { const data = await adminFetch<any[]>('/blogs'); setItems(data); setMsg('') } catch (e: any) { setMsg(e.message) } }
  const reset = () => { setEditing(null); setForm({ tag: '', title: '', excerpt: '', read_time: '', date: '', image: '' }); setMsg('') }
  const openEdit = (b: any) => { setEditing(b); setForm({ tag: b.tag, title: b.title, excerpt: b.excerpt, read_time: b.read_time, date: b.date, image: b.image || '' }); setMsg('') }
  const save = async () => {
    try {
      if (editing) await adminFetch(`/blogs/${editing.id}`, { method: 'PUT', body: JSON.stringify(form) })
      else await adminFetch('/blogs', { method: 'POST', body: JSON.stringify(form) })
      setMsg('Saved successfully'); reset(); load()
    } catch (e: any) { setMsg(e.message) }
  }
  const del = async (id: number) => { try { if (!confirm('Delete?')) return; await adminFetch(`/blogs/${id}`, { method: 'DELETE' }); setMsg('Deleted'); load() } catch (e: any) { setMsg(e.message) } }
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Blogs ({items.length})</h1>
      {msg && <p className={`mb-4 text-sm ${msg.includes('Saved') || msg.includes('Deleted') ? 'text-green-600' : 'text-red-600'}`}>{msg}</p>}
      <div className="bg-white p-5 rounded-xl shadow mb-6 space-y-3">
        <h3 className="font-semibold text-gray-700">{editing ? 'Edit' : 'Add'} Blog Post</h3>
        <div className="grid grid-cols-2 gap-3">
          <input placeholder="Tag" value={form.tag} onChange={e => set('tag', e.target.value)} className="border rounded-lg px-3 py-2 text-sm" />
          <input placeholder="Title" value={form.title} onChange={e => set('title', e.target.value)} className="border rounded-lg px-3 py-2 text-sm" />
          <input placeholder="Read time (e.g. 5 min read)" value={form.read_time} onChange={e => set('read_time', e.target.value)} className="border rounded-lg px-3 py-2 text-sm" />
          <input placeholder="Date (YYYY-MM-DD)" value={form.date} onChange={e => set('date', e.target.value)} className="border rounded-lg px-3 py-2 text-sm" />
          <textarea placeholder="Excerpt" value={form.excerpt} onChange={e => set('excerpt', e.target.value)} className="border rounded-lg px-3 py-2 text-sm col-span-2" rows={2} />
          <input placeholder="Image path" value={form.image} onChange={e => set('image', e.target.value)} className="border rounded-lg px-3 py-2 text-sm col-span-2" />
        </div>
        <div className="flex gap-2">
          <button onClick={save} className="bg-brand-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-brand-800">{editing ? 'Update' : 'Add'}</button>
          {editing && <button onClick={reset} className="border border-gray-300 px-4 py-2 rounded-lg text-sm">Cancel</button>}
        </div>
      </div>
      <div className="bg-white rounded-xl shadow divide-y divide-gray-100">
        {items.map(b => (
          <div key={b.id} className="p-4 flex justify-between">
            <div>
              <p className="font-medium text-gray-800">{b.title}</p>
              <p className="text-xs text-gray-500">{b.tag} • {b.date} • {b.read_time}</p>
              <p className="text-sm text-gray-600 mt-1">{b.excerpt?.slice(0, 100)}...</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => openEdit(b)} className="text-blue-600 text-sm hover:underline">Edit</button>
              <button onClick={() => del(b.id)} className="text-red-600 text-sm hover:underline">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
