'use client'

import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight, Minus, Plus, MessageCircle, ArrowLeft, ShoppingBag } from 'lucide-react'
import Navbar from '@/components/landing/Navbar'
import Footer from '@/components/landing/Footer'
import CarritoPanel from '@/components/landing/CarritoPanel'
import ShareButton from '@/components/ui/ShareButton'
import SizeGuideLink from '@/components/ui/SizeGuideLink'
import FormattedDescription from '@/components/ui/FormattedDescription'
import { negocio } from '@/lib/config'
import { getStoreItem } from '@/lib/store'
import { defaultProductos } from '@/lib/defaults'

function slugify(text) {
  return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export default function ProductoPage({ params }) {
  const { id } = params
  const [producto, setProducto] = useState(null)
  const [loading, setLoading] = useState(true)

  // Product state
  const [currentImg, setCurrentImg] = useState(0)
  const [selectedTalle, setSelectedTalle] = useState(null)
  const [selectedColor, setSelectedColor] = useState(null)
  const [cantidad, setCantidad] = useState(1)
  const [talleError, setTalleError] = useState(false)

  // Cart state (synced via localStorage like the landing page)
  const [cart, setCart] = useState([])
  const [cartOpen, setCartOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(false)

  // Load product
  useEffect(() => {
    const load = async () => {
      // Try API first
      try {
        const res = await fetch('/api/data')
        const data = await res.json()
        const all = data.productos || []
        const found = all.find(p => String(p.id) === String(id) || slugify(p.nombre) === id)
        if (found) { setProducto(found); setLoading(false); return }
      } catch {}

      // Try localStorage overrides
      const local = getStoreItem('productos')
      if (local) {
        const found = local.find(p => String(p.id) === String(id) || slugify(p.nombre) === id)
        if (found) { setProducto(found); setLoading(false); return }
      }

      // Defaults
      const found = defaultProductos.find(p => String(p.id) === String(id) || slugify(p.nombre) === id)
      setProducto(found || null)
      setLoading(false)
    }
    load()
  }, [id])

  // Load cart + dark mode from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('isabella_cart')
      if (saved) setCart(JSON.parse(saved))
    } catch {}
    const theme = localStorage.getItem('isabella_theme')
    if (theme === 'dark') setDarkMode(true)
  }, [])

  useEffect(() => {
    localStorage.setItem('isabella_cart', JSON.stringify(cart))
  }, [cart])

  const toggleDarkMode = useCallback(() => {
    setDarkMode(prev => {
      const next = !prev
      localStorage.setItem('isabella_theme', next ? 'dark' : 'light')
      return next
    })
  }, [])

  const handleAddToCart = useCallback((prod, talle, qty, openCart = false, color = null) => {
    setCart(prev => {
      const existing = prev.findIndex(i => i.id === prod.id && i.talle === talle && (i.color || null) === color)
      if (existing >= 0) {
        const updated = [...prev]
        updated[existing] = { ...updated[existing], cantidad: updated[existing].cantidad + qty }
        return updated
      }
      const colorObj = color && prod.colores ? prod.colores.find(c => c.nombre === color) : null
      const cartImage = colorObj ? colorObj.imagen : (prod.imagenes?.[0] || null)
      return [...prev, {
        id: prod.id, nombre: prod.nombre, precio: prod.precio,
        talle, cantidad: qty, color,
        imagenes: cartImage ? [cartImage] : prod.imagenes,
        tallesDisponibles: prod.talles,
      }]
    })
    if (openCart) setCartOpen(true)
  }, [])

  const handleUpdateCartItem = useCallback((index, qty) => {
    setCart(prev => { const u = [...prev]; u[index] = { ...u[index], cantidad: qty }; return u })
  }, [])
  const handleRemoveCartItem = useCallback((index) => {
    setCart(prev => prev.filter((_, i) => i !== index))
  }, [])
  const handleChangeTalle = useCallback((index, newTalle) => {
    setCart(prev => {
      const item = prev[index]
      const existingIdx = prev.findIndex((i, idx) => idx !== index && i.id === item.id && i.talle === newTalle && (i.color || null) === (item.color || null))
      if (existingIdx >= 0) {
        const updated = [...prev]
        updated[existingIdx] = { ...updated[existingIdx], cantidad: updated[existingIdx].cantidad + item.cantidad }
        return updated.filter((_, i) => i !== index)
      }
      const updated = [...prev]
      updated[index] = { ...updated[index], talle: newTalle }
      return updated
    })
  }, [])
  const handleClearCart = useCallback(() => setCart([]), [])

  const cartCount = cart.reduce((sum, item) => sum + item.cantidad, 0)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="font-display text-sm uppercase tracking-editorial text-secondary animate-pulse">Cargando...</p>
      </div>
    )
  }

  if (!producto) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-6">
        <p className="font-display text-lg uppercase tracking-editorial">Producto no encontrado</p>
        <a href="/#productos" className="flex items-center gap-2 font-display text-xs uppercase tracking-editorial text-secondary hover:text-primary transition-colors">
          <ArrowLeft size={14} /> Volver a la tienda
        </a>
      </div>
    )
  }

  const colores = producto.colores && producto.colores.length > 0 ? producto.colores : []
  const activeColor = selectedColor
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

  const discount = producto.precioAnterior
    ? Math.round((1 - producto.precio / producto.precioAnterior) * 100)
    : 0

  const handleAdd = (openCart = false) => {
    if (producto.talles.length > 1 && !selectedTalle) {
      setTalleError(true)
      return
    }
    const talle = selectedTalle || producto.talles[0] || 'Unico'
    handleAddToCart(producto, talle, cantidad, openCart, activeColor?.nombre || null)
    setSelectedTalle(null)
    setCantidad(1)
    setCurrentImg(0)
    setSelectedColor(null)
  }

  const handleWhatsAppConsult = () => {
    const msg = encodeURIComponent(`Hola! Me interesa el producto: ${producto.nombre}. Esta disponible?`)
    window.location.href = `https://wa.me/${negocio.whatsapp}?text=${msg}`
  }

  return (
    <div className={darkMode ? 'dark-landing' : ''}>
      <Navbar
        cartCount={cartCount}
        onCartClick={() => setCartOpen(true)}
        onSearch={() => {}}
        categorias={[]}
        darkMode={darkMode}
        onToggleDark={toggleDarkMode}
      />

      <main className="pt-28 md:pt-32 pb-16 px-6 md:px-12">
        {/* Breadcrumb */}
        <div className="max-w-6xl mx-auto mb-6">
          <a href="/#productos" className="flex items-center gap-2 font-display text-[11px] uppercase tracking-editorial text-secondary hover:text-primary transition-colors w-fit">
            <ArrowLeft size={14} strokeWidth={1.5} /> Volver a la tienda
          </a>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {/* Gallery */}
          <div>
            <div className="relative aspect-[3/4] bg-light overflow-hidden">
              {imagenes.length > 0 ? (
                <img
                  src={imagenes[currentImg]}
                  alt={producto.nombre}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="font-display text-sm uppercase tracking-editorial text-muted">{producto.nombre}</span>
                </div>
              )}
              {imagenes.length > 1 && (
                <>
                  <button
                    onClick={() => setCurrentImg(i => i === 0 ? imagenes.length - 1 : i - 1)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-white/80 text-primary hover:bg-white transition-colors"
                  >
                    <ChevronLeft size={20} strokeWidth={1.5} />
                  </button>
                  <button
                    onClick={() => setCurrentImg(i => i === imagenes.length - 1 ? 0 : i + 1)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white/80 text-primary hover:bg-white transition-colors"
                  >
                    <ChevronRight size={20} strokeWidth={1.5} />
                  </button>
                </>
              )}
              {producto.badge && (
                <span className={`absolute top-3 left-3 px-2.5 py-1 font-display text-[10px] uppercase tracking-editorial ${
                  producto.badge === 'SALE' ? 'bg-sale text-white' : producto.badge === 'ULTIMAS' ? 'bg-nude text-primary' : 'bg-primary text-white'
                }`}>
                  {producto.badge === 'SALE' && discount > 0 ? `SALE -${discount}%` : producto.badge}
                </span>
              )}
            </div>
            {/* Thumbnails */}
            {imagenes.length > 1 && (
              <div className="flex gap-2 mt-3">
                {imagenes.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImg(i)}
                    className={`w-16 h-20 flex-shrink-0 overflow-hidden border transition-all ${
                      i === currentImg ? 'border-primary' : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <p className="font-body font-light text-[11px] uppercase tracking-[0.1em] text-secondary">
              {[producto.seccion, producto.categoria].filter(Boolean).join(' — ')}
            </p>
            <h1 className="font-display text-2xl md:text-3xl uppercase tracking-editorial mt-2">
              {producto.nombre}
            </h1>
            {producto.marca && (
              <p className="font-body text-xs text-secondary mt-1">{producto.marca}</p>
            )}

            <div className="flex items-baseline gap-3 mt-4">
              <span className="font-body text-2xl text-primary">
                {formatPrice(producto.precio)}
              </span>
              {producto.precioAnterior && (
                <span className="font-body text-lg text-secondary line-through">
                  {formatPrice(producto.precioAnterior)}
                </span>
              )}
            </div>
            {cuotas && (
              <p className="font-body font-light text-xs text-muted mt-1">{cuotas}</p>
            )}

            <div className="my-5 border-t border-border" />

            <FormattedDescription text={producto.descripcion} />

            {!isOutOfStock ? (
              <>
                {/* Color selector */}
                {colores.length > 0 && (
                  <div className="mt-6">
                    <span className="font-display text-[11px] uppercase tracking-editorial mb-2 block">
                      Color{activeColor ? `: ${activeColor.nombre}` : ''}
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {colores.map((c) => (
                        <button
                          key={c.nombre}
                          title={c.nombre}
                          onClick={() => { setSelectedColor(activeColor?.nombre === c.nombre ? null : c); setCurrentImg(0) }}
                          className={`w-9 h-9 border-2 transition-all duration-200 ${
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
                  <div className="mt-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-display text-[11px] uppercase tracking-editorial">Talle</span>
                      <SizeGuideLink />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {producto.talles.map((t) => (
                        <button
                          key={t}
                          onClick={() => { setSelectedTalle(t); setTalleError(false) }}
                          className={`min-w-[44px] px-3 py-2.5 font-display text-[11px] uppercase tracking-editorial border transition-colors ${
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
                <div className="mt-6">
                  <span className="font-display text-[11px] uppercase tracking-editorial mb-2 block">Cantidad</span>
                  <div className="flex items-center border border-border w-fit">
                    <button onClick={() => setCantidad(q => Math.max(1, q - 1))} className="p-2.5 text-primary hover:text-secondary transition-colors">
                      <Minus size={16} strokeWidth={1.5} />
                    </button>
                    <span className="px-5 font-body text-base">{cantidad}</span>
                    <button onClick={() => setCantidad(q => q + 1)} className="p-2.5 text-primary hover:text-secondary transition-colors">
                      <Plus size={16} strokeWidth={1.5} />
                    </button>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-8 space-y-3">
                  <button
                    onClick={() => handleAdd(false)}
                    className="w-full h-14 bg-primary text-white font-display text-xs uppercase tracking-editorial hover:bg-primary-hover transition-colors flex items-center justify-center gap-2"
                  >
                    <ShoppingBag size={16} strokeWidth={1.5} /> AGREGAR AL CARRITO
                  </button>
                  <button
                    onClick={() => handleAdd(true)}
                    className="w-full h-14 bg-white text-primary border border-primary font-display text-xs uppercase tracking-editorial hover:bg-light transition-colors"
                  >
                    COMPRAR AHORA
                  </button>
                </div>
              </>
            ) : (
              <div className="mt-8 space-y-3">
                <p className="font-display text-sm uppercase tracking-editorial text-secondary text-center py-4">
                  PRODUCTO AGOTADO
                </p>
                <button
                  onClick={handleWhatsAppConsult}
                  className="w-full h-14 bg-whatsapp text-white font-display text-xs uppercase tracking-editorial flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                >
                  <MessageCircle size={16} strokeWidth={1.5} />
                  CONSULTAR POR WHATSAPP
                </button>
              </div>
            )}

            {/* Share */}
            <div className="mt-6 pt-6 border-t border-border">
              <ShareButton producto={producto} variant="full" />
            </div>
          </div>
        </div>
      </main>

      <Footer />

      <CarritoPanel
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cart}
        onUpdateItem={handleUpdateCartItem}
        onRemoveItem={handleRemoveCartItem}
        onChangeTalle={handleChangeTalle}
        onClear={handleClearCart}
      />
    </div>
  )
}
