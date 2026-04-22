'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Minus, Plus, MessageCircle } from 'lucide-react'
import Modal from '@/components/ui/Modal'
import FormattedDescription from '@/components/ui/FormattedDescription'
import ShareButton from '@/components/ui/ShareButton'
import SizeGuideLink from '@/components/ui/SizeGuideLink'
import { negocio } from '@/lib/config'

export default function QuickViewModal({ producto, isOpen, onClose, onAddToCart }) {
  const [selectedTalle, setSelectedTalle] = useState(null)
  const [cantidad, setCantidad] = useState(1)
  const [currentImg, setCurrentImg] = useState(0)
  const [talleError, setTalleError] = useState(false)
  const [selectedColor, setSelectedColor] = useState(null)
  const [hasPickedColor, setHasPickedColor] = useState(false)

  if (!producto) return null

  const colores = producto.colores && producto.colores.length > 0 ? producto.colores : []

  const activeColor = hasPickedColor ? selectedColor : (producto._selectedColor ?? null)

  const baseImages = producto.imagenes && producto.imagenes.length > 0 ? producto.imagenes : []
  const imagenes = activeColor
    ? [activeColor.imagen, ...baseImages.filter(img => img !== activeColor.imagen)]
    : baseImages

  const isOutOfStock = producto.stock <= 0 || producto.disponible === false

  const formatPrice = (p) =>
    new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0 }).format(p)

  const cuotas = producto.precio > 0
    ? `3 cuotas sin interes de ${formatPrice(Math.ceil(producto.precio / 3))}`
    : ''

  const handleAdd = (openCart = false) => {
    if (producto.talles.length > 1 && !selectedTalle) {
      setTalleError(true)
      return
    }
    const talle = selectedTalle || producto.talles[0] || 'Unico'
    const colorName = activeColor?.nombre || null
    onAddToCart(producto, talle, cantidad, openCart, colorName)
    onClose()
    setSelectedTalle(null)
    setCantidad(1)
    setCurrentImg(0)
    setTalleError(false)
    setSelectedColor(null)
    setHasPickedColor(false)
  }

  const handleWhatsAppConsult = () => {
    const msg = encodeURIComponent(`Hola! Me interesa el producto: ${producto.nombre}. Esta disponible?`)
    window.location.href = `https://wa.me/${negocio.whatsapp}?text=${msg}`
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-[900px]">
      {/* Desktop: fixed height grid so nothing shifts. Mobile: natural flow. */}
      <div className="grid grid-cols-1 md:grid-cols-[55%_45%] md:max-h-[88vh]">

        {/* Image — fixed aspect on both breakpoints, no cropping */}
        <div className="relative bg-light overflow-hidden">
          {imagenes.length > 0 ? (
            <>
              <div className="aspect-[3/4]">
                <img
                  src={imagenes[currentImg]}
                  alt={producto.nombre}
                  className="w-full h-full object-cover"
                />
              </div>
              {imagenes.length > 1 && (
                <>
                  <button
                    onClick={() => setCurrentImg(i => i === 0 ? imagenes.length - 1 : i - 1)}
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-1 bg-white/80 text-primary hover:bg-white transition-colors"
                    aria-label="Anterior"
                  >
                    <ChevronLeft size={18} strokeWidth={1.5} />
                  </button>
                  <button
                    onClick={() => setCurrentImg(i => i === imagenes.length - 1 ? 0 : i + 1)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 bg-white/80 text-primary hover:bg-white transition-colors"
                    aria-label="Siguiente"
                  >
                    <ChevronRight size={18} strokeWidth={1.5} />
                  </button>
                  {/* Thumbnail strip — overlaid at bottom of image */}
                  <div className="absolute bottom-0 left-0 right-0 flex gap-1.5 p-2 bg-gradient-to-t from-black/20 to-transparent">
                    {imagenes.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentImg(i)}
                        className={`w-10 h-12 flex-shrink-0 overflow-hidden border transition-all ${
                          i === currentImg ? 'border-white opacity-100' : 'border-transparent opacity-60 hover:opacity-90'
                        }`}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="aspect-[3/4] flex items-center justify-center">
              <span className="font-display text-sm uppercase tracking-editorial text-muted">
                {producto.nombre}
              </span>
            </div>
          )}
        </div>

        {/* Info — fills column, scrolls only if content overflows */}
        <div className="p-6 md:p-8 flex flex-col md:overflow-y-auto">
          <p className="font-body font-light text-[11px] uppercase tracking-[0.1em] text-secondary">
            {producto.categoria}
          </p>
          <h2 className="font-display text-lg uppercase tracking-editorial mt-1">
            {producto.nombre}
          </h2>

          <div className="flex items-center gap-3 mt-3">
            <span className="font-body text-xl text-primary">
              {formatPrice(producto.precio)}
            </span>
            {producto.precioAnterior && (
              <span className="font-body text-base text-secondary line-through">
                {formatPrice(producto.precioAnterior)}
              </span>
            )}
          </div>
          {cuotas && (
            <p className="font-body font-light text-xs text-muted mt-1">{cuotas}</p>
          )}

          <div className="my-3 border-t border-border" />

          <FormattedDescription text={producto.descripcion} />

          {!isOutOfStock ? (
            <>
              {/* Color selector */}
              {colores.length > 0 && (
                <div className="mt-4">
                  <span className="font-display text-[11px] uppercase tracking-editorial mb-2 block">
                    Color{activeColor ? `: ${activeColor.nombre}` : ''}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {colores.map((c) => (
                      <button
                        key={c.nombre}
                        title={c.nombre}
                        onClick={() => { setSelectedColor(activeColor?.nombre === c.nombre ? null : c); setHasPickedColor(true); setCurrentImg(0) }}
                        className={`w-8 h-8 border-2 transition-all duration-200 ${
                          activeColor?.nombre === c.nombre
                            ? 'border-primary scale-110 ring-2 ring-primary ring-offset-2'
                            : 'border-border hover:border-primary'
                        }`}
                        style={{ backgroundColor: c.hex }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Talle selector */}
              {producto.talles.length > 0 && (
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-display text-[11px] uppercase tracking-editorial">Talle</span>
                    <SizeGuideLink />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {producto.talles.map((t) => (
                      <button
                        key={t}
                        onClick={() => { setSelectedTalle(t); setTalleError(false) }}
                        className={`min-w-[40px] px-3 py-2 font-display text-[11px] uppercase tracking-editorial border transition-colors ${
                          selectedTalle === t
                            ? 'bg-primary text-white border-primary'
                            : `bg-white text-primary border-primary/30 hover:border-primary ${talleError ? 'border-sale' : ''}`
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                  {talleError && (
                    <p className="mt-1 font-body text-xs text-sale">Selecciona un talle</p>
                  )}
                </div>
              )}

              {/* Quantity */}
              <div className="mt-4">
                <span className="font-display text-[11px] uppercase tracking-editorial mb-2 block">Cantidad</span>
                <div className="flex items-center border border-border w-fit">
                  <button
                    onClick={() => setCantidad(q => Math.max(1, q - 1))}
                    className="p-2 text-primary hover:text-secondary transition-colors"
                  >
                    <Minus size={14} strokeWidth={1.5} />
                  </button>
                  <span className="px-4 font-body text-sm">{cantidad}</span>
                  <button
                    onClick={() => setCantidad(q => q + 1)}
                    className="p-2 text-primary hover:text-secondary transition-colors"
                  >
                    <Plus size={14} strokeWidth={1.5} />
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 space-y-3">
                <button
                  onClick={() => handleAdd(false)}
                  className="w-full h-12 bg-primary text-white font-display text-xs uppercase tracking-editorial hover:bg-primary-hover transition-colors"
                >
                  AGREGAR AL CARRITO
                </button>
                <button
                  onClick={() => handleAdd(true)}
                  className="w-full h-12 bg-white text-primary border border-primary font-display text-xs uppercase tracking-editorial hover:bg-light transition-colors"
                >
                  COMPRAR AHORA
                </button>
              </div>
            </>
          ) : (
            <div className="mt-6 space-y-3">
              <p className="font-display text-sm uppercase tracking-editorial text-secondary text-center py-4">
                PRODUCTO AGOTADO
              </p>
              <button
                onClick={handleWhatsAppConsult}
                className="w-full h-12 bg-whatsapp text-white font-display text-xs uppercase tracking-editorial flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
              >
                <MessageCircle size={16} strokeWidth={1.5} />
                CONSULTAR POR WHATSAPP
              </button>
            </div>
          )}

          {/* Share */}
          <div className="mt-4 pt-4 border-t border-border">
            <ShareButton producto={producto} variant="full" />
          </div>
        </div>
      </div>
    </Modal>
  )
}
