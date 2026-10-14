import { useState, useEffect, useCallback, lazy, Suspense } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { adminFetch } from '../api/client'
import { ChevronDown } from 'lucide-react'

type AdminSection = 'dashboard' | 'bookings' | 'services' | 'fleet' | 'faqs' | 'gallery' | 'testimonials' | 'destinations' | 'blogs' | 'about' | 'awards' | 'safety' | 'availability' | 'contact' | 'trusted-by'

const components: Record<AdminSection, React.LazyExoticComponent<React.ComponentType<any>>> = {
  dashboard: lazy(() => import('./AdminDashboard')),
  bookings: lazy(() => import('./AdminBookings')),
  services: lazy(() => import('./AdminServices')),
  fleet: lazy(() => import('./AdminFleet')),
  faqs: lazy(() => import('./AdminFaqs')),
  gallery: lazy(() => import('./AdminGallery')),
  testimonials: lazy(() => import('./AdminTestimonials')),
  destinations: lazy(() => import('./AdminDestinations')),
  blogs: lazy(() => import('./AdminBlogs')),
  about: lazy(() => import('./AdminAbout')),
  awards: lazy(() => import('./AdminAwards')),
  safety: lazy(() => import('./AdminSafety')),
  availability: lazy(() => import('./AdminAvailability')),
  contact: lazy(() => import('./AdminContact')),
  'trusted-by': lazy(() => import('./AdminTrustedBy')),
}

const topSections: { key: AdminSection; label: string }[] = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'bookings', label: 'Bookings' },
  { key: 'services', label: 'Services' },
  { key: 'fleet', label: 'Fleet' },
  { key: 'gallery', label: 'Gallery' },
  { key: 'testimonials', label: 'Testimonials' },
  { key: 'availability', label: 'Availability' },
]

const settingsSections: { key: AdminSection; label: string }[] = [
  { key: 'about', label: 'About' },
  { key: 'awards', label: 'Awards' },
  { key: 'blogs', label: 'Blogs' },
  { key: 'contact', label: 'Contact' },
  { key: 'destinations', label: 'Destinations' },
  { key: 'faqs', label: 'FAQs' },
  { key: 'safety', label: 'Safety' },
  { key: 'trusted-by', label: 'Trusted By' },
]

export default function Admin() {
  const [section, setSection] = useState<AdminSection>('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [newCount, setNewCount] = useState(0)
  const [settingsOpen, setSettingsOpen] = useState(true)
  const navigate = useNavigate()

  if (!localStorage.getItem('admin_token')) return <Navigate to="/admin/login" replace />

  const fetchNewCount = useCallback(async () => {
    try {
      const rows = await adminFetch<any[]>('/bookings?status=eq.new&order=created_at.desc')
      setNewCount(rows.length)
    } catch {
      setNewCount(0)
    }
  }, [])

  useEffect(() => {
    fetchNewCount()
    const interval = setInterval(fetchNewCount, 30000)
    return () => clearInterval(interval)
  }, [fetchNewCount])

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-gray-900 text-white transform transition-transform duration-200 lg:translate-x-0 lg:static lg:block ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-5 border-b border-gray-700">
          <h2 className="text-lg font-bold">VST Admin</h2>
          <p className="text-xs text-gray-400">{localStorage.getItem('admin_user')}</p>
        </div>
        <nav className="p-3 space-y-0.5 overflow-y-auto h-[calc(100%-4rem)]">
          {topSections.map(s => (
            <button key={s.key} onClick={() => { setSection(s.key); setSidebarOpen(false); navigate('/admin') }}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between ${section === s.key ? 'bg-brand-700 text-white' : 'text-gray-300 hover:bg-gray-800'}`}>
              <span>{s.label}</span>
              {s.key === 'bookings' && newCount > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5">
                  {newCount > 99 ? '99+' : newCount}
                </span>
              )}
            </button>
          ))}

          {/* Settings dropdown */}
          <button onClick={() => setSettingsOpen(o => !o)}
            className="w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between text-gray-300 hover:bg-gray-800 mt-2">
            <span className="font-semibold">Settings</span>
            <ChevronDown size={14} className={`transition-transform duration-200 ${settingsOpen ? 'rotate-180' : ''}`} />
          </button>
          {settingsOpen && settingsSections.map(s => (
            <button key={s.key} onClick={() => { setSection(s.key); setSidebarOpen(false); navigate('/admin') }}
              className={`w-full text-left px-3 py-2 pl-8 rounded-lg text-sm transition-colors ${section === s.key ? 'bg-brand-700 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'}`}>
              {s.label}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-gray-700">
          <button onClick={() => { localStorage.clear(); navigate('/') }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-gray-800">
            Logout
          </button>
        </div>
      </aside>
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />}
      <main className="flex-1 p-6 lg:p-8 overflow-auto">
        <button className="lg:hidden mb-4 text-gray-600 text-sm" onClick={() => setSidebarOpen(true)}>☰ Menu</button>
        <SectionRouter section={section} onSectionChange={() => fetchNewCount()} />
      </main>
    </div>
  )
}

function SectionRouter({ section, onSectionChange }: { section: AdminSection; onSectionChange: () => void }) {
  const Comp = components[section]

  useEffect(() => {
    onSectionChange()
  }, [section, onSectionChange])

  return (
    <Suspense fallback={<div className="animate-pulse bg-gray-200 h-96 rounded-lg" />}>
      <Comp />
    </Suspense>
  )
}
