'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import ProductCard from './ProductCard'
import FilterBar from './FilterBar'

export default function ProductGrid({ productos = [], searchQuery = '', initialCategory = null, initialSeccion = null, activeBrand = null, onClearBrand, onSeccionChange, onCategoryChange, onQuickView }) {
  const [activeCategory, setActiveCategory] = useState(initialCategory)
  const [activeSeccion, setActiveSeccion] = useState(initialSeccion)
  const [activeTalle, setActiveTalle] = useState(null)
  const [sortBy, setSortBy] = useState(null)
  const [priceRange, setPriceRange] = useState(null)
  const sectionRef = useRef(null)

  // Sync with parent (also when parent clears back to null)
  useEffect(() => {
    setActiveCategory(initialCategory)
  }, [initialCategory])

  useEffect(() => {
    setActiveSeccion(initialSeccion)
  }, [initialSeccion])

  const changeSeccion = (s) => {
    setActiveSeccion(s)
    if (onSeccionChange) onSeccionChange(s)
  }
  const changeCategory = (c) => {
    setActiveCategory(c)
    if (onCategoryChange) onCategoryChange(c)
  }

  // Extract unique secciones
  const secciones = useMemo(() => {
    return [...new Set(productos.map(p => p.seccion).filter(Boolean))].sort()
  }, [productos])

  // Extract unique categories
  const categorias = useMemo(() => {
    const cats = [...new Set(productos.map(p => p.categoria).filter(Boolean))]
    return cats.sort()
  }, [productos])

  // Extract unique talles
  const tallesDisponibles = useMemo(() => {
    const talles = new Set()
    productos.forEach(p => (p.talles || []).forEach(t => talles.add(t)))
    return [...talles].sort()
  }, [productos])

  // Dynamic price ranges (terciles)
  const priceRanges = useMemo(() => {
    const prices = productos.map(p => p.precio).filter(Boolean).sort((a, b) => a - b)
    if (prices.length < 3) return []
    const t1 = prices[Math.floor(prices.length / 3)]
    const t2 = prices[Math.floor((prices.length * 2) / 3)]
    const fmt = (n) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0 }).format(n)
    return [
      { label: `Hasta ${fmt(t1)}`, value: `0-${t1}` },
      { label: `${fmt(t1)} - ${fmt(t2)}`, value: `${t1}-${t2}` },
      { label: `Mas de ${fmt(t2)}`, value: `${t2}-999999999` },
    ]
  }, [productos])

  // Filter + sort
  const filtered = useMemo(() => {
    let result = [...productos]

    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(p =>
        p.nombre.toLowerCase().includes(q) ||
        p.categoria.toLowerCase().includes(q)
      )
    }

    if (activeSeccion) {
      result = result.filter(p => p.seccion === activeSeccion)
    }

    if (activeCategory) {
      result = result.filter(p => p.categoria === activeCategory)
    }

    if (activeBrand) {
      result = result.filter(p => p.marca === activeBrand)
    }

    if (activeTalle) {
      result = result.filter(p => (p.talles || []).includes(activeTalle))
    }

    if (priceRange) {
      const [min, max] = priceRange.split('-').map(Number)
      result = result.filter(p => p.precio >= min && p.precio <= max)
    }

    if (sortBy) {
      switch (sortBy) {
        case 'nombre-asc': result.sort((a, b) => a.nombre.localeCompare(b.nombre)); break
        case 'nombre-desc': result.sort((a, b) => b.nombre.localeCompare(a.nombre)); break
        case 'precio-asc': result.sort((a, b) => a.precio - b.precio); break
        case 'precio-desc': result.sort((a, b) => b.precio - a.precio); break
        case 'nuevo': result.sort((a, b) => a.orden - b.orden); break
      }
    }

    return result
  }, [productos, searchQuery, activeSeccion, activeCategory, activeBrand, activeTalle, sortBy, priceRange])

  const handleClear = () => {
    changeSeccion(null)
    changeCategory(null)
    setActiveTalle(null)
    setSortBy(null)
    setPriceRange(null)
  }

  // Scroll reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: 0.1 }
    )
    const el = sectionRef.current
    if (el) observer.observe(el)
    return () => { if (el) observer.unobserve(el) }
  }, [])

  return (
    <section id="productos" className="py-12 md:py-20 px-6 md:px-12 scroll-reveal" ref={sectionRef}>
      <div className="text-center mb-10">
        <h2 className="font-display font-light text-2xl md:text-[28px] uppercase tracking-wide-title text-primary">
          {activeBrand ? activeBrand : 'PRODUCTOS'}
        </h2>
        <div className="mt-3 mx-auto w-10 h-px bg-primary" />
        {activeBrand && (
          <button
            onClick={() => onClearBrand && onClearBrand()}
            className="mt-3 font-body text-xs text-secondary underline hover:text-primary transition-colors"
          >
            Ver todos los productos
          </button>
        )}
      </div>

      {/* Section tabs */}
      {secciones.length > 1 && (
        <div className="flex justify-center gap-1 mb-6">
          <button
            onClick={() => changeSeccion(null)}
            className={`px-5 py-2 font-display text-[11px] uppercase tracking-editorial border transition-colors ${
              !activeSeccion ? 'bg-primary text-white border-primary' : 'border-border text-secondary hover:border-primary hover:text-primary'
            }`}
          >
            Todos
          </button>
          {secciones.map((s) => (
            <button
              key={s}
              onClick={() => changeSeccion(activeSeccion === s ? null : s)}
              className={`px-5 py-2 font-display text-[11px] uppercase tracking-editorial border transition-colors ${
                activeSeccion === s ? 'bg-primary text-white border-primary' : 'border-border text-secondary hover:border-primary hover:text-primary'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <FilterBar
        categorias={categorias}
        tallesDisponibles={tallesDisponibles}
        activeCategory={activeCategory}
        activeTalle={activeTalle}
        sortBy={sortBy}
        priceRange={priceRange}
        priceRanges={priceRanges}
        onCategoryChange={changeCategory}
        onTalleChange={setActiveTalle}
        onSortChange={setSortBy}
        onPriceChange={setPriceRange}
        onClear={handleClear}
        totalResults={filtered.length}
      />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
        {filtered.map((p) => (
          <ProductCard
            key={p.id}
            producto={p}
            onQuickView={onQuickView}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <p className="font-display font-light text-lg uppercase tracking-editorial text-secondary">
            No se encontraron productos
          </p>
          <button
            onClick={handleClear}
            className="mt-4 font-body text-sm text-secondary underline hover:text-primary transition-colors"
          >
            Limpiar filtros
          </button>
        </div>
      )}
    </section>
  )
}
