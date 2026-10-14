import { Link } from 'react-router-dom'
import { Phone, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { CALL_URL } from '../../data/constants'
import FadeUp from '../ui/FadeUp'

export default function CTABanner() {
  return (
    <section className="py-14 sm:py-16 px-4 sm:px-8 lg:px-16 relative overflow-hidden bg-gradient-to-br from-[#D71920] via-[#B5121B] to-[#8F0E15] text-white">
      {/* Decorative floating subtle orbs */}
      <motion.div
        className="absolute top-1/2 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 6, repeat: Infinity }}
      />
      <motion.div
        className="absolute top-1/2 right-1/4 w-96 h-96 bg-black/10 rounded-full blur-3xl"
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 6, repeat: Infinity }}
      />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <FadeUp>
          <span className="inline-block text-white text-xs font-button font-bold tracking-[0.25em] uppercase mb-4 bg-white/15 border border-white/25 px-4 py-1.5 rounded-full backdrop-blur-md">
            Ready to Travel in Luxury?
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight tracking-tight">
            Your Premium Journey
            <br />
            <span>
              Awaits You
            </span>
          </h2>
          <p className="text-white/90 text-sm sm:text-base mb-6 max-w-2xl mx-auto leading-relaxed font-light">
            Book your luxury ride today and experience the difference. Every mile made memorable.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/booking"
              className="bg-white text-[#B5121B] font-button font-bold text-sm sm:text-base px-9 py-4 rounded-full shadow-lg hover:bg-neutral-100 hover:scale-105 active:scale-95 transition-all duration-300 inline-flex items-center gap-2"
            >
              Book Now <ArrowRight size={18} />
            </Link>
            <a
              href={CALL_URL}
              className="bg-transparent border-2 border-white text-white font-button font-bold text-sm sm:text-base px-9 py-4 rounded-full hover:bg-white/15 hover:scale-105 active:scale-95 transition-all duration-300 inline-flex items-center gap-2"
            >
              <Phone size={18} />Call Us Now
            </a>
          </div>
        </FadeUp>
      </div>
    </section>
  )
}
