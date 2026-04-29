'use client'

import { Plus, Trash2, Image } from 'lucide-react'
import ImageField from './ImageField'

export default function CategoryManager({ blocks = [], onSave }) {
  const items = blocks

  const save = (updated) => onSave(updated)

  const addBlock = () => {
    const newBlock = { id: String(Date.now()), nombre: '', imagen: '', orden: items.length + 1 }
    save([...items, newBlock])
  }

  const updateBlock = (id, field, value) => {
    save(items.map(b => b.id === id ? { ...b, [field]: value } : b))
  }

  const removeBlock = (id) => {
    save(items.filter(b => b.id !== id))
  }

  return (
    <div className="bg-white border border-border">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <h3 className="font-display text-sm uppercase tracking-editorial">Bloques de categorias</h3>
        <button
          onClick={addBlock}
          className="flex items-center gap-1.5 font-display text-[11px] uppercase tracking-editorial text-white bg-primary px-3 py-1.5 hover:bg-primary-hover transition-colors"
        >
          <Plus size={14} /> Agregar
        </button>
      </div>

      <div className="p-5 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((block) => (
          <div key={block.id} className="border border-border overflow-hidden group">
            <div className="aspect-square bg-light relative">
              {block.imagen ? (
                <img src={block.imagen} alt={block.nombre} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Image size={20} className="text-muted" />
                </div>
              )}
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <span className="font-display font-light text-white text-xs uppercase tracking-editorial">
                  {block.nombre || 'CATEGORIA'}
                </span>
              </div>
            </div>
            <div className="p-3 space-y-2">
              <input
                type="text"
                value={block.nombre || ''}
                onChange={(e) => updateBlock(block.id, 'nombre', e.target.value)}
                placeholder="Nombre"
                className="w-full border-b border-border pb-1 font-display text-[11px] uppercase tracking-editorial outline-none focus:border-primary transition-colors"
              />
              <ImageField label="" value={block.imagen} onChange={(v) => updateBlock(block.id, 'imagen', v)} placeholder="URL imagen o link de Drive" subfolder="category_blocks" />
              <button
                onClick={() => removeBlock(block.id)}
                className="flex items-center gap-1 font-display text-[9px] uppercase tracking-editorial text-sale hover:text-red-700 transition-colors"
              >
                <Trash2 size={10} /> Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <p className="px-5 pb-5 text-center font-body text-sm text-muted">No hay categorias configuradas</p>
      )}
    </div>
  )
}
