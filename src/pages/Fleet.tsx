import { useState, useEffect } from 'react'
import { Link } from '@tanstack/react-router'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, Fuel, ArrowRight, CheckCircle, X, Shield, Phone } from 'lucide-react'
import { FLEET, CALL_URL } from '../data/constants'
import { IMAGES } from '../data/images'
import { api } from '../api'
import FadeUp from '../components/ui/FadeUp'
import CTABanner from '../components/home/CTABanner'

const CATEGORIES = ['All', 'SUV', 'Sedan', 'Van', 'Bus', 'Luxury']

const VEHICLE_PHOTOS: Record<string, string> = {
  'Toyota Innova Crysta': IMAGES.innova,
  'PKN Deluxe':           IMAGES.pkn,
  'Urbania 16+1':        IMAGES.urbania,
  'Tempo Traveller':     IMAGES.tempoTrav,
  'Toyota Etios':        IMAGES.etios,
  'Sedan':               IMAGES.luxSedan,
  'Luxury SUV':          IMAGES.luxSUV,
  'Mini Bus':            IMAGES.miniBus,
  'Luxury Bus':          IMAGES.luxBus,
}

export default function Fleet() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [active, setActive] = useState('All')
  const [selected, setSelected] = useState<any>(null)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const data = await api.fleet()
        if (cancelled) return
        if (Array.isArray(data) && data.length) {
          setItems(data)
        } else {
          setItems(FLEET)
        }
      } catch {
        if (cancelled) return
        setItems(FLEET)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    const interval = setInterval(load, 5000)
    return () => { cancelled = true; clearInterval(interval) }
  }, [])

  const getPhoto = (name: string) => VEHICLE_PHOTOS[name] || '/images/car_rentals_cover.png'
  const getFeatures = (item: any) => Array.isArray(item.features) ? item.features : []

  const filtered = active === 'All' ? items : items.filter((v: any) => v.category === active)

  if (loading) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
        <section className="pt-36 pb-20 px-4 sm:px-8 lg:px-16 bg-[#FAFAF8] relative overflow-hidden border-b border-[#E5E5E5]">
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-brand-500 to-brand-700" />
          <div className="max-w-7xl mx-auto relative z-10">
            <FadeUp>
              <span className="badge-red mb-4 block w-fit">Our Fleet</span>
              <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#171717] mb-4 tracking-tight">
                Complete <span className="text-[#B5121B]">Fleet</span>
              </h1>
              <div className="w-16 h-1 bg-gradient-to-r from-brand-500 to-brand-700 rounded-full mb-6" />
              <p className="text-[#555555] text-base sm:text-lg max-w-2xl leading-relaxed font-light">
                Explore our diverse fleet of well-maintained vehicles. Every car is sanitized, insured, and driven by a certified professional chauffeur.
              </p>
            </FadeUp>
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
      <section className="pt-36 pb-20 px-4 sm:px-8 lg:px-16 bg-[#FAFAF8] relative overflow-hidden border-b border-[#E5E5E5]">
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-brand-500 to-brand-700" />
        <div className="max-w-7xl mx-auto relative z-10">
          <FadeUp>
            <span className="badge-red mb-4 block w-fit">Our Fleet</span>
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#171717] mb-4 tracking-tight">
              Complete <span className="text-[#B5121B]">Fleet</span>
            </h1>
            <div className="w-16 h-1 bg-gradient-to-r from-brand-500 to-brand-700 rounded-full mb-6" />
            <p className="text-[#555555] text-base sm:text-lg max-w-2xl leading-relaxed font-light">
              Explore our diverse fleet of well-maintained vehicles. Every car is sanitized, insured, and driven by a certified professional chauffeur.
            </p>
          </FadeUp>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto">
          <FadeUp className="mb-12">
            <div className="flex flex-wrap justify-center gap-2.5">
              {CATEGORIES.map((cat: string) => (
                <button
                  key={cat}
                  onClick={() => setActive(cat)}
                  className={`font-button text-xs sm:text-sm px-6 py-2.5 rounded-full border transition-all duration-300 ${
                    active === cat
                      ? 'bg-[#B5121B] text-white border-[#B5121B] font-bold shadow-brand'
                      : 'text-[#555555] border-[#E5E5E5] hover:border-brand-300 hover:text-brand-600 bg-white shadow-sm'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </FadeUp>

          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            <AnimatePresence mode="popLayout">
              {filtered.map((vehicle, i) => {
                const photo = vehicle.image || VEHICLE_PHOTOS[vehicle.name] || IMAGES.innova
                return (
                  <motion.div
                    key={vehicle.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                    className="bg-white rounded-3xl overflow-hidden border border-[#E5E5E5] shadow-card hover:shadow-card-hover hover:border-brand-300 hover:-translate-y-1.5 transition-all duration-400 group flex flex-col h-full"
                  >
                    <div className="relative h-56 overflow-hidden bg-neutral-100">
                      <img
                        src={photo}
                        alt={vehicle.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                      <div className="absolute top-3.5 left-3.5 flex items-center gap-2">
                        <span className="text-xs font-button font-bold bg-white/95 backdrop-blur-md text-brand-700 border border-white px-3.5 py-1 rounded-full shadow-sm">
                          {vehicle.category}
                        </span>
                        {vehicle.ac && (
                          <span className="text-xs font-button font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full shadow-sm">
                            AC
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="p-6 bg-white flex flex-col flex-1">
                      <h3 className="font-heading text-xl font-bold text-[#171717] mb-1.5 group-hover:text-brand-600 transition-colors">
                        {vehicle.name}
                      </h3>
                      <div className="flex items-center gap-4 text-xs font-button text-[#666666] mb-4 pb-3 border-b border-[#EAEAEA]">
                        <span className="flex items-center gap-1.5"><Users size={14} className="text-brand-600" />{vehicle.seats} Seats</span>
                        <span className="flex items-center gap-1.5"><Fuel size={14} className="text-brand-600" />{vehicle.fuel}</span>
                      </div>
                      <ul className="space-y-2 mb-6">
                        {getFeatures(vehicle).map((f: string) => (
                          <li key={f} className="flex items-center gap-2 text-xs sm:text-sm text-[#555555]">
                            <CheckCircle size={14} className="text-brand-600 flex-shrink-0" />{f}
                          </li>
                        ))}
                      </ul>

                      <div className="grid grid-cols-2 gap-2 mt-auto">
                        <button
                          onClick={() => setSelected(vehicle)}
                          className="btn-outline text-xs py-3 px-3 shadow-sm"
                        >
                          View Details
                        </button>
                        <Link
                          to="/booking"
                          search={{ vehicle: vehicle.name } as any}
                          className="btn-primary text-xs py-3 px-3 shadow-brand"
                        >
                          <span className="relative z-10 flex items-center justify-center gap-1.5">Book Now <ArrowRight size={13} /></span>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      <AnimatePresence>
        {selected && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-[#E5E5E5] relative"
            >
              <div className="relative h-60 bg-neutral-100">
                <img
                  src={VEHICLE_PHOTOS[selected.name] || IMAGES.innova}
                  alt={selected.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <button
                  onClick={() => setSelected(null)}
                  className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 text-[#222222] hover:text-brand-600 flex items-center justify-center shadow-md transition-colors"
                >
                  <X size={18} />
                </button>
                <div className="absolute bottom-4 left-4">
                  <span className="text-xs font-button font-bold bg-[#B5121B] text-white px-3.5 py-1 rounded-full shadow-md">
                    {selected.category}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="font-heading text-2xl font-bold text-[#171717] mb-2">{selected.name}</h3>
                <div className="flex items-center gap-4 text-xs font-button text-[#666666] mb-4 pb-4 border-b border-[#EAEAEA]">
                  <span className="flex items-center gap-1.5"><Users size={14} className="text-brand-600" />{selected.seats} Seater</span>
                  <span className="flex items-center gap-1.5"><Fuel size={14} className="text-brand-600" />{selected.fuel}</span>
                  <span className="flex items-center gap-1.5"><Shield size={14} className="text-brand-600" />Fully Insured</span>
                </div>

                <div className="space-y-2 mb-6">
                  <p className="text-xs font-button font-bold text-[#171717] uppercase tracking-wider">Features & Amenities</p>
                  <div className="grid grid-cols-2 gap-2">
                    {selected.features.map((f: string) => (
                      <span key={f} className="flex items-center gap-1.5 text-xs text-[#555555]">
                        <CheckCircle size={13} className="text-brand-600 flex-shrink-0" />{f}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Link
                    to="/booking"
                    search={{ vehicle: selected.name } as any}
                    onClick={() => setSelected(null)}
                    className="btn-primary text-center text-xs py-3.5 rounded-full"
                  >
                    Book This Vehicle
                  </Link>
                  <a
                    href={CALL_URL}
                    className="btn-outline text-center text-xs py-3.5 rounded-full flex items-center justify-center gap-1.5"
                  >
                    <Phone size={14} />Call for Rates
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <CTABanner />
    </motion.div>
  )
}
