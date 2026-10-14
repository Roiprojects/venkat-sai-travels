import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Plane, MapPin, Briefcase, Car, Crown, Heart, Users, Mountain, Star, Compass, Hotel, Clock, ArrowRight, CheckCircle } from 'lucide-react'
import { IMAGES } from '../data/images'
import FadeUp from '../components/ui/FadeUp'
import CTABanner from '../components/home/CTABanner'
import { api } from '../api'

const ICON_MAP: Record<string, React.ElementType> = {
  Plane, MapPin, Briefcase, Car, Crown, Heart, Users, Mountain, Star, Compass, Hotel, Clock
}

const SERVICE_PHOTOS: Record<number, string> = {
  1: IMAGES.airport, 2: IMAGES.outstation, 3: IMAGES.corporate, 4: IMAGES.blackCar,
  5: IMAGES.vip, 6: IMAGES.wedding, 7: IMAGES.employeeTransport, 8: IMAGES.pilgrimage,
  9: IMAGES.eventTransport, 10: IMAGES.family, 11: IMAGES.hotelTransfers, 12: IMAGES.hourlyRental,
}

const SERVICE_HOVER_PHOTOS: Record<number, string> = {
  1: '/images/white_ciaz_sedan.jpg', 2: '/images/innova_family_outstation.png',
  3: '/images/blue_ciaz_sedan.jpg', 4: '/images/etios_sedan_reveal.png',
  5: '/images/chauffeur_door_reveal.png', 6: '/images/wedding_cars_reveal.png',
  7: '/images/urbania_employee_reveal.png', 8: '/images/pilgrimage_tempo_reveal.png',
  9: '/images/event_bus_reveal.png', 10: '/images/innova_family_outstation.png',
  11: '/images/white_ciaz_sedan.jpg',
}

const SERVICE_PHOTO_ALIGNMENT: Record<number, string> = {
  4: 'object-center', 5: 'object-[center_35%]', 6: 'object-center',
}

const FALLBACK_SERVICES = [
  { id: 1, icon: 'Plane', title: 'Airport Transfers', desc: 'Punctual airport pickup & drop with flight tracking.', vehicles: ['Sedan','SUV','Innova'] },
  { id: 2, icon: 'MapPin', title: 'Outstation Trips', desc: 'Comfortable one-way and round trip outstation travel across South India.', vehicles: ['Innova','Etios','Tempo'] },
  { id: 3, icon: 'Briefcase', title: 'Corporate Travel', desc: 'Dedicated corporate account management with billing and 24/7 support.', vehicles: ['Executive Sedan','Luxury SUV','Bus'] },
  { id: 4, icon: 'Car', title: 'Car Rentals', desc: 'Hourly and daily car rentals for local city travel and sightseeing.', vehicles: ['Innova Crysta','Etios Sedan','SUV'] },
  { id: 5, icon: 'Crown', title: 'Luxury Chauffeur', desc: 'VIP chauffeur-driven luxury cars for high-profile clients.', vehicles: ['Luxury Sedan','Luxury SUV'] },
  { id: 6, icon: 'Heart', title: 'Wedding Transport', desc: 'Elegant wedding fleet packages including decorated cars and guest vehicles.', vehicles: ['Wedding Coach','Luxury Cars','Tempo'] },
  { id: 7, icon: 'Users', title: 'Employee Transport', desc: 'Reliable daily employee pickup & drop for IT parks and offices.', vehicles: ['Staff Shuttle','Urbania','Tempo'] },
  { id: 8, icon: 'Mountain', title: 'Pilgrimage Tours', desc: 'Comfortable pilgrimage packages to Tirupati, Shirdi, Vaishno Devi.', vehicles: ['Innova','Tempo','Bus'] },
  { id: 9, icon: 'Star', title: 'Event Transportation', desc: 'Full logistics management for corporate events and large gatherings.', vehicles: ['Event Fleet','Luxury Bus','Mini Bus'] },
  { id: 10, icon: 'Compass', title: 'Family Trips', desc: 'Curated family holiday packages with comfortable vehicles.', vehicles: ['Innova','Tempo','Urbania'] },
  { id: 11, icon: 'Hotel', title: 'Hotel Transfers', desc: 'Seamless transfers between hotels and tourist spots across Karnataka.', vehicles: ['Sedan','SUV','Innova'] },
  { id: 12, icon: 'Clock', title: 'Hourly Rental', desc: 'Flexible hourly package rentals for city meetings and short-term needs.', vehicles: ['Sedan','SUV'] },
]

