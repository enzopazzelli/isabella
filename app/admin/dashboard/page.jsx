'use client'

import { useState, useEffect } from 'react'
import { ExternalLink, RefreshCw, LogOut, Eye, ArrowLeft, Sun, Moon } from 'lucide-react'
import { adminPassword } from '@/lib/config'
import { getSheetEditUrl } from '@/lib/admin'
import { getStoreItem, setStoreItem } from '@/lib/store'
import {
  defaultHeroSlides,
  defaultCategoryBlocks,
  defaultProductos,
  defaultBanners,
  defaultTestimonios,
  defaultInstagramPhotos,
  defaultPromos,
  defaultMarcas,
} from '@/lib/defaults'
import HeroManager from '@/components/admin/HeroManager'
import CategoryManager from '@/components/admin/CategoryManager'
import BrandManager from '@/components/admin/BrandManager'
import BannerManager from '@/components/admin/BannerManager'
import ProductoManager from '@/components/admin/ProductoManager'
import PromoManager from '@/components/admin/PromoManager'
import TestimonioManager from '@/components/admin/TestimonioManager'
import InstagramManager from '@/components/admin/InstagramManager'
import ConfigManager from '@/components/admin/ConfigManager'
import PedidosManager from '@/components/admin/PedidosManager'

const tabs = [
  { id: 'landing', label: 'LANDING' },
  { id: 'productos', label: 'PRODUCTOS' },
  { id: 'textos', label: 'TEXTOS Y PROMOS' },
  { id: 'pedidos', label: 'PEDIDOS' },
  { id: 'config', label: 'CONFIGURACION' },
]

