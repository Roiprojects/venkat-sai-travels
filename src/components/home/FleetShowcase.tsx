import { useState, useEffect } from 'react'
import { Link } from '@tanstack/react-router'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, Fuel, ArrowRight, CheckCircle, Car } from 'lucide-react'
import { IMAGES } from '../../data/images'
import SectionHeader from '../ui/SectionHeader'
import FadeUp from '../ui/FadeUp'
import { useAdminData } from '../../hooks/useAdminData'

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

const FALLBACK_FLEET = [
  { id: 1, name: 'Toyota Innova Crysta', category: 'SUV', seats: 7, fuel: 'Diesel', ac: true, features: ['GPS Tracked','Luxury Interior','Ample Luggage'], image: '/images/innova_crysta.jpg' },
  { id: 2, name: 'PKN Deluxe', category: 'Van', seats: 9, fuel: 'Diesel', ac: true, features: ['9 Seater','Reclining Seats','Reading Lights'], image: '/images/mini_bus.png' },
  { id: 3, name: 'Urbania 16+1', category: 'Bus', seats: 17, fuel: 'Diesel', ac: true, features: ['16+1 Seater','Push-back Seats','USB Charging'], image: '/images/urbania.png' },
  { id: 4, name: 'Tempo Traveller', category: 'Van', seats: 12, fuel: 'Diesel', ac: true, features: ['12 Seater','Luggage Rack','Comfortable Seats'], image: '/images/tempo_traveller.jpg' },
  { id: 5, name: 'Toyota Etios', category: 'Sedan', seats: 4, fuel: 'Diesel/CNG', ac: true, features: ['Spacious Boot','Fuel Efficient','City & Outstation'], image: '/images/etios.jpg' },
  { id: 6, name: 'Sedan', category: 'Luxury', seats: 4, fuel: 'Petrol', ac: true, features: ['Executive Class','Premium Interior','Chauffeur Driven'], image: '/images/ciaz_sedan.jpg' },
  { id: 7, name: 'Luxury SUV', category: 'Luxury', seats: 6, fuel: 'Petrol', ac: true, features: ['VIP Experience','Panoramic Roof','Captain Seats'], image: '/images/xuv700_suv.jpg' },
  { id: 8, name: 'Mini Bus', category: 'Bus', seats: 24, fuel: 'Diesel', ac: true, features: ['24 Seater','Group Travel','Corporate Events'], image: '/images/mini_bus.png' },
  { id: 9, name: 'Luxury Bus', category: 'Bus', seats: 40, fuel: 'Diesel', ac: true, features: ['40 Seater','Sleeper Available','Premium Finish'], image: '/images/luxury_coach_bus.jpg' },
]

export default function FleetShowcase() {
  const { fleet } = useAdminData()
  const [active, setActive] = useState('All')
  const fleetItems = fleet?.length ? fleet : FALLBACK_FLEET
  const filtered = active === 'All' ? fleetItems : fleetItems.filter(v => v.category === active)

  return (
    <section className="section-padding bg-[#FAFAF8] relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-[#E5E5E5]" />

      <div className="max-w-7xl mx-auto relative z-10">
        <SectionHeader
          badge="Our Fleet"
          title="Premium Vehicle"
          highlight="Collection"
          subtitle="Curated luxury and comfortable vehicles for every occasion."
        />

        <FadeUp>
          <div className="flex flex-wrap justify-center gap-2.5 mb-12">
            {CATEGORIES.map((cat) => (
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

        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((vehicle, i) => {
              const photo = vehicle.image && VEHICLE_PHOTOS[vehicle.name]
                ? VEHICLE_PHOTOS[vehicle.name]
                : vehicle.image || IMAGES.innova
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
                        <span className="text-xs font-button font-semibold text-emerald-700 bg-emerald-50 backdrop-blur-sm border border-emerald-200 px-2.5 py-0.5 rounded-full shadow-sm">
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
                    <ul className="space-y-2 mb-5">
                      {(Array.isArray(vehicle.features) ? vehicle.features : []).map((f: string) => (
                        <li key={f} className="flex items-center gap-2 text-xs sm:text-sm text-[#555555]">
                          <CheckCircle size={14} className="text-brand-600 flex-shrink-0" />{f}
                        </li>
                      ))}
                    </ul>
                    <Link
                      to="/booking"
                      search={{ vehicle: vehicle.name } as any}
                      className="w-full btn-primary text-xs sm:text-sm py-3.5 px-4 shadow-brand mt-auto"
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">Book This Vehicle <ArrowRight size={14} /></span>
                    </Link>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </motion.div>

        <FadeUp className="text-center mt-14">
          <Link to="/fleet" className="btn-outline px-8 py-3.5 shadow-sm">View Full Fleet</Link>
        </FadeUp>
      </div>
    </section>
  )
}
