'use client'

import { useEffect, useRef } from 'react'
function InstagramIcon({ size = 24, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><circle cx="12" cy="12" r="5" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  )
}
import { negocio } from '@/lib/config'

export default function InstagramFeed({ photos = [] }) {
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: 0.1 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => { if (ref.current) observer.unobserve(ref.current) }
  }, [])

  if (!photos.length) return null

  const igUser = negocio.instagram || 'isabella_boutique'
  const igUrl = `https://instagram.com/${igUser}`

  return (
    <section className="py-12 md:py-20 px-6 md:px-12 scroll-reveal" ref={ref}>
      <div className="text-center mb-8">
        <h2 className="font-display font-light text-xl md:text-2xl uppercase tracking-wide-title text-primary">
          SEGUINOS EN INSTAGRAM
        </h2>
        <a
          href={igUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-body text-sm text-secondary hover:text-primary transition-colors mt-2 inline-block"
        >
          @{igUser}
        </a>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
        {photos.slice(0, 6).map((photo) => (
          <a
            key={photo.id}
            href={igUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative aspect-square overflow-hidden"
          >
            {photo.imagen ? (
              <img
                src={photo.imagen}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200" />
            )}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
              <InstagramIcon
                size={24}
                className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}
