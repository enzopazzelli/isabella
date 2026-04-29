'use client'

import { useState } from 'react'
import { Plus, Trash2, GripVertical, ChevronDown, ChevronUp, Image } from 'lucide-react'
import ImageField from './ImageField'

export default function HeroManager({ slides = [], onSave }) {
  const items = slides
  const [expandedId, setExpandedId] = useState(null)

  const save = (updated) => onSave(updated)

  const addSlide = () => {
    const newSlide = {
      id: String(Date.now()),
      imagen: '',
      titulo: '',
      subtitulo: '',
      textoBoton: '',
      linkBoton: '#productos',
      posicionTexto: 'center',
    }
    save([...items, newSlide])
    setExpandedId(newSlide.id)
  }

  const updateSlide = (id, field, value) => {
    save(items.map(s => s.id === id ? { ...s, [field]: value } : s))
  }

  const removeSlide = (id) => {
    save(items.filter(s => s.id !== id))
  }

  const moveSlide = (index, direction) => {
    const newItems = [...items]
    const target = index + direction
    if (target < 0 || target >= newItems.length) return
    ;[newItems[index], newItems[target]] = [newItems[target], newItems[index]]
    save(newItems)
  }

  return (
    <div className="bg-white border border-border">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <h3 className="font-display text-sm uppercase tracking-editorial">Hero — Carrusel principal</h3>
        <button
          onClick={addSlide}
          className="flex items-center gap-1.5 font-display text-[11px] uppercase tracking-editorial text-white bg-primary px-3 py-1.5 hover:bg-primary-hover transition-colors"
        >
          <Plus size={14} /> Agregar slide
        </button>
      </div>

      <div className="divide-y divide-border">
        {items.map((slide, index) => (
          <div key={slide.id}>
            {/* Header row */}
            <button
              onClick={() => setExpandedId(expandedId === slide.id ? null : slide.id)}
              className="w-full flex items-center gap-3 px-5 py-3 hover:bg-light/50 transition-colors text-left"
            >
              <GripVertical size={14} className="text-muted flex-shrink-0" />
              <div className="w-10 h-10 bg-light flex-shrink-0 overflow-hidden">
                {slide.imagen ? (
                  <img src={slide.imagen} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center"><Image size={14} className="text-muted" /></div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-display text-xs uppercase tracking-editorial truncate">
                  {slide.titulo || 'Sin titulo'}
                </p>
                <p className="font-body text-[11px] text-secondary truncate">{slide.subtitulo || ''}</p>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button onClick={(e) => { e.stopPropagation(); moveSlide(index, -1) }} className="p-1 text-muted hover:text-primary" disabled={index === 0}>
                  <ChevronUp size={14} />
                </button>
                <button onClick={(e) => { e.stopPropagation(); moveSlide(index, 1) }} className="p-1 text-muted hover:text-primary" disabled={index === items.length - 1}>
                  <ChevronDown size={14} />
                </button>
              </div>
              {expandedId === slide.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {/* Expanded form */}
            {expandedId === slide.id && (
              <div className="px-5 pb-4 pt-1 bg-light/30 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Field label="Titulo" value={slide.titulo} onChange={(v) => updateSlide(slide.id, 'titulo', v)} placeholder="Ej: NUEVA COLECCION" />
                  <Field label="Subtitulo" value={slide.subtitulo} onChange={(v) => updateSlide(slide.id, 'subtitulo', v)} placeholder="Texto secundario" />
                  <ImageField label="Imagen" value={slide.imagen} onChange={(v) => updateSlide(slide.id, 'imagen', v)} subfolder="hero" />
                  <Field label="Posicion del texto" value={slide.posicionTexto} onChange={(v) => updateSlide(slide.id, 'posicionTexto', v)} type="select" options={['center', 'bottom-left', 'bottom-center', 'bottom-right']} />
                  <Field label="Texto del boton" value={slide.textoBoton} onChange={(v) => updateSlide(slide.id, 'textoBoton', v)} placeholder="Ej: VER COLECCION (vacio = sin boton)" />
                  <Field label="Link del boton" value={slide.linkBoton} onChange={(v) => updateSlide(slide.id, 'linkBoton', v)} placeholder="#productos" />
                </div>

                {slide.imagen && (
                  <div className="mt-2">
                    <p className="font-body text-[10px] text-secondary uppercase mb-1">Preview</p>
                    <div className="w-full max-w-md aspect-video bg-light overflow-hidden relative">
                      <img src={slide.imagen} alt="" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <span className="font-display font-light text-white text-sm uppercase tracking-wide-title">{slide.titulo}</span>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => removeSlide(slide.id)}
                  className="flex items-center gap-1.5 font-display text-[10px] uppercase tracking-editorial text-sale hover:text-red-700 transition-colors mt-2"
                >
                  <Trash2 size={12} /> Eliminar slide
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <p className="px-5 py-8 text-center font-body text-sm text-muted">No hay slides configurados</p>
      )}
    </div>
  )
}

function Field({ label, value, onChange, placeholder, type = 'text', options = [] }) {
  return (
    <div>
      <label className="block font-display text-[10px] uppercase tracking-editorial text-secondary mb-1">{label}</label>
      {type === 'select' ? (
        <select
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="w-full border border-border px-3 py-2 font-body text-sm outline-none focus:border-primary transition-colors bg-white"
        >
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : (
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full border border-border px-3 py-2 font-body text-sm outline-none focus:border-primary transition-colors"
        />
      )}
    </div>
  )
}
