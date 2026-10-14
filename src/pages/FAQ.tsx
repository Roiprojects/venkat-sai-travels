import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus, Phone, MessageCircle } from 'lucide-react'
import { FAQ_DATA, WHATSAPP_URL, CALL_URL } from '../data/constants'
import { api } from '../api'
import FadeUp from '../components/ui/FadeUp'
import CTABanner from '../components/home/CTABanner'

const EXTRA_FAQS = [
  { q: 'What is included in the rental fare?', a: 'Our fares are inclusive of vehicle rental, driver allowance, and fuel. Tolls, parking, and state permit taxes (if applicable) are charged at actuals or as quoted.', category: 'Pricing' },
  { q: 'Can I book a vehicle for outstation travel from Bangalore?', a: 'Yes, we provide outstation chauffeur services to all destinations across Karnataka, Tamil Nadu, Kerala, Andhra Pradesh, and Telangana.', category: 'Services' },
  { q: 'What documents are required to book?', a: 'For chauffeur-driven rentals, only a valid government ID (Aadhaar / Passport) is required for booking confirmation.', category: 'Booking' },
  { q: 'Are your drivers trained for highway driving?', a: 'Yes, all our drivers are experienced highway chauffeurs with valid commercial licenses, defensive driving training, and verified background checks.', category: 'Safety' },
  { q: 'Do you offer airport meet and greet services?', a: 'Yes, our chauffeur will wait at the arrival hall with a name board and assist you with your luggage.', category: 'Services' },
]

const CATEGORIES = ['All', 'General', 'Booking', 'Pricing', 'Services', 'Safety']
const FALLBACK_FAQS = [...FAQ_DATA.map(f => ({ ...f, category: 'General' })), ...EXTRA_FAQS]

export default function FAQ() {
  const [faqs, setFaqs] = useState<typeof FALLBACK_FAQS>(FALLBACK_FAQS)
  const [active, setActive] = useState('All')
  const [open, setOpen] = useState<number | null>(0)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const data = await api.faqs()
        if (!cancelled && Array.isArray(data) && data.length) {
          setFaqs(data.map((f: any) => ({ q: f.question, a: f.answer, category: f.category || 'General' })))
        }
      } catch (e) { console.error('FAQ fetch error:', e) }
    }
    load()
    const interval = setInterval(load, 5000)
    return () => { cancelled = true; clearInterval(interval) }
  }, [])

  const filtered = active === 'All' ? faqs : faqs.filter(f => f.category === active)

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
      {/* Page Hero */}
      <section className="pt-36 pb-20 px-4 sm:px-8 lg:px-16 bg-[#FAFAF8] relative overflow-hidden border-b border-[#E5E5E5]">
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-brand-500 to-brand-700" />
        <div className="max-w-7xl mx-auto relative z-10">
          <FadeUp>
            <span className="badge-red mb-4 block w-fit">Help & Support</span>
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#171717] mb-4 tracking-tight">
              Frequently Asked <span className="text-[#B5121B]">Questions</span>
            </h1>
            <div className="w-16 h-1 bg-gradient-to-r from-brand-500 to-brand-700 rounded-full mb-6" />
            <p className="text-[#555555] text-base sm:text-lg max-w-2xl leading-relaxed font-light">
              Find quick answers to questions about bookings, pricing, vehicles, driver policies, and more.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="section-padding bg-white">
        <div className="max-w-4xl mx-auto">
          {/* Categories */}
          <FadeUp className="mb-12">
            <div className="flex flex-wrap justify-center gap-2.5">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => { setActive(cat); setOpen(null) }}
                  className={`font-button text-xs sm:text-sm px-6 py-2.5 rounded-full border transition-all duration-300 ${
                    active === cat
                      ? 'bg-[#B5121B] text-white border-[#B5121B] font-bold shadow-brand'
                      : 'text-[#555555] border-[#E5E5E5] hover:border-brand-300 hover:text-brand-600 bg-white shadow-sm'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </FadeUp>

          {/* Accordion */}
          <div className="space-y-3.5">
            {filtered.map((item, i) => (
              <FadeUp key={item.q} delay={i * 0.03}>
                <div className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                  open === i
                    ? 'border-brand-300 bg-[#FAFAF8] shadow-card ring-2 ring-brand-500/10'
                    : 'border-[#E5E5E5] bg-white hover:border-[#D0D0D0]'
                }`}>
                  <button
                    className="w-full flex items-center justify-between p-5 sm:p-6 text-left"
                    onClick={() => setOpen(open === i ? null : i)}
                  >
                    <div className="pr-4">
                      <span className="text-[11px] font-button font-bold text-brand-600 uppercase tracking-wider block mb-1">
                        {item.category}
                      </span>
                      <span className={`font-heading text-sm sm:text-base font-semibold transition-colors duration-200 ${open === i ? 'text-brand-600' : 'text-[#171717]'}`}>
                        {item.q}
                      </span>
                    </div>
                    <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${open === i ? 'bg-[#B5121B] text-white shadow-sm' : 'bg-neutral-100 text-[#555555]'}`}>
                      {open === i ? <Minus size={14} /> : <Plus size={14} />}
                    </span>
                  </button>
                  <AnimatePresence>
                    {open === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                      >
                        <p className="px-5 sm:px-6 pb-6 text-[#555555] text-xs sm:text-sm leading-relaxed border-t border-[#EAEAEA] pt-3 font-light">
                          {item.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </FadeUp>
            ))}
          </div>

          {/* Still Have Questions Box */}
          <FadeUp className="mt-14 p-8 bg-[#FAFAF8] rounded-3xl border border-[#E5E5E5] text-center shadow-sm">
            <h3 className="font-heading text-2xl font-bold text-[#171717] mb-2">Still Have Questions?</h3>
            <p className="text-[#666666] text-sm max-w-md mx-auto mb-6 font-light">
              Can't find the answer you're looking for? Our customer support team is available 24/7.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <a href={CALL_URL} className="btn-primary text-xs py-3 px-6 shadow-brand">
                <Phone size={14} />Call Us Now
              </a>
              <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="btn-outline text-xs py-3 px-6 shadow-sm">
                <MessageCircle size={14} />Chat on WhatsApp
              </a>
            </div>
          </FadeUp>
        </div>
      </section>

      <CTABanner />
    </motion.div>
  )
}
