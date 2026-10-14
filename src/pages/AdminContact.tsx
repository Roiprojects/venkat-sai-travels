import { useState, useEffect } from 'react'
import { adminFetch } from '../api/client'

export default function AdminContact() {
  const [inquiries, setInquiries] = useState<any[]>([])
  const [msg, setMsg] = useState('')

  useEffect(() => { load() }, [])
  const load = async () => { try { const data = await adminFetch<any[]>('/contact'); setInquiries(data); setMsg('') } catch (e: any) { setMsg(e.message) } }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Contact Inquiries ({inquiries.length})</h1>
      {msg && <p className="mb-4 text-sm text-red-600">{msg}</p>}
      <div className="space-y-4">
        {inquiries.map(c => (
          <div key={c.id} className="bg-white p-5 rounded-xl shadow border border-gray-100">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-semibold text-gray-800">{c.name}</p>
                <p className="text-sm text-gray-500">{c.phone} {c.email && <span className="text-gray-400">• {c.email}</span>}</p>
              </div>
              <span className="text-xs text-gray-400">{new Date(c.created_at).toLocaleDateString()}</span>
            </div>
            <p className="text-sm font-medium text-brand-700 mb-1">{c.subject}</p>
            <p className="text-gray-600 text-sm">{c.message}</p>
          </div>
        ))}
        {inquiries.length === 0 && <p className="text-gray-400">No inquiries yet</p>}
      </div>
    </div>
  )
}
