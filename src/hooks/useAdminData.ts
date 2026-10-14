import { useState, useEffect, useCallback } from 'react'
import { api } from '../api/client'

const FALLBACK_STATS = [
  { value: 22, suffix: '+', label: 'Years of Experience' },
  { value: 10000, suffix: '+', label: 'Happy Customers' },
  { value: 50000, suffix: '+', label: 'Trips Completed' },
  { value: 200, suffix: '+', label: 'Corporate Clients' },
  { value: 50, suffix: '+', label: 'Luxury Fleet' },
]

const FALLBACK_NAV_LINKS = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Services', path: '/services' },
  { label: 'Fleet', path: '/fleet' },
  { label: 'Gallery', path: '/gallery' },
  { label: 'Contact', path: '/contact' },
]

function parseStats(settings: Record<string, string> | null | undefined) {
  if (!settings) return FALLBACK_STATS
  const stats: typeof FALLBACK_STATS = []
  for (let i = 1; i <= 5; i++) {
    const val = settings[`stat_${i}_value`]
    const suffix = settings[`stat_${i}_suffix`] || ''
    const label = settings[`stat_${i}_label`]
    if (val && label) stats.push({ value: parseInt(val) || 0, suffix, label })
  }
  return stats.length ? stats : FALLBACK_STATS
}

function parseNavLinks(settings: Record<string, string> | null | undefined) {
  if (!settings) return FALLBACK_NAV_LINKS
  const links: typeof FALLBACK_NAV_LINKS = []
  for (let i = 1; i <= 10; i++) {
    const label = settings[`nav_${i}_label`]
    const path = settings[`nav_${i}_path`]
    if (label && path) links.push({ label, path })
  }
  return links.length ? links : FALLBACK_NAV_LINKS
}

export function useAdminData() {
  const [settings, setSettings] = useState<Record<string, string> | null>(null)
  const [testimonials, setTestimonials] = useState<any[] | null>(null)
  const [awards, setAwards] = useState<any[] | null>(null)
  const [destinations, setDestinations] = useState<any[] | null>(null)
  const [faqs, setFaqs] = useState<any[] | null>(null)
  const [availability, setAvailability] = useState<any[] | null>(null)
  const [safety, setSafety] = useState<any[] | null>(null)
  const [services, setServices] = useState<any[] | null>(null)
  const [fleet, setFleet] = useState<any[] | null>(null)
  const [trustedBy, setTrustedBy] = useState<any[] | null>(null)
  const [blogs, setBlogs] = useState<any[] | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    const load = () => {
      Promise.allSettled([
        api.settings(),
        api.testimonials(),
        api.awards(),
        api.destinations(),
        api.faqs(),
        api.availability(),
        api.safety(),
        api.services(),
        api.fleet(),
        api.trustedBy(),
        api.blogs(),
      ]).then((results) => {
        if (cancelled) return
        const [s, t, a, d, f, av, sf, svc, fl, tb, bl] = results
        if (s.status === 'fulfilled' && s.value) setSettings(s.value as Record<string, string>)
        if (t.status === 'fulfilled' && Array.isArray(t.value)) setTestimonials(t.value)
        if (a.status === 'fulfilled' && Array.isArray(a.value)) setAwards(a.value)
        if (d.status === 'fulfilled' && Array.isArray(d.value)) setDestinations(d.value)
        if (f.status === 'fulfilled' && Array.isArray(f.value)) setFaqs(f.value)
        if (av.status === 'fulfilled' && Array.isArray(av.value)) setAvailability(av.value)
        if (sf.status === 'fulfilled' && Array.isArray(sf.value)) setSafety(sf.value)
        if (svc.status === 'fulfilled' && Array.isArray(svc.value)) setServices(svc.value)
        if (fl.status === 'fulfilled' && Array.isArray(fl.value)) setFleet(fl.value)
        if (tb.status === 'fulfilled' && Array.isArray(tb.value)) setTrustedBy(tb.value)
        if (bl.status === 'fulfilled' && Array.isArray(bl.value)) setBlogs(bl.value)
        setLoading(false)
      })
    }
    load()
    const interval = setInterval(load, 5000)
    return () => { cancelled = true; clearInterval(interval) }
  }, [])

  const stats = parseStats(settings)
  const navLinks = parseNavLinks(settings)

  const mappedTestimonials = testimonials
    ? testimonials.map((t: any) => ({
        name: t.name,
        initial: t.name?.charAt(0) || '?',
        text: t.text,
        location: t.location,
        date: t.date,
        rating: t.rating || 5,
      }))
    : null

  const mappedFaqs = faqs
    ? faqs.map((f: any) => ({
        q: f.question,
        a: f.answer,
        category: f.category || 'General',
      }))
    : null

  const mappedAvailability = availability
    ? availability.map((v: any) => ({
        name: v.vehicle_name,
        seats: v.seats || 0,
        status: v.status || 'Available Now',
        available: v.available ?? true,
      }))
    : null

  return {
    settings,
    stats,
    navLinks,
    testimonials: mappedTestimonials,
    awards: awards?.map((a: any) => ({ year: a.year, title: a.title })) || null,
    destinations: destinations?.map((d: any) => ({
      name: d.name,
      distance: d.distance,
      time: d.time,
      tag: d.tag,
      gradient: d.gradient,
      image: d.image || '',
    })) || null,
    faqs: mappedFaqs,
    availability: mappedAvailability,
    safety: safety?.map((s: any) => ({ icon: s.icon, title: s.title, description: s.description })) || null,
    services: services?.map((s: any) => ({
      id: s.id,
      icon: s.icon,
      title: s.title,
      desc: s.description,
      vehicles: Array.isArray(s.vehicles) ? s.vehicles : [],
    })) || null,
    fleet: fleet?.map((f: any) => ({
      id: f.id,
      name: f.name,
      category: f.category,
      seats: f.seats,
      fuel: f.fuel,
      ac: f.ac ?? true,
      features: Array.isArray(f.features) ? f.features : [],
      image: f.image || '',
      color: f.color,
    })) || null,
    trustedBy: trustedBy?.map((t: any) => ({ name: t.name, image: t.image || '' })) || null,
    blogs: blogs?.map((b: any) => ({
      tag: b.tag,
      title: b.title,
      excerpt: b.excerpt,
      read_time: b.read_time,
      date: b.date,
      image: b.image || '',
    })) || null,
    loading,
  }
}
