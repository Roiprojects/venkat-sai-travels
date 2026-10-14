import { useState, useEffect, useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { Target, Eye, Heart, Quote } from 'lucide-react'
import SectionHeader from '../components/ui/SectionHeader'
import FadeUp from '../components/ui/FadeUp'
import CTABanner from '../components/home/CTABanner'
import { IMAGES } from '../data/images'
import { api } from '../api'

const FALLBACK_FOUNDER_IMG = '/images/car_rentals_cover.png'

const TIMELINE_FALLBACK = [
  { year: '2002', title: 'Founded',            desc: 'Mr. Venkat Sai started Venkat Sai Travels with a single vehicle and an unwavering vision for safe, premium travel in Bangalore.' },
  { year: '2006', title: 'Fleet Expansion',    desc: 'Expanded to 10+ vehicles including Innova Crysta and Tempo Travellers to serve growing demand.' },
  { year: '2010', title: 'Corporate Division', desc: 'Launched a dedicated corporate travel division, onboarding 50+ IT companies across Bangalore.' },
  { year: '2015', title: 'Luxury Fleet',       desc: 'Added premium luxury vehicles, Urbania buses, and chauffeur services for high-profile clients and events.' },
  { year: '2019', title: 'Digital Booking',    desc: 'Introduced instant WhatsApp and online booking systems for seamless, real-time reservations.' },
  { year: '2024', title: '22 Years Strong',    desc: '50+ vehicles, 200+ corporate clients, 50,000+ trips completed — and still growing stronger every year.' },
]

const VALUES_FALLBACK = [
  { icon: Target, title: 'Our Mission', desc: 'To provide world-class transportation services that exceed expectations through professionalism, punctuality, and premium vehicles.' },
  { icon: Eye,    title: 'Our Vision',  desc: "To become South India's most trusted luxury travel partner, setting new standards in customer experience." },
  { icon: Heart,  title: 'Our Values',  desc: 'Integrity, excellence, and genuine care for every passenger — these values drive every decision we make.' },
]

// Timeline item with hanging swing-down entrance animation
function TimelineItem({ item, index }: { item: { year: string; title: string; desc: string }; index: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const shouldReduceMotion = useReducedMotion()

  const isEven = index % 2 === 0
  const delay = index * 0.14

  // Desktop vs mobile swing parameters
  const initialYDesktop = shouldReduceMotion ? 0 : -45
  const initialRotateDesktop = shouldReduceMotion ? 0 : (isEven ? -4 : 4)

  const initialYMobile = shouldReduceMotion ? 0 : -25
  const initialRotateMobile = shouldReduceMotion ? 0 : -2

  return (
    <div
      ref={ref}
      className={`relative flex gap-6 md:gap-0 ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}
    >
      {/* Desktop Card */}
      <div className={`hidden md:block md:w-1/2 ${isEven ? 'pr-12 text-right' : 'pl-12'}`}>
        <motion.div
          initial={{ opacity: 0, y: initialYDesktop, rotate: initialRotateDesktop }}
          animate={
            inView
              ? { opacity: 1, y: 0, rotate: 0 }
              : { opacity: 0, y: initialYDesktop, rotate: initialRotateDesktop }
          }
          transition={{
            duration: 1.0,
            delay,
            ease: [0.22, 1, 0.36, 1],
          }}
          style={{ transformOrigin: 'top center' }}
          className={`bg-white rounded-3xl p-6 border border-[#E5E5E5] shadow-card hover:shadow-card-hover hover:border-brand-300 hover:-translate-y-1 transition-all duration-300 inline-block max-w-lg ${
            !isEven ? 'text-left' : ''
          }`}
        >
          <span className="text-[#B5121B] font-heading text-2xl font-extrabold">{item.year}</span>
          <h4 className="text-[#171717] font-heading text-lg font-bold mt-1">{item.title}</h4>
          <p className="text-[#555555] text-sm mt-1 leading-relaxed font-light">{item.desc}</p>
        </motion.div>
      </div>

      {/* Red Circular Timeline Dot */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={
          inView
            ? { opacity: 1, scale: [0.5, 1.25, 1] }
            : { opacity: 0, scale: 0.5 }
        }
        transition={{
          duration: 0.7,
          delay: delay + 0.08,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="flex-shrink-0 w-8 h-8 rounded-full bg-[#B5121B] border-4 border-white z-10 md:absolute md:left-1/2 md:-translate-x-1/2 md:top-4 shadow-md"
      />

      {/* Mobile Card */}
      <div className="md:hidden flex-1">
        <motion.div
          initial={{ opacity: 0, y: initialYMobile, rotate: initialRotateMobile }}
          animate={
            inView
              ? { opacity: 1, y: 0, rotate: 0 }
              : { opacity: 0, y: initialYMobile, rotate: initialRotateMobile }
          }
          transition={{
            duration: 0.85,
            delay,
            ease: [0.22, 1, 0.36, 1],
          }}
          style={{ transformOrigin: 'top center' }}
          className="bg-white rounded-3xl p-6 border border-[#E5E5E5] shadow-card hover:shadow-card-hover hover:border-brand-300 hover:-translate-y-1 transition-all duration-300"
        >
          <span className="text-[#B5121B] font-heading text-xl font-extrabold">{item.year}</span>
          <h4 className="text-[#171717] font-heading text-lg font-bold mt-1">{item.title}</h4>
          <p className="text-[#555555] text-sm mt-1 font-light">{item.desc}</p>
        </motion.div>
      </div>

      {/* Desktop Alternate Spacer */}
      <div className="hidden md:block md:w-1/2" />
    </div>
  )
}

export default function About() {
  const [timeline, setTimeline] = useState(TIMELINE_FALLBACK)
  const [values, setValues] = useState(VALUES_FALLBACK)
  const [founderData, setFounderData] = useState<any>(null)
  const [imgSrc, setImgSrc] = useState('')
  const [imgError, setImgError] = useState(false)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const data = await api.about()
        if (!cancelled && data) {
          if (data.timeline?.length) setTimeline(data.timeline.map((t: any) => ({ year: String(t.year), title: t.title, desc: t.description })))
          if (data.values?.length) {
            setValues(data.values.map((v: any) => ({ icon: Target, title: v.title, desc: v.description })))
          }
          if (data.founder) {
            setFounderData(data.founder)
            if (data.founder.image) setImgSrc(data.founder.image)
          }
        }
      } catch (e) { console.error('About fetch error:', e) }
    }
    load()
    const interval = setInterval(load, 5000)
    return () => { cancelled = true; clearInterval(interval) }
  }, [])

  const resolvedImgSrc = imgSrc || IMAGES.founderBg || FALLBACK_FOUNDER_IMG

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
      {/* Page Hero */}
      <section className="pt-36 pb-20 px-4 sm:px-8 lg:px-16 bg-[#FAFAF8] relative overflow-hidden border-b border-[#E5E5E5]">
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-brand-500 to-brand-700" />
        <div className="max-w-7xl mx-auto relative z-10">
          <FadeUp>
            <span className="badge-red mb-4 block w-fit">About Us</span>
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#171717] mb-4 tracking-tight">
              Our <span className="text-[#B5121B]">Story</span>
            </h1>
            <div className="w-16 h-1 bg-gradient-to-r from-brand-500 to-brand-700 rounded-full mb-6" />
            <p className="text-[#555555] text-base sm:text-lg max-w-2xl leading-relaxed font-light">
              22+ years of luxury travel excellence in Bangalore — built on trust, professionalism,
              and an unwavering commitment to passenger safety and satisfaction since 2002.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* Founder Section */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-14 items-center">

            {/* Left: founder photo card */}
            <FadeUp>
              <div className="relative rounded-3xl overflow-hidden shadow-xl border border-[#E5E5E5] h-[460px] bg-neutral-100">
                <img
                  src={!imgError ? resolvedImgSrc : FALLBACK_FOUNDER_IMG}
                  alt="Venkat Sai Travels — Our Team"
                  className="w-full h-full object-cover"
                  onError={() => setImgError(true)}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                {/* Quote overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <Quote size={32} className="text-brand-400 mb-3" />
                  <p className="text-white text-base leading-relaxed italic font-body mb-5 font-light">
                    "{founderData?.quote || 'Our success is built on the trust of our customers. Every trip we complete is a promise we keep.'}"
                  </p>
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-full bg-[#B5121B] flex items-center justify-center font-heading font-bold text-white text-lg shadow-md">
                      B
                    </div>
                    <div>
                      <p className="text-white font-heading font-bold text-base">Mr. Babu</p>
                      <p className="text-brand-300 text-xs font-button font-medium">Founder & Managing Director</p>
                    </div>
                  </div>
                </div>
              </div>
            </FadeUp>

            {/* Right: text */}
            <FadeUp delay={0.15}>
              <span className="badge-red mb-4 block w-fit">The Founder</span>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#171717] mb-4">
                Built on <span className="text-[#B5121B]">Passion</span> & Trust
              </h2>
              <div className="w-16 h-1 bg-gradient-to-r from-brand-500 to-brand-700 rounded-full mb-6" />
              <p className="text-[#555555] text-sm sm:text-base leading-relaxed mb-4 font-light">
                Starting with just one vehicle in 2002, Mr. Venkat Sai's unwavering dedication to service
                excellence has transformed a single car into one of Bangalore's most respected travel companies — spanning over two decades of trusted journeys.
              </p>
              <p className="text-[#555555] text-sm sm:text-base leading-relaxed mb-8 font-light">
                Today, Venkat Sai Travels operates a fleet of 50+ premium vehicles, serving 50,000+ trips
                for satisfied customers including 200+ corporate clients, wedding parties, pilgrimage groups,
                and individual travellers who demand nothing but the best.
              </p>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-4 p-6 bg-[#FAFAF8] rounded-3xl border border-[#E5E5E5] shadow-sm">
                {[['22+', 'Years Exp.'], ['200+', 'Corp. Clients'], ['50K+', 'Trips Done']].map(([v, l]) => (
                  <div key={l} className="text-center">
                    <p className="font-heading text-2xl sm:text-3xl font-extrabold text-[#B5121B] mb-0.5">{v}</p>
                    <p className="text-[#555555] text-xs font-button font-medium">{l}</p>
                  </div>
                ))}
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* Timeline Section with Hanging Swing-Down Entrance Animation */}
      <section className="section-padding bg-[#FAFAF8]">
        <div className="max-w-7xl mx-auto">
          <SectionHeader badge="Our Journey" title="22 Years of" highlight="Excellence" />
          <div className="relative mt-10">
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-brand-200" />
            <div className="space-y-8">
              {timeline.map((item, i) => (
                <TimelineItem key={item.year} item={item} index={i} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Vision Mission Values */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto">
          <SectionHeader badge="Who We Are" title="Our Core" highlight="Values" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((v, i) => {
              const Icon = v.icon
              return (
                <FadeUp key={v.title} delay={i * 0.1}>
                  <div className="bg-[#FAFAF8] rounded-3xl p-8 border border-[#E5E5E5] shadow-card hover:shadow-card-hover hover:border-brand-300 hover:-translate-y-1.5 transition-all duration-400 group h-full">
                    <div className="w-14 h-14 rounded-2xl bg-brand-50 border border-brand-200/80 flex items-center justify-center mb-6 group-hover:bg-[#B5121B] transition-all duration-300 shadow-sm">
                      <Icon size={24} className="text-brand-600 group-hover:text-white transition-colors duration-300" />
                    </div>
                    <h3 className="font-heading text-xl font-bold text-[#171717] mb-3">{v.title}</h3>
                    <p className="text-[#555555] text-sm leading-relaxed font-light">{v.desc}</p>
                  </div>
                </FadeUp>
              )
            })}
          </div>
        </div>
      </section>

      <CTABanner />
    </motion.div>
  )
}
