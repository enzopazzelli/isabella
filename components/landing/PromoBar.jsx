'use client'

export default function PromoBar({ promos = [] }) {
  if (!promos.length) return null

  const text = promos.join('  \u2014  ')
  const repeatedText = `${text}  \u2014  `.repeat(4)

  return (
    <div className="bg-primary text-white overflow-hidden h-8 md:h-[32px] flex items-center relative z-50">
      <div className="animate-marquee whitespace-nowrap">
        <span className="font-display text-[11px] uppercase tracking-editorial">
          {repeatedText}
        </span>
        <span className="font-display text-[11px] uppercase tracking-editorial">
          {repeatedText}
        </span>
      </div>
    </div>
  )
}
