'use client'

import { useState, useEffect } from 'react'
import { Search, ShoppingBag, Menu, X, Sun, Moon } from 'lucide-react'

function InstagramIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><circle cx="12" cy="12" r="5" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  )
}

function FacebookIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  )
}

function TiktokIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
    </svg>
  )
}
import { negocio as defaultNegocio, navLinks } from '@/lib/config'

export default function Navbar({ cartCount = 0, onCartClick, onSearch, categorias = [], darkMode = false, onToggleDark, negocio = defaultNegocio }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [scrolled, setScrolled] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [activeSection, setActiveSection] = useState('')

  useEffect(() => {
    const handleScroll = () => {
      const promoH = 32
      setScrolled(window.scrollY > promoH)

      const sections = navLinks.map(l => l.href.replace('#', '')).filter(Boolean)
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i])
        if (el && el.getBoundingClientRect().top <= 100) {
          setActiveSection(sections[i])
          break
        }
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (menuOpen) {
      document.body.classList.add('overflow-hidden')
    } else {
      document.body.classList.remove('overflow-hidden')
    }
    return () => document.body.classList.remove('overflow-hidden')
  }, [menuOpen])

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        setMenuOpen(false)
        setSearchOpen(false)
      }
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [])

  const handleSearchChange = (e) => {
    const val = e.target.value
    setSearchQuery(val)
    if (onSearch) onSearch(val)
    if (val) {
      const el = document.getElementById('productos')
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const closeSearch = () => {
    setSearchOpen(false)
    setSearchQuery('')
    if (onSearch) onSearch('')
  }

  return (
    <>
      <nav
        className={`fixed left-0 right-0 z-40 transition-all duration-500 ${
          scrolled
            ? darkMode
              ? 'top-0 bg-[#111]/95 backdrop-blur-sm border-b border-[#333] shadow-sm'
              : 'top-0 bg-white/95 backdrop-blur-sm border-b border-border shadow-sm'
            : hovered
              ? darkMode
                ? 'top-8 bg-[#111]/90 backdrop-blur-sm border-b border-white/10'
                : 'top-8 bg-white/90 backdrop-blur-sm border-b border-white/10'
              : 'top-8 bg-transparent border-b border-transparent'
        }`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="flex items-center justify-between px-6 md:px-12 h-[60px] md:h-[75px]">
          {/* Mobile: Hamburger */}
          <button
            className="md:hidden p-1"
            onClick={() => setMenuOpen(true)}
            aria-label="Menu"
          >
            <Menu size={22} strokeWidth={1.5} className={`transition-colors duration-300 ${scrolled || hovered ? (darkMode ? 'text-white' : 'text-primary') : 'text-white'}`} />
          </button>

          {/* Logo */}
          <a href="#inicio" className="flex flex-col items-center md:items-start">
            <span className={`font-display font-light text-[22px] md:text-[28px] uppercase tracking-logo transition-colors duration-300 ${
              scrolled || hovered ? (darkMode ? 'text-white' : 'text-primary') : 'text-white'
            }`}>
              {negocio.nombre}
            </span>
            <span className={`hidden lg:block font-display font-light text-[9px] uppercase tracking-[0.3em] transition-colors duration-300 ${
              scrolled || hovered ? (darkMode ? 'text-white/60' : 'text-secondary') : 'text-white/60'
            }`}>
              {negocio.subtitulo}
            </span>
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const section = link.href.replace('#', '')
              const isActive = activeSection === section
              const lit = scrolled || hovered
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className={`font-display text-xs uppercase tracking-editorial transition-colors duration-300 relative pb-1 ${
                    lit
                      ? isActive
                        ? darkMode ? 'text-white border-b border-white' : 'text-primary border-b border-primary'
                        : darkMode ? 'text-white/80 hover:text-white' : 'text-primary hover:text-secondary'
                      : isActive ? 'text-white border-b border-white' : 'text-white/80 hover:text-white'
                  }`}
                >
                  {link.label}
                </a>
              )
            })}
          </div>

          {/* Icons */}
          <div className="flex items-center gap-3">
            <button
              onClick={onToggleDark}
              className={`p-1 transition-colors duration-300 ${
                scrolled || hovered
                  ? darkMode ? 'text-white/70 hover:text-white' : 'text-primary/50 hover:text-primary'
                  : 'text-white/60 hover:text-white'
              }`}
              aria-label={darkMode ? 'Modo claro' : 'Modo oscuro'}
              title={darkMode ? 'Modo claro' : 'Modo oscuro'}
            >
              {darkMode ? <Sun size={18} strokeWidth={1.5} /> : <Moon size={18} strokeWidth={1.5} />}
            </button>
            <button
              onClick={() => searchOpen ? closeSearch() : setSearchOpen(true)}
              className={`p-1 transition-colors duration-300 ${scrolled || hovered ? (darkMode ? 'text-white hover:text-white/70' : 'text-primary hover:text-secondary') : 'text-white hover:text-white/70'}`}
              aria-label="Buscar"
            >
              {searchOpen ? <X size={20} strokeWidth={1.5} /> : <Search size={20} strokeWidth={1.5} />}
            </button>
            <button
              onClick={onCartClick}
              className={`p-1 transition-colors duration-300 relative ${scrolled || hovered ? (darkMode ? 'text-white hover:text-white/70' : 'text-primary hover:text-secondary') : 'text-white hover:text-white/70'}`}
              aria-label="Carrito"
            >
              <ShoppingBag size={20} strokeWidth={1.5} />
              {cartCount > 0 && (
                <span className={`absolute -top-1 -right-1 text-[10px] font-body w-4 h-4 flex items-center justify-center transition-colors duration-300 ${
                  scrolled || hovered
                    ? darkMode ? 'bg-white text-[#111]' : 'bg-primary text-white'
                    : 'bg-white text-primary'
                }`}>
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {searchOpen && (
          <div className={`border-t px-6 md:px-12 py-3 animate-fade-in ${
            scrolled || hovered
              ? darkMode ? 'border-[#333] bg-[#111]' : 'border-border bg-white'
              : 'border-white/20 bg-black/30 backdrop-blur-sm'
          }`}>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Buscar productos..."
              autoFocus
              className={`w-full bg-transparent border-b pb-2 outline-none font-body text-sm italic transition-colors ${
                scrolled || hovered
                  ? darkMode
                    ? 'border-white/30 focus:border-white text-white placeholder:text-white/50'
                    : 'border-primary/30 focus:border-primary text-primary placeholder:text-muted'
                  : 'border-white/30 focus:border-white text-white placeholder:text-white/50'
              }`}
            />
          </div>
        )}
      </nav>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div className={`fixed inset-0 z-50 animate-fade-in flex flex-col ${darkMode ? 'bg-[#111]' : 'bg-white'}`}>
          <div className="flex items-center justify-end px-6 h-[60px]">
            <button onClick={() => setMenuOpen(false)} className={`p-1 ${darkMode ? 'text-white' : ''}`} aria-label="Cerrar menu">
              <X size={22} strokeWidth={1.5} />
            </button>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center gap-8">
            <div className="text-center mb-4">
              <span className={`font-display font-light text-[28px] uppercase tracking-logo block ${darkMode ? 'text-white' : 'text-primary'}`}>
                {negocio.nombre}
              </span>
              <span className={`font-display font-light text-[10px] uppercase tracking-[0.3em] ${darkMode ? 'text-white/50' : 'text-secondary'}`}>
                {negocio.subtitulo}
              </span>
            </div>

            {navLinks.map((link, i) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`menu-link-enter font-display font-light text-[22px] uppercase tracking-wide-title ${darkMode ? 'text-white' : 'text-primary'}`}
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                {link.label}
              </a>
            ))}

            {categorias.length > 0 && (
              <div className="flex flex-wrap justify-center gap-4 mt-4">
                {categorias.map((cat, i) => (
                  <a
                    key={cat}
                    href="#productos"
                    onClick={() => setMenuOpen(false)}
                    className={`menu-link-enter font-display text-[13px] uppercase tracking-editorial ${darkMode ? 'text-white/60' : 'text-secondary'}`}
                    style={{ animationDelay: `${(navLinks.length + i) * 0.05}s` }}
                  >
                    {cat}
                  </a>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center justify-center gap-6 pb-8">
            {negocio.instagram && (
              <a href={`https://instagram.com/${negocio.instagram}`} target="_blank" rel="noopener noreferrer" className={`${darkMode ? 'text-white/60 hover:text-white' : 'text-secondary hover:text-primary'} transition-colors`}>
                <InstagramIcon size={20} />
              </a>
            )}
            {negocio.facebook && (
              <a href={negocio.facebook} target="_blank" rel="noopener noreferrer" className={`${darkMode ? 'text-white/60 hover:text-white' : 'text-secondary hover:text-primary'} transition-colors`}>
                <FacebookIcon size={20} />
              </a>
            )}
            {negocio.tiktok && (
              <a href={`https://www.tiktok.com/@${negocio.tiktok}`} target="_blank" rel="noopener noreferrer" className={`${darkMode ? 'text-white/60 hover:text-white' : 'text-secondary hover:text-primary'} transition-colors`}>
                <TiktokIcon size={20} />
              </a>
            )}
          </div>
        </div>
      )}
    </>
  )
}
