import { useState, useEffect } from 'react'
import { Link, useLocation } from '@tanstack/react-router'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ArrowRight, Phone, MessageCircle } from 'lucide-react'
import { WHATSAPP_URL, CALL_URL } from '../../data/constants'
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

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [hoveredPath, setHoveredPath] = useState<string | null>(null)
  const [navLinks, setNavLinks] = useState(FALLBACK_NAV_LINKS)
  const location = useLocation()

  useEffect(() => {
    ;(async () => {
      try {
        const data = await api.settings()
        const links: typeof FALLBACK_NAV_LINKS = []
        for (let i = 1; i <= 10; i++) {
          const label = data[`nav_${i}_label`]
          const path = data[`nav_${i}_path`]
          if (label && path) links.push({ label, path })
        }
        if (links.length) setNavLinks(links)
      } catch {}
    })()
  }, [])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 25)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [location])

  return (
    <>
      {/* ── Floating Luxury Pill Navbar Wrapper ── */}
      <motion.div
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-3.5 sm:top-5 inset-x-3 sm:inset-x-6 z-50 max-w-7xl mx-auto select-none"
      >
        <header
          className={`w-full rounded-full transition-all duration-300 px-4 sm:px-6 flex items-center justify-between border ${
            scrolled
              ? 'py-2 sm:py-2.5 bg-white/96 backdrop-blur-2xl border-[#E5E5E5] shadow-[0_12px_36px_rgba(0,0,0,0.08)]'
              : 'py-2.5 sm:py-3.5 bg-white/90 backdrop-blur-xl border-[#EAEAEA] shadow-[0_8px_30px_rgba(0,0,0,0.05)]'
          }`}
        >
          {/* ── 1. Clean Dedicated Logo Section ── */}
          <div className="flex items-center">
            <Link
              to="/"
              className="block focus:outline-none transition-transform duration-200 hover:scale-[1.02]"
              aria-label="Venkat Sai Travels Home"
            >
              {/* Desktop Logo */}
              <div className="hidden sm:flex items-center">
                <Logo height={scrolled ? 58 : 68} />
              </div>
              {/* Mobile Logo */}
              <div className="sm:hidden flex items-center">
                <Logo height={44} />
              </div>
            </Link>
          </div>

          {/* ── 2. Interactive Navigation Links with Smooth Gliding Indicator ── */}
          <nav
            onMouseLeave={() => setHoveredPath(null)}
            className="hidden lg:flex items-center gap-1 xl:gap-1.5 p-1 bg-[#FAFAF8]/90 rounded-full border border-[#EAEAEA]/80 shadow-[inset_0_1px_3px_rgba(0,0,0,0.02)]"
          >
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path
              const isHovered = hoveredPath === link.path

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onMouseEnter={() => setHoveredPath(link.path)}
                  className="relative px-4 py-2 rounded-full text-xs xl:text-sm font-button font-medium transition-colors duration-200 z-10"
                >
                  {/* Text label with red highlight on active/hover */}
                  <span
                    className={`relative z-20 transition-colors duration-200 ${
                      isActive
                        ? 'text-[#B5121B] font-bold'
                        : isHovered
                        ? 'text-[#B5121B] font-semibold'
                        : 'text-[#222222]'
                    }`}
                  >
                    {link.label}
                  </span>

                  {/* Active Page Gliding Pill Indicator (Subtle soft red pill: rgba(181,18,27,0.07)) */}
                  {isActive && (
                    <motion.div
                      layoutId="navActiveIndicator"
                      className="absolute inset-0 rounded-full bg-[#B5121B]/[0.08] border border-[#B5121B]/20 shadow-[0_2px_8px_rgba(181,18,27,0.08)] z-10"
                      transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                    />
                  )}

                  {/* Hover Pill Indicator when not active */}
                  {!isActive && isHovered && (
                    <motion.div
                      layoutId="navHoverIndicator"
                      className="absolute inset-0 rounded-full bg-neutral-200/50 z-0"
                      transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                    />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* ── 3. Quick Actions & "Plan Your Journey" CTA Button ── */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Quick Phone Call Pill */}
            <a
              href={CALL_URL}
              className="flex items-center gap-1.5 text-[#444444] hover:text-[#B5121B] px-3.5 py-2 rounded-full border border-[#EAEAEA] bg-white hover:border-brand-200 text-xs font-button font-semibold transition-all duration-200 shadow-sm hover:shadow"
              title="Call Us"
            >
              <Phone size={13} className="text-[#B5121B]" />
              <span className="hidden xl:inline">Call Us</span>
            </a>

            {/* Quick WhatsApp Pill */}
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-emerald-700 hover:text-emerald-800 px-3.5 py-2 rounded-full border border-emerald-200/80 bg-emerald-50/70 hover:bg-emerald-100/80 text-xs font-button font-semibold transition-all duration-200 shadow-sm"
              title="Chat on WhatsApp"
            >
              <MessageCircle size={13} className="text-emerald-600" />
              <span className="hidden xl:inline">WhatsApp</span>
            </a>

            {/* Redesigned "PLAN YOUR JOURNEY →" Button */}
            <Link
              to="/booking"
              className="group relative overflow-hidden inline-flex items-center gap-2 bg-gradient-to-r from-[#D71920] to-[#B5121B] text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-full text-xs font-button font-bold uppercase tracking-wider shadow-[0_4px_16px_rgba(181,18,27,0.3)] hover:shadow-[0_8px_24px_rgba(181,18,27,0.45)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
            >
              <span className="relative z-10">Plan Your Journey</span>
              <ArrowRight
                size={14}
                className="relative z-10 transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </div>

          {/* ── Mobile Hamburger Button ── */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden w-10 h-10 rounded-full flex items-center justify-center bg-[#FAFAF8] border border-[#EAEAEA] text-[#222222] hover:text-[#B5121B] hover:border-brand-200 transition-colors shadow-sm"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </header>
      </motion.div>

      {/* ── Mobile Menu Floating Drawer ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.96 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-3 top-20 sm:top-24 z-40 bg-white backdrop-blur-2xl rounded-3xl p-5 shadow-2xl border border-[#DDDDDD] lg:hidden flex flex-col gap-3 max-w-lg mx-auto"
          >
            {/* Mobile Header Bar */}
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E5E5]">
              <Logo height={44} />
              <button
                onClick={() => setMenuOpen(false)}
                className="w-9 h-9 rounded-full flex items-center justify-center bg-[#F2F2F2] text-[#444444] hover:text-[#B5121B] hover:bg-brand-50 transition-colors"
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
            </div>

            {/* Mobile Nav Links */}
            <div className="flex flex-col gap-1 py-1">
              {navLinks.map((link, i) => {
                const isActive = location.pathname === link.path
                return (
                  <motion.div
                    key={link.path}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.2 }}
                  >
                    <Link
                      to={link.path}
                      className={`font-button text-base font-bold py-3.5 px-5 rounded-2xl transition-all flex items-center justify-between group ${
                        isActive
                          ? 'bg-brand-600 text-white shadow-[0_4px_14px_rgba(181,18,27,0.3)]'
                          : 'text-[#111111] bg-[#F7F7F5] hover:bg-brand-50 hover:text-brand-600 border border-transparent hover:border-brand-200/60'
                      }`}
                    >
                      <span>{link.label}</span>
                      <ArrowRight
                        size={15}
                        className={`transition-transform duration-200 group-hover:translate-x-1 ${
                          isActive ? 'text-white' : 'text-brand-500'
                        }`}
                      />
                    </Link>
                  </motion.div>
                )
              })}
            </div>

            <div className="h-px bg-[#E5E5E5] my-0.5" />

            {/* Mobile CTA Buttons */}
            <div className="flex flex-col gap-2">
              <Link
                to="/booking"
                className="group w-full bg-gradient-to-r from-[#D71920] to-[#B5121B] text-white py-3.5 px-6 rounded-full text-center text-sm font-button font-bold uppercase tracking-wider shadow-[0_4px_16px_rgba(181,18,27,0.3)] flex items-center justify-center gap-2"
              >
                <span>Plan Your Journey</span>
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </Link>

              <div className="grid grid-cols-2 gap-2">
                <a
                  href={CALL_URL}
                  className="flex items-center justify-center gap-2 border border-[#DDDDDD] bg-[#F7F7F5] hover:bg-white py-3 rounded-full text-sm font-button font-bold text-[#111111] hover:text-[#B5121B] transition-colors shadow-sm"
                >
                  <Phone size={14} className="text-[#B5121B]" />Call Us
                </a>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 py-3 rounded-full text-sm font-button font-bold transition-colors shadow-sm"
                >
                  <MessageCircle size={14} className="text-emerald-600" />WhatsApp
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