export default function AdminDashboard() {
  const [authed, setAuthed] = useState(false)
  const [pass, setPass] = useState('')
  const [error, setError] = useState(false)
  const [activeTab, setActiveTab] = useState('landing')
  const [data, setData] = useState(null)
  const [darkMode, setDarkMode] = useState(false)

  // Data states (loaded from store or defaults)
  const [heroSlides, setHeroSlides] = useState([])
  const [categoryBlocks, setCategoryBlocks] = useState([])
  const [marcas, setMarcas] = useState([])
  const [banners, setBanners] = useState([])
  const [productos, setProductos] = useState([])
  const [testimonios, setTestimonios] = useState([])
  const [promos, setPromos] = useState([])
  const [instagramPhotos, setInstagramPhotos] = useState([])

  useEffect(() => {
    const saved = localStorage.getItem('isabella_admin_auth')
    if (saved === 'true') setAuthed(true)
    const theme = localStorage.getItem('isabella_admin_dark')
    if (theme === 'true') setDarkMode(true)
  }, [])

  useEffect(() => {
    if (!authed) return
    // Load from store or API, then defaults
    fetch('/api/data')
      .then(r => r.json())
      .then(d => setData(d))
      .catch(() => {})

    setHeroSlides(getStoreItem('hero_slides') || defaultHeroSlides)
    setCategoryBlocks(getStoreItem('category_blocks') || defaultCategoryBlocks)
    setMarcas(getStoreItem('marcas') || defaultMarcas)
    setBanners(getStoreItem('banners') || defaultBanners)
    setProductos(getStoreItem('productos') || defaultProductos)
    setTestimonios(getStoreItem('testimonios') || defaultTestimonios)
    setPromos(getStoreItem('promos') || defaultPromos)
    setInstagramPhotos(getStoreItem('instagram_photos') || defaultInstagramPhotos)
  }, [authed])

  // Persist helpers
  const saveHero = (slides) => { setHeroSlides(slides); setStoreItem('hero_slides', slides) }
  const saveCategories = (cats) => { setCategoryBlocks(cats); setStoreItem('category_blocks', cats) }
  const saveMarcas = (m) => { setMarcas(m); setStoreItem('marcas', m) }
  const saveBanners = (b) => { setBanners(b); setStoreItem('banners', b) }
  const saveProductos = (p) => { setProductos(p); setStoreItem('productos', p) }
  const saveTestimonios = (t) => { setTestimonios(t); setStoreItem('testimonios', t) }
  const savePromos = (p) => { setPromos(p); setStoreItem('promos', p) }
  const saveInstagram = (ig) => { setInstagramPhotos(ig); setStoreItem('instagram_photos', ig) }

  const handleLogin = (e) => {
    e.preventDefault()
    if (pass === adminPassword) {
      setAuthed(true)
      localStorage.setItem('isabella_admin_auth', 'true')
      setError(false)
    } else {
      setError(true)
    }
  }

  const handleLogout = () => {
    setAuthed(false)
    localStorage.removeItem('isabella_admin_auth')
  }

  const toggleDarkMode = () => {
    setDarkMode(prev => {
      localStorage.setItem('isabella_admin_dark', String(!prev))
      return !prev
    })
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-6">
        <form onSubmit={handleLogin} className="w-full max-w-sm">
          <h1 className="font-display font-light text-2xl uppercase tracking-logo text-center mb-8">
            ISABELLA
          </h1>
          <p className="font-display text-xs uppercase tracking-editorial text-secondary text-center mb-6">
            Panel de Administracion
          </p>
          <input
            type="password"
            value={pass}
            onChange={(e) => { setPass(e.target.value); setError(false) }}
            placeholder="Contrasena"
            className={`w-full border-b ${error ? 'border-sale' : 'border-border'} focus:border-primary pb-2 outline-none font-body text-sm text-primary placeholder:text-muted transition-colors`}
            autoFocus
          />
          {error && <p className="font-body text-xs text-sale mt-2">Contrasena incorrecta</p>}
          <button
            type="submit"
            className="w-full mt-6 h-10 bg-primary text-white font-display text-xs uppercase tracking-editorial hover:bg-primary-hover transition-colors"
          >
            INGRESAR
          </button>
          <a
            href="/"
            className="flex items-center justify-center gap-2 mt-5 font-display text-[11px] uppercase tracking-editorial text-secondary hover:text-primary transition-colors"
          >
            <ArrowLeft size={14} strokeWidth={1.5} /> Volver a la tienda
          </a>
        </form>
      </div>
    )
  }

  const dm = darkMode

  return (
    <div className={`min-h-screen transition-colors duration-300 ${dm ? 'bg-[#1a1a1a]' : 'bg-light'}`}>
      {/* Header */}
      <div className={`px-6 md:px-10 py-3 flex items-center justify-between sticky top-0 z-30 border-b transition-colors duration-300 ${
        dm ? 'bg-[#111] border-[#333]' : 'bg-white border-border'
      }`}>
        <div className="flex items-center gap-4">
          <a href="/" className={`font-display font-light text-lg uppercase tracking-logo transition-colors duration-300 ${dm ? 'text-white' : ''}`}>ISABELLA</a>
          <span className="font-display text-[10px] uppercase tracking-editorial text-white bg-primary px-2 py-0.5">Admin</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={toggleDarkMode}
            className={`flex items-center gap-1.5 font-display text-[11px] uppercase tracking-editorial transition-colors ${
              dm ? 'text-white/60 hover:text-white' : 'text-secondary hover:text-primary'
            }`}
            title={dm ? 'Modo claro' : 'Modo oscuro'}
          >
            {dm ? <Sun size={14} strokeWidth={1.5} /> : <Moon size={14} strokeWidth={1.5} />}
          </button>
          <a href="/" target="_blank" className={`flex items-center gap-1.5 font-display text-[11px] uppercase tracking-editorial transition-colors ${
            dm ? 'text-white/60 hover:text-white' : 'text-secondary hover:text-primary'
          }`}>
            <Eye size={14} strokeWidth={1.5} /> Ver sitio
          </a>
          <button
            onClick={handleLogout}
            className={`flex items-center gap-1.5 font-display text-[11px] uppercase tracking-editorial transition-colors ${
              dm ? 'text-white/60 hover:text-white' : 'text-secondary hover:text-primary'
            }`}
          >
            <LogOut size={14} strokeWidth={1.5} /> Salir
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className={`px-6 md:px-10 flex gap-1 overflow-x-auto border-b transition-colors duration-300 ${
        dm ? 'bg-[#111] border-[#333]' : 'bg-white border-border'
      }`}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`py-3 px-4 font-display text-[11px] uppercase tracking-editorial border-b-2 transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? dm ? 'border-white text-white' : 'border-primary text-primary'
                : dm ? 'border-transparent text-white/50 hover:text-white' : 'border-transparent text-secondary hover:text-primary'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className={`px-6 md:px-10 py-6 max-w-6xl admin-content ${dm ? 'dark-admin' : ''}`}>
        {activeTab === 'landing' && (
          <div className="space-y-6">
            <HeroManager slides={heroSlides} onSave={saveHero} />
            <CategoryManager blocks={categoryBlocks} onSave={saveCategories} />
            <BrandManager marcas={marcas} onSave={saveMarcas} />
            <BannerManager banners={banners} onSave={saveBanners} />
            <InstagramManager photos={instagramPhotos} onSave={saveInstagram} />
          </div>
        )}

        {activeTab === 'productos' && (
          <ProductoManager productos={productos} marcas={marcas} onSave={saveProductos} />
        )}

        {activeTab === 'textos' && (
          <div className="space-y-6">
            <PromoManager promos={promos} onSave={savePromos} />
            <TestimonioManager testimonios={testimonios} onSave={saveTestimonios} />
          </div>
        )}

        {activeTab === 'pedidos' && (
          <PedidosManager />
        )}

        {activeTab === 'config' && (
          <ConfigManager />
        )}
      </div>
    </div>
  )
}
