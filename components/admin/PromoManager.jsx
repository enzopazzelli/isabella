'use client'

import { Plus, Trash2, GripVertical } from 'lucide-react'

export default function PromoManager({ promos = [], onSave }) {
  const items = promos

  const save = (updated) => onSave(updated)

  const addPromo = () => save([...items, ''])

  const updatePromo = (index, value) => {
    const updated = [...items]
    updated[index] = value
    save(updated)
  }

  const removePromo = (index) => {
    save(items.filter((_, i) => i !== index))
  }

  return (
    <div className="bg-white border border-border">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <div>
          <h3 className="font-display text-sm uppercase tracking-editorial">Barra de promociones</h3>
          <p className="font-body text-[11px] text-secondary mt-1">Mensajes que se muestran en el marquee superior del sitio</p>
        </div>
        <button
          onClick={addPromo}
          className="flex items-center gap-1.5 font-display text-[11px] uppercase tracking-editorial text-white bg-primary px-3 py-1.5 hover:bg-primary-hover transition-colors"
        >
          <Plus size={14} /> Agregar
        </button>
      </div>

      <div className="p-5 space-y-2">
        {items.map((promo, i) => (
          <div key={i} className="flex items-center gap-2">
            <GripVertical size={14} className="text-muted flex-shrink-0" />
            <input
              type="text"
              value={promo}
              onChange={(e) => updatePromo(i, e.target.value)}
              placeholder="Ej: ENVIOS A TODO EL PAIS"
              className="flex-1 border border-border px-3 py-2 font-display text-[11px] uppercase tracking-editorial outline-none focus:border-primary"
            />
            <button
              onClick={() => removePromo(i)}
              className="p-1.5 text-muted hover:text-sale transition-colors flex-shrink-0"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}

        {items.length === 0 && (
          <p className="text-center py-4 font-body text-sm text-muted">No hay mensajes de promocion</p>
        )}
      </div>

      {/* Preview */}
      {items.length > 0 && (
        <div className="border-t border-border px-5 py-3 bg-light/50">
          <p className="font-display text-[10px] uppercase tracking-editorial text-secondary mb-2">Preview</p>
          <div className="bg-primary text-white px-4 py-2 overflow-hidden">
            <p className="font-display text-[11px] uppercase tracking-editorial whitespace-nowrap">
              {items.filter(Boolean).join('  \u2014  ')}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
