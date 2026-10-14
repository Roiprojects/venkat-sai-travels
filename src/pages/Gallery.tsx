import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ZoomIn } from 'lucide-react'
import { IMAGES } from '../data/images'
import { api } from '../api'
import FadeUp from '../components/ui/FadeUp'
import CTABanner from '../components/home/CTABanner'

const GALLERY_ITEMS = [
  { src: IMAGES.innova,      title: 'Toyota Innova Crysta',   category: 'Fleet',       desc: 'Premium 7-seater for family and corporate trips' },
  { src: IMAGES.urbania,     title: 'Force Urbania 16+1',     category: 'Fleet',       desc: 'World-class luxury group travel coach' },
  { src: IMAGES.pkn,         title: 'PKN Deluxe 9-Seater',    category: 'Fleet',       desc: 'Executive travel in unparalleled comfort' },
  { src: IMAGES.tempoTrav,   title: 'Force Tempo Traveller',  category: 'Fleet',       desc: 'Spacious 12-seater for outstation & events' },
  { src: IMAGES.luxSedan,    title: 'Sedan',                  category: 'Fleet',       desc: 'Refined comfort for executive airport commutes' },
  { src: IMAGES.luxSUV,      title: 'Luxury SUV',             category: 'Fleet',       desc: 'Dynamic capability with first-class cabin' },
  { src: IMAGES.miniBus,     title: 'Mini Bus',               category: 'Fleet',       desc: 'Comfortable 21-seater group transport' },
  { src: IMAGES.luxBus,      title: 'Luxury Coach Bus',       category: 'Fleet',       desc: '40-seater luxury bus for grand tours' },
  { src: IMAGES.airport,     title: 'Airport Transfer Fleet', category: 'Services',    desc: 'Round-the-clock Bangalore airport transfers' },
  { src: IMAGES.wedding,     title: 'Wedding Car Fleet',      category: 'Events',      desc: 'Decorated luxury vehicles for special occasions' },
  { src: IMAGES.corporate,   title: 'Corporate Travel Fleet', category: 'Corporate',   desc: 'Executive fleet for IT corridors & business visits' },
  { src: IMAGES.mysore,      title: 'Mysore Palace Tour',     category: 'Destinations', desc: 'Outstation trips to South India\'s royal city' },
  { src: IMAGES.coorg,       title: 'Coorg Hills Trip',       category: 'Destinations', desc: 'Scenic journey through coffee plantations' },
  { src: IMAGES.ooty,        title: 'Ooty Queen of Hills',    category: 'Destinations', desc: 'Serene mountain drives with luxury chauffeurs' },
  { src: IMAGES.goa,         title: 'Goa Coastal Road Trip',  category: 'Destinations', desc: 'Coastal holiday transport in absolute comfort' },
]

const CATEGORIES = ['All', 'Fleet', 'Services', 'Events', 'Corporate', 'Destinations']

export default function Gallery() {
  const [galleryItems, setGalleryItems] = useState<typeof GALLERY_ITEMS>([])
  const [active, setActive] = useState('All')
  const [lightbox, setLightbox] = useState<typeof GALLERY_ITEMS[0] | null>(null)

  useEffect(() => {
    ;(async () => {
      try {
        const data = await api.gallery()
        if (Array.isArray(data) && data.length) {
          setGalleryItems(data.map((item: any) => ({ src: item.src, title: item.title, category: item.category, desc: item.description })))
          return
        }
      } catch {}
      setGalleryItems(GALLERY_ITEMS)
    })()
  }, [])

  const filtered = active === 'All' ? galleryItems : galleryItems.filter(g => g.category === active)

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
      {/* Page Hero */}
      <section className="pt-36 pb-20 px-4 sm:px-8 lg:px-16 bg-[#FAFAF8] relative overflow-hidden border-b border-[#E5E5E5]">
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-brand-500 to-brand-700" />
        <div className="max-w-7xl mx-auto relative z-10">
          <FadeUp>
            <span className="badge-red mb-4 block w-fit">Visual Experience</span>
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#171717] mb-4 tracking-tight">
              Photo <span className="text-[#B5121B]">Gallery</span>
            </h1>
            <div className="w-16 h-1 bg-gradient-to-r from-brand-500 to-brand-700 rounded-full mb-6" />
            <p className="text-[#555555] text-base sm:text-lg max-w-2xl leading-relaxed font-light">
              Glimpse into the world of Venkat Sai Travels — our premium fleet, scenic destination tours,
              corporate fleets, and memorable journeys.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Category Filter */}
          <FadeUp className="mb-12">
            <div className="flex flex-wrap justify-center gap-2.5">
              {CATEGORIES.map(cat => (
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

          {/* Grid */}
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filtered.map((item, i) => (
                <motion.div
                  key={item.title}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35, delay: i * 0.04 }}
                  onClick={() => setLightbox(item)}
                  className="bg-[#FAFAF8] rounded-3xl overflow-hidden border border-[#E5E5E5] shadow-card hover:shadow-card-hover hover:border-brand-300 group cursor-pointer"
                >
                  <div className="relative h-64 overflow-hidden bg-neutral-100">
                    <img
                      src={item.src}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover:from-black/80 transition-all duration-300" />
                    <div className="absolute top-3.5 right-3.5 w-9 h-9 rounded-full bg-white/90 text-brand-600 flex items-center justify-center shadow-md group-hover:bg-[#B5121B] group-hover:text-white transition-all duration-300">
                      <ZoomIn size={16} />
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <span className="text-[11px] font-button font-bold text-white bg-[#B5121B] px-3 py-0.5 rounded-full mb-2 inline-block shadow-sm">
                        {item.category}
                      </span>
                      <h4 className="font-heading text-lg font-bold text-white leading-snug">{item.title}</h4>
                      <p className="text-slate-200 text-xs mt-1 line-clamp-1 font-light">{item.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightbox && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-[#E5E5E5] relative"
            >
              <div className="relative h-80 sm:h-96 bg-neutral-100">
                <img src={lightbox.src} alt={lightbox.title} className="w-full h-full object-cover" />
                <button
                  onClick={() => setLightbox(null)}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 text-[#222222] hover:text-brand-600 flex items-center justify-center shadow-md transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 bg-white">
                <span className="text-xs font-button font-bold text-white bg-[#B5121B] px-3.5 py-1 rounded-full shadow-sm mb-2 inline-block">
                  {lightbox.category}
                </span>
                <h3 className="font-heading text-2xl font-bold text-[#171717] mt-1 mb-2">{lightbox.title}</h3>
                <p className="text-[#555555] text-sm leading-relaxed font-light">{lightbox.desc}</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <CTABanner />
    </motion.div>
  )
}
