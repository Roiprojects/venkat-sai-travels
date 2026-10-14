import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plane, MapPin, Briefcase, Car, Crown, Heart, Users, Mountain, Star, Compass, Hotel, Clock } from 'lucide-react'
import { IMAGES } from '../../data/images'
import SectionHeader from '../ui/SectionHeader'
import FadeUp from '../ui/FadeUp'
import { useAdminData } from '../../hooks/useAdminData'

const ICON_MAP: Record<string, React.ElementType> = {
  Plane, MapPin, Briefcase, Car, Crown, Heart, Users, Mountain, Star, Compass, Hotel, Clock
}

const SERVICE_PHOTOS: Record<number, string> = {
  1:  IMAGES.airport,
  2:  IMAGES.outstation,
  3:  IMAGES.corporate,
  4:  IMAGES.blackCar,
  5:  IMAGES.vip,
  6:  IMAGES.wedding,
  7:  IMAGES.employeeTransport,
  8:  IMAGES.pilgrimage,
  9:  IMAGES.eventTransport,
  10: IMAGES.family,
  11: IMAGES.hotelTransfers,
  12: IMAGES.hourlyRental,
}

const SERVICE_HOVER_PHOTOS: Record<number, string> = {
  1:  '/images/white_ciaz_sedan.jpg',
  2:  '/images/innova_family_outstation.png',
  3:  '/images/blue_ciaz_sedan.jpg',
  4:  '/images/etios_sedan_reveal.png',
  5:  '/images/chauffeur_door_reveal.png',
  6:  '/images/wedding_cars_reveal.png',
  7:  '/images/urbania_employee_reveal.png',
  8:  '/images/pilgrimage_tempo_reveal.png',
  9:  '/images/event_bus_reveal.png',
  10: '/images/innova_family_outstation.png',
  11: '/images/white_ciaz_sedan.jpg',
}

const SERVICE_PHOTO_ALIGNMENT: Record<number, string> = {
  4: 'object-center',
  5: 'object-[center_35%]',
  6: 'object-center',
}

export default function ServicesGrid() {
  const { services } = useAdminData()
  const items = services?.length ? services : []

  return (
    <section className="section-padding bg-white relative overflow-hidden">
      <link rel="preload" as="image" href="/images/innova_family_outstation.png" />
      <link rel="preload" as="image" href="/images/blue_ciaz_sedan.jpg" />
      <link rel="preload" as="image" href="/images/white_ciaz_sedan.jpg" />
      <link rel="preload" as="image" href="/images/chauffeur_door_reveal.png" />
      <link rel="preload" as="image" href="/images/etios_sedan_reveal.png" />
      <link rel="preload" as="image" href="/images/wedding_cars_reveal.png" />
      <link rel="preload" as="image" href="/images/urbania_employee_reveal.png" />
      <link rel="preload" as="image" href="/images/pilgrimage_tempo_reveal.png" />
      <link rel="preload" as="image" href="/images/event_bus_reveal.png" />

      <div className="max-w-7xl mx-auto relative z-10">
        <SectionHeader
          badge="What We Offer"
          title="Our Premium"
          highlight="Services"
          subtitle="From airport transfers to pilgrimage tours, every mile covered with excellence."
        />

        {items.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mt-12">
            {items.map((service: any, i: number) => {
              const Icon = ICON_MAP[service.icon] || Car
              const photo = SERVICE_PHOTOS[service.id] || IMAGES.airport
              const hoverPhoto = SERVICE_HOVER_PHOTOS[service.id]
              const alignClass = SERVICE_PHOTO_ALIGNMENT[service.id] || 'object-center'
              const badgeLabel = service.vehicles?.[0] || 'Premium'

              return (
                <FadeUp key={service.id} delay={i * 0.04}>
                  <div className="bg-white rounded-3xl overflow-hidden border border-[#E5E5E5] shadow-card hover:shadow-card-hover hover:border-brand-300 hover:-translate-y-1.5 transition-all duration-400 group cursor-default h-full flex flex-col">
                    <div className="relative h-44 overflow-hidden flex-shrink-0 bg-neutral-100 select-none">
                      <img
                        src={photo}
                        alt={service.title}
                        className={`absolute inset-0 w-full h-full object-cover ${alignClass} transition-all duration-600 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.02] ${
                          hoverPhoto ? 'group-hover:opacity-0' : ''
                        }`}
                      />
                      {hoverPhoto && (
                        <img
                          src={hoverPhoto}
                          alt={`${service.title} - Vehicle`}
                          className="absolute inset-0 w-full h-full object-cover object-center opacity-0 group-hover:opacity-100 transition-all duration-600 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.02]"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent group-hover:from-black/50 transition-all duration-500 pointer-events-none z-10" />
                      <div className="absolute bottom-3 left-4 z-20 flex items-center gap-2">
                        <div className="w-10 h-10 rounded-2xl bg-white/90 backdrop-blur-md border border-white flex items-center justify-center shadow-md group-hover:scale-105 group-hover:bg-[#B5121B] group-hover:text-white transition-all duration-300">
                          <Icon size={18} className="text-brand-600 group-hover:text-white" />
                        </div>
                        {badgeLabel && (
                          <span className="text-[11px] font-button font-bold text-white bg-[#B5121B] px-3 py-1 rounded-full shadow-md transform transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:shadow-lg">
                            {badgeLabel}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="p-5 flex flex-col flex-1 bg-white">
                      <h3 className="font-heading text-lg font-bold text-[#171717] mb-2 group-hover:text-brand-600 transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-[#555555] text-xs sm:text-sm leading-relaxed flex-1 mb-4 font-light">{service.desc}</p>
                      <div className="flex flex-wrap gap-1.5 mt-auto pt-3 border-t border-[#EAEAEA]">
                        {service.vehicles?.map((v: string) => (
                          <span key={v} className="text-[11px] font-button font-medium text-brand-700 bg-brand-50 border border-brand-200/80 px-2.5 py-0.5 rounded-full">
                            {v}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </FadeUp>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-20 text-[#888888]">Loading services...</div>
        )}

        <FadeUp className="text-center mt-14">
          <Link to="/services" className="btn-primary px-8 py-3.5 shadow-brand">
            View All Services
          </Link>
        </FadeUp>
      </div>
    </section>
  )
}
