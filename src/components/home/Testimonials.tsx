import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react'
import SectionHeader from '../ui/SectionHeader'
import { useAdminData } from '../../hooks/useAdminData'

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={15} className={i < rating ? 'text-[#B5121B] fill-[#B5121B]' : 'text-neutral-300 fill-neutral-300'} />
      ))}
    </div>
  )
}

const FALLBACK_TESTIMONIALS = [
  { name: 'Rajesh Kumar', initial: 'R', text: 'Exceptional service! The driver was punctual, the car was immaculate, and the overall experience was truly first-class. Venkat Sai Travels has set a new benchmark.', location: 'Bangalore', date: '2 weeks ago', rating: 5 },
  { name: 'Priya Sharma', initial: 'P', text: 'Used their airport transfer service multiple times. Never once missed a flight. Professional, clean, and always on time. Highly recommended for corporate travel!', location: 'Whitefield', date: '1 month ago', rating: 5 },
  { name: 'Arun Mehta', initial: 'A', text: 'Booked the Urbania for our family trip to Ooty. Comfortable, spacious, and the driver was knowledgeable about all the tourist spots. Will book again!', location: 'HSR Layout', date: '3 weeks ago', rating: 5 },
  { name: 'Sunitha Reddy', initial: 'S', text: 'Used them for my wedding. The decorated cars were stunning and everything was perfectly coordinated. Mr. Babu was very helpful throughout the planning process.', location: 'Indiranagar', date: '2 months ago', rating: 5 },
  { name: 'Kiran Patel', initial: 'K', text: 'Our company has been using Venkat Sai Travels for employee transport. Zero complaints in 2 years. Extremely reliable and professional team.', location: 'Electronic City', date: '1 week ago', rating: 5 },
  { name: 'Deepika Nair', initial: 'D', text: 'The Innova Crysta was spotless and the driver was courteous. The journey to Mysore was very comfortable. Transparent pricing with no hidden charges.', location: 'Koramangala', date: '3 months ago', rating: 5 },
]

export default function Testimonials() {
  const { testimonials } = useAdminData()
  const items = testimonials?.length ? testimonials : FALLBACK_TESTIMONIALS
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(1)

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1)
      setCurrent(c => (c + 1) % items.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [items.length])

  const go = (dir: number) => {
    setDirection(dir)
    setCurrent(c => (c + dir + items.length) % items.length)
  }

  const t = items[current]

  return (
    <section className="section-padding bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <SectionHeader badge="Testimonials" title="What Our" highlight="Clients Say" subtitle="Trusted by thousands of travellers across Bangalore." />

        <div className="flex justify-center mb-12">
          <div className="flex items-center gap-3 bg-[#FAFAF8] px-6 py-3 rounded-full shadow-sm border border-[#E5E5E5]">
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span className="text-[#171717] font-button font-bold text-sm">4.9</span>
            <StarRating rating={5} />
            <span className="text-[#666666] text-xs font-medium">on Google</span>
          </div>
        </div>

        <div className="relative max-w-3xl mx-auto">
          <div className="overflow-hidden">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={current}
                custom={direction}
                initial={{ opacity: 0, x: direction * 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -direction * 50 }}
                transition={{ duration: 0.4 }}
                className="bg-[#FAFAF8] rounded-3xl p-8 sm:p-12 border border-[#E5E5E5] shadow-card relative"
              >
                <Quote size={44} className="text-brand-100 absolute top-8 right-8 pointer-events-none" />
                <div className="mb-4"><StarRating rating={t.rating} /></div>
                <p className="text-[#333333] text-base sm:text-lg leading-relaxed font-body mb-8 italic font-light">"{t.text}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#B5121B] flex items-center justify-center shadow-md">
                    <span className="font-heading font-bold text-white text-lg">{t.initial || t.name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="font-heading font-bold text-[#171717] text-base">{t.name}</p>
                    <p className="text-brand-600 text-xs font-button font-semibold mt-0.5">{t.location} · {t.date}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex items-center justify-center gap-4 mt-8">
            <button onClick={() => go(-1)} className="w-10 h-10 rounded-full border border-[#E5E5E5] bg-white flex items-center justify-center text-[#555555] hover:border-brand-600 hover:text-brand-600 shadow-sm transition-all duration-300">
              <ChevronLeft size={18} />
            </button>
            <div className="flex gap-2">
              {items.map((_, i) => (
                <button key={i} onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i) }}
                  className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? 'bg-brand-600 w-8' : 'bg-neutral-300 w-2'}`} />
              ))}
            </div>
            <button onClick={() => go(1)} className="w-10 h-10 rounded-full border border-[#E5E5E5] bg-white flex items-center justify-center text-[#555555] hover:border-brand-600 hover:text-brand-600 shadow-sm transition-all duration-300">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
