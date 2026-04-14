'use client'

import { useEffect, useRef } from 'react'

const positionClasses = {
  'center': 'items-center justify-center text-center',
  'bottom-left': 'items-end justify-start text-left pb-12 pl-8 md:pl-16',
  'bottom-center': 'items-end justify-center text-center pb-12',
  'bottom-right': 'items-end justify-end text-right pb-12 pr-8 md:pr-16',
}

export default function EditorialBanner({ banner }) {
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: 0.1 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => { if (ref.current) observer.unobserve(ref.current) }
  }, [])

  if (!banner) return null

  return (
    <section className="scroll-reveal" ref={ref}>
      <div className="relative w-full h-[50vh] md:h-[60vh] overflow-hidden">
        {banner.imagen ? (
          <img
            src={banner.imagen}
            alt={banner.titulo || ''}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-neutral-800 to-stone-700" />
        )}

        {(banner.titulo || banner.subtitulo) && (
          <>
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/40 to-transparent" />
            <div className={`absolute inset-0 flex flex-col ${positionClasses[banner.posicionTexto] || positionClasses.center} px-6 md:px-12`}>
              {banner.titulo && (
                <h3
                  className="font-display font-light text-white text-xl md:text-4xl uppercase tracking-wide-title"
                  style={{ textShadow: '0 2px 20px rgba(0,0,0,0.3)' }}
                >
                  {banner.titulo}
                </h3>
              )}
              {banner.subtitulo && (
                <p
                  className="font-display font-light text-white/90 text-sm md:text-base mt-2 max-w-md"
                  style={{ textShadow: '0 1px 10px rgba(0,0,0,0.3)' }}
                >
                  {banner.subtitulo}
                </p>
              )}
              {banner.textoBoton && (
                <a
                  href={banner.linkBoton || '#'}
                  className="mt-5 inline-block border border-white text-white font-display text-xs uppercase tracking-editorial px-7 py-2.5 hover:bg-white hover:text-primary transition-all duration-300"
                >
                  {banner.textoBoton}
                </a>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  )
}
