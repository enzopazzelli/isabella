'use client'

import { useState } from 'react'
import { Plus, Trash2, Image, ArrowUp, ArrowDown } from 'lucide-react'
import ImageField from './ImageField'

export default function InstagramManager({ photos = [], onSave }) {
  const [items, setItems] = useState(photos)

  const save = (updated) => { setItems(updated); onSave(updated) }

  const addPhoto = () => {
    const newPhoto = {
      id: String(Date.now()),
      imagen: '',
      orden: items.length + 1,
    }
    save([...items, newPhoto])
  }

  const updatePhoto = (id, value) => {
    save(items.map(p => p.id === id ? { ...p, imagen: value } : p))
  }

  const removePhoto = (id) => {
    save(items.filter(p => p.id !== id))
  }

  const movePhoto = (index, direction) => {
    const newIndex = index + direction
    if (newIndex < 0 || newIndex >= items.length) return
    const updated = [...items]
    const [moved] = updated.splice(index, 1)
    updated.splice(newIndex, 0, moved)
    save(updated.map((p, i) => ({ ...p, orden: i + 1 })))
  }

  const visibles = items.slice(0, 6)

  return (
    <div className="bg-white border border-border">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <div>
          <h3 className="font-display text-sm uppercase tracking-editorial">Feed Instagram</h3>
          <p className="font-body text-[11px] text-secondary mt-1">
            Fotos cuadradas que aparecen al pie de la landing. Se muestran las primeras 6. Click para abrir Instagram.
          </p>
        </div>
        <button
          onClick={addPhoto}
          className="flex items-center gap-1.5 font-display text-[11px] uppercase tracking-editorial text-white bg-primary px-3 py-1.5 hover:bg-primary-hover transition-colors flex-shrink-0"
        >
          <Plus size={14} /> Agregar
        </button>
      </div>

      <div className="p-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {items.map((photo, i) => {
          const visible = i < 6
          return (
            <div key={photo.id} className={`border overflow-hidden ${visible ? 'border-border' : 'border-dashed border-muted/40'}`}>
              <div className="aspect-square bg-light relative">
                {photo.imagen ? (
                  <img
                    src={photo.imagen}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Image size={20} className="text-muted" />
                  </div>
                )}
                {!visible && (
                  <div className="absolute top-1 left-1 bg-white/90 px-1.5 py-0.5 font-display text-[9px] uppercase tracking-editorial text-muted">
                    Oculta
                  </div>
                )}
              </div>
              <div className="p-2 space-y-2">
                <ImageField label="" value={photo.imagen} onChange={(v) => updatePhoto(photo.id, v)} placeholder="URL o Drive" />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => movePhoto(i, -1)}
                      disabled={i === 0}
                      className="p-1 text-muted hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      title="Subir"
                    >
                      <ArrowUp size={12} />
                    </button>
                    <button
                      onClick={() => movePhoto(i, 1)}
                      disabled={i === items.length - 1}
                      className="p-1 text-muted hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      title="Bajar"
                    >
                      <ArrowDown size={12} />
                    </button>
                  </div>
                  <button
                    onClick={() => removePhoto(photo.id)}
                    className="flex items-center gap-1 font-display text-[9px] uppercase tracking-editorial text-sale hover:text-red-700 transition-colors"
                    title="Eliminar"
                  >
                    <Trash2 size={10} />
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {items.length === 0 && (
        <p className="px-5 pb-5 text-center font-body text-sm text-muted">No hay fotos configuradas</p>
      )}

      {items.length > 6 && (
        <p className="px-5 pb-4 font-body text-[11px] text-muted italic">
          Solo se muestran las primeras 6 en la landing ({items.length - 6} oculta{items.length - 6 > 1 ? 's' : ''}).
        </p>
      )}
    </div>
  )
}
