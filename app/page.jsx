'use client'

import { useState, useEffect, useCallback } from 'react'
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
import {
  defaultHeroSlides,
  defaultCategoryBlocks,
  defaultProductos,
  defaultTestimonios,
  defaultBanners,
  defaultInstagramPhotos,
  defaultPromos,
  defaultMarcas,
} from '@/lib/defaults'

export default function HomePage() {
  const [data, setData] = useState(null)
  const [adminOverrides, setAdminOverrides] = useState({})
  const [cart, setCart] = useState([])
  const [cartOpen, setCartOpen] = useState(false)
  const [quickViewProduct, setQuickViewProduct] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedBrand, setSelectedBrand] = useState(null)
  const [darkMode, setDarkMode] = useState(false)

  // Load data from API
  useEffect(() => {
    fetch('/api/data')
      .then((res) => res.json())
      .then((d) => setData(d))
      .catch(() => setData(null))
  }, [])

  // Load admin overrides from localStorage (only use if valid arrays with content)
  useEffect(() => {
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
    })
  }, [])

  // Load dark mode preference
  useEffect(() => {
    const saved = localStorage.getItem('isabella_theme')
    if (saved === 'dark') setDarkMode(true)
  }, [])

  const toggleDarkMode = useCallback(() => {
    setDarkMode(prev => {
      const next = !prev
      localStorage.setItem('isabella_theme', next ? 'dark' : 'light')
      return next
    })
  }, [])

  // Load cart from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('isabella_cart')
      if (saved) setCart(JSON.parse(saved))
    } catch {}
  }, [])

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem('isabella_cart', JSON.stringify(cart))
  }, [cart])

  // Priority: admin overrides > API data > defaults
  const heroSlides = adminOverrides.heroSlides || data?.heroSlides || defaultHeroSlides
  const categoryBlocks = adminOverrides.categoryBlocks || data?.categoryBlocks || defaultCategoryBlocks
  const productos = adminOverrides.productos || data?.productos || defaultProductos
  const testimonios = adminOverrides.testimonios || data?.testimonios || defaultTestimonios
  const banners = adminOverrides.banners || data?.banners || defaultBanners
  const instagramPhotos = adminOverrides.instagramPhotos || data?.instagramPhotos || defaultInstagramPhotos
  const marcas = adminOverrides.marcas || data?.marcas || defaultMarcas
  const promos = adminOverrides.promos
    || (data?.config?.promos ? String(data.config.promos).split('|').map(s => s.trim()) : null)
    || defaultPromos

  const categorias = [...new Set(productos.map(p => p.categoria).filter(Boolean))]

  const preBanners = banners.filter(b => b.ubicacion === 'pre-productos')
  const midBanners = banners.filter(b => b.ubicacion === 'mid-productos')
  const postBanners = banners.filter(b => b.ubicacion === 'post-productos')

  const cartCount = cart.reduce((sum, item) => sum + item.cantidad, 0)

  const handleAddToCart = useCallback((producto, talle, cantidad, openCart = false) => {
    setCart((prev) => {
      const existing = prev.findIndex(i => i.id === producto.id && i.talle === talle)
      if (existing >= 0) {
        const updated = [...prev]
        updated[existing] = { ...updated[existing], cantidad: updated[existing].cantidad + cantidad }
        return updated
      }
      return [...prev, {
        id: producto.id,
        nombre: producto.nombre,
        precio: producto.precio,
        talle,
        cantidad,
        imagenes: producto.imagenes,
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
      const existingIdx = prev.findIndex((i, idx) => idx !== index && i.id === item.id && i.talle === newTalle)
      if (existingIdx >= 0) {
        // Merge into existing
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
    <div className={darkMode ? 'dark-landing' : ''}>
      <PromoBar promos={promos} />
      <Navbar
        cartCount={cartCount}
        onCartClick={() => setCartOpen(true)}
        onSearch={setSearchQuery}
        categorias={categorias}
        darkMode={darkMode}
        onToggleDark={toggleDarkMode}
      />
      <Hero slides={heroSlides} />
      <CategoryBlocks blocks={categoryBlocks} onCategoryClick={handleCategoryClick} />
      <BrandsCarousel marcas={marcas} activeMarca={selectedBrand} onBrandClick={handleBrandClick} />

      {preBanners.map((b) => <EditorialBanner key={b.id} banner={b} />)}

      <ProductGrid
        productos={productos}
        searchQuery={searchQuery}
        initialCategory={selectedCategory}
        activeBrand={selectedBrand}
        onClearBrand={() => setSelectedBrand(null)}
        onQuickView={setQuickViewProduct}
        onAddToCart={handleAddToCart}
      />

      {midBanners.map((b) => <EditorialBanner key={b.id} banner={b} />)}

      <Testimonios testimonios={testimonios} />
      <InstagramFeed photos={instagramPhotos} />

      {postBanners.map((b) => <EditorialBanner key={b.id} banner={b} />)}

      <Newsletter />
      <Footer />

      <QuickViewModal
        producto={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
      />

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
