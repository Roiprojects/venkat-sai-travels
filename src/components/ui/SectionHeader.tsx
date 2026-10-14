import FadeUp from './FadeUp'

interface SectionHeaderProps {
  badge?: string
  title: string
  highlight?: string
  subtitle?: string
  center?: boolean
  light?: boolean
}

export default function SectionHeader({ badge, title, highlight, subtitle, center = true, light = false }: SectionHeaderProps) {
  return (
    <FadeUp className={`mb-8 sm:mb-10 ${center ? 'text-center' : ''}`}>
      {badge && (
        <div className={`mb-3 ${center ? 'flex justify-center' : ''}`}>
          <span className="inline-flex items-center gap-2 font-button text-xs font-bold tracking-wider uppercase px-4 py-1.5 rounded-full text-brand-600 bg-brand-50 border border-brand-200/80 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-600 animate-pulse" />
            {badge}
          </span>
        </div>
      )}
      <h2 className={`font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight ${light ? 'text-white' : 'text-[#171717]'}`}>
        {title}{' '}
        {highlight && <span className="text-[#B5121B]">{highlight}</span>}
      </h2>
      <div className={`w-16 h-1 bg-gradient-to-r from-brand-500 to-brand-700 rounded-full my-2.5 ${center ? 'mx-auto' : ''}`} />
      {subtitle && (
        <p className={`text-base sm:text-lg max-w-2xl leading-relaxed ${center ? 'mx-auto' : ''} ${light ? 'text-slate-200' : 'text-[#666666]'} font-light`}>
          {subtitle}
        </p>
      )}
    </FadeUp>
  )
}
