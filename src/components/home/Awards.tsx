import { Award, ThumbsUp, Zap, Globe } from 'lucide-react'
import FadeUp from '../ui/FadeUp'
import SectionHeader from '../ui/SectionHeader'
import { useAdminData } from '../../hooks/useAdminData'

const ICON_MAP: Record<string, React.ElementType> = { Award, ThumbsUp, Zap, Globe }

function resolveIcon(iconName?: string): React.ElementType {
  return ICON_MAP[iconName || 'Award'] || Award
}

const FALLBACK_AWARDS = [
  { icon: Award, year: '2024', title: 'Best Luxury Travel Agency', org: 'Karnataka Travel Excellence Awards' },
  { icon: ThumbsUp, year: '2023', title: 'Top Rated on Google', org: '4.9★ with 1000+ Reviews — Google Business' },
  { icon: Zap, year: '2022', title: 'Most Reliable Corporate Fleet', org: 'Bangalore IT Corridor Business Awards' },
  { icon: Globe, year: '2021', title: 'Premium Travel Partner', org: 'South India Tourism & Travel Summit' },
]

export default function Awards() {
  const { awards } = useAdminData()
  const items = awards?.length
    ? awards.map((a: any) => ({ icon: resolveIcon(a.icon), year: String(a.year), title: a.title, org: '' }))
    : FALLBACK_AWARDS
  return (
    <section className="section-padding bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <SectionHeader
          badge="Recognition"
          title="Awards &"
          highlight="Achievements"
          subtitle="Our commitment to excellence has earned recognition across the industry."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {items.map((award, i) => {
            const Icon = award.icon
            return (
              <FadeUp key={award.title} delay={i * 0.08}>
                <div className="bg-[#FAFAF8] rounded-3xl p-6 sm:p-7 border border-[#E5E5E5] shadow-card hover:shadow-card-hover hover:border-brand-300 hover:-translate-y-1.5 transition-all duration-400 group h-full flex flex-col">
                  <div className="flex items-start justify-between mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-brand-50 border border-brand-200/80 flex items-center justify-center shadow-sm group-hover:bg-[#B5121B] transition-all duration-300">
                      <Icon size={20} className="text-brand-600 group-hover:text-white transition-colors duration-300" />
                    </div>
                    <span className="text-xs font-button font-bold text-brand-700 bg-brand-50 border border-brand-200/80 px-3 py-1 rounded-full">{award.year}</span>
                  </div>
                  <h4 className="font-heading text-base font-bold text-[#171717] mb-2 leading-snug flex-1 group-hover:text-brand-600 transition-colors">{award.title}</h4>
                  <p className="text-[#666666] text-xs leading-relaxed font-light">{award.org}</p>
                </div>
              </FadeUp>
            )
          })}
        </div>
      </div>
    </section>
  )
}
