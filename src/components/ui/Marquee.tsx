import { motion } from 'framer-motion'

interface MarqueeProps {
  items: string[]
  speed?: number
  separator?: string
  dark?: boolean
}

export default function Marquee({ items, speed = 30, separator = '·', dark = false }: MarqueeProps) {
  const doubled = [...items, ...items]

  return (
    <div className={`overflow-hidden py-4 ${dark ? 'bg-crimson' : 'bg-gold'}`}>
      <motion.div
        className="flex gap-8 whitespace-nowrap w-max"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: speed, repeat: Infinity, ease: 'linear' }}
      >
        {doubled.map((item, i) => (
          <span
            key={i}
            className={`font-button font-semibold text-sm tracking-wider flex items-center gap-8 ${
              dark ? 'text-white/60' : 'text-white'
            }`}
          >
            {item}
            <span className={`text-lg ${dark ? 'text-gold/60' : 'text-white/60'}`}>{separator}</span>
          </span>
        ))}
      </motion.div>
    </div>
  )
}
