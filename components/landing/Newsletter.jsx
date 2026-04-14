'use client'

import { useState, useEffect, useRef } from 'react'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: 0.1 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => { if (ref.current) observer.unobserve(ref.current) }
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email) return
    setSent(true)
    setEmail('')
    setTimeout(() => setSent(false), 3000)
  }

  return (
    <section className="py-16 md:py-20 bg-primary scroll-reveal" ref={ref}>
      <div className="max-w-xl mx-auto px-6 text-center">
        <h2 className="font-display font-light text-lg md:text-xl uppercase tracking-wide-title text-white">
          SUSCRIBITE PARA RECIBIR NOVEDADES
        </h2>

        {sent ? (
          <p className="mt-6 font-body text-sm text-white/80">
            Gracias por suscribirte. Te mantendremos al tanto de las novedades.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Tu email"
              required
              className="flex-1 bg-transparent border-b border-white/50 focus:border-white text-white placeholder:text-muted pb-2 outline-none font-body text-sm transition-colors"
            />
            <button
              type="submit"
              className="border border-white text-white font-display text-xs uppercase tracking-editorial px-8 py-2.5 hover:bg-white hover:text-primary transition-all duration-300"
            >
              ENVIAR
            </button>
          </form>
        )}
      </div>
    </section>
  )
}
