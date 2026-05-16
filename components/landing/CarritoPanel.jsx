'use client'

import { useState, useEffect } from 'react'
import { X, Minus, Plus, ShoppingBag, MessageCircle, CreditCard } from 'lucide-react'
import { negocio as defaultNegocio } from '@/lib/config'
import { generateOrderId, saveOrder, postOrderRemote } from '@/lib/orders'
import SizeGuideLink from '@/components/ui/SizeGuideLink'

export default function CarritoPanel({ isOpen, onClose, items = [], onUpdateItem, onRemoveItem, onChangeTalle, onClear, negocio = defaultNegocio }) {
  const [nombre, setNombre] = useState('')
  const [notas, setNotas] = useState('')

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('overflow-hidden')
    } else {
      document.body.classList.remove('overflow-hidden')
    }
    return () => document.body.classList.remove('overflow-hidden')
  }, [isOpen])

  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [onClose])

  const total = items.reduce((sum, item) => sum + item.precio * item.cantidad, 0)

  const formatPrice = (p) =>
    new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0 }).format(p)

  const handleCheckout = () => {
    if (!items.length) return

    const orderId = generateOrderId()

    const order = {
      id: orderId,
      fecha: new Date().toISOString(),
      cliente: nombre || 'Sin nombre',
      notas,
      items: items.map(i => ({
        id: i.id,
        nombre: i.nombre,
        talle: i.talle,
        color: i.color || null,
        precio: i.precio,
        cantidad: i.cantidad,
      })),
      total,
      estado: 'pendiente',
    }

    saveOrder(order)
    postOrderRemote(order)

    let msg = `¡Hola! Vengo a hacer un pedido \u2728\n\n`
    msg += `Pedido #${orderId}${nombre ? ` — ${nombre}` : ''}\n\n`
    msg += `Me llevo:\n`
    items.forEach(item => {
      msg += `- ${item.nombre}`
      if (item.color) msg += ` · ${item.color}`
      if (item.talle && item.talle !== 'Unico') msg += ` · Talle ${item.talle}`
      msg += ` · x${item.cantidad} — ${formatPrice(item.precio * item.cantidad)}\n`
    })
    msg += `\nTotal: ${formatPrice(total)}`
    if (notas) msg += `\n\nNotas: ${notas}`
    msg += `\n\n¡Gracias! \uD83D\uDC8C`

    const encodedMsg = encodeURIComponent(msg)
    window.location.href = `https://wa.me/${negocio.whatsapp}?text=${encodedMsg}`

    onClear()
    onClose()
  }

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-50 bg-black/40"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed top-0 right-0 z-50 h-full w-full sm:w-[420px] bg-white flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="font-display text-sm uppercase tracking-editorial">CARRITO</h2>
          <button onClick={onClose} className="p-1 text-primary hover:text-secondary transition-colors" aria-label="Cerrar">
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        {items.length === 0 ? (
          /* Empty state */
          <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6">
            <ShoppingBag size={48} strokeWidth={1} className="text-muted" />
            <p className="font-display font-light text-base uppercase tracking-editorial">
              Tu carrito esta vacio
            </p>
            <button
              onClick={() => {
                onClose()
                setTimeout(() => {
                  const el = document.getElementById('productos')
                  if (el) el.scrollIntoView({ behavior: 'smooth' })
                }, 100)
              }}
              className="border border-primary text-primary font-display text-xs uppercase tracking-editorial px-6 py-2.5 hover:bg-primary hover:text-white transition-all duration-300"
            >
              VER PRODUCTOS
            </button>
          </div>
        ) : (
          <>
            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <div className="mb-3">
                <SizeGuideLink />
              </div>

              <div className="space-y-4">
                {items.map((item, idx) => (
                  <CartItem
                    key={`${item.id}-${item.talle}-${idx}`}
                    item={item}
                    onUpdate={(qty) => onUpdateItem(idx, qty)}
                    onRemove={() => onRemoveItem(idx)}
                    onChangeTalle={(newTalle) => onChangeTalle(idx, newTalle)}
                    formatPrice={formatPrice}
                  />
                ))}
              </div>

              <div className="border-t border-border mt-6 pt-4 space-y-3">
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Tu nombre"
                  className="w-full bg-transparent border-b border-border focus:border-primary pb-2 outline-none font-body text-sm text-primary placeholder:text-muted transition-colors"
                />
                <textarea
                  value={notas}
                  onChange={(e) => setNotas(e.target.value)}
                  placeholder="Notas (opcional)"
                  rows={2}
                  className="w-full bg-transparent border border-border p-2 outline-none font-body text-sm text-primary placeholder:text-muted resize-none focus:border-primary transition-colors"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-border">
              <div className="flex items-center justify-between mb-4">
                <span className="font-display text-sm uppercase tracking-editorial">Total</span>
                <span className="font-display font-semibold text-lg">{formatPrice(total)}</span>
              </div>
              <button
                onClick={handleCheckout}
                className="w-full h-12 bg-whatsapp text-white font-display text-xs uppercase tracking-editorial flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
              >
                <MessageCircle size={16} strokeWidth={1.5} />
                FINALIZAR COMPRA POR WHATSAPP
              </button>
              <div className="flex items-start gap-2 mt-3 px-1">
                <CreditCard size={14} strokeWidth={1.5} className="text-secondary mt-0.5 flex-shrink-0" />
                <p className="font-body text-[11px] text-secondary leading-relaxed">
                  Pagos con tarjeta de credito o debito se reciben unicamente en el local.
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  )
}

function CartItem({ item, onUpdate, onRemove, onChangeTalle, formatPrice }) {
  const [talleOpen, setTalleOpen] = useState(false)

  return (
    <div className="flex gap-3">
      {/* Thumbnail */}
      <div className="w-[60px] h-[80px] flex-shrink-0 bg-light overflow-hidden">
        {item.imagenes && item.imagenes[0] ? (
          <img src={item.imagenes[0]} alt={item.nombre} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="font-display text-[8px] uppercase text-muted">IMG</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h4 className="font-display text-xs uppercase tracking-editorial truncate">{item.nombre}</h4>
        {item.color && (
          <p className="font-body text-[11px] text-secondary mt-0.5">Color: {item.color}</p>
        )}

        {/* Talle selector */}
        <div className="relative mt-1">
          <button
            onClick={() => setTalleOpen(!talleOpen)}
            className="font-body text-[11px] text-secondary hover:text-primary transition-colors"
          >
            Talle: {item.talle}
          </button>
          {talleOpen && item.tallesDisponibles && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-border shadow-sm z-10 flex gap-1 p-1">
              {item.tallesDisponibles.map((t) => (
                <button
                  key={t}
                  onClick={() => { onChangeTalle(t); setTalleOpen(false) }}
                  className={`px-2 py-1 font-display text-[10px] uppercase border ${
                    t === item.talle ? 'bg-primary text-white border-primary' : 'border-border hover:border-primary'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          )}
        </div>

        <p className="font-body text-xs text-secondary mt-0.5">{formatPrice(item.precio)}</p>

        {/* Quantity + remove */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center border border-border">
            <button onClick={() => onUpdate(Math.max(1, item.cantidad - 1))} className="p-1">
              <Minus size={12} strokeWidth={1.5} />
            </button>
            <span className="px-2 font-body text-xs">{item.cantidad}</span>
            <button onClick={() => onUpdate(item.cantidad + 1)} className="p-1">
              <Plus size={12} strokeWidth={1.5} />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-body text-xs font-medium">{formatPrice(item.precio * item.cantidad)}</span>
            <button onClick={onRemove} className="text-muted hover:text-primary transition-colors">
              <X size={14} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
