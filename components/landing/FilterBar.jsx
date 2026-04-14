'use client'

import { useState } from 'react'
import { ChevronDown, SlidersHorizontal, X } from 'lucide-react'

export default function FilterBar({
  categorias = [],
  tallesDisponibles = [],
  activeCategory,
  activeTalle,
  sortBy,
  priceRange,
  priceRanges = [],
  onCategoryChange,
  onTalleChange,
  onSortChange,
  onPriceChange,
  onClear,
  totalResults = 0,
}) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const hasFilters = activeCategory || activeTalle || sortBy || priceRange

  return (
    <div className="mb-8">
      {/* Mobile: Toggle button */}
      <div className="md:hidden flex items-center justify-between mb-4">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex items-center gap-2 font-display text-[11px] uppercase tracking-editorial text-primary border border-border px-4 py-2"
        >
          <SlidersHorizontal size={14} strokeWidth={1.5} />
          FILTRAR
        </button>
        <span className="font-body font-light text-[13px] text-secondary">
          {totalResults} productos
        </span>
      </div>

      {/* Filters */}
      <div className={`${mobileOpen ? 'block' : 'hidden'} md:block`}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-6">
          {/* Category pills */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onCategoryChange(null)}
              className={`font-display text-[11px] uppercase tracking-editorial px-3 py-1.5 border transition-colors ${
                !activeCategory ? 'bg-primary text-white border-primary' : 'bg-white text-primary border-border hover:border-primary'
              }`}
            >
              TODOS
            </button>
            {categorias.map((cat) => (
              <button
                key={cat}
                onClick={() => onCategoryChange(cat === activeCategory ? null : cat)}
                className={`font-display text-[11px] uppercase tracking-editorial px-3 py-1.5 border transition-colors ${
                  activeCategory === cat ? 'bg-primary text-white border-primary' : 'bg-white text-primary border-border hover:border-primary'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {/* Sort dropdown */}
            <div className="relative">
              <select
                value={sortBy || ''}
                onChange={(e) => onSortChange(e.target.value || null)}
                className="appearance-none font-display text-[11px] uppercase tracking-editorial bg-white border border-border px-3 py-1.5 pr-8 outline-none cursor-pointer"
              >
                <option value="">Ordenar por</option>
                <option value="nombre-asc">Nombre A-Z</option>
                <option value="nombre-desc">Nombre Z-A</option>
                <option value="precio-asc">Precio menor</option>
                <option value="precio-desc">Precio mayor</option>
                <option value="nuevo">Nuevos primero</option>
              </select>
              <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-secondary" />
            </div>

            {/* Talle dropdown */}
            {tallesDisponibles.length > 0 && (
              <div className="relative">
                <select
                  value={activeTalle || ''}
                  onChange={(e) => onTalleChange(e.target.value || null)}
                  className="appearance-none font-display text-[11px] uppercase tracking-editorial bg-white border border-border px-3 py-1.5 pr-8 outline-none cursor-pointer"
                >
                  <option value="">Talle</option>
                  {tallesDisponibles.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-secondary" />
              </div>
            )}

            {/* Price dropdown */}
            {priceRanges.length > 0 && (
              <div className="relative">
                <select
                  value={priceRange || ''}
                  onChange={(e) => onPriceChange(e.target.value || null)}
                  className="appearance-none font-display text-[11px] uppercase tracking-editorial bg-white border border-border px-3 py-1.5 pr-8 outline-none cursor-pointer"
                >
                  <option value="">Precio</option>
                  {priceRanges.map((r) => (
                    <option key={r.label} value={r.value}>{r.label}</option>
                  ))}
                </select>
                <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-secondary" />
              </div>
            )}

            {/* Clear + Count (desktop) */}
            <span className="hidden md:inline font-body font-light text-[13px] text-secondary">
              {totalResults} productos
            </span>
            {hasFilters && (
              <button
                onClick={onClear}
                className="flex items-center gap-1 font-body text-xs text-secondary underline hover:text-primary transition-colors"
              >
                <X size={12} /> Limpiar
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
