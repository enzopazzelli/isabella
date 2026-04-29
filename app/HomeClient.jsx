'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import PromoBar from '@/components/landing/PromoBar'
import Navbar from '@/components/landing/Navbar'
import Hero from '@/components/landing/Hero'
import CategoryBlocks from '@/components/landing/CategoryBlocks'
import BrandsCarousel from '@/components/landing/BrandsCarousel'
import EditorialBanner from '@/components/landing/EditorialBanner'
import ProductGrid from '@/components/landing/ProductGrid'
import QuickViewModal from '@/components/landing/QuickViewModal'
import Testimonios from '@/components/landing/Testimonios'
import InstagramFeed from '@/components/landing/InstagramFeed'
import Newsletter from '@/components/landing/Newsletter'
import Footer from '@/components/landing/Footer'
import CarritoPanel from '@/components/landing/CarritoPanel'
import { getStoreItem } from '@/lib/store'
import { mergeNegocio } from '@/lib/runtimeConfig'

export default function HomeClient({
  initialHeroSlides,
  initialCategoryBlocks,
  initialProductos,
  initialTestimonios,
  initialBanners,
  initialInstagramPhotos,
  initialMarcas,
  initialPromos,
  negocio,
}) {
  const [adminOverrides, setAdminOverrides] = useState({})
  const [cart, setCart] = useState([])
  const [cartOpen, setCartOpen] = useState(false)
  const [quickViewProduct, setQuickViewProduct] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedSeccion, setSelectedSeccion] = useState(null)
  const [selectedBrand, setSelectedBrand] = useState(null)
  const [darkMode, setDarkMode] = useState(false)
  const hydrated = useRef(false)

  // Hidratación única: URL params + admin overrides + dark mode + cart desde localStorage
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const seccion = params.get('seccion')
    const categoria = params.get('categoria')
    const marca = params.get('marca')
    if (seccion) setSelectedSeccion(seccion)
    if (categoria) setSelectedCategory(categoria)
    if (marca) setSelectedBrand(marca)

    const validArray = (arr) => Array.isArray(arr) && arr.length > 0 ? arr : null
    setAdminOverrides({
      heroSlides: validArray(getStoreItem('hero_slides')),
      categoryBlocks: validArray(getStoreItem('category_blocks')),
      banners: validArray(getStoreItem('banners')),
      productos: validArray(getStoreItem('productos')),
      testimonios: validArray(getStoreItem('testimonios')),
      promos: validArray(getStoreItem('promos')),
      marcas: validArray(getStoreItem('marcas')),
      instagramPhotos: validArray(getStoreItem('instagram_photos')),
      config: getStoreItem('config') || null,
    })

    setDarkMode(document.documentElement.classList.contains('dark-landing'))

    try {
      const saved = localStorage.getItem('isabella_cart')
      if (saved) setCart(JSON.parse(saved))
    } catch {}

    hydrated.current = true

    const handlePop = () => {
      const p = new URLSearchParams(window.location.search)
      setSelectedSeccion(p.get('seccion'))
      setSelectedCategory(p.get('categoria'))
      setSelectedBrand(p.get('marca'))
    }
    window.addEventListener('popstate', handlePop)
    return () => window.removeEventListener('popstate', handlePop)
  }, [])

  // Sync URL ↔ filtros
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (selectedSeccion) params.set('seccion', selectedSeccion); else params.delete('seccion')
    if (selectedCategory) params.set('categoria', selectedCategory); else params.delete('categoria')
    if (selectedBrand) params.set('marca', selectedBrand); else params.delete('marca')
    const qs = params.toString()
    const newUrl = `${window.location.pathname}${qs ? '?' + qs : ''}${window.location.hash}`
    if (newUrl !== window.location.pathname + window.location.search + window.location.hash) {
      window.history.replaceState({}, '', newUrl)
    }
  }, [selectedSeccion, selectedCategory, selectedBrand])

  // Persist cart (saltea primer render para no pisar el localStorage antes de hidratar)
  useEffect(() => {
    if (!hydrated.current) return
    localStorage.setItem('isabella_cart', JSON.stringify(cart))
  }, [cart])

  const toggleDarkMode = useCallback(() => {
    setDarkMode(prev => {
      const next = !prev
      document.documentElement.classList.toggle('dark-landing', next)
      localStorage.setItem('isabella_theme', next ? 'dark' : 'light')
      return next
    })
  }, [])

  const heroSlides = adminOverrides.heroSlides || initialHeroSlides
  const categoryBlocks = adminOverrides.categoryBlocks || initialCategoryBlocks
  const productos = adminOverrides.productos || initialProductos
  const testimonios = adminOverrides.testimonios || initialTestimonios
  const banners = adminOverrides.banners || initialBanners
  const instagramPhotos = adminOverrides.instagramPhotos || initialInstagramPhotos
  const marcas = adminOverrides.marcas || initialMarcas
  const promos = adminOverrides.promos || initialPromos
  const negocioRuntime = adminOverrides.config ? mergeNegocio({ ...negocio, ...adminOverrides.config }) : negocio

  const categorias = [...new Set(productos.map(p => p.categoria).filter(Boolean))]

  const preBanners = banners.filter(b => b.ubicacion === 'pre-productos')
  const midBanners = banners.filter(b => b.ubicacion === 'mid-productos')
  const postBanners = banners.filter(b => b.ubicacion === 'post-productos')

  const cartCount = cart.reduce((sum, item) => sum + item.cantidad, 0)

  const handleAddToCart = useCallback((producto, talle, cantidad, openCart = false, color = null) => {
    setCart((prev) => {
      const existing = prev.findIndex(i => i.id === producto.id && i.talle === talle && (i.color || null) === color)
      if (existing >= 0) {
        const updated = [...prev]
        updated[existing] = { ...updated[existing], cantidad: updated[existing].cantidad + cantidad }
        return updated
      }
      const colorObj = color && producto.colores ? producto.colores.find(c => c.nombre === color) : null
      const cartImage = colorObj ? colorObj.imagen : (producto.imagenes?.[0] || null)
      return [...prev, {
        id: producto.id,
        nombre: producto.nombre,
        precio: producto.precio,
        talle,
        cantidad,
        color,
        imagenes: cartImage ? [cartImage] : producto.imagenes,
        tallesDisponibles: producto.talles,
      }]
    })
    if (openCart) setCartOpen(true)
  }, [])

  const handleUpdateCartItem = useCallback((index, cantidad) => {
    setCart((prev) => {
      const updated = [...prev]
      updated[index] = { ...updated[index], cantidad }
      return updated
    })
  }, [])

  const handleRemoveCartItem = useCallback((index) => {
    setCart((prev) => prev.filter((_, i) => i !== index))
  }, [])

  const handleChangeTalle = useCallback((index, newTalle) => {
    setCart((prev) => {
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

  const handleCategoryClick = useCallback((catName) => {
    setSelectedCategory(catName)
    const el = document.getElementById('productos')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }, [])

  const handleBrandClick = useCallback((brandName) => {
    setSelectedBrand(brandName)
    if (brandName) {
      const el = document.getElementById('productos')
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }
  }, [])

  return (
    <div>
      <PromoBar promos={promos} />
      <Navbar
        cartCount={cartCount}
        onCartClick={() => setCartOpen(true)}
        onSearch={setSearchQuery}
        categorias={categorias}
        darkMode={darkMode}
        onToggleDark={toggleDarkMode}
        negocio={negocioRuntime}
      />
      <Hero slides={heroSlides} />
      <CategoryBlocks blocks={categoryBlocks} onCategoryClick={handleCategoryClick} />
      <BrandsCarousel marcas={marcas} activeMarca={selectedBrand} onBrandClick={handleBrandClick} />

      {preBanners.map((b) => <EditorialBanner key={b.id} banner={b} />)}

      <ProductGrid
        productos={productos}
        searchQuery={searchQuery}
        initialCategory={selectedCategory}
        initialSeccion={selectedSeccion}
        activeBrand={selectedBrand}
        onClearBrand={() => setSelectedBrand(null)}
        onSeccionChange={setSelectedSeccion}
        onCategoryChange={setSelectedCategory}
        onQuickView={setQuickViewProduct}
      />

      {midBanners.map((b) => <EditorialBanner key={b.id} banner={b} />)}

      <Testimonios testimonios={testimonios} />
      <InstagramFeed photos={instagramPhotos} negocio={negocioRuntime} />

      {postBanners.map((b) => <EditorialBanner key={b.id} banner={b} />)}

      <Newsletter />
      <Footer negocio={negocioRuntime} />

      <QuickViewModal
        producto={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
        negocio={negocioRuntime}
      />

      <CarritoPanel
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cart}
        onUpdateItem={handleUpdateCartItem}
        onRemoveItem={handleRemoveCartItem}
        onChangeTalle={handleChangeTalle}
        onClear={handleClearCart}
        negocio={negocioRuntime}
      />
    </div>
  )
}
