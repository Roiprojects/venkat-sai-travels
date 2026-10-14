import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import FadeUp from '../ui/FadeUp'
import { useAdminData } from '../../hooks/useAdminData'

const FALLBACK_VEHICLES = [
  { name: 'Innova Crysta', seats: 7, status: 'Available Now', available: true },
  { name: 'Urbania 16+1', seats: 17, status: 'Available Now', available: true },
  { name: 'Etios Sedan', seats: 4, status: 'Available Now', available: true },
  { name: 'Tempo Traveller', seats: 12, status: 'Available Now', available: true },
  { name: 'Luxury SUV', seats: 6, status: 'Book in Advance', available: false },
  { name: 'Luxury Bus', seats: 40, status: 'Book in Advance', available: false },
]

export default function VehicleAvailability() {
  const { availability } = useAdminData()
  const vehicles = availability?.length ? availability : FALLBACK_VEHICLES

  return (
    <section className="section-padding bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          <div className="lg:col-span-5">
            <FadeUp>
              <span className="badge-red mb-4 block w-fit">Real-time Availability</span>
              <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-[#171717] leading-tight mb-4">
                Vehicles Ready to <span className="text-[#B5121B]">Roll</span>
              </h2>
              <div className="w-16 h-1 bg-gradient-to-r from-brand-500 to-brand-700 rounded-full mb-6" />
              <p className="text-[#555555] text-base leading-relaxed mb-8 font-light">
                Our 50+ vehicle fleet is stationed across Bangalore and surrounding areas. Most bookings
                are confirmed in under 30 minutes with a vehicle at your location within the hour.
              </p>
              <div className="flex gap-3.5 flex-wrap">
                <Link to="/booking" className="btn-primary shadow-brand">
                  Book Instantly
                </Link>
                <Link to="/fleet" className="btn-outline">
                  View Full Fleet
                </Link>
              </div>
            </FadeUp>
          </div>

          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
              {vehicles.map((v, i) => (
                <FadeUp key={v.name} delay={i * 0.05} className="h-full">
                  <div className="bg-[#FAFAF8] border border-[#E5E5E5] rounded-2xl px-4 py-3.5 flex items-center justify-between gap-3 h-full min-h-[72px] hover:border-brand-300 hover:shadow-sm hover:-translate-y-0.5 transition-all duration-300">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div
                        className={`w-2.5 h-2.5 rounded-full shrink-0 animate-pulse ${
                          v.available
                            ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]'
                            : 'bg-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.4)]'
                        }`}
                      />
                      <div className="min-w-0">
                        <p className="text-[#171717] text-sm font-button font-bold whitespace-nowrap leading-snug">
                          {v.name}
                        </p>
                        <p className="text-[#666666] text-xs font-medium leading-none mt-0.5">
                          {v.seats} Seater
                        </p>
                      </div>
                    </div>

                    <span
                      className={`text-[11px] sm:text-xs font-button font-semibold px-2.5 sm:px-3 py-1 rounded-full whitespace-nowrap shrink-0 text-center ${
                        v.available
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {v.status}
                    </span>
                  </div>
                </FadeUp>
              ))}

              <FadeUp delay={0.35} className="sm:col-span-2 mt-1">
                <Link
                  to="/booking"
                  className="w-full flex items-center justify-center gap-2 border border-brand-600 text-brand-600 font-button font-bold py-3.5 rounded-2xl bg-white hover:bg-[#B5121B] hover:text-white transition-all duration-300 text-sm shadow-sm"
                >
                  Check Full Availability <ArrowRight size={14} />
                </Link>
              </FadeUp>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
