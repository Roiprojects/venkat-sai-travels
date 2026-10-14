import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, Calendar, Clock, Car, Phone, Mail, User, Shield, CheckCircle, ArrowRight, Users, Fuel } from 'lucide-react'
import { COMPANY, CALL_URL, FLEET } from '../data/constants'
import { api } from '../api'
import FadeUp from '../components/ui/FadeUp'

const TRIP_TYPES = ['Airport Pickup', 'Airport Drop', 'Round Trip', 'Outstation', 'Local', 'Corporate', 'Wedding', 'Pilgrimage']

function normalizeFleet(raw: any[]): typeof FLEET {
  return raw.map(v => ({
    id:   v.id   ?? Math.random(),
    name: v.name ?? '',
    category: v.category ?? '',
    seats:    v.seats    ?? 4,
    fuel:     v.fuel     ?? 'Diesel',
    ac:       v.ac       ?? true,
    features: Array.isArray(v.features) ? v.features : [],
    color: v.color ?? 'from-slate-800 to-slate-900',
  }))
}

export default function Booking() {
  const [params] = useSearchParams()

  const qPickup = params.get('pickup') || ''
  const qDrop = params.get('drop') || ''
  const qDate = params.get('date') || ''
  const qTime = params.get('time') || ''
  const qTrip = params.get('trip') || ''
  const qVehicle = params.get('vehicle') || ''

  const [form, setForm] = useState({
    tripType: qTrip || 'Outstation',
    pickup: qPickup,
    drop: qDrop,
    date: qDate,
    time: qTime,
    vehicle: qVehicle,
    name: '',
    phone: '',
    email: '',
    passengers: '1',
    notes: '',
  })

  const [fleetItems, setFleetItems] = useState<typeof FLEET>(FLEET)

  useEffect(() => {
    ;(async () => {
      try {
        const data = await api.fleet()
        if (Array.isArray(data) && data.length) { setFleetItems(normalizeFleet(data)); return }
      } catch {}
      setFleetItems(normalizeFleet(FLEET))
    })()
  }, [])

  useEffect(() => {
    if (qDrop && !qTrip) setForm(f => ({ ...f, drop: qDrop, tripType: 'Outstation' }))
  }, [qDrop, qTrip])

  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      await api.submitBooking({
        trip_type: form.tripType,
        pickup: form.pickup,
        drop: form.drop,
        date: form.date,
        time: form.time,
        vehicle: form.vehicle,
        name: form.name,
        phone: form.phone,
        email: form.email,
        passengers: form.passengers,
        notes: form.notes,
      })
      setSubmitted(true)
    } catch (err: any) {
      setError(err.message || 'Booking failed. Please try again or call us directly.')
    } finally {
      setSaving(false)
    }
  }

  const inputClass = "w-full bg-[#FAFAF8] border border-[#E5E5E5] text-[#222222] text-sm rounded-2xl px-4 py-3 placeholder-[#888888] focus:outline-none focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-500/10 transition-all duration-300 font-body"

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
      {/* Page Hero */}
      <section className="pt-36 pb-16 px-4 sm:px-8 lg:px-16 bg-[#FAFAF8] relative overflow-hidden border-b border-[#E5E5E5]">
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-brand-500 to-brand-700" />
        <div className="max-w-7xl mx-auto relative z-10">
          <FadeUp>
            <span className="badge-red mb-4 block w-fit">Reservation</span>
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#171717] mb-4 tracking-tight">
              Instant <span className="text-[#B5121B]">Booking</span>
            </h1>
            <div className="w-16 h-1 bg-gradient-to-r from-brand-500 to-brand-700 rounded-full mb-6" />
          </FadeUp>
        </div>
      </section>

      {/* Booking Form Section */}
      <section className="section-padding bg-white">
        <div className="max-w-4xl mx-auto">
          <FadeUp>
            <div className="bg-[#FAFAF8] rounded-3xl p-6 sm:p-12 border border-[#E5E5E5] shadow-card relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brand-500 via-brand-600 to-brand-700" />

              {submitted ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle size={40} className="text-emerald-600" />
                  </div>
                  <h2 className="font-heading text-3xl font-bold text-[#171717] mb-3">Booking Received!</h2>
                  <p className="text-[#555555] text-base max-w-md mx-auto font-light">
                    Your booking has been submitted successfully. Our team will review and confirm your ride shortly.
                  </p>
                </div>
              ) : (
                <>
                  <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Step 1: Trip Type */}
                  <div>
                    <h3 className="font-heading text-lg font-bold text-[#171717] mb-4 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-[#B5121B] text-white text-xs flex items-center justify-center font-bold">1</span>
                      Select Trip Type
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {TRIP_TYPES.map(t => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setForm({ ...form, tripType: t })}
                          className={`text-xs font-button py-3 px-3.5 rounded-2xl border transition-all duration-200 text-left font-semibold ${
                            form.tripType === t
                              ? 'bg-[#B5121B] text-white border-[#B5121B] shadow-brand'
                              : 'bg-white text-[#555555] border-[#E5E5E5] hover:border-brand-300'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Step 2: Journey Details */}
                  <div>
                    <h3 className="font-heading text-lg font-bold text-[#171717] mb-4 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-[#B5121B] text-white text-xs flex items-center justify-center font-bold">2</span>
                      Journey Details
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="relative">
                        <label className="block text-xs font-button font-bold text-[#171717] uppercase tracking-wider mb-1.5">Pickup Location *</label>
                        <div className="relative">
                          <MapPin size={15} className="absolute left-3.5 top-3.5 text-brand-600 pointer-events-none" />
                          <input className={`${inputClass} pl-10`} placeholder="Airport / Hotel / Area" required value={form.pickup} onChange={e => setForm({ ...form, pickup: e.target.value })} />
                        </div>
                      </div>
                      <div className="relative">
                        <label className="block text-xs font-button font-bold text-[#171717] uppercase tracking-wider mb-1.5">Drop Location *</label>
                        <div className="relative">
                          <MapPin size={15} className="absolute left-3.5 top-3.5 text-brand-500 pointer-events-none" />
                          <input className={`${inputClass} pl-10`} placeholder="Destination / Airport / Hotel" required value={form.drop} onChange={e => setForm({ ...form, drop: e.target.value })} />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-button font-bold text-[#171717] uppercase tracking-wider mb-1.5">Date *</label>
                        <div className="relative">
                          <Calendar size={15} className="absolute left-3.5 top-3.5 text-brand-600 pointer-events-none z-10" />
                          <input type="date" className={`${inputClass} pl-10`} required value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} min={new Date().toISOString().split('T')[0]} />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-button font-bold text-[#171717] uppercase tracking-wider mb-1.5">Time *</label>
                        <div className="relative">
                          <Clock size={15} className="absolute left-3.5 top-3.5 text-brand-600 pointer-events-none z-10" />
                          <input type="time" className={`${inputClass} pl-10`} required value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Step 3: Vehicle Selection */}
                  <div>
                    <h3 className="font-heading text-lg font-bold text-[#171717] mb-4 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-[#B5121B] text-white text-xs flex items-center justify-center font-bold">3</span>
                      Select Vehicle
                    </h3>
                    {!form.vehicle && (
                      <p className="text-[#555555] text-xs mb-4 font-light">Choose the vehicle that fits your group size and comfort preference.</p>
                    )}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {fleetItems.map(fleetItem => {
                        const selected = form.vehicle === fleetItem.name
                        return (
                          <button
                            key={fleetItem.id}
                            type="button"
                            onClick={() => setForm({ ...form, vehicle: fleetItem.name })}
                            className={`relative flex flex-col items-center gap-2 p-4 rounded-2xl border-2 text-center transition-all duration-200 cursor-pointer ${
                              selected
                                ? 'border-[#B5121B] bg-[#B5121B]/5 shadow-brand'
                                : 'border-[#E5E5E5] bg-white hover:border-brand-300 hover:shadow-sm'
                            }`}
                          >
                            {selected && (
                              <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#B5121B] flex items-center justify-center">
                                <CheckCircle size={10} className="text-white" />
                              </span>
                            )}
                            <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${fleetItem.color} flex items-center justify-center`}>
                              <Car size={18} className="text-white" />
                            </div>
                            <p className={`text-xs font-semibold font-button leading-tight ${selected ? 'text-[#171717]' : 'text-[#555555]'}`}>
                              {fleetItem.name}
                            </p>
                            <div className="flex items-center gap-2 text-[10px] text-[#888888]">
                              <span className="flex items-center gap-0.5"><Users size={10} />{fleetItem.seats}</span>
                              <span className="flex items-center gap-0.5"><Fuel size={10} />{fleetItem.fuel.split('/')[0]}</span>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Step 4: Contact Information */}
                  <div>
                    <h3 className="font-heading text-lg font-bold text-[#171717] mb-4 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-[#B5121B] text-white text-xs flex items-center justify-center font-bold">4</span>
                      Your Contact Info
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="relative">
                        <label className="block text-xs font-button font-bold text-[#171717] uppercase tracking-wider mb-1.5">Full Name *</label>
                        <div className="relative">
                          <User size={15} className="absolute left-3.5 top-3.5 text-brand-600 pointer-events-none" />
                          <input className={`${inputClass} pl-10`} placeholder="Your Name" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                        </div>
                      </div>
                      <div className="relative">
                        <label className="block text-xs font-button font-bold text-[#171717] uppercase tracking-wider mb-1.5">Mobile Number *</label>
                        <div className="relative">
                          <Phone size={15} className="absolute left-3.5 top-3.5 text-brand-600 pointer-events-none" />
                          <input className={`${inputClass} pl-10`} placeholder="10-digit number" required value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                        </div>
                      </div>
                      <div className="relative">
                        <label className="block text-xs font-button font-bold text-[#171717] uppercase tracking-wider mb-1.5">Email</label>
                        <div className="relative">
                          <Mail size={15} className="absolute left-3.5 top-3.5 text-brand-600 pointer-events-none" />
                          <input type="email" className={`${inputClass} pl-10`} placeholder="your@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Special Requests */}
                  <div>
                    <label className="block text-xs font-button font-bold text-[#171717] uppercase tracking-wider mb-1.5">Special Requests (Optional)</label>
                    <textarea rows={3} className={inputClass} placeholder="Flight number, extra luggage, child seat, route preferences..." value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
                  </div>

                  {/* Trust badge */}
                  <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-[#E5E5E5]">
                    <Shield size={18} className="text-brand-600 flex-shrink-0" />
                    <p className="text-[#555555] text-xs font-light">
                      No upfront payment required for local bookings. 100% free cancellation up to 4 hours before pickup.
                    </p>
                  </div>

                  <button type="submit" disabled={saving} className="w-full btn-primary text-base py-4 px-8 shadow-brand disabled:opacity-60">
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {saving ? 'Submitting...' : 'Submit Booking'} <ArrowRight size={16} />
                    </span>
                  </button>
                </form>
                {error && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                    {error}
                  </div>
                )}
              </>
              )}
            </div>
          </FadeUp>

          {/* Quick Call Box */}
          <div className="mt-8 p-6 bg-white rounded-3xl border border-[#E5E5E5] text-center shadow-sm">
            <p className="text-[#555555] text-sm mb-2 font-light">Prefer to book over a phone call?</p>
            <a href={CALL_URL} className="btn-outline inline-flex items-center gap-2 text-sm py-2.5 px-6 shadow-sm">
              <Phone size={15} />Call +91 {COMPANY.phones[0]}
            </a>
          </div>
        </div>
      </section>
    </motion.div>
  )
}
