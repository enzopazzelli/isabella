'use client'

import { useState } from 'react'
import { Plus, Trash2, ChevronDown, ChevronUp, Image } from 'lucide-react'
import ImageField from './ImageField'

export default function BannerManager({ banners = [], onSave }) {
  const [items, setItems] = useState(banners)
  const [expandedId, setExpandedId] = useState(null)

  const save = (updated) => { setItems(updated); onSave(updated) }

  const addBanner = () => {
    const newBanner = {
      id: String(Date.now()),
      imagen: '',
      titulo: '',
      subtitulo: '',
      textoBoton: '',
      linkBoton: '#productos',
      posicionTexto: 'center',
      ubicacion: 'pre-productos',
      orden: items.length + 1,
    }
    save([...items, newBanner])
    setExpandedId(newBanner.id)
  }

  const updateBanner = (id, field, value) => {
    save(items.map(b => b.id === id ? { ...b, [field]: value } : b))
  }

  const removeBanner = (id) => {
    save(items.filter(b => b.id !== id))
  }

  return (
    <div className="bg-white border border-border">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <h3 className="font-display text-sm uppercase tracking-editorial">Banners editoriales</h3>
        <button
          onClick={addBanner}
          className="flex items-center gap-1.5 font-display text-[11px] uppercase tracking-editorial text-white bg-primary px-3 py-1.5 hover:bg-primary-hover transition-colors"
        >
          <Plus size={14} /> Agregar banner
        </button>
      </div>

      <div className="divide-y divide-border">
        {items.map((banner) => (
          <div key={banner.id}>
            <button
              onClick={() => setExpandedId(expandedId === banner.id ? null : banner.id)}
              className="w-full flex items-center gap-3 px-5 py-3 hover:bg-light/50 transition-colors text-left"
            >
              <div className="w-16 h-10 bg-light flex-shrink-0 overflow-hidden">
                {banner.imagen ? (
                  <img src={banner.imagen} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center"><Image size={14} className="text-muted" /></div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-display text-xs uppercase tracking-editorial truncate">{banner.titulo || 'Sin titulo'}</p>
                <p className="font-body text-[10px] text-secondary">{banner.ubicacion}</p>
              </div>
              {expandedId === banner.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {expandedId === banner.id && (
              <div className="px-5 pb-4 pt-1 bg-light/30 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Field label="Titulo" value={banner.titulo} onChange={(v) => updateBanner(banner.id, 'titulo', v)} />
                  <Field label="Subtitulo" value={banner.subtitulo} onChange={(v) => updateBanner(banner.id, 'subtitulo', v)} />
                  <ImageField label="Imagen" value={banner.imagen} onChange={(v) => updateBanner(banner.id, 'imagen', v)} />
                  <Field label="Ubicacion" value={banner.ubicacion} onChange={(v) => updateBanner(banner.id, 'ubicacion', v)} type="select" options={['pre-productos', 'mid-productos', 'post-productos']} />
                  <Field label="Texto boton" value={banner.textoBoton} onChange={(v) => updateBanner(banner.id, 'textoBoton', v)} />
                  <Field label="Posicion texto" value={banner.posicionTexto} onChange={(v) => updateBanner(banner.id, 'posicionTexto', v)} type="select" options={['center', 'bottom-left', 'bottom-center', 'bottom-right']} />
                </div>
                <button onClick={() => removeBanner(banner.id)} className="flex items-center gap-1.5 font-display text-[10px] uppercase tracking-editorial text-sale hover:text-red-700 transition-colors">
                  <Trash2 size={12} /> Eliminar
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <p className="px-5 py-8 text-center font-body text-sm text-muted">No hay banners configurados</p>
      )}
    </div>
  )
}

function Field({ label, value, onChange, placeholder = '', type = 'text', options = [] }) {
  return (
    <div>
      <label className="block font-display text-[10px] uppercase tracking-editorial text-secondary mb-1">{label}</label>
      {type === 'select' ? (
        <select value={value || ''} onChange={(e) => onChange(e.target.value)} className="w-full border border-border px-3 py-2 font-body text-sm outline-none focus:border-primary bg-white">
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : (
        <input type="text" value={value || ''} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full border border-border px-3 py-2 font-body text-sm outline-none focus:border-primary" />
      )}
    </div>
  )
}
