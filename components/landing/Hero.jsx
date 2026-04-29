'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'

const positionClasses = {
  'center': 'items-center justify-center text-center',
  'bottom-left': 'items-end justify-start text-left pb-20 pl-8 md:pl-16',
  'bottom-center': 'items-end justify-center text-center pb-20',
  'bottom-right': 'items-end justify-end text-right pb-20 pr-8 md:pr-16',
}

function HeroPlaceholder({ titulo, index }) {
  const gradients = [
    'from-gray-900 to-gray-800',
    'from-neutral-800 to-stone-700',
    'from-zinc-900 to-zinc-700',
  ]
  return (
    <div className={`absolute inset-0 bg-gradient-to-br ${gradients[index % gradients.length]}`}>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-display font-light text-white/20 text-[60px] md:text-[100px] uppercase tracking-wide-title">
          {titulo || 'ISABELLA'}
        </span>
      </div>
    </div>
  )
}

export default function Hero({ slides = [] }) {
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length)
  }, [slides.length])

  useEffect(() => {
    if (slides.length <= 1 || paused) return
    const timer = setInterval(nextSlide, 5500)
    return () => clearInterval(timer)
  }, [slides.length, paused, nextSlide])

  if (!slides.length) return null

  return (
    <section
      id="inicio"
      className="relative w-full h-[calc(100vh-32px)] overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {slides.map((slide, i) => (
        <div
          key={slide.id}
          className={`hero-slide absolute inset-0 ${i === current ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
        >
          {slide.imagen ? (
            <Image
              src={slide.imagen}
              alt={slide.titulo || ''}
              fill
              priority={i === 0}
              loading={i === 0 ? undefined : 'lazy'}
              sizes="100vw"
              className="object-cover"
            />
          ) : (
            <HeroPlaceholder titulo={slide.titulo} index={i} />
          )}

          {(slide.titulo || slide.subtitulo) && (
            <>
              <div className="absolute inset-0 bg-black/25" />
              {slide.posicionTexto !== 'center' && (
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/30 to-transparent" />
              )}
              <div className={`absolute inset-0 flex flex-col items-center ${positionClasses[slide.posicionTexto] || positionClasses.center} px-6 md:px-12`}>
                {slide.titulo && (
                  <h2
                    className="font-display font-light text-white text-2xl md:text-5xl uppercase tracking-wide-title"
                    style={{ textShadow: '0 2px 30px rgba(0,0,0,0.5)' }}
                  >
                    {slide.titulo}
                  </h2>
                )}
                {slide.subtitulo && (
                  <p
                    className="font-display font-light text-white/90 text-sm md:text-lg mt-3 max-w-lg"
                    style={{ textShadow: '0 1px 15px rgba(0,0,0,0.4)' }}
                  >
                    {slide.subtitulo}
                  </p>
                )}
                {slide.textoBoton && (
                  <a
                    href={slide.linkBoton || '#productos'}
                    className="mt-6 border border-white text-white font-display text-xs uppercase tracking-editorial px-8 py-3 hover:bg-white hover:text-primary transition-all duration-300"
                  >
                    {slide.textoBoton}
                  </a>
                )}
              </div>
            </>
          )}
        </div>
      ))}

      {/* Progress indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-3">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-[2px] w-8 md:w-12 bg-white/40 overflow-hidden ${i === current ? 'hero-progress-active' : ''}`}
              aria-label={`Slide ${i + 1}`}
            >
              <div className={`h-full bg-white ${i === current ? 'hero-progress-bar' : 'w-0'}`} />
            </button>
          ))}
        </div>
      )}
    </section>
  )
}
