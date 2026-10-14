import { Link } from 'react-router-dom'
import { UserCheck, CreditCard, Star, Clock, Building2 } from 'lucide-react'
import FadeUp from '../ui/FadeUp'
import { IMAGES } from '../../data/images'

const BENEFITS = [
  { icon: UserCheck,  title: 'Dedicated Account Manager', desc: 'Single point of contact for all corporate travel needs.' },
  { icon: CreditCard, title: 'Monthly Billing',            desc: 'Consolidated invoicing with GST for easy expense management.' },
  { icon: Star,       title: 'Priority Booking',           desc: 'Guaranteed vehicle availability even during peak demand.' },
  { icon: Clock,      title: '24/7 Support',               desc: 'Round-the-clock assistance for last-minute changes.' },
]

export default function Corporate() {
  return (
    <section className="section-padding bg-[#FAFAF8] relative overflow-hidden">
      {/* Preload blue Ciaz sedan image for instant zero-lag hover crossfade */}
      <link rel="preload" as="image" href="/images/blue_ciaz_sedan.jpg" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left: photo card with stats overlay & smooth blue Ciaz hover crossfade */}
          <FadeUp>
            <div className="relative rounded-3xl overflow-hidden shadow-xl border border-[#E5E5E5] h-[440px] bg-neutral-100 group select-none">
              {/* Layer 1: Existing Corporate Cover Image (Night City Architecture) */}
              <img
                src={IMAGES.corporate}
                alt="Corporate Travel"
                className="absolute inset-0 w-full h-full object-cover transition-all duration-600 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.02] group-hover:opacity-0"
              />

              {/* Layer 2: Photorealistic Blue Suzuki Ciaz Sedan on Hover */}
              <img
                src="/images/blue_ciaz_sedan.jpg"
                alt="Corporate Travel - Blue Suzuki Ciaz Sedan"
                className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-all duration-600 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.02]"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none z-10" />

              {/* Floating stats */}
              <div className="absolute bottom-6 left-6 right-6 z-20">
                <div className="grid grid-cols-3 gap-3">
                  {[['200+', 'Corporate Clients'], ['22+', 'Years Experience'], ['24/7', 'Available']].map(([v, l]) => (
                    <div key={l} className="bg-white/95 backdrop-blur-md border border-white rounded-2xl p-3 text-center shadow-md">
                      <p className="font-heading text-xl sm:text-2xl font-bold text-[#171717] leading-none mb-1">{v}</p>
                      <p className="text-brand-600 text-[11px] font-button leading-tight font-bold">{l}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top badge */}
              <div className="absolute top-5 left-5 z-20">
                <span className="inline-flex items-center gap-1.5 bg-[#B5121B] text-white text-xs font-button font-bold px-3.5 py-1.5 rounded-full shadow-md">
                  <Building2 size={12} />Corporate Solutions
                </span>
              </div>
            </div>
          </FadeUp>

          {/* Right: text + benefits */}
          <FadeUp delay={0.15}>
            <span className="badge-red mb-4 block w-fit">Trusted Partner</span>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-[#171717] leading-tight mb-4">
              Trusted by <span className="text-[#B5121B]">500+</span><br />Businesses
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-brand-500 to-brand-700 rounded-full mb-6" />
            <p className="text-[#555555] text-base leading-relaxed mb-8 font-light">
              From IT parks to corporate campuses, Venkat Sai Travels is the preferred travel partner
              for businesses across Bangalore. Our solutions are designed for reliability, efficiency,
              and cost-effectiveness.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
              {BENEFITS.map((b) => {
                const Icon = b.icon
                return (
                  <div key={b.title} className="flex items-start gap-3.5 group">
                    <div className="w-10 h-10 rounded-2xl bg-white border border-[#E5E5E5] flex items-center justify-center flex-shrink-0 group-hover:bg-[#B5121B] transition-all duration-300 shadow-sm">
                      <Icon size={18} className="text-brand-600 group-hover:text-white transition-colors duration-300" />
                    </div>
                    <div>
                      <h4 className="font-heading text-sm font-bold text-[#171717] mb-1">{b.title}</h4>
                      <p className="text-[#666666] text-xs leading-relaxed font-light">{b.desc}</p>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="flex gap-3.5 flex-wrap">
              <Link to="/contact" className="btn-primary shadow-brand">Get Corporate Quote</Link>
              <a href="mailto:Ls.babu@yahoo.com" className="btn-outline">Email Us</a>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  )
}
