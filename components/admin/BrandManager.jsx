'use client'

import { Plus, Trash2, Image, ArrowUp, ArrowDown } from 'lucide-react'
import ImageField from './ImageField'

export default function BrandManager({ marcas = [], onSave }) {
  const items = marcas

  const save = (updated) => onSave(updated)

  const addMarca = () => {
    const newMarca = {
      id: String(Date.now()),
      nombre: '',
      logo: '',
      orden: items.length + 1,
    }
    save([...items, newMarca])
  }

  const updateMarca = (id, field, value) => {
    save(items.map(m => m.id === id ? { ...m, [field]: value } : m))
  }

  const removeMarca = (id) => {
    save(items.filter(m => m.id !== id))
  }

  const moveMarca = (index, direction) => {
    const newIndex = index + direction
    if (newIndex < 0 || newIndex >= items.length) return
    const updated = [...items]
    const [moved] = updated.splice(index, 1)
    updated.splice(newIndex, 0, moved)
    save(updated.map((m, i) => ({ ...m, orden: i + 1 })))
  }

  return (
    <div className="bg-white border border-border">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <div>
          <h3 className="font-display text-sm uppercase tracking-editorial">Marcas</h3>
          <p className="font-body text-[11px] text-secondary mt-1">
            Marcas que se muestran en el carrusel horizontal. Asociá productos a una marca desde la pestaña PRODUCTOS.
          </p>
        </div>
        <button
          onClick={addMarca}
          className="flex items-center gap-1.5 font-display text-[11px] uppercase tracking-editorial text-white bg-primary px-3 py-1.5 hover:bg-primary-hover transition-colors flex-shrink-0"
        >
          <Plus size={14} /> Agregar
        </button>
      </div>

      <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((marca, i) => (
          <div key={marca.id} className="border border-border overflow-hidden">
            <div className="aspect-[4/3] bg-light relative flex items-center justify-center">
              {marca.logo ? (
                <img
                  src={marca.logo}
                  alt={marca.nombre}
                  className="max-w-[70%] max-h-[70%] object-contain"
                />
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <Image size={20} className="text-muted" />
                  <span className="font-display text-[10px] uppercase tracking-editorial text-muted text-center px-2">
                    {marca.nombre || 'Sin logo'}
                  </span>
                </div>
              )}
            </div>
            <div className="p-3 space-y-2">
              <input
                type="text"
                value={marca.nombre || ''}
                onChange={(e) => updateMarca(marca.id, 'nombre', e.target.value)}
                placeholder="Nombre de marca"
                className="w-full border-b border-border pb-1 font-display text-[11px] uppercase tracking-editorial outline-none focus:border-primary transition-colors"
              />
              <ImageField label="" value={marca.logo} onChange={(v) => updateMarca(marca.id, 'logo', v)} placeholder="URL del logo o link de Drive (opcional)" subfolder="marcas" />
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => moveMarca(i, -1)}
                    disabled={i === 0}
                    className="p-1 text-muted hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    title="Subir"
                  >
                    <ArrowUp size={12} />
                  </button>
                  <button
                    onClick={() => moveMarca(i, 1)}
                    disabled={i === items.length - 1}
                    className="p-1 text-muted hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    title="Bajar"
                  >
                    <ArrowDown size={12} />
                  </button>
                </div>
                <button
                  onClick={() => removeMarca(marca.id)}
                  className="flex items-center gap-1 font-display text-[9px] uppercase tracking-editorial text-sale hover:text-red-700 transition-colors"
                >
                  <Trash2 size={10} /> Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <p className="px-5 pb-5 text-center font-body text-sm text-muted">No hay marcas configuradas</p>
      )}
    </div>
  )
}
