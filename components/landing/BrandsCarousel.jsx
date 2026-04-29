'use client'

import { defaultMarcas } from '@/lib/defaults'
import { eqCi } from '@/lib/utils'

export default function BrandsCarousel({ marcas = [], activeMarca = null, onBrandClick }) {
  const validMarcas = (marcas.filter(m => m && m.nombre).length > 0 ? marcas : defaultMarcas).filter(m => m && m.nombre)

  // Duplicate the list so the marquee loops seamlessly (translateX -50% lands on the copy)
  const loop = [...validMarcas, ...validMarcas]

  return (
    <section className="py-12 md:py-16 border-y border-border bg-white overflow-hidden">
      <div className="text-center mb-8 px-6">
        <h2 className="font-display font-light text-2xl md:text-[28px] uppercase tracking-wide-title text-primary">
          NUESTRAS MARCAS
        </h2>
        <div className="mt-3 mx-auto w-10 h-px bg-primary" />
        <p className="mt-3 font-body font-light text-[13px] text-secondary">
          Seleccioná una marca para ver sus productos
        </p>
      </div>

      <div className="relative group">
        {/* Edge fades */}
        <div className="pointer-events-none absolute top-0 left-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-white to-transparent z-10" />
        <div className="pointer-events-none absolute top-0 right-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-white to-transparent z-10" />

        <div className="flex animate-marquee-slow whitespace-nowrap">
          {loop.map((m, i) => {
            const isActive = eqCi(activeMarca, m.nombre)
            return (
              <button
                key={`${m.id}-${i}`}
                onClick={() => onBrandClick && onBrandClick(isActive ? null : m.nombre)}
                className={`group/brand relative flex-shrink-0 mx-4 md:mx-6 flex flex-col items-center justify-center transition-all ${
                  isActive ? 'opacity-100' : 'opacity-70 hover:opacity-100'
                }`}
                aria-label={`Ver productos de ${m.nombre}`}
              >
                <div className={`w-28 h-28 md:w-36 md:h-36 border flex items-center justify-center bg-white transition-all ${
                  isActive ? 'border-primary border-2' : 'border-border group-hover/brand:border-primary'
                }`}>
                  {m.logo ? (
                    <img
                      src={m.logo}
                      alt={m.nombre}
                      className="max-w-[75%] max-h-[75%] object-contain"
                    />
                  ) : (
                    <span className="font-display font-light text-[11px] md:text-xs uppercase tracking-editorial text-primary text-center px-2 leading-tight whitespace-normal">
                      {m.nombre}
                    </span>
                  )}
                </div>
                <span className={`mt-2 font-display text-[9px] md:text-[10px] uppercase tracking-editorial transition-colors ${
                  isActive ? 'text-primary' : 'text-secondary group-hover/brand:text-primary'
                }`}>
                  {m.nombre}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {activeMarca && (
        <div className="text-center mt-6 px-6">
          <button
            onClick={() => onBrandClick && onBrandClick(null)}
            className="font-body text-xs text-secondary underline hover:text-primary transition-colors"
          >
            Quitar filtro de marca
          </button>
        </div>
      )}
    </section>
  )
}
