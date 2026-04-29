'use client'

import { useState } from 'react'
import Image from 'next/image'

function slugify(text) {
  return String(text || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

const badgeStyles = {
  NUEVO: 'bg-primary text-white',
  SALE: 'bg-sale text-white',
  ULTIMAS: 'bg-nude text-primary',
  AGOTADO: 'bg-secondary text-white',
}

export default function ProductCard({ producto, onQuickView }) {
  const [hovered, setHovered] = useState(false)
  const [selectedColor, setSelectedColor] = useState(null)
  const colores = producto.colores && producto.colores.length > 0 ? producto.colores : []

  // Resolve the displayed image based on selected color
  const displayImages = selectedColor
    ? [selectedColor.imagen, ...(producto.imagenes || []).filter(img => img !== selectedColor.imagen)]
    : producto.imagenes || []

  const hasImages = displayImages.length > 0
  const hasMultipleImages = displayImages.length > 1
  const hasMultipleTalles = producto.talles && producto.talles.length > 1
  const isOutOfStock = producto.stock <= 0 || producto.disponible === false
  const discount = producto.precioAnterior
    ? Math.round((1 - producto.precio / producto.precioAnterior) * 100)
    : 0

  const badge = isOutOfStock ? 'AGOTADO' : producto.badge
  const displayBadge = badge === 'SALE' && discount > 0 ? `SALE -${discount}%` : badge

  const formatPrice = (p) => {
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0 }).format(p)
  }

  const cuotas = producto.precio > 0
    ? `3 cuotas sin interes de ${formatPrice(Math.ceil(producto.precio / 3))}`
    : ''

  return (
    <div
      className="group cursor-pointer"
      onClick={() => onQuickView({ ...producto, _selectedColor: selectedColor })}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image container */}
      <div className={`relative aspect-[3/4] overflow-hidden bg-light ${isOutOfStock ? 'opacity-50 grayscale' : ''}`}>
        {hasImages ? (
          <div className="relative w-full h-full">
            {/* Primary image */}
            <Image
              src={displayImages[0]}
              alt={producto.nombre}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
              className={`object-cover transition-all duration-500 ${
                hasMultipleImages && hovered ? 'opacity-0' : 'opacity-100'
              } ${!hasMultipleImages && hovered ? 'scale-[1.03]' : 'scale-100'}`}
            />
            {/* Secondary image on hover (crossfade) */}
            {hasMultipleImages && (
              <Image
                src={displayImages[1]}
                alt={producto.nombre}
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
                className={`object-cover transition-opacity duration-500 ${
                  hovered ? 'opacity-100' : 'opacity-0'
                }`}
              />
            )}
          </div>
        ) : (
          /* Elegant placeholder */
          <div className="w-full h-full bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100 flex flex-col items-center justify-center gap-3 px-4">
            <div className="w-12 h-px bg-border" />
            <span className="font-display text-[11px] uppercase tracking-wide-title text-muted text-center leading-relaxed">
              {producto.nombre}
            </span>
            <div className="w-12 h-px bg-border" />
          </div>
        )}

        {/* Badge */}
        {displayBadge && (
          <span className={`absolute top-3 left-3 px-2.5 py-1 font-display text-[10px] uppercase tracking-editorial ${badgeStyles[badge] || badgeStyles.NUEVO}`}>
            {displayBadge}
          </span>
        )}

        {/* Talles preview on hover (desktop only) */}
        {!isOutOfStock && hasMultipleTalles && (
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:flex gap-1">
            {producto.talles.slice(0, 4).map((t) => (
              <span key={t} className="bg-white/90 text-primary font-display text-[9px] uppercase tracking-editorial px-1.5 py-0.5 border border-border">
                {t}
              </span>
            ))}
            {producto.talles.length > 4 && (
              <span className="bg-white/90 text-secondary font-display text-[9px] px-1.5 py-0.5 border border-border">
                +{producto.talles.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Color swatches overlaid on image corner */}
        {colores.length > 0 && (
          <div className="absolute bottom-3 left-3 z-10 flex gap-1">
            {colores.map((c) => (
              <button
                key={c.nombre}
                title={c.nombre}
                onClick={(e) => { e.stopPropagation(); setSelectedColor(selectedColor?.nombre === c.nombre ? null : c) }}
                className={`w-4 h-4 border transition-all duration-200 ${
                  selectedColor?.nombre === c.nombre
                    ? 'border-primary scale-125 ring-1 ring-primary ring-offset-1'
                    : 'border-white/70 hover:border-primary'
                }`}
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>
        )}

      </div>

      {/* Product info */}
      <div className="mt-3 space-y-1">
        <p className="font-body font-light text-[11px] uppercase tracking-[0.1em] text-secondary">
          {producto.categoria}
        </p>
        <h3 className="font-display text-[13px] uppercase tracking-editorial text-primary leading-snug">
          <a
            href={`/producto/${slugify(producto.nombre) || producto.id}`}
            onClick={(e) => e.stopPropagation()}
            className="hover:underline"
          >
            {producto.nombre}
          </a>
        </h3>
        <div className="flex items-baseline gap-2">
          <span className="font-body text-sm text-primary font-medium">
            {formatPrice(producto.precio)}
          </span>
          {producto.precioAnterior && (
            <span className="font-body text-[12px] text-secondary line-through">
              {formatPrice(producto.precioAnterior)}
            </span>
          )}
        </div>
        {cuotas && (
          <p className="font-body font-light text-[11px] text-muted">
            {cuotas}
          </p>
        )}
      </div>
    </div>
  )
}
