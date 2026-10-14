import { useState, useEffect } from 'react'
import { adminFetch } from '../api/client'

const CATEGORIES = ['General','Pricing','Booking','Services','Safety']

export default function AdminFaqs() {
  const [items, setItems] = useState<any[]>([])
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState({ question: '', answer: '', category: 'General' })
  const [msg, setMsg] = useState('')

  useEffect(() => { load() }, [])
  const load = async () => { try { const data = await adminFetch<any[]>('/faqs'); setItems(data); setMsg('') } catch (e: any) { setMsg(e.message) } }
  const reset = () => { setEditing(null); setForm({ question: '', answer: '', category: 'General' }); setMsg('') }
  const openEdit = (f: any) => { setEditing(f); setForm({ question: f.question, answer: f.answer, category: f.category || 'General' }); setMsg('') }
  const save = async () => {
    try {
      if (editing) await adminFetch(`/faqs/${editing.id}`, { method: 'PUT', body: JSON.stringify(form) })
      else await adminFetch('/faqs', { method: 'POST', body: JSON.stringify(form) })
      setMsg('Saved successfully'); reset(); load()
    } catch (e: any) { setMsg(e.message) }
  }
  const del = async (id: number) => { try { if (!confirm('Delete?')) return; await adminFetch(`/faqs/${id}`, { method: 'DELETE' }); setMsg('Deleted'); load() } catch (e: any) { setMsg(e.message) } }
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">FAQs ({items.length})</h1>
      {msg && <p className={`mb-4 text-sm ${msg.includes('Saved') || msg.includes('Deleted') ? 'text-green-600' : 'text-red-600'}`}>{msg}</p>}
      <div className="bg-white p-5 rounded-xl shadow mb-6 space-y-3">
        <h3 className="font-semibold text-gray-700">{editing ? 'Edit' : 'Add'} FAQ</h3>
        <div className="grid gap-3">
          <input placeholder="Question" value={form.question} onChange={e => set('question', e.target.value)} className="border rounded-lg px-3 py-2 text-sm w-full" />
          <textarea placeholder="Answer" value={form.answer} onChange={e => set('answer', e.target.value)} className="border rounded-lg px-3 py-2 text-sm w-full" rows={3} />
          <select value={form.category} onChange={e => set('category', e.target.value)} className="border rounded-lg px-3 py-2 text-sm w-40">
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="flex gap-2">
          <button onClick={save} className="bg-brand-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-brand-800">{editing ? 'Update' : 'Add'}</button>
          {editing && <button onClick={reset} className="border border-gray-300 px-4 py-2 rounded-lg text-sm">Cancel</button>}
        </div>
      </div>
      <div className="bg-white rounded-xl shadow divide-y divide-gray-100">
        {items.map(f => (
          <div key={f.id} className="p-4">
            <div className="flex justify-between items-start gap-3">
              <div className="flex-1">
                <p className="font-medium text-gray-800 text-sm">Q: {f.question}</p>
                <p className="text-xs text-gray-500 mt-1">A: {f.answer?.slice(0, 100)}...</p>
                <span className="inline-block mt-1 bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs">{f.category}</span>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => openEdit(f)} className="text-blue-600 text-sm hover:underline">Edit</button>
                <button onClick={() => del(f.id)} className="text-red-600 text-sm hover:underline">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
