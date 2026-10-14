import { Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 pt-28 pb-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        <p className="font-heading text-8xl sm:text-9xl font-extrabold text-[#B5121B] mb-2 tracking-tight">
          404
        </p>
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[#171717] mb-3">
          Page Not Found
        </h1>
        <p className="text-[#666666] text-sm leading-relaxed mb-8 font-light">
          The page you are looking for does not exist or has been moved. Let's get you back on track.
        </p>
        <div className="flex gap-3 justify-center">
          <Link to="/" className="btn-primary text-xs py-3 px-6 shadow-brand">
            <Home size={15} />Back to Home
          </Link>
          <button onClick={() => window.history.back()} className="btn-outline text-xs py-3 px-6 shadow-sm">
            <ArrowLeft size={15} />Go Back
          </button>
        </div>
      </motion.div>
    </div>
  )
}
