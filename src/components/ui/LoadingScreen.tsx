import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

export default function LoadingScreen() {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 1200)
    return () => clearTimeout(t)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="loader"
          className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-white"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.5, ease: 'easeInOut' } }}
        >
          {/* Glowing subtle red backdrop orb */}
          <div className="absolute w-96 h-96 bg-brand-50 rounded-full blur-3xl pointer-events-none" />

          {/* Animated ring */}
          <div className="relative mb-8 z-10">
            <motion.div
              className="w-24 h-24 rounded-full border-2 border-brand-100"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            />
            <motion.div
              className="absolute inset-0 w-24 h-24 rounded-full border-t-2 border-brand-600 shadow-[0_0_15px_rgba(181,18,27,0.3)]"
              animate={{ rotate: 360 }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
            />
            {/* Center monogram */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-heading font-bold text-brand-600 text-xl tracking-wider">VST</span>
            </div>
          </div>

          {/* Brand name */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center z-10"
          >
            <p className="font-heading text-[#171717] text-2xl font-bold tracking-wide">Venkat Sai Travels</p>
            <motion.p
              className="text-brand-600 text-xs font-button tracking-[0.35em] uppercase mt-2 font-semibold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Luxury Travel · Bangalore
            </motion.p>
          </motion.div>

          {/* Progress bar */}
          <motion.div className="absolute bottom-12 w-48 h-1 bg-neutral-100 overflow-hidden rounded-full z-10">
            <motion.div
              className="h-full bg-gradient-to-r from-brand-500 to-brand-700 rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 1.0, ease: 'easeOut' }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
