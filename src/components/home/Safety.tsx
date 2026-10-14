import { ShieldCheck, UserCheck, Wrench, HeartHandshake, Star, Clock, Car } from 'lucide-react'
import FadeUp from '../ui/FadeUp'
import { useAdminData } from '../../hooks/useAdminData'

const ICON_MAP: Record<string, React.ElementType> = {
  ShieldCheck, UserCheck, Wrench, HeartHandshake, Star, Clock, Car,
}

const FALLBACK_PILLARS = [
  { icon: ShieldCheck, title: 'Fully Insured', desc: 'Comprehensive insurance for vehicles and passengers on every single trip, no exceptions.' },
  { icon: UserCheck, title: 'Driver Verification', desc: 'Police verification, background checks, and commercial license validation for all drivers.' },
  { icon: Wrench, title: 'Vehicle Inspection', desc: 'Every vehicle undergoes monthly safety inspection and daily pre-trip checks by our team.' },
  { icon: HeartHandshake, title: 'Sanitized Interiors', desc: 'Deep-cleaned and sanitized before every booking. Fresh fragrance and spotless interiors guaranteed.' },
  { icon: Star, title: 'Rated Drivers', desc: 'Passengers rate every driver. Low-rated drivers are retrained or removed from our platform.' },
  { icon: Clock, title: 'Real-time Tracking', desc: 'Live GPS tracking on all vehicles. Share your trip link with family for peace of mind.' },
]

export default function Safety() {
  const { safety } = useAdminData()
  const pillars = safety?.length
    ? safety.map((s: any) => ({ icon: ICON_MAP[s.icon] || Car, title: s.title, desc: s.description }))
    : FALLBACK_PILLARS

  return (
    <section className="section-padding bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <FadeUp>
            <span className="badge-red mb-4 block w-fit">Safety First</span>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-[#171717] leading-tight mb-4">
              Your Safety Is Our <span className="text-[#B5121B]">Top Priority</span>
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-brand-500 to-brand-700 rounded-full mb-6" />
            <p className="text-[#555555] text-base leading-relaxed mb-8 font-light">
              At Venkat Sai Travels, safety is not a feature — it's the foundation. From verified drivers to GPS-tracked vehicles, every aspect of your journey is designed to give you complete peace of mind.
            </p>
            <div className="grid grid-cols-3 gap-3.5">
              <div className="bg-[#FAFAF8] rounded-2xl p-4 sm:p-5 border border-[#E5E5E5] text-center shadow-sm">
                <p className="font-heading text-2xl sm:text-3xl font-extrabold text-brand-600">Zero</p>
                <p className="text-[#666666] text-xs font-button font-medium mt-1">Accidents in 2024</p>
              </div>
              <div className="bg-[#FAFAF8] rounded-2xl p-4 sm:p-5 border border-[#E5E5E5] text-center shadow-sm">
                <p className="font-heading text-2xl sm:text-3xl font-extrabold text-brand-600">100%</p>
                <p className="text-[#666666] text-xs font-button font-medium mt-1">Verified Drivers</p>
              </div>
              <div className="bg-[#FAFAF8] rounded-2xl p-4 sm:p-5 border border-[#E5E5E5] text-center shadow-sm">
                <p className="font-heading text-2xl sm:text-3xl font-extrabold text-brand-600">4.9★</p>
                <p className="text-[#666666] text-xs font-button font-medium mt-1">Safety Rating</p>
              </div>
            </div>
          </FadeUp>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {pillars.map((pillar, i) => {
              const Icon = pillar.icon
              return (
                <FadeUp key={pillar.title} delay={i * 0.06}>
                  <div className="bg-[#FAFAF8] rounded-3xl p-5 sm:p-6 border border-[#E5E5E5] shadow-card hover:shadow-card-hover hover:border-brand-300 hover:-translate-y-1 transition-all duration-300 group h-full">
                    <div className="w-10 h-10 rounded-2xl bg-brand-50 border border-brand-200/80 flex items-center justify-center mb-3.5 group-hover:bg-[#B5121B] transition-all duration-300">
                      <Icon size={18} className="text-brand-600 group-hover:text-white transition-colors duration-300" />
                    </div>
                    <h4 className="font-heading text-base font-bold text-[#171717] mb-1.5 group-hover:text-brand-600 transition-colors">{pillar.title}</h4>
                    <p className="text-[#555555] text-xs leading-relaxed font-light">{pillar.desc}</p>
                  </div>
                </FadeUp>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
