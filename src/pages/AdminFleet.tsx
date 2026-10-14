import { useState, useEffect } from 'react'
import { adminFetch } from '../api/client'

const CATEGORIES = ['SUV','Sedan','Van','Bus','Luxury']
const FORM = { name: '', category: 'SUV', seats: 4, fuel: 'Diesel', ac: true, features: '', image: '', color: '' }

export default function AdminFleet() {
  const [items, setItems] = useState<any[]>([])
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState(FORM)

  useEffect(() => { load() }, [])
  const load = async () => {
    try {
      const data = await adminFetch<any[]>('/fleet')
      setItems(data)
      setMsg('')
    } catch (e: any) { setMsg(e.message) }
  }

  const [msg, setMsg] = useState('')

  const reset = () => { setEditing(null); setForm(FORM); setMsg('') }
  const openEdit = (item: any) => { setEditing(item); setForm({ name: item.name, category: item.category, seats: item.seats, fuel: item.fuel, ac: item.ac, features: Array.isArray(item.features) ? item.features.join(', ') : item.features, image: item.image || '', color: item.color || '' }); setMsg('') }
  const save = async () => {
    try {
      setMsg('')
      const body = { ...form, features: form.features.split(',').map((f: string) => f.trim()).filter(Boolean) }
      if (editing) await adminFetch(`/fleet/${editing.id}`, { method: 'PUT', body: JSON.stringify(body) })
      else await adminFetch('/fleet', { method: 'POST', body: JSON.stringify(body) })
      setMsg('Saved successfully')
      reset(); load()
    } catch (e: any) { setMsg(e.message) }
  }
  const del = async (id: number) => { try { if (!confirm('Delete?')) return; await adminFetch(`/fleet/${id}`, { method: 'DELETE' }); setMsg('Deleted'); load() } catch (e: any) { setMsg(e.message) } }

  const set = (key: string, val: any) => setForm(f => ({ ...f, [key]: val }))

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Fleet ({items.length})</h1>
      {msg && <p className={`mb-4 text-sm ${msg.includes('Saved') || msg.includes('Deleted') ? 'text-green-600' : 'text-red-600'}`}>{msg}</p>}
      <div className="bg-white p-5 rounded-xl shadow mb-6">
        <h3 className="font-semibold text-gray-700 mb-3">{editing ? 'Edit Vehicle' : 'Add Vehicle'}</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <input placeholder="Name" value={form.name} onChange={e => set('name', e.target.value)} className="border rounded-lg px-3 py-2 text-sm" />
          <select value={form.category} onChange={e => set('category', e.target.value)} className="border rounded-lg px-3 py-2 text-sm">
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <input type="number" placeholder="Seats" value={form.seats} onChange={e => set('seats', +e.target.value)} className="border rounded-lg px-3 py-2 text-sm" />
          <input placeholder="Fuel" value={form.fuel} onChange={e => set('fuel', e.target.value)} className="border rounded-lg px-3 py-2 text-sm" />
          <input placeholder="Image path" value={form.image} onChange={e => set('image', e.target.value)} className="border rounded-lg px-3 py-2 text-sm" />
          <input placeholder="Color gradient" value={form.color} onChange={e => set('color', e.target.value)} className="border rounded-lg px-3 py-2 text-sm" />
          <input placeholder="Features (comma-separated)" value={form.features} onChange={e => set('features', e.target.value)} className="border rounded-lg px-3 py-2 text-sm col-span-2 md:col-span-4" />
          <label className="flex items-center gap-2 text-sm col-span-2 md:col-span-4">
            <input type="checkbox" checked={form.ac} onChange={e => set('ac', e.target.checked)} className="rounded" />
            Air Conditioning
          </label>
        </div>
        <div className="flex gap-2 mt-4">
          <button onClick={save} className="bg-brand-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-brand-800">{editing ? 'Update' : 'Add'}</button>
          {editing && <button onClick={reset} className="border border-gray-300 px-4 py-2 rounded-lg text-sm">Cancel</button>}
        </div>
      </div>
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-gray-600">Name</th>
              <th className="px-4 py-3 text-left text-gray-600">Category</th>
              <th className="px-4 py-3 text-left text-gray-600">Seats</th>
              <th className="px-4 py-3 text-left text-gray-600">Fuel</th>
              <th className="px-4 py-3 text-left text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items.map(item => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">{item.name}</td>
                <td className="px-4 py-3"><span className="bg-brand-50 text-brand-700 px-2 py-0.5 rounded text-xs">{item.category}</span></td>
                <td className="px-4 py-3">{item.seats}</td>
                <td className="px-4 py-3">{item.fuel}</td>
                <td className="px-4 py-3 flex gap-2">
                  <button onClick={() => openEdit(item)} className="text-blue-600 hover:underline text-xs">Edit</button>
                  <button onClick={() => del(item.id)} className="text-red-600 hover:underline text-xs">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
