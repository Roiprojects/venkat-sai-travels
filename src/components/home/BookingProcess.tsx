import { Phone, CheckCircle, Car, MapPin } from 'lucide-react'
import FadeUp from '../ui/FadeUp'
import SectionHeader from '../ui/SectionHeader'

const STEPS = [
  { step: '01', icon: Phone, title: 'Book', desc: 'Call, WhatsApp, or fill our online form. Takes less than 2 minutes.' },
  { step: '02', icon: CheckCircle, title: 'Confirm', desc: 'Receive instant booking confirmation with driver details and vehicle info.' },
  { step: '03', icon: Car, title: 'Ride', desc: 'Your professional chauffeur arrives on time at your pickup location.' },
  { step: '04', icon: MapPin, title: 'Arrive', desc: 'Enjoy a comfortable journey and arrive at your destination relaxed.' },
]

export default function BookingProcess() {
  return (
    <section className="section-padding bg-[#FAFAF8] relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-[#E5E5E5]" />

      <div className="max-w-7xl mx-auto relative z-10">
        <SectionHeader badge="How It Works" title="Book in" highlight="4 Easy Steps" subtitle="Getting your premium ride is simple, fast, and hassle-free." />

        <div className="relative mt-8">
          {/* Connector line (desktop) */}
          <div className="hidden lg:block absolute top-10 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-transparent via-brand-200 to-transparent" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {STEPS.map((step, i) => {
              const Icon = step.icon
              return (
                <FadeUp key={step.step} delay={i * 0.1}>
                  <div className="text-center group flex flex-col items-center">
                    <div className="relative inline-block mb-6">
                      <div className="w-20 h-20 rounded-3xl border border-[#E5E5E5] flex items-center justify-center bg-white shadow-card group-hover:border-brand-400 group-hover:shadow-brand group-hover:-translate-y-1 transition-all duration-400">
                        <Icon size={26} className="text-brand-600 group-hover:scale-110 transition-transform duration-300" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-[#B5121B] flex items-center justify-center shadow-md">
                        <span className="text-white text-xs font-button font-bold">{i + 1}</span>
                      </div>
                    </div>
                    <h3 className="font-heading text-xl font-bold text-[#171717] mb-2 group-hover:text-brand-600 transition-colors">{step.title}</h3>
                    <p className="text-[#555555] text-xs sm:text-sm leading-relaxed max-w-xs mx-auto font-light">{step.desc}</p>
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
