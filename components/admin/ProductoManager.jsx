'use client'

import { useState } from 'react'
import { Plus, Trash2, ChevronDown, ChevronUp, Search, Image, Copy } from 'lucide-react'
import ImageField from './ImageField'

export default function ProductoManager({ productos = [], marcas = [], onSave }) {
  const [items, setItems] = useState(productos)
  const [expandedId, setExpandedId] = useState(null)
  const [search, setSearch] = useState('')
  const [filterCat, setFilterCat] = useState('')
  const [filterMarca, setFilterMarca] = useState('')

  const save = (updated) => { setItems(updated); onSave(updated) }

  const categorias = [...new Set(items.map(p => p.categoria).filter(Boolean))].sort()
  const marcasNombres = [
    ...new Set([
      ...marcas.map(m => m.nombre).filter(Boolean),
      ...items.map(p => p.marca).filter(Boolean),
    ]),
  ].sort()

  const addProducto = () => {
    const newProd = {
      id: String(Date.now()),
      nombre: '',
      categoria: categorias[0] || '',
      marca: marcasNombres[0] || '',
      descripcion: '',
      precio: 0,
      precioAnterior: null,
      talles: ['S', 'M', 'L'],
      badge: null,
      imagenes: [],
      stock: 10,
      disponible: true,
      orden: items.length + 1,
    }
    save([newProd, ...items])
    setExpandedId(newProd.id)
  }

  const duplicateProducto = (prod) => {
    const dup = { ...prod, id: String(Date.now()), nombre: prod.nombre + ' (copia)' }
    save([dup, ...items])
    setExpandedId(dup.id)
  }

  const updateProducto = (id, field, value) => {
    save(items.map(p => p.id === id ? { ...p, [field]: value } : p))
  }

  const removeProducto = (id) => {
    save(items.filter(p => p.id !== id))
    if (expandedId === id) setExpandedId(null)
  }

  const filtered = items.filter(p => {
    if (filterCat && p.categoria !== filterCat) return false
    if (filterMarca && p.marca !== filterMarca) return false
    if (search) {
      const q = search.toLowerCase()
      return p.nombre.toLowerCase().includes(q)
        || (p.categoria || '').toLowerCase().includes(q)
        || (p.marca || '').toLowerCase().includes(q)
    }
    return true
  })

  const formatPrice = (p) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0 }).format(p)

  return (
    <div className="bg-white border border-border">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-5 py-4 border-b border-border">
        <h3 className="font-display text-sm uppercase tracking-editorial">Productos ({items.length})</h3>
        <button
          onClick={addProducto}
          className="flex items-center gap-1.5 font-display text-[11px] uppercase tracking-editorial text-white bg-primary px-3 py-1.5 hover:bg-primary-hover transition-colors"
        >
          <Plus size={14} /> Nuevo producto
        </button>
      </div>

      {/* Search + filter */}
      <div className="flex flex-col sm:flex-row gap-2 px-5 py-3 border-b border-border bg-light/50">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar producto..."
            className="w-full pl-9 pr-3 py-2 border border-border font-body text-sm outline-none focus:border-primary bg-white"
          />
        </div>
        <select
          value={filterCat}
          onChange={(e) => setFilterCat(e.target.value)}
          className="border border-border px-3 py-2 font-display text-[11px] uppercase tracking-editorial outline-none bg-white"
        >
          <option value="">Todas las categorias</option>
          {categorias.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select
          value={filterMarca}
          onChange={(e) => setFilterMarca(e.target.value)}
          className="border border-border px-3 py-2 font-display text-[11px] uppercase tracking-editorial outline-none bg-white"
        >
          <option value="">Todas las marcas</option>
          {marcasNombres.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>

      {/* Product list */}
      <div className="divide-y divide-border max-h-[70vh] overflow-y-auto">
        {filtered.map((prod) => (
          <div key={prod.id}>
            {/* Row */}
            <button
              onClick={() => setExpandedId(expandedId === prod.id ? null : prod.id)}
              className="w-full flex items-center gap-3 px-5 py-3 hover:bg-light/50 transition-colors text-left"
            >
              <div className="w-10 h-[52px] bg-light flex-shrink-0 overflow-hidden">
                {prod.imagenes && prod.imagenes[0] ? (
                  <img src={prod.imagenes[0]} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center"><Image size={14} className="text-muted" /></div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-display text-xs uppercase tracking-editorial truncate">{prod.nombre || 'Sin nombre'}</p>
                  {prod.badge && (
                    <span className="font-display text-[9px] uppercase tracking-editorial bg-light px-1.5 py-0.5 text-secondary">{prod.badge}</span>
                  )}
                </div>
                <p className="font-body text-[11px] text-secondary">
                  {prod.categoria}
                  {prod.marca ? ` - ${prod.marca}` : ''}
                  {' - '}{formatPrice(prod.precio)} - Stock: {prod.stock}
                </p>
              </div>
              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${prod.disponible ? 'bg-green-500' : 'bg-red-400'}`} />
              {expandedId === prod.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {/* Expanded form */}
            {expandedId === prod.id && (
              <div className="px-5 pb-5 pt-2 bg-light/30 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="md:col-span-3">
                    <Field label="Nombre" value={prod.nombre} onChange={(v) => updateProducto(prod.id, 'nombre', v)} placeholder="Ej: Blazer Milano" />
                  </div>
                  <Field label="Categoria" value={prod.categoria} onChange={(v) => updateProducto(prod.id, 'categoria', v)} placeholder="Ej: Abrigos" />
                  <div className="md:col-span-2">
                    <label className="block font-display text-[10px] uppercase tracking-editorial text-secondary mb-1">Marca</label>
                    <input
                      type="text"
                      list={`marcas-list-${prod.id}`}
                      value={prod.marca || ''}
                      onChange={(e) => updateProducto(prod.id, 'marca', e.target.value)}
                      placeholder="Ej: MILANO"
                      className="w-full border border-border px-3 py-2 font-body text-sm outline-none focus:border-primary"
                    />
                    <datalist id={`marcas-list-${prod.id}`}>
                      {marcasNombres.map(m => <option key={m} value={m} />)}
                    </datalist>
                    <p className="font-body text-[10px] text-muted mt-1">
                      Escribí el nombre o elegí una existente. Si la marca no está cargada, se creará al aparecer en un producto.
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block font-display text-[10px] uppercase tracking-editorial text-secondary mb-1">Descripcion</label>
                  <textarea
                    value={prod.descripcion || ''}
                    onChange={(e) => updateProducto(prod.id, 'descripcion', e.target.value)}
                    rows={3}
                    placeholder="Descripcion del producto. Usa guiones (-) para listas."
                    className="w-full border border-border px-3 py-2 font-body text-sm outline-none focus:border-primary resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <label className="block font-display text-[10px] uppercase tracking-editorial text-secondary mb-1">Precio</label>
                    <input
                      type="number"
                      value={prod.precio || 0}
                      onChange={(e) => updateProducto(prod.id, 'precio', Number(e.target.value))}
                      className="w-full border border-border px-3 py-2 font-body text-sm outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block font-display text-[10px] uppercase tracking-editorial text-secondary mb-1">Precio anterior</label>
                    <input
                      type="number"
                      value={prod.precioAnterior || ''}
                      onChange={(e) => updateProducto(prod.id, 'precioAnterior', e.target.value ? Number(e.target.value) : null)}
                      placeholder="Vacio = sin descuento"
                      className="w-full border border-border px-3 py-2 font-body text-sm outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block font-display text-[10px] uppercase tracking-editorial text-secondary mb-1">Stock</label>
                    <input
                      type="number"
                      value={prod.stock}
                      onChange={(e) => updateProducto(prod.id, 'stock', Number(e.target.value))}
                      className="w-full border border-border px-3 py-2 font-body text-sm outline-none focus:border-primary"
                    />
                  </div>
                  <Field
                    label="Badge"
                    value={prod.badge || ''}
                    onChange={(v) => updateProducto(prod.id, 'badge', v || null)}
                    type="select"
                    options={['', 'NUEVO', 'SALE', 'ULTIMAS']}
                  />
                </div>

                <div>
                  <label className="block font-display text-[10px] uppercase tracking-editorial text-secondary mb-1">
                    Talles (separados por coma)
                  </label>
                  <input
                    type="text"
                    value={(prod.talles || []).join(', ')}
                    onChange={(e) => updateProducto(prod.id, 'talles', e.target.value.split(',').map(t => t.trim()).filter(Boolean))}
                    placeholder="S, M, L, XL"
                    className="w-full border border-border px-3 py-2 font-body text-sm outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block font-display text-[10px] uppercase tracking-editorial text-secondary">
                    Imagenes
                  </label>
                  {(prod.imagenes || []).map((img, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <div className="flex-1">
                        <ImageField
                          label={`Imagen ${i + 1}`}
                          value={img}
                          onChange={(v) => {
                            const imgs = [...(prod.imagenes || [])]
                            imgs[i] = v
                            updateProducto(prod.id, 'imagenes', imgs.filter(Boolean))
                          }}
                        />
                      </div>
                      <button
                        onClick={() => updateProducto(prod.id, 'imagenes', (prod.imagenes || []).filter((_, idx) => idx !== i))}
                        className="mt-6 p-1.5 text-muted hover:text-sale transition-colors flex-shrink-0"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => updateProducto(prod.id, 'imagenes', [...(prod.imagenes || []), ''])}
                    className="font-display text-[10px] uppercase tracking-editorial text-primary hover:text-primary-hover transition-colors"
                  >
                    + Agregar imagen
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <label className="font-display text-[10px] uppercase tracking-editorial text-secondary">Disponible</label>
                  <button
                    onClick={() => updateProducto(prod.id, 'disponible', !prod.disponible)}
                    className={`w-10 h-5 rounded-full transition-colors relative ${prod.disponible ? 'bg-green-500' : 'bg-gray-300'}`}
                  >
                    <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform shadow-sm ${prod.disponible ? 'left-5' : 'left-0.5'}`} />
                  </button>
                </div>

                <div className="flex gap-2 pt-2 border-t border-border">
                  <button
                    onClick={() => duplicateProducto(prod)}
                    className="flex items-center gap-1.5 font-display text-[10px] uppercase tracking-editorial text-secondary hover:text-primary transition-colors"
                  >
                    <Copy size={12} /> Duplicar
                  </button>
                  <button
                    onClick={() => removeProducto(prod.id)}
                    className="flex items-center gap-1.5 font-display text-[10px] uppercase tracking-editorial text-sale hover:text-red-700 transition-colors"
                  >
                    <Trash2 size={12} /> Eliminar
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="px-5 py-8 text-center font-body text-sm text-muted">
          {search || filterCat ? 'No se encontraron productos' : 'No hay productos'}
        </p>
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
          {options.map(o => <option key={o} value={o}>{o || '— Sin badge —'}</option>)}
        </select>
      ) : (
        <input type="text" value={value || ''} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full border border-border px-3 py-2 font-body text-sm outline-none focus:border-primary" />
      )}
    </div>
  )
}
