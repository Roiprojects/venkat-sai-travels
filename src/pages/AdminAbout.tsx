import { useState, useEffect } from 'react'
import { pr, prAuth } from '../api/client'

export default function AdminAbout() {
  const [about, setAbout] = useState<any>({ founder: {}, timeline: [], values: [] })
  const [founder, setFounder] = useState({ quote: '', title: '', image: '' })
  const [timelineForm, setTimelineForm] = useState({ year: new Date().getFullYear(), title: '', description: '' })
  const [valueForm, setValueForm] = useState({ icon: '', title: '', description: '' })
  const [editingTimeline, setEditingTimeline] = useState<any>(null)
  const [editingValue, setEditingValue] = useState<any>(null)

  const [msg, setMsg] = useState('')

  useEffect(() => { load() }, [])
  const load = async () => {
    try {
      const [founderData, timelineData, valuesData] = await Promise.all([
        pr<any>('/about_founder?limit=1'),
        pr<any[]>('/about_timeline?order=year'),
        pr<any[]>('/about_values?order=id'),
      ])
      setAbout({ founder: founderData || {}, timeline: timelineData || [], values: valuesData || [] })
      setMsg('')
      if (founderData) setFounder({ quote: founderData.quote || '', title: founderData.title || '', image: founderData.image || '' })
    } catch (e: any) { setMsg(e.message) }
  }

  const saveFounder = async () => { try { await adminFetch('/about/founder', { method: 'PUT', body: JSON.stringify(founder) }); setMsg('Saved successfully'); load() } catch (e: any) { setMsg(e.message) } }
  const addTimeline = async () => { try { if (editingTimeline) await adminFetch(`/about/timeline/${editingTimeline.id}`, { method: 'PUT', body: JSON.stringify(timelineForm) }); else await adminFetch('/about/timeline', { method: 'POST', body: JSON.stringify(timelineForm) }); setEditingTimeline(null); setTimelineForm({ year: new Date().getFullYear(), title: '', description: '' }); setMsg('Saved'); load() } catch (e: any) { setMsg(e.message) } }
  const delTimeline = async (id: number) => { try { if (!confirm('Delete?')) return; await adminFetch(`/about/timeline/${id}`, { method: 'DELETE' }); setMsg('Deleted'); load() } catch (e: any) { setMsg(e.message) } }
  const addValue = async () => { try { if (editingValue) await adminFetch(`/about/values/${editingValue.id}`, { method: 'PUT', body: JSON.stringify(valueForm) }); else await adminFetch('/about/values', { method: 'POST', body: JSON.stringify(valueForm) }); setEditingValue(null); setValueForm({ icon: '', title: '', description: '' }); setMsg('Saved'); load() } catch (e: any) { setMsg(e.message) } }
  const delValue = async (id: number) => { try { if (!confirm('Delete?')) return; await adminFetch(`/about/values/${id}`, { method: 'DELETE' }); setMsg('Deleted'); load() } catch (e: any) { setMsg(e.message) } }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">About</h1>
      {msg && <p className={`mb-4 text-sm ${msg.includes('Saved') || msg.includes('Deleted') ? 'text-green-600' : 'text-red-600'}`}>{msg}</p>}

      <div className="bg-white p-5 rounded-xl shadow mb-6 space-y-3">
        <h3 className="font-semibold text-gray-700">Founder</h3>
        <textarea value={founder.quote} onChange={e => setFounder(f => ({ ...f, quote: e.target.value }))} className="border rounded-lg px-3 py-2 text-sm w-full" rows={3} />
        <input value={founder.title} onChange={e => setFounder(f => ({ ...f, title: e.target.value }))} className="border rounded-lg px-3 py-2 text-sm w-full" placeholder="Title" />
        <input value={founder.image} onChange={e => setFounder(f => ({ ...f, image: e.target.value }))} className="border rounded-lg px-3 py-2 text-sm w-full" placeholder="Image path" />
        <button onClick={saveFounder} className="bg-brand-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-brand-800">Save Founder</button>
      </div>

      <div className="bg-white p-5 rounded-xl shadow mb-6 space-y-3">
        <h3 className="font-semibold text-gray-700">Timeline {editingTimeline ? '(Editing)' : ''}</h3>
        <div className="grid grid-cols-3 gap-3">
          <input type="number" placeholder="Year" value={timelineForm.year} onChange={e => setTimelineForm(f => ({ ...f, year: +e.target.value }))} className="border rounded-lg px-3 py-2 text-sm" />
          <input placeholder="Title" value={timelineForm.title} onChange={e => setTimelineForm(f => ({ ...f, title: e.target.value }))} className="border rounded-lg px-3 py-2 text-sm" />
          <input placeholder="Description" value={timelineForm.description} onChange={e => setTimelineForm(f => ({ ...f, description: e.target.value }))} className="border rounded-lg px-3 py-2 text-sm" />
        </div>
        <div className="flex gap-2">
          <button onClick={addTimeline} className="bg-brand-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-brand-800">{editingTimeline ? 'Update' : 'Add'}</button>
          {editingTimeline && <button onClick={() => setEditingTimeline(null)} className="border border-gray-300 px-4 py-2 rounded-lg text-sm">Cancel</button>}
        </div>
        <div className="space-y-2 mt-3">
          {about.timeline.map((t: any) => (
            <div key={t.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <div><span className="font-medium">{t.year}</span> — {t.title}</div>
              <div className="flex gap-2">
                <button onClick={() => { setEditingTimeline(t); setTimelineForm({ year: t.year, title: t.title, description: t.description }) }} className="text-blue-600 text-xs hover:underline">Edit</button>
                <button onClick={() => delTimeline(t.id)} className="text-red-600 text-xs hover:underline">Del</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl shadow mb-6 space-y-3">
        <h3 className="font-semibold text-gray-700">Values {editingValue ? '(Editing)' : ''}</h3>
        <div className="grid grid-cols-3 gap-3">
          <input placeholder="Icon name" value={valueForm.icon} onChange={e => setValueForm(f => ({ ...f, icon: e.target.value }))} className="border rounded-lg px-3 py-2 text-sm" />
          <input placeholder="Title" value={valueForm.title} onChange={e => setValueForm(f => ({ ...f, title: e.target.value }))} className="border rounded-lg px-3 py-2 text-sm" />
          <input placeholder="Description" value={valueForm.description} onChange={e => setValueForm(f => ({ ...f, description: e.target.value }))} className="border rounded-lg px-3 py-2 text-sm" />
        </div>
        <div className="flex gap-2">
          <button onClick={addValue} className="bg-brand-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-brand-800">{editingValue ? 'Update' : 'Add'}</button>
          {editingValue && <button onClick={() => setEditingValue(null)} className="border border-gray-300 px-4 py-2 rounded-lg text-sm">Cancel</button>}
        </div>
        <div className="space-y-2 mt-3">
          {about.values.map((v: any) => (
            <div key={v.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <div><span className="font-medium">{v.icon}</span> {v.title}</div>
              <div className="flex gap-2">
                <button onClick={() => { setEditingValue(v); setValueForm({ icon: v.icon, title: v.title, description: v.description }) }} className="text-blue-600 text-xs hover:underline">Edit</button>
                <button onClick={() => delValue(v.id)} className="text-red-600 text-xs hover:underline">Del</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
