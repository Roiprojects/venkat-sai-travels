import { Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { MapPin, ArrowRight } from 'lucide-react'
import { IMAGES } from '../../data/images'
import SectionHeader from '../ui/SectionHeader'
import FadeUp from '../ui/FadeUp'
import { useAdminData } from '../../hooks/useAdminData'

const FALLBACK_DESTINATIONS = [
  { name: 'Mysore', distance: '150 km', time: '3 hrs', tag: 'Most Popular', gradient: 'from-amber-900/80 to-amber-950/90', image: '/images/mysore_palace_cover.png' },
  { name: 'Coorg', distance: '250 km', time: '5 hrs', tag: 'Trending', gradient: 'from-green-900/80 to-green-950/90', image: '' },
  { name: 'Ooty', distance: '270 km', time: '6 hrs', tag: 'Weekend Getaway', gradient: 'from-blue-900/80 to-blue-950/90', image: '' },
  { name: 'Chennai', distance: '350 km', time: '6 hrs', tag: 'City Connect', gradient: 'from-orange-900/80 to-orange-950/90', image: '' },
  { name: 'Hyderabad', distance: '570 km', time: '10 hrs', tag: 'Overnight Option', gradient: 'from-purple-900/80 to-purple-950/90', image: '' },
  { name: 'Goa', distance: '560 km', time: '10 hrs', tag: 'Beach Escape', gradient: 'from-teal-900/80 to-teal-950/90', image: '' },
]

const DEST_PHOTOS: Record<string, string> = {
  Mysore:    IMAGES.mysore,
  Coorg:     IMAGES.coorg,
  Ooty:      IMAGES.ooty,
  Chennai:   IMAGES.chennai,
  Hyderabad: IMAGES.hyderabad,
  Goa:       IMAGES.goa,
}

export default function Destinations() {
  const { destinations } = useAdminData()
  const items = destinations?.length ? destinations : FALLBACK_DESTINATIONS

  return (
    <section className="section-padding bg-[#FAFAF8] relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-[#E5E5E5]" />

      <div className="max-w-7xl mx-auto relative z-10">
        <SectionHeader
          badge="Popular Routes"
          title="Top Travel"
          highlight="Destinations"
          subtitle="Explore India's most scenic destinations with our premium outstation chauffeur service."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((dest, i) => {
            const photo = DEST_PHOTOS[dest.name] || dest.image || IMAGES.mysore
            return (
              <FadeUp key={dest.name} delay={i * 0.07}>
                <div className="bg-white rounded-3xl overflow-hidden border border-[#E5E5E5] shadow-card hover:shadow-card-hover hover:border-brand-300 hover:-translate-y-1.5 transition-all duration-400 group flex flex-col h-full">
                  <div className="relative h-52 overflow-hidden bg-neutral-100">
                    <img
                      src={photo}
                      alt={dest.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute top-3.5 right-3.5">
                      <span className="text-xs font-button font-bold text-[#171717] bg-white/95 backdrop-blur-md px-3 py-1 rounded-full shadow-sm">
                        {dest.time}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 bg-white flex flex-col flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-heading text-xl font-bold text-[#171717] group-hover:text-brand-600 transition-colors">
                        {dest.name}
                      </h3>
                      <span className="text-xs font-button text-[#666666] flex items-center gap-1 font-medium">
                        <MapPin size={12} className="text-brand-600" />{dest.distance}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-5 mt-2">
                      <span className="text-[11px] font-button text-brand-700 bg-brand-50 border border-brand-200/80 px-2.5 py-0.5 rounded-full font-semibold">
                        {dest.tag}
                      </span>
                    </div>

                    <Link
                      to="/booking"
                      search={{ destination: dest.name } as any}
                      className="w-full btn-primary text-xs sm:text-sm py-3 px-4 shadow-brand mt-auto"
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">Book Route <ArrowRight size={14} /></span>
                    </Link>
                  </div>
                </div>
              </FadeUp>
            )
          })}
        </div>
      </div>
    </section>
  )
}
