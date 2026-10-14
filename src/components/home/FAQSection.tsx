import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus } from 'lucide-react'
import SectionHeader from '../ui/SectionHeader'
import FadeUp from '../ui/FadeUp'
import { useAdminData } from '../../hooks/useAdminData'

const EXTRA_FAQS = [
  { q: 'What is included in the rental fare?', a: 'Our fares are inclusive of vehicle rental, driver allowance, and fuel. Tolls, parking, and state permit taxes (if applicable) are charged at actuals or as quoted.', category: 'Pricing' },
  { q: 'Can I book a vehicle for outstation travel from Bangalore?', a: 'Yes, we provide outstation chauffeur services to all destinations across Karnataka, Tamil Nadu, Kerala, Andhra Pradesh, and Telangana.', category: 'Services' },
  { q: 'What documents are required to book?', a: 'For chauffeur-driven rentals, only a valid government ID (Aadhaar / Passport) is required for booking confirmation.', category: 'Booking' },
  { q: 'Are your drivers trained for highway driving?', a: 'Yes, all our drivers are experienced highway chauffeurs with valid commercial licenses, defensive driving training, and verified background checks.', category: 'Safety' },
  { q: 'Do you offer airport meet and greet services?', a: 'Yes, our chauffeur will wait at the arrival hall with a name board and assist you with your luggage.', category: 'Services' },
]

const CATEGORIES = ['All', 'General', 'Booking', 'Pricing', 'Services', 'Safety']

const FALLBACK_FAQS = [
  { q: 'How do I book a vehicle with Venkat Sai Travels?', a: 'You can book via WhatsApp, call us directly, or fill the booking form on our website. We confirm your booking within 30 minutes.', category: 'General' },
  { q: 'What are your operating hours?', a: 'We operate 24 hours a day, 7 days a week including all holidays and festivals.', category: 'General' },
  { q: 'Do you provide outstation services?', a: 'Yes, we cover all major destinations across South India including Mysore, Coorg, Ooty, Chennai, Hyderabad, Goa, and more.', category: 'General' },
  { q: 'Are your drivers verified and trained?', a: 'All our drivers hold valid commercial licenses, undergo background verification, and receive regular training in safety, courtesy, and route knowledge.', category: 'General' },
  { q: 'Do you provide airport pickup at night?', a: 'Absolutely! Our airport transfer service runs 24/7. We track your flight status to ensure timely pickup regardless of delays.', category: 'General' },
  { q: 'What vehicles are available for airport transfer?', a: 'We offer Etios sedans, Innova Crysta SUVs, and luxury cars for airport transfers based on your group size and preference.', category: 'General' },
  { q: 'Is GST included in the price?', a: 'All our prices are transparent with GST included. No hidden charges — what you see is what you pay.', category: 'General' },
  { q: 'Do you have corporate accounts?', a: 'Yes, we offer dedicated corporate accounts with monthly billing, priority booking, dedicated account managers, and customized solutions.', category: 'General' },
  { q: 'What is your cancellation policy?', a: 'Free cancellation up to 2 hours before pickup. Cancellations within 2 hours may incur a minimal charge. Contact us for full details.', category: 'General' },
  { q: 'Do you provide vehicles for weddings?', a: 'Yes! We offer complete wedding transportation packages including decorated bridal cars, guest shuttles, baraat vehicles, and luxury fleets.', category: 'General' },
  ...EXTRA_FAQS,
]

export default function FAQSection() {
  const { faqs } = useAdminData()
  const [open, setOpen] = useState<number | null>(0)
  const items = faqs?.length ? faqs : FALLBACK_FAQS

  return (
    <section className="section-padding bg-[#FAFAF8] relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-[#E5E5E5]" />
      <div className="max-w-3xl mx-auto relative z-10">
        <SectionHeader badge="FAQ" title="Common" highlight="Questions" subtitle="Everything you need to know about booking with us." />

        <div className="space-y-3.5">
          {items.map((item, i) => (
            <FadeUp key={i} delay={i * 0.03}>
              <div className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                open === i
                  ? 'border-brand-300 bg-white shadow-card ring-2 ring-brand-500/10'
                  : 'border-[#E5E5E5] bg-white hover:border-[#D0D0D0]'
              }`}>
                <button
                  className="w-full flex items-center justify-between p-5 sm:p-6 text-left"
                  onClick={() => setOpen(open === i ? null : i)}
                >
                  <span className={`font-heading text-sm sm:text-base font-semibold pr-4 transition-colors duration-200 ${open === i ? 'text-brand-600' : 'text-[#171717]'}`}>
                    {item.q}
                  </span>
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
                      <p className="px-5 sm:px-6 pb-6 text-[#555555] text-xs sm:text-sm leading-relaxed border-t border-[#F0F0ED] pt-3 font-light">{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  )
}
