import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Linkedin, Youtube, Twitter } from 'lucide-react'
import { WHATSAPP_URL } from '../../data/constants'
import Logo from '../common/Logo'
import { api } from '../../api'

const FALLBACK_NAV_LINKS = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Services', path: '/services' },
  { label: 'Fleet', path: '/fleet' },
  { label: 'Gallery', path: '/gallery' },
  { label: 'Contact', path: '/contact' },
]

const FALLBACK_SERVICES = ['Airport Transfers', 'Outstation Trips', 'Corporate Travel', 'Wedding Transport', 'Employee Transport', 'Pilgrimage Tours', 'Luxury Chauffeur', 'Hourly Rental']

const SocialIcon = ({ href, icon: Icon, color }: { href: string; icon: React.ElementType; color: string }) => (
  <a
    href={href}
    target="_blank"
    rel="noreferrer"
    className={`w-9 h-9 rounded-full flex items-center justify-center bg-white border border-[#E5E5E5] text-[#555555] hover:scale-110 shadow-sm transition-all duration-300 ${color}`}
  >
    <Icon size={15} />
  </a>
)

export default function Footer() {
  const [settings, setSettings] = useState<Record<string, string> | null>(null)
  const [footerServices, setFooterServices] = useState<string[]>([])

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const [s, svc] = await Promise.all([
          api.settings(),
          api.services(),
        ])
        if (!cancelled) {
          if (s) setSettings(s)
          if (Array.isArray(svc) && svc.length) {
            setFooterServices(svc.slice(0, 8).map((s: any) => s.title).filter(Boolean))
          }
        }
      } catch (e) { console.error('Footer fetch error:', e) }
    }
    load()
    const interval = setInterval(load, 5000)
    return () => { cancelled = true; clearInterval(interval) }
  }, [])

  const navLinks = (() => {
    const links: typeof FALLBACK_NAV_LINKS = []
    for (let i = 1; i <= 10; i++) {
      const label = settings?.[`nav_${i}_label`]
      const path = settings?.[`nav_${i}_path`]
      if (label && path) links.push({ label, path })
    }
    return links.length ? links : FALLBACK_NAV_LINKS
  })()

  const displayServices = footerServices.length ? footerServices : FALLBACK_SERVICES

  const companyName = settings?.company_name || 'Venkat Sai Travels'
  const tagline = settings?.company_tagline || "Bangalore's premium luxury travel partner since 2009. First-class travel with professional chauffeurs."
  const email = settings?.company_email || ''
  const line1 = settings?.company_address_line1 || ''
  const line2 = settings?.company_address_line2 || ''
  const city = settings?.company_city || ''
  const hours = settings?.company_hours || ''
  const phones = [settings?.company_phone_1, settings?.company_phone_2, settings?.company_phone_3].filter(Boolean) as string[]

  return (
    <footer className="bg-[#F7F7F5] text-[#555555] border-t border-[#E5E5E5] relative overflow-hidden">
      <div className="h-1 bg-gradient-to-r from-brand-500 via-brand-600 to-brand-700" />

      <div className="px-4 sm:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

            {/* Column 1: Brand */}
            <div>
              <div className="mb-5 inline-block transition-transform duration-300 hover:scale-105">
                <Logo height={90} showTagline={true} />
              </div>
              <p className="text-[#555555] text-xs sm:text-sm leading-relaxed mb-6 font-light">
                {tagline}
              </p>
              <div className="flex flex-wrap gap-2">
                <SocialIcon href="https://facebook.com" icon={Facebook} color="hover:text-brand-600 hover:border-brand-300" />
                <SocialIcon href="https://instagram.com" icon={Instagram} color="hover:text-brand-600 hover:border-brand-300" />
                <SocialIcon href="https://linkedin.com" icon={Linkedin} color="hover:text-brand-600 hover:border-brand-300" />
                <SocialIcon href="https://youtube.com" icon={Youtube} color="hover:text-brand-600 hover:border-brand-300" />
                <SocialIcon href="https://twitter.com" icon={Twitter} color="hover:text-brand-600 hover:border-brand-300" />
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-full flex items-center justify-center bg-emerald-50 border border-emerald-200 text-emerald-600 hover:scale-110 hover:bg-emerald-600 hover:text-white transition-all duration-300 shadow-sm"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div>
              <h4 className="font-heading text-base font-bold text-[#B5121B] mb-5 flex items-center gap-2">
                <span className="w-4 h-0.5 bg-[#B5121B] inline-block rounded-full" />Quick Links
              </h4>
              <ul className="space-y-3">
                {[...navLinks, { label: 'Booking', path: '/booking' }, { label: 'FAQ', path: '/faq' }].map(link => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="text-[#555555] hover:text-[#B5121B] text-xs sm:text-sm transition-colors flex items-center gap-2 group font-medium"
                    >
                      <span className="w-0 group-hover:w-2.5 h-0.5 bg-[#B5121B] rounded-full transition-all duration-300" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Services */}
            <div>
              <h4 className="font-heading text-base font-bold text-[#B5121B] mb-5 flex items-center gap-2">
                <span className="w-4 h-0.5 bg-[#B5121B] inline-block rounded-full" />Our Services
              </h4>
              <ul className="space-y-3">
                {displayServices.map(s => (
                  <li key={s}>
                    <Link
                      to="/services"
                      className="text-[#555555] hover:text-[#B5121B] text-xs sm:text-sm transition-colors flex items-center gap-2 group font-medium"
                    >
                      <span className="w-0 group-hover:w-2.5 h-0.5 bg-[#B5121B] rounded-full transition-all duration-300" />
                      {s}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: Contact */}
            <div>
              <h4 className="font-heading text-base font-bold text-[#B5121B] mb-5 flex items-center gap-2">
                <span className="w-4 h-0.5 bg-[#B5121B] inline-block rounded-full" />Contact
              </h4>
              <ul className="space-y-3.5">
                {line1 && (
                  <li className="flex gap-3">
                    <MapPin size={16} className="text-[#B5121B] flex-shrink-0 mt-0.5" />
                    <p className="text-[#555555] text-xs sm:text-sm leading-relaxed font-light">
                      {line1}<br />{line2}<br />{city}
                    </p>
                  </li>
                )}
                {phones.map(p => (
                  <li key={p}>
                    <a href={`tel:+91${p}`} className="flex items-center gap-2 text-[#555555] hover:text-[#B5121B] text-xs sm:text-sm transition-colors font-medium">
                      <Phone size={14} className="text-[#B5121B]" />{p}
                    </a>
                  </li>
                ))}
                {email && (
                  <li>
                    <a href={`mailto:${email}`} className="flex items-center gap-2 text-[#555555] hover:text-[#B5121B] text-xs sm:text-sm transition-colors font-medium">
                      <Mail size={14} className="text-[#B5121B]" />{email}
                    </a>
                  </li>
                )}
                {hours && (
                  <li className="flex items-center gap-2 text-[#555555] text-xs sm:text-sm">
                    <Clock size={14} className="text-[#B5121B]" />{hours}
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#E5E5E5] py-5 px-4 sm:px-8 lg:px-16 bg-[#F0F0ED]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[#666666] text-xs font-light">
            &copy; {new Date().getFullYear()} {companyName}. All rights reserved.
          </p>
          <div className="flex gap-5">
            {['Privacy Policy', 'Terms of Service', 'Cancellation Policy'].map(l => (
              <Link key={l} to="/faq" className="text-[#666666] hover:text-[#B5121B] text-xs transition-colors">
                {l}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
