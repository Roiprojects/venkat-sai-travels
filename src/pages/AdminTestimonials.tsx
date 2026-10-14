import { useState, useEffect } from 'react'
import { adminFetch } from '../api/client'

export default function AdminTestimonials() {
  const [items, setItems] = useState<any[]>([])
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState({ name: '', location: '', rating: 5, text: '', date: '' })
  const [msg, setMsg] = useState('')

  useEffect(() => { load() }, [])
  const load = async () => { try { const data = await adminFetch<any[]>('/testimonials'); setItems(data); setMsg('') } catch (e: any) { setMsg(e.message) } }
  const reset = () => { setEditing(null); setForm({ name: '', location: '', rating: 5, text: '', date: '' }); setMsg('') }
  const openEdit = (t: any) => { setEditing(t); setForm({ name: t.name, location: t.location, rating: t.rating, text: t.text, date: t.date || '' }); setMsg('') }
  const save = async () => {
    try {
      if (editing) await adminFetch(`/testimonials/${editing.id}`, { method: 'PUT', body: JSON.stringify(form) })
      else await adminFetch('/testimonials', { method: 'POST', body: JSON.stringify(form) })
      setMsg('Saved successfully'); reset(); load()
    } catch (e: any) { setMsg(e.message) }
  }
  const del = async (id: number) => { try { if (!confirm('Delete?')) return; await adminFetch(`/testimonials/${id}`, { method: 'DELETE' }); setMsg('Deleted'); load() } catch (e: any) { setMsg(e.message) } }
  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }))

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Testimonials ({items.length})</h1>
      {msg && <p className={`mb-4 text-sm ${msg.includes('Saved') || msg.includes('Deleted') ? 'text-green-600' : 'text-red-600'}`}>{msg}</p>}
      <div className="bg-white p-5 rounded-xl shadow mb-6 space-y-3">
        <h3 className="font-semibold text-gray-700">{editing ? 'Edit' : 'Add'} Testimonial</h3>
        <div className="grid grid-cols-2 gap-3">
          <input placeholder="Name" value={form.name} onChange={e => set('name', e.target.value)} className="border rounded-lg px-3 py-2 text-sm" />
          <input placeholder="Location" value={form.location} onChange={e => set('location', e.target.value)} className="border rounded-lg px-3 py-2 text-sm" />
          <input type="number" placeholder="Rating (1-5)" value={form.rating} onChange={e => set('rating', +e.target.value)} className="border rounded-lg px-3 py-2 text-sm" min={1} max={5} />
          <input placeholder="Date (e.g. 2 weeks ago)" value={form.date} onChange={e => set('date', e.target.value)} className="border rounded-lg px-3 py-2 text-sm" />
          <textarea placeholder="Review text" value={form.text} onChange={e => set('text', e.target.value)} className="border rounded-lg px-3 py-2 text-sm col-span-2" rows={3} />
        </div>
        <div className="flex gap-2">
          <button onClick={save} className="bg-brand-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-brand-800">{editing ? 'Update' : 'Add'}</button>
          {editing && <button onClick={reset} className="border border-gray-300 px-4 py-2 rounded-lg text-sm">Cancel</button>}
        </div>
      </div>
      <div className="bg-white rounded-xl shadow divide-y divide-gray-100">
        {items.map(t => (
          <div key={t.id} className="p-4 flex justify-between">
            <div>
              <p className="font-medium text-gray-800">{t.name} <span className="text-yellow-500">{'★'.repeat(t.rating)}</span></p>
              <p className="text-xs text-gray-500">{t.location} • {t.date}</p>
              <p className="text-sm text-gray-600 mt-1">{t.text?.slice(0, 120)}...</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => openEdit(t)} className="text-blue-600 text-sm hover:underline">Edit</button>
              <button onClick={() => del(t.id)} className="text-red-600 text-sm hover:underline">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
