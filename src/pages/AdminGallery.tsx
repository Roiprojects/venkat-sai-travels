import { useState, useEffect, useRef } from 'react'
import { adminFetch } from '../api/client'

const CATEGORIES = ['Fleet','Services','Events','Corporate','Destinations']

export default function AdminGallery() {
  const [items, setItems] = useState<any[]>([])
  const [filter, setFilter] = useState('')
  const [form, setForm] = useState({ src: '', title: '', category: 'Fleet', description: '' })
  const [editingId, setEditingId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState('')
  const loadFn = useRef<((resetForm?: boolean) => Promise<void>) | null>(null)

  useEffect(() => {
    let cancelled = false

    const run = async (resetForm = false) => {
      try {
        const data = await adminFetch<any[]>('/gallery')
        if (cancelled) return
        setItems(data)
        setMsg('')
        if (resetForm) {
          setEditingId(null)
          setForm({ src: '', title: '', category: 'Fleet', description: '' })
        }
      } catch (e: any) {
        if (cancelled) return
        setMsg(e.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadFn.current = run
    run()
    const interval = setInterval(() => run(false), 5000)
    return () => { cancelled = true; clearInterval(interval) }
  }, [])

  const reload = () => { setLoading(true); loadFn.current?.(true) }

  const add = async () => {
    try {
      if (!form.src) return
      await adminFetch('/gallery', { method: 'POST', body: JSON.stringify(form) })
      setForm({ src: '', title: '', category: 'Fleet', description: '' })
      setMsg('Added')
      reload()
    } catch (e: any) { setMsg(e.message) }
  }
  const startEdit = (item: any) => {
    setEditingId(item.id)
    setForm({ src: item.src || '', title: item.title || '', category: item.category || 'Fleet', description: item.description || '' })
    setMsg('')
  }
  const saveEdit = async () => {
    try {
      if (!editingId) return
      await adminFetch(`/gallery/${editingId}`, { method: 'PUT', body: JSON.stringify(form) })
      setEditingId(null)
      setForm({ src: '', title: '', category: 'Fleet', description: '' })
      setMsg('Updated')
      reload()
    } catch (e: any) { setMsg(e.message) }
  }
  const cancelEdit = () => {
    setEditingId(null)
    setForm({ src: '', title: '', category: 'Fleet', description: '' })
  }
  const del = async (id: number) => {
    try { if (!confirm('Delete?')) return; await adminFetch(`/gallery/${id}`, { method: 'DELETE' }); setMsg('Deleted'); reload() } catch (e: any) { setMsg(e.message) }
  }

  const filtered = filter ? items.filter(i => i.category === filter) : items

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Gallery ({items.length})</h1>
      {msg && <p className={`mb-4 text-sm ${msg.includes('Saved') || msg.includes('Added') || msg.includes('Deleted') || msg.includes('Updated') ? 'text-green-600' : 'text-red-600'}`}>{msg}</p>}
      {loading && <p className="text-sm text-gray-400 mb-4">Loading gallery...</p>}
      <div className="bg-white p-5 rounded-xl shadow mb-6 flex gap-3 items-end">
        <div className="flex-1">
          <label className="text-xs text-gray-500">Image URL / Path</label>
          <input value={form.src} onChange={e => setForm(f => ({ ...f, src: e.target.value }))} className="border rounded-lg px-3 py-2 text-sm w-full" placeholder="/images/photo.jpg" />
        </div>
        <div className="flex-1">
          <label className="text-xs text-gray-500">Title</label>
          <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="border rounded-lg px-3 py-2 text-sm w-full" />
        </div>
        <div>
          <label className="text-xs text-gray-500">Category</label>
          <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="border rounded-lg px-3 py-2 text-sm">
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <button onClick={editingId ? saveEdit : add} className="bg-brand-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-brand-800">{editingId ? 'Update' : 'Add'}</button>
        {editingId && <button onClick={cancelEdit} className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-400">Cancel</button>}
      </div>
      <div className="flex gap-2 mb-4">
        <button onClick={() => setFilter('')} className={`px-3 py-1 rounded-full text-sm ${!filter ? 'bg-brand-700 text-white' : 'bg-gray-100 text-gray-600'}`}>All</button>
        {CATEGORIES.map(c => (
          <button key={c} onClick={() => setFilter(c)} className={`px-3 py-1 rounded-full text-sm ${filter === c ? 'bg-brand-700 text-white' : 'bg-gray-100 text-gray-600'}`}>{c}</button>
        ))}
      </div>
      <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
        {filtered.map(item => (
          <div key={item.id} className="relative group">
            <img src={item.src} alt={item.title} className="w-full h-32 object-cover rounded-lg bg-gray-100" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
              <button onClick={() => startEdit(item)} className="bg-brand-600 text-white px-3 py-1 rounded text-xs">Edit</button>
              <button onClick={() => del(item.id)} className="bg-red-600 text-white px-3 py-1 rounded text-xs">Delete</button>
            </div>
            <p className="text-xs text-gray-600 mt-1 truncate">{item.title || item.category}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
