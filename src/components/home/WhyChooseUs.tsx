import { Clock, UserCheck, Navigation, Sparkles, DollarSign, Timer, Star, Shield } from 'lucide-react'
import FadeUp from '../ui/FadeUp'
import SectionHeader from '../ui/SectionHeader'

const FEATURES = [
  { icon: Clock, title: '24x7 Service', desc: 'Round-the-clock availability for all your travel needs, any time of day or night.' },
  { icon: UserCheck, title: 'Professional Drivers', desc: 'Verified, trained, and courteous chauffeurs with commercial licenses and safety records.' },
  { icon: Navigation, title: 'GPS Enabled', desc: 'Real-time GPS tracking on all vehicles for your safety and peace of mind.' },
  { icon: Sparkles, title: 'Clean Vehicles', desc: 'Sanitized, well-maintained fleet meeting premium cleanliness standards before every trip.' },
  { icon: DollarSign, title: 'Transparent Pricing', desc: 'No hidden charges. What you see is what you pay — GST inclusive always.' },
  { icon: Timer, title: 'On-Time Pickup', desc: 'Punctuality is our promise. We track flights and ensure zero waiting.' },
  { icon: Star, title: 'Premium Experience', desc: 'Every touchpoint — from booking to drop — crafted for a world-class experience.' },
  { icon: Shield, title: 'Insurance Covered', desc: 'Vehicles and passengers covered with comprehensive travel insurance for safe journeys.' },
]

export default function WhyChooseUs() {
  return (
    <section className="section-padding bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <SectionHeader
          badge="Why Choose Us"
          title="The Venkat Sai Travels"
          highlight="Difference"
          subtitle="Every journey with us is a promise of luxury, safety, and reliability."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map((feature, i) => {
            const Icon = feature.icon
            return (
              <FadeUp key={feature.title} delay={i * 0.05}>
                <div className="bg-[#FAFAF8] rounded-3xl p-6 sm:p-7 border border-[#E5E5E5] shadow-card hover:shadow-card-hover hover:border-brand-300 hover:-translate-y-1.5 transition-all duration-400 group cursor-default h-full flex flex-col">
                  <div className="w-12 h-12 rounded-2xl bg-brand-50 border border-brand-200/80 flex items-center justify-center mb-5 group-hover:bg-[#B5121B] transition-all duration-300 shadow-sm">
                    <Icon size={20} className="text-brand-600 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <h3 className="font-heading text-lg font-bold text-[#171717] mb-2 group-hover:text-brand-600 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-[#555555] text-xs sm:text-sm leading-relaxed font-light">{feature.desc}</p>
                </div>
              </FadeUp>
            )
          })}
        </div>
      </div>
    </section>
  )
}
