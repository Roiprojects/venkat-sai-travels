import { useState, useRef, useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion'
import { MapPin, Calendar, Clock, Car, ArrowRight, Sparkles } from 'lucide-react'
import { COMPANY } from '../../data/constants'

const TRIP_TYPES = [
  'Airport Pickup',
  'Airport Drop',
  'Round Trip',
  'Outstation',
  'Local',
  'Corporate',
  'Wedding',
  'Hourly'
]

const VEHICLES = [
  'Etios Sedan',
  'Innova Crysta',
  'PKN Deluxe 9-Seater',
  'Urbania 16+1',
  'Tempo Traveller',
  'Sedan',
  'Luxury SUV',
  'Mini Bus',
  'Luxury Bus'
]

export default function BookingCard() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    pickup: '',
    drop: '',
    tripType: 'One Way',
    date: '',
    time: '',
    vehicle: ''
  })
  const [isHovered, setIsHovered] = useState(false)
  const [isTouchDevice, setIsTouchDevice] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0)
  }, [])

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const springConfig = { damping: 25, stiffness: 180, mass: 0.5 }
  const smoothX = useSpring(x, springConfig)
  const smoothY = useSpring(y, springConfig)

  const rotateX = useTransform(smoothY, [-0.5, 0.5], [1.8, -1.8])
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-1.8, 1.8])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isTouchDevice || shouldReduceMotion) return
    const rect = cardRef.current?.getBoundingClientRect()
    if (!rect) return
    const clientX = (e.clientX - rect.left) / rect.width - 0.5
    const clientY = (e.clientY - rect.top) / rect.height - 0.5
    x.set(clientX)
    y.set(clientY)
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    x.set(0)
    y.set(0)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    navigate({
      to: '/booking',
      search: {
        pickup: form.pickup,
        drop: form.drop,
        trip: form.tripType,
        date: form.date,
        time: form.time,
        vehicle: form.vehicle,
      } as any,
    })
  }

  const inputClass =
    'w-full bg-white/70 backdrop-blur-sm border border-white/80 text-[#222222] text-sm rounded-xl px-4 py-2.5 placeholder-[#888888] focus:outline-none focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-500/10 transition-all duration-300 font-body shadow-2xs'

  return (
    <div style={{ perspective: 1000 }} className="w-full">
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX: isTouchDevice || shouldReduceMotion ? 0 : rotateX,
          rotateY: isTouchDevice || shouldReduceMotion ? 0 : rotateY,
          transformStyle: 'preserve-3d',
        }}
        whileHover={
          shouldReduceMotion
            ? undefined
            : {
                y: -7,
                scale: 1.015,
                transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
              }
        }
        whileTap={{ scale: 0.99 }}
        className={`relative bg-white/80 backdrop-blur-xl rounded-3xl p-6 sm:p-7 overflow-hidden transition-all duration-400 border transform-gpu ${
          isHovered
            ? 'border-brand-500/50 shadow-[0_24px_50px_-6px_rgba(0,0,0,0.12),0_0_30px_rgba(181,18,27,0.12),inset_0_1px_1px_rgba(255,255,255,0.9)]'
            : 'border-white/80 shadow-[0_16px_40px_rgba(0,0,0,0.08),inset_0_1px_1px_rgba(255,255,255,0.9)]'
        }`}
      >
        {/* ── 1. Animated Perimeter Border Highlight (Traveling Red Glow on Hover) ── */}
        {!shouldReduceMotion && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 rounded-3xl pointer-events-none z-10 p-[1.5px]"
            style={{
              background: isHovered
                ? 'linear-gradient(135deg, rgba(181,18,27,0.8) 0%, rgba(215,25,32,0.4) 50%, rgba(181,18,27,0.8) 100%)'
                : 'transparent',
              WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'xor',
              maskComposite: 'exclude',
            }}
          />
        )}

        {/* ── 2. Top Red Gradient Accent Bar with Interactive Expansion ── */}
        <motion.div
          animate={{ height: isHovered ? 5 : 4 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="absolute top-0 left-0 right-0 bg-gradient-to-r from-brand-500 via-brand-600 to-brand-700 rounded-t-3xl z-20"
        />

        {/* ── 3. Subtle Glass Specular Light Sweep Reflection ── */}
        {!shouldReduceMotion && isHovered && (
          <motion.div
            initial={{ x: '-100%', opacity: 0 }}
            animate={{ x: '200%', opacity: [0, 0.4, 0] }}
            transition={{ duration: 1.1, ease: 'easeInOut' }}
            className="absolute -inset-y-10 w-1/2 bg-gradient-to-r from-transparent via-white/40 to-transparent transform -skew-x-12 pointer-events-none z-10"
          />
        )}

        {/* ── 4. Card Header (Subtly elevates 2px on hover) ── */}
        <motion.div
          animate={{ y: isHovered && !shouldReduceMotion ? -2 : 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="mb-4 relative z-20"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-xl font-bold text-[#171717]">Quick Book</h3>
            <motion.div
              animate={{ rotate: isHovered ? 15 : 0, scale: isHovered ? 1.1 : 1 }}
              transition={{ duration: 0.3 }}
              className="text-brand-600"
            >
              <Sparkles size={16} />
            </motion.div>
          </div>
          <p className="text-brand-600 text-xs mt-0.5 font-semibold">Fill in your details and we'll take care of the rest</p>
        </motion.div>

        {/* ── 5. Form Fields ── */}
        <form onSubmit={handleSubmit} className="space-y-3 relative z-20">
          <select
            className={inputClass}
            value={form.tripType}
            onChange={(e) => setForm({ ...form, tripType: e.target.value })}
          >
            {TRIP_TYPES.map((t) => (
              <option key={t} value={t} className="bg-white text-[#222222]">
                {t}
              </option>
            ))}
          </select>

          <div className="relative group/field">
            <motion.div
              animate={{ scale: isHovered ? 1.05 : 1 }}
              transition={{ duration: 0.25 }}
              className="absolute left-3.5 top-3 pointer-events-none z-10"
            >
              <MapPin size={14} className="text-brand-600" />
            </motion.div>
            <input
              className={`${inputClass} pl-9`}
              placeholder="Pickup Location"
              required
              value={form.pickup}
              onChange={(e) => setForm({ ...form, pickup: e.target.value })}
            />
          </div>

          <div className="relative group/field">
            <motion.div
              animate={{ scale: isHovered ? 1.05 : 1 }}
              transition={{ duration: 0.25 }}
              className="absolute left-3.5 top-3 pointer-events-none z-10"
            >
              <MapPin size={14} className="text-brand-500" />
            </motion.div>
            <input
              className={`${inputClass} pl-9`}
              placeholder="Drop Location"
              required
              value={form.drop}
              onChange={(e) => setForm({ ...form, drop: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div className="relative">
              <Calendar size={14} className="absolute left-3.5 top-3 text-brand-600 pointer-events-none z-10" />
              <input
                type="date"
                className={`${inputClass} pl-9`}
                required
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className="relative">
              <Clock size={14} className="absolute left-3.5 top-3 text-brand-600 pointer-events-none z-10" />
              <input
                type="time"
                className={`${inputClass} pl-9`}
                required
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
              />
            </div>
          </div>

          <div className="relative">
            <motion.div
              animate={{ scale: isHovered ? 1.05 : 1 }}
              transition={{ duration: 0.25 }}
              className="absolute left-3.5 top-3 pointer-events-none z-10"
            >
              <Car size={14} className="text-brand-600" />
            </motion.div>
            <select
              className={`${inputClass} pl-9`}
              value={form.vehicle}
              onChange={(e) => setForm({ ...form, vehicle: e.target.value })}
            >
              <option value="" className="bg-white text-[#888888]">
                Select Vehicle
              </option>
              {VEHICLES.map((v) => (
                <option key={v} value={v} className="bg-white text-[#222222]">
                  {v}
                </option>
              ))}
            </select>
          </div>

          {/* ── 6. Interactive Quick Book CTA Button ── */}
          <motion.button
            type="submit"
            whileHover={{ y: -2 }}
            whileTap={{ y: 0, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="group w-full relative overflow-hidden bg-gradient-to-r from-[#D71920] to-[#B5121B] hover:from-[#B5121B] hover:to-[#8F0E15] text-white font-button font-bold text-xs sm:text-sm py-3.5 px-6 rounded-full shadow-[0_4px_16px_rgba(181,18,27,0.3)] hover:shadow-[0_8px_24px_rgba(181,18,27,0.45)] mt-2 transition-all duration-300"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              Book Now{' '}
              <ArrowRight
                size={15}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </span>
          </motion.button>
        </form>

        <p className="text-center text-[#666666] text-xs mt-3.5 font-medium relative z-20">
          Or call:{' '}
          <a
            href={`tel:+91${COMPANY.phones[0]}`}
            className="text-brand-600 font-bold hover:underline transition-colors"
          >
            {COMPANY.phones[0]}
          </a>
        </p>
      </motion.div>
    </div>
  )
}
