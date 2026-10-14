import { motion } from 'framer-motion'
import FadeUp from '../ui/FadeUp'
import SectionHeader from '../ui/SectionHeader'
import { useAdminData } from '../../hooks/useAdminData'

const FALLBACK_COMPANIES = [
  { name: 'Infosys' },
  { name: 'Wipro' },
  { name: 'TCS' },
  { name: 'Biocon' },
  { name: 'Mphasis' },
  { name: 'Mindtree' },
  { name: 'KPMG' },
  { name: 'Deloitte' },
  { name: 'Accenture' },
  { name: 'IBM' },
]

export default function TrustedBy() {
  const { trustedBy } = useAdminData()
  const companies = trustedBy?.length ? trustedBy.map(t => ({ name: t.name })) : FALLBACK_COMPANIES

  return (
    <section className="section-padding bg-[#FAFAF8] relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-[#E5E5E5]" />

      <div className="max-w-7xl mx-auto relative z-10">
        <SectionHeader
          badge="Trusted By"
          title="Powering Travel for"
          highlight="200+ Companies"
          subtitle="From startups to Fortune 500 companies — Bangalore's top businesses rely on us."
        />

        {/* Company grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5 mb-8 sm:mb-10">
          {companies.map((co, i) => (
            <FadeUp key={co.name} delay={i * 0.04}>
              <motion.div
                whileHover={{ y: -4, scale: 1.02 }}
                className="bg-white rounded-2xl p-5 text-center group cursor-default border border-[#E5E5E5] hover:border-brand-300 hover:shadow-card transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-2xl bg-brand-50 border border-brand-200/80 flex items-center justify-center mx-auto mb-3 group-hover:bg-[#B5121B] transition-all duration-300 shadow-sm">
                  <span className="font-heading font-bold text-brand-700 group-hover:text-white text-sm tracking-wider">
                    {co.name.slice(0, 2).toUpperCase()}
                  </span>
                </div>
                <p className="font-heading font-bold text-[#171717] text-sm group-hover:text-brand-600 transition-colors">{co.name}</p>
              </motion.div>
            </FadeUp>
          ))}
        </div>

        {/* Achievement strip */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-card border border-[#E5E5E5]">
          <div className="relative grid grid-cols-2 md:grid-cols-4 gap-8">
            <FadeUp className="text-center">
              <p className="font-heading text-3xl md:text-4xl font-extrabold text-[#B5121B] mb-1.5 tracking-tight">200+</p>
              <p className="text-[#171717] font-button font-bold text-sm tracking-wide">Corporate Clients</p>
              <p className="text-[#666666] text-xs mt-1 font-light">Businesses trust us for daily commute</p>
            </FadeUp>
            <FadeUp delay={0.08} className="text-center">
              <p className="font-heading text-3xl md:text-4xl font-extrabold text-[#B5121B] mb-1.5 tracking-tight">22+</p>
              <p className="text-[#171717] font-button font-bold text-sm tracking-wide">Years in Business</p>
              <p className="text-[#666666] text-xs mt-1 font-light">Serving Bangalore with excellence</p>
            </FadeUp>
            <FadeUp delay={0.16} className="text-center">
              <p className="font-heading text-3xl md:text-4xl font-extrabold text-[#B5121B] mb-1.5 tracking-tight">50,000+</p>
              <p className="text-[#171717] font-button font-bold text-sm tracking-wide">Trips Completed</p>
              <p className="text-[#666666] text-xs mt-1 font-light">And counting every month</p>
            </FadeUp>
            <FadeUp delay={0.24} className="text-center">
              <p className="font-heading text-3xl md:text-4xl font-extrabold text-[#B5121B] mb-1.5 tracking-tight">4.9/5</p>
              <p className="text-[#171717] font-button font-bold text-sm tracking-wide">Google Rating</p>
              <p className="text-[#666666] text-xs mt-1 font-light">Based on 1000+ reviews</p>
            </FadeUp>
          </div>
        </div>
      </div>
    </section>
  )
}
