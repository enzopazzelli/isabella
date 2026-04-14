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

  if (!producto) return null

  const imagenes = producto.imagenes && producto.imagenes.length > 0 ? producto.imagenes : []
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
    onAddToCart(producto, talle, cantidad, openCart)
    onClose()
    setSelectedTalle(null)
    setCantidad(1)
    setCurrentImg(0)
    setTalleError(false)
  }

  const handleWhatsAppConsult = () => {
    const msg = encodeURIComponent(`Hola! Me interesa el producto: ${producto.nombre}. Esta disponible?`)
    window.location.href = `https://wa.me/${negocio.whatsapp}?text=${msg}`
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-[900px]">
      <div className="grid grid-cols-1 md:grid-cols-[55%_45%]">
        {/* Images */}
        <div className="relative bg-light">
          {imagenes.length > 0 ? (
            <>
              <div className="aspect-[3/4] md:aspect-auto md:h-full">
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
                </>
              )}
              {imagenes.length > 1 && (
                <div className="flex gap-2 p-3 overflow-x-auto">
                  {imagenes.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentImg(i)}
                      className={`w-14 h-[72px] flex-shrink-0 overflow-hidden border ${
                        i === currentImg ? 'border-primary' : 'border-border'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
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

        {/* Info */}
        <div className="p-6 md:p-8 flex flex-col">
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

          <div className="my-4 border-t border-border" />

          <FormattedDescription text={producto.descripcion} />

          {!isOutOfStock ? (
            <>
              {/* Talle selector */}
              {producto.talles.length > 0 && (
                <div className="mt-5">
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
