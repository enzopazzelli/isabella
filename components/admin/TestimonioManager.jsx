'use client'

import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'

export default function TestimonioManager({ testimonios = [], onSave }) {
  const [items, setItems] = useState(testimonios)

  const save = (updated) => { setItems(updated); onSave(updated) }

  const addTestimonio = () => {
    const newT = { id: String(Date.now()), nombre: '', texto: '' }
    save([...items, newT])
  }

  const updateTestimonio = (id, field, value) => {
    save(items.map(t => t.id === id ? { ...t, [field]: value } : t))
  }

  const removeTestimonio = (id) => {
    save(items.filter(t => t.id !== id))
  }

  return (
    <div className="bg-white border border-border">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <div>
          <h3 className="font-display text-sm uppercase tracking-editorial">Testimonios</h3>
          <p className="font-body text-[11px] text-secondary mt-1">Lo que dicen las clientas — aparecen en el carrusel de testimonios</p>
        </div>
        <button
          onClick={addTestimonio}
          className="flex items-center gap-1.5 font-display text-[11px] uppercase tracking-editorial text-white bg-primary px-3 py-1.5 hover:bg-primary-hover transition-colors"
        >
          <Plus size={14} /> Agregar
        </button>
      </div>

      <div className="p-5 space-y-4">
        {items.map((t) => (
          <div key={t.id} className="border border-border p-4 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  value={t.nombre || ''}
                  onChange={(e) => updateTestimonio(t.id, 'nombre', e.target.value)}
                  placeholder="Nombre (ej: Carolina M.)"
                  className="w-full border-b border-border pb-1 font-display text-xs uppercase tracking-editorial outline-none focus:border-primary"
                />
                <textarea
                  value={t.texto || ''}
                  onChange={(e) => updateTestimonio(t.id, 'texto', e.target.value)}
                  placeholder="Texto del testimonio..."
                  rows={2}
                  className="w-full border border-border px-3 py-2 font-body text-sm outline-none focus:border-primary resize-none"
                />
              </div>
              <button
                onClick={() => removeTestimonio(t.id)}
                className="p-1 text-muted hover:text-sale transition-colors flex-shrink-0"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}

        {items.length === 0 && (
          <p className="text-center py-4 font-body text-sm text-muted">No hay testimonios</p>
        )}
      </div>
    </div>
  )
}