export default function Services() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const data = await api.services()
        if (cancelled) return
        setItems(Array.isArray(data) && data.length ? data : FALLBACK_SERVICES)
      } catch {
        if (!cancelled) setItems(FALLBACK_SERVICES)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    const interval = setInterval(load, 5000)
    return () => { cancelled = true; clearInterval(interval) }
  }, [])

  if (loading) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
        <section className="pt-36 pb-20 px-4 sm:px-8 lg:px-16 bg-[#FAFAF8] relative overflow-hidden border-b border-[#E5E5E5]">
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-brand-500 to-brand-700" />
          <div className="max-w-7xl mx-auto relative z-10">
            <span className="badge-red mb-4 block w-fit">Services</span>
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#171717] mb-4 tracking-tight">
              All <span className="text-[#B5121B]">Services</span>
            </h1>
          </div>
        </section>
        <section className="section-padding bg-white">
          <div className="max-w-7xl mx-auto flex items-center justify-center py-24">
            <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
          </div>
        </section>
      </motion.div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
      <link rel="preload" as="image" href="/images/innova_family_outstation.png" />
      <link rel="preload" as="image" href="/images/blue_ciaz_sedan.jpg" />
      <link rel="preload" as="image" href="/images/white_ciaz_sedan.jpg" />
      <link rel="preload" as="image" href="/images/chauffeur_door_reveal.png" />
      <link rel="preload" as="image" href="/images/etios_sedan_reveal.png" />
      <link rel="preload" as="image" href="/images/wedding_cars_reveal.png" />
      <link rel="preload" as="image" href="/images/urbania_employee_reveal.png" />
      <link rel="preload" as="image" href="/images/pilgrimage_tempo_reveal.png" />
      <link rel="preload" as="image" href="/images/event_bus_reveal.png" />

      <section className="pt-36 pb-20 px-4 sm:px-8 lg:px-16 bg-[#FAFAF8] relative overflow-hidden border-b border-[#E5E5E5]">
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-brand-500 to-brand-700" />
        <div className="max-w-7xl mx-auto relative z-10">
          <FadeUp>
            <span className="badge-red mb-4 block w-fit">Services</span>
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#171717] mb-4 tracking-tight">
              All <span className="text-[#B5121B]">Services</span>
            </h1>
            <div className="w-16 h-1 bg-gradient-to-r from-brand-500 to-brand-700 rounded-full mb-6" />
            <p className="text-[#555555] text-base sm:text-lg max-w-2xl leading-relaxed font-light">
              Comprehensive travel solutions tailored for every occasion — from airport transfers
              to luxury corporate commutes across South India.
            </p>
          </FadeUp>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto space-y-12">
          {items.map((service: any, i: number) => {
            const Icon = ICON_MAP[service.icon] || Car
            const id = service.id ?? (i + 1)
            const img = SERVICE_PHOTOS[id] || IMAGES.airport
            const hoverImg = SERVICE_HOVER_PHOTOS[id]
            const isEven = i % 2 === 0
            const badgeLabel = service.vehicles?.[0] || service.title || 'Premium'
            const alignClass = SERVICE_PHOTO_ALIGNMENT[id] || 'object-center'
            const vehicles = Array.isArray(service.vehicles) ? service.vehicles : []

            return (
              <FadeUp key={id} delay={0.05}>
                <div className="grid lg:grid-cols-2 gap-8 items-center bg-[#FAFAF8] rounded-3xl p-6 sm:p-10 border border-[#E5E5E5] shadow-card hover:shadow-card-hover hover:border-brand-300 transition-all duration-400 group">
                  <div className={`relative h-64 sm:h-80 rounded-2xl overflow-hidden bg-neutral-100 select-none ${isEven ? '' : 'lg:order-2'}`}>
                    <img src={img} alt={service.title} className={`absolute inset-0 w-full h-full object-cover ${alignClass} transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.02] ${hoverImg ? 'group-hover:opacity-0' : ''}`} />
                    {hoverImg && (
                      <img src={hoverImg} alt={`${service.title} - Vehicle`} className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.02]" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none z-10" />
                    <div className="absolute bottom-4 left-4 z-20">
                      <span className="text-xs font-button font-bold text-white bg-[#B5121B] px-3.5 py-1 rounded-full shadow-md inline-block transform transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:shadow-lg">
                        {badgeLabel}
                      </span>
                    </div>
                  </div>
                  <div className={`${isEven ? '' : 'lg:order-1'} flex flex-col justify-center`}>
                    <div className="w-12 h-12 rounded-2xl bg-brand-50 border border-brand-200/80 flex items-center justify-center mb-4 shadow-sm">
                      <Icon size={22} className="text-brand-600" />
                    </div>
                    <h3 className="font-heading text-2xl sm:text-3xl font-bold text-[#171717] mb-3">{service.title}</h3>
                    <p className="text-[#555555] text-sm sm:text-base leading-relaxed mb-6 font-light">{service.desc}</p>
                    <div className="mb-6">
                      <p className="text-xs font-button font-bold text-[#171717] uppercase tracking-wider mb-2">Available Vehicles</p>
                      <div className="flex flex-wrap gap-2">
                        {vehicles.map((v: string) => (
                          <span key={v} className="text-xs font-button text-brand-700 bg-white border border-[#E5E5E5] px-3 py-1 rounded-full shadow-sm font-semibold">{v}</span>
                        ))}
                      </div>
                    </div>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
                      {['Punctual Chauffeur', 'Clean & Sanitized', '24/7 Support', 'GST Invoice'].map(f => (
                        <li key={f} className="flex items-center gap-2 text-xs sm:text-sm text-[#555555]">
                          <CheckCircle size={14} className="text-brand-600 flex-shrink-0" />{f}
                        </li>
                      ))}
                    </ul>
                    <Link to={`/booking?service=${encodeURIComponent(service.title)}`} className="btn-primary text-xs sm:text-sm py-3 px-6 shadow-brand w-fit">
                      <span className="relative z-10 flex items-center justify-center gap-2">Book This Service <ArrowRight size={14} /></span>
                    </Link>
                  </div>
                </div>
              </FadeUp>
            )
          })}
        </div>
      </section>

      <CTABanner />
    </motion.div>
  )
}
