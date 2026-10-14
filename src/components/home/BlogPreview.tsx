import { motion } from 'framer-motion'
import { ArrowRight, Calendar, Clock, Tag } from 'lucide-react'
import FadeUp from '../ui/FadeUp'
import { IMAGES } from '../../data/images'
import { useAdminData } from '../../hooks/useAdminData'

const FALLBACK_POSTS = [
  {
    tag: 'Travel Tips',
    title: '10 Things to Know Before Your Bangalore Airport Transfer',
    excerpt: 'First time flying from Kempegowda International? Here\'s everything you need to plan your airport ride — from booking timelines to terminal tips.',
    readTime: '4 min read',
    date: 'Jan 2025',
    photo: IMAGES.blog1,
  },
  {
    tag: 'Destinations',
    title: 'Bangalore to Mysore: The Ultimate Road Trip Guide',
    excerpt: 'The 150 km Bangalore–Mysore highway is one of Karnataka\'s finest drives. We cover the best stops, timings, and why Innova Crysta is perfect for this route.',
    readTime: '6 min read',
    date: 'Dec 2024',
    photo: IMAGES.blog2,
  },
  {
    tag: 'Corporate Travel',
    title: 'How to Set Up Employee Transportation for Your Bangalore Office',
    excerpt: 'Discover how smart HR managers in Bangalore\'s IT parks are cutting commute costs by 40% with managed corporate transport solutions.',
    readTime: '5 min read',
    date: 'Nov 2024',
    photo: IMAGES.blog3,
  },
]

const BLOG_PHOTO_MAP: Record<string, string> = {
  '/images/blog1.jpg': IMAGES.blog1,
  '/images/blog2.jpg': IMAGES.blog2,
  '/images/blog3.jpg': IMAGES.blog3,
}

export default function BlogPreview() {
  const { blogs } = useAdminData()
  const posts = blogs?.length
    ? blogs.map((b: any) => ({
        tag: b.tag,
        title: b.title,
        excerpt: b.excerpt,
        readTime: b.read_time,
        date: b.date,
        photo: BLOG_PHOTO_MAP[b.image] || b.image || IMAGES.blog1,
      }))
    : FALLBACK_POSTS

  return (
    <section className="section-padding bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
          <FadeUp className="max-w-xl">
            <span className="badge-red mb-3.5 block w-fit">Travel Journal</span>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-[#171717]">
              Latest <span className="text-[#B5121B]">Travel Tips</span>
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-brand-500 to-brand-700 rounded-full mt-4" />
          </FadeUp>
          <FadeUp delay={0.15}>
            <button className="btn-outline text-xs sm:text-sm py-2.5 px-6 shadow-sm">View All Posts</button>
          </FadeUp>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((post, i) => (
            <FadeUp key={post.title} delay={i * 0.08}>
              <motion.article
                whileHover={{ y: -6 }}
                className="bg-[#FAFAF8] rounded-3xl overflow-hidden border border-[#E5E5E5] shadow-card hover:shadow-card-hover hover:border-brand-300 transition-all duration-400 group cursor-pointer h-full flex flex-col"
              >
                {/* Photo */}
                <div className="h-52 relative overflow-hidden flex-shrink-0 bg-neutral-100">
                  <img
                    src={post.photo}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/95 backdrop:blur-md text-brand-700 text-xs font-button font-bold px-3.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                      <Tag size={11} className="text-brand-600" />{post.tag}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-1 bg-[#FAFAF8]">
                  <div className="flex items-center gap-4 text-[#888888] text-xs font-button mb-3">
                    <span className="flex items-center gap-1.5"><Calendar size={12} className="text-brand-600" />{post.date}</span>
                    <span className="flex items-center gap-1.5"><Clock size={12} className="text-brand-600" />{post.readTime}</span>
                  </div>
                  <h3 className="font-heading text-lg font-bold text-[#171717] mb-2 leading-snug group-hover:text-brand-600 transition-colors duration-300">
                    {post.title}
                  </h3>
                  <p className="text-[#555555] text-xs sm:text-sm leading-relaxed flex-1 mb-5 font-light">{post.excerpt}</p>
                  <div className="flex items-center gap-2 text-brand-600 text-xs sm:text-sm font-button font-bold group-hover:gap-3 transition-all duration-300 mt-auto">
                    Read More <ArrowRight size={14} />
                  </div>
                </div>
              </motion.article>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  )
}
