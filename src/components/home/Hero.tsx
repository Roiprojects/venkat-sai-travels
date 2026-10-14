import { useState, useEffect } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Link } from '@tanstack/react-router'
import { Phone, MessageCircle, ChevronDown, ArrowRight, Star, Sparkles } from 'lucide-react'
import { WHATSAPP_URL, CALL_URL } from '../../data/constants'
import { IMAGES } from '../../data/images'
import BookingCard from './BookingCard'
import Logo from '../common/Logo'

export default function Hero() {
  const shouldReduceMotion = useReducedMotion()
  const [isTouchDevice, setIsTouchDevice] = useState(false)

  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0)
  }, [])

  // Smooth custom luxury cubic-bezier easing
  const luxuryEase = [0.22, 1, 0.36, 1]

  // Step 1: "Luxury Travel" rises from translateY(25px) to translateY(0)
  const line1Variants = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 25,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: luxuryEase,
        delay: 0.1,
      },
    },
  }

  // Step 2: "Begins Here" rises from translateY(25px) to translateY(0) after a 180ms delay
  const line2Variants = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 25,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: luxuryEase,
        delay: 0.28,
      },
    },
  }

  return (
    <section className="relative min-h-screen min-h-[100dvh] flex items-center overflow-hidden px-4 sm:px-8 lg:px-16 pt-24 sm:pt-28 pb-14 sm:pb-16 bg-[#FAFAF8]">
      {/* ── Background Video Container ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster="/images/car_rentals_cover.png"
          className="w-full h-full object-cover object-[center_35%] sm:object-center filter brightness-[1.02] contrast-[1.05] transform-gpu"
        >
          <source src="/videos/convoy_cars.mp4" type="video/mp4" />
          <source src="/videos/hero_cars.mp4" type="video/mp4" />
          <source src="/videos/scene.mp4" type="video/mp4" />
        </video>
      </div>

      {/* ── Background Minimal Overlays (Full video clarity across the hero) ── */}
      <div className="absolute inset-0 bg-black/10 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#FAFAF8]/40 via-transparent to-black/10 pointer-events-none" />

      {/* Left brand red accent line */}
      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-brand-500 via-brand-600 to-brand-700 z-10" />

      {/* ── Content Container ── */}
      <div className="relative z-10 max-w-7xl mx-auto w-full pt-10 sm:pt-14">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12 w-full">

          {/* Left column: text & CTAs in transparent container */}
          <div className="lg:max-w-xl xl:max-w-2xl w-full text-left">
            {/* Animated Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05, duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-white/90 border border-brand-200/90 px-4 py-1.5 rounded-full mb-4 shadow-sm backdrop-blur-md"
            >
              <Logo variant="icon" height={18} />
              <span className="text-brand-600 text-xs font-button font-bold tracking-wider uppercase flex items-center gap-1.5">
                <Sparkles size={12} className="text-brand-600 animate-pulse" />
                Venkat Sai Travels · Bangalore
              </span>
            </motion.div>

            {/* ── ELEGANT CINEMATIC HERO HEADING ── */}
            <motion.div
              whileHover={
                !isTouchDevice && !shouldReduceMotion
                  ? { y: -2, transition: { duration: 0.25, ease: luxuryEase } }
                  : undefined
              }
              className="mb-4 select-none cursor-default"
            >
              <h1 className="font-heading text-4xl sm:text-6xl xl:text-7xl font-extrabold leading-[1.08] tracking-tight">
                {/* Step 1: Luxury Travel */}
                <motion.span
                  variants={line1Variants}
                  initial="hidden"
                  animate="visible"
                  className="block text-amber-500"
                >
                  Luxury Travel
                </motion.span>

                {/* Step 2: Begins Here */}
                <motion.span
                  variants={line2Variants}
                  initial="hidden"
                  animate="visible"
                  className="block text-[#B5121B] mt-1 drop-shadow-[0_1px_3px_rgba(255,255,255,0.8)]"
                >
                  Begins Here
                </motion.span>
              </h1>
            </motion.div>

            {/* Sub-headline */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.42, duration: 0.6, ease: luxuryEase }}
              className="text-zinc-950 text-base sm:text-lg leading-relaxed max-w-lg mb-8 font-bold bg-white/75 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/80 shadow-xs"
            >
              Premium chauffeur & vehicle rental services in Bangalore. Airport transfers,
              outstation trips, corporate travel — crafted for excellence since 2002.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.52, duration: 0.6, ease: luxuryEase }}
              className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-3 mb-8 w-full"
            >
              <Link
                to="/booking"
                className="btn-primary text-xs sm:text-sm py-3.5 px-7 sm:px-9 shadow-[0_6px_20px_rgba(181,18,27,0.3)]"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Book Now <ArrowRight size={15} />
                </span>
              </Link>
              <Link
                to="/fleet"
                className="btn-outline text-xs sm:text-sm px-6 sm:px-8 py-3.5 bg-white/90 border border-brand-600 text-brand-600 hover:bg-brand-600 hover:text-white transition-all shadow-sm"
              >
                <span className="relative z-10">Explore Fleet</span>
              </Link>
              <a
                href={CALL_URL}
                className="flex items-center justify-center gap-1.5 text-[#252525] hover:text-brand-600 border border-[#E5E5E5] bg-white/85 hover:border-brand-300 px-4 sm:px-5 py-3.5 rounded-full transition-all duration-300 font-button text-xs sm:text-sm shadow-sm hover:-translate-y-0.5 active:translate-y-0"
              >
                <Phone size={14} className="text-brand-600" />
                Call
              </a>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-1.5 text-emerald-700 border border-emerald-200/90 bg-emerald-50/85 hover:bg-emerald-100/90 px-4 sm:px-5 py-3.5 rounded-full transition-all duration-300 font-button text-xs sm:text-sm shadow-sm hover:-translate-y-0.5 active:translate-y-0"
              >
                <MessageCircle size={14} className="text-emerald-600" />
                WhatsApp
              </a>
            </motion.div>

            {/* Trust Points */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.62, duration: 0.6 }}
              className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2.5 sm:gap-4 w-full"
            >
              {['22+ Years Experience', '50,000+ Trips', '24/7 Availability', '200+ Companies'].map((b) => (
                <div key={b} className="flex items-center gap-2 bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/80 shadow-xs">
                  <span className="w-1.5 h-1.5 bg-brand-600 rounded-full shadow-[0_0_6px_rgba(181,18,27,0.4)] shrink-0" />
                  <span className="text-zinc-900 text-xs sm:text-sm font-button font-semibold">{b}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right column: stat chips + booking card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.7, ease: luxuryEase }}
            className="flex flex-col gap-4 w-full lg:w-96 xl:w-[420px]"
          >
            {/* Stat chips with glass effect */}
            <div className="grid grid-cols-3 gap-2.5 w-full">
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl px-3 sm:px-4 py-3 shadow-[0_8px_24px_rgba(0,0,0,0.05),inset_0_1px_1px_rgba(255,255,255,0.9)] border border-white/80 text-center">
                <p className="text-[#171717] font-heading font-extrabold text-lg sm:text-xl leading-none">50+</p>
                <p className="text-[#666666] text-[10px] sm:text-xs font-button mt-1 font-medium">Vehicles</p>
              </div>
              <div className="bg-brand-50/85 backdrop-blur-xl rounded-2xl px-3 sm:px-4 py-3 shadow-[0_8px_24px_rgba(181,18,27,0.06),inset_0_1px_1px_rgba(255,255,255,0.9)] text-center border border-brand-200/80">
                <p className="text-brand-600 font-heading font-extrabold text-lg sm:text-xl leading-none">24/7</p>
                <p className="text-brand-700 text-[10px] sm:text-xs font-button mt-1 font-semibold">Service</p>
              </div>
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl px-3 sm:px-4 py-3 shadow-[0_8px_24px_rgba(0,0,0,0.05),inset_0_1px_1px_rgba(255,255,255,0.9)] border border-white/80 text-center">
                <div className="flex items-center justify-center gap-1">
                  <p className="text-[#171717] font-heading font-extrabold text-lg sm:text-xl leading-none">4.9</p>
                  <Star size={12} className="text-brand-600 fill-brand-600" />
                </div>
                <p className="text-[#666666] text-[10px] sm:text-xs font-button mt-1 font-medium">Rating</p>
              </div>
            </div>

            {/* Booking card */}
            <BookingCard />
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-3 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 pointer-events-none"
        animate={{ y: [0, 5, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <span className="text-[#888888] text-[10px] sm:text-xs font-button tracking-widest font-semibold">SCROLL</span>
        <ChevronDown size={14} className="text-brand-600" />
      </motion.div>
    </section>
  )
}
