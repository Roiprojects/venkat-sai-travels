import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import CountUp from 'react-countup'
import FadeUp from '../ui/FadeUp'
import { useAdminData } from '../../hooks/useAdminData'

const FALLBACK_STATS = [
  { value: 22, suffix: '+', label: 'Years of Experience' },
  { value: 10000, suffix: '+', label: 'Happy Customers' },
  { value: 50000, suffix: '+', label: 'Trips Completed' },
  { value: 200, suffix: '+', label: 'Corporate Clients' },
  { value: 50, suffix: '+', label: 'Luxury Fleet' },
]

export default function Stats() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const { stats } = useAdminData()
  const items = stats.length ? stats : FALLBACK_STATS

  return (
    <section ref={ref} className="py-10 sm:py-14 bg-[#FAFAF8] relative overflow-hidden px-4 sm:px-8 lg:px-16 border-b border-[#E5E5E5]">
      <div className="max-w-7xl mx-auto relative z-10">
        <FadeUp className="text-center mb-6 sm:mb-8">
          <span className="badge-red">Our Achievements</span>
        </FadeUp>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-5">
          {items.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 25 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="text-center group"
            >
              <div className="bg-white rounded-2xl sm:rounded-3xl px-2.5 sm:px-4 py-5 sm:py-6 border border-[#E5E5E5] shadow-card hover:border-brand-300 hover:shadow-card-hover hover:-translate-y-1 transition-all duration-400">
                <div className="font-heading text-2xl sm:text-3xl lg:text-[1.85rem] xl:text-4xl font-extrabold mb-1.5 sm:mb-2 tracking-tight whitespace-nowrap flex items-baseline justify-center">
                  <span className="text-[#B5121B]">
                    {inView ? (
                      <CountUp end={stat.value} duration={2.5} delay={i * 0.1} separator="," />
                    ) : '0'}
                  </span>
                  <span className="text-[#B5121B] text-lg sm:text-xl lg:text-2xl xl:text-3xl ml-0.5 font-bold">{stat.suffix}</span>
                </div>
                <p className="text-[#555555] text-xs sm:text-sm font-button font-medium leading-snug">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
