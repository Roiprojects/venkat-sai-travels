import { useState, useEffect } from 'react'
import { adminFetch, adminApi } from '../api/client'

export default function AdminSettings() {
  const [settings, setSettings] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => { load() }, [])
  const load = async () => { const data = await adminFetch<any[]>('/settings'); setSettings(Object.fromEntries(data.map((r: any) => [r.key, r.value]))) }

  const save = async () => {
    setSaving(true)
    try {
      const body = Object.entries(settings).map(([key, value]) => ({ key, value }))
      await adminApi.updateSettings(body)
      setMsg('Saved!'); setTimeout(() => setMsg(''), 2000)
    } catch { setMsg('Error saving') }
    finally { setSaving(false) }
  }

  const update = (key: string, value: string) => setSettings(s => ({ ...s, [key]: value }))

  const companyFields = [
    ['company_name','Company Name'], ['company_tagline','Tagline'], ['company_founder','Founder'],
    ['company_email','Email'], ['company_phone_1','Phone 1'], ['company_phone_2','Phone 2'],
    ['company_phone_3','Phone 3'], ['company_whatsapp','WhatsApp'],
    ['company_address_line1','Address Line 1'], ['company_address_line2','Address Line 2'],
    ['company_city','City'], ['company_hours','Hours'],
  ]

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
        <button onClick={save} disabled={saving} className="bg-brand-700 text-white px-4 py-2 rounded-lg hover:bg-brand-800 disabled:opacity-50">
          {saving ? 'Saving...' : 'Save All'}
        </button>
      </div>
      {msg && <p className="text-green-600 text-sm mb-4">{msg}</p>}
      <div className="bg-white rounded-xl shadow p-6 space-y-4">
        <h3 className="font-semibold text-gray-700 border-b pb-2">Company Info</h3>
        {companyFields.map(([key, label]) => (
          <div key={key} className="flex items-center gap-4">
            <label className="text-sm text-gray-600 w-40 shrink-0">{label}</label>
            <input type="text" value={settings[key] || ''} onChange={e => update(key, e.target.value)}
              className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
          </div>
        ))}
        <h3 className="font-semibold text-gray-700 border-b pb-2 pt-4">Stats</h3>
        {[1,2,3,4,5].map(i => (
          <div key={i} className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-gray-500">Stat {i} Value</label>
              <input type="text" value={settings[`stat_${i}_value`] || ''} onChange={e => update(`stat_${i}_value`, e.target.value)}
                className="w-full border border-gray-300 rounded px-2 py-1 text-sm" />
            </div>
            <div>
              <label className="text-xs text-gray-500">Suffix</label>
              <input type="text" value={settings[`stat_${i}_suffix`] || ''} onChange={e => update(`stat_${i}_suffix`, e.target.value)}
                className="w-full border border-gray-300 rounded px-2 py-1 text-sm" />
            </div>
            <div>
              <label className="text-xs text-gray-500">Label</label>
              <input type="text" value={settings[`stat_${i}_label`] || ''} onChange={e => update(`stat_${i}_label`, e.target.value)}
                className="w-full border border-gray-300 rounded px-2 py-1 text-sm" />
            </div>
          </div>
        ))}
        <h3 className="font-semibold text-gray-700 border-b pb-2 pt-4">Navigation Links</h3>
        {[1,2,3,4,5,6].map(i => (
          <div key={i} className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500">Nav {i} Label</label>
              <input type="text" value={settings[`nav_${i}_label`] || ''} onChange={e => update(`nav_${i}_label`, e.target.value)}
                className="w-full border border-gray-300 rounded px-2 py-1 text-sm" />
            </div>
            <div>
              <label className="text-xs text-gray-500">Path</label>
              <input type="text" value={settings[`nav_${i}_path`] || ''} onChange={e => update(`nav_${i}_path`, e.target.value)}
                className="w-full border border-gray-300 rounded px-2 py-1 text-sm" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
