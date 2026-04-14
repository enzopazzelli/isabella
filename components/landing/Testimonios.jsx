'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

export default function Testimonios({ testimonios = [] }) {
  const [current, setCurrent] = useState(0)
  const ref = useRef(null)

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % testimonios.length)
  }, [testimonios.length])

  useEffect(() => {
    if (testimonios.length <= 1) return
    const timer = setInterval(next, 8000)
    return () => clearInterval(timer)
  }, [testimonios.length, next])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: 0.1 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => { if (ref.current) observer.unobserve(ref.current) }
  }, [])

  if (!testimonios.length) return null

  return (
    <section className="py-16 md:py-24 bg-light scroll-reveal" ref={ref}>
      <div className="max-w-2xl mx-auto px-6 text-center">
        <h2 className="font-display font-light text-xl md:text-2xl uppercase tracking-wide-title text-primary mb-12">
          LO QUE DICEN NUESTRAS CLIENTAS
        </h2>

        <div className="relative min-h-[200px]">
          {testimonios.map((t, i) => (
            <div
              key={t.id}
              className={`transition-opacity duration-700 ${
                i === current ? 'opacity-100' : 'opacity-0 absolute inset-0'
              }`}
            >
              <span className="font-body text-5xl text-muted/50 leading-none block mb-4">
                {'\u201C'}
              </span>
              <p className="font-body text-[15px] italic text-primary leading-relaxed">
                {t.texto}
              </p>
              <p className="font-display text-xs uppercase tracking-editorial text-secondary mt-6">
                {t.nombre}
              </p>
            </div>
          ))}
        </div>

        {testimonios.length > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {testimonios.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-1.5 h-1.5 rounded-full border transition-all ${
                  i === current ? 'bg-primary border-primary' : 'bg-transparent border-secondary'
                }`}
                aria-label={`Testimonio ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
