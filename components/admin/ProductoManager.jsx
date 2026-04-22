'use client'

import { useState } from 'react'
import { Plus, Trash2, ChevronDown, ChevronUp, Search, Image, Copy, List, LayoutGrid } from 'lucide-react'
import ImageField from './ImageField'

export default function ProductoManager({ productos = [], marcas = [], onSave }) {
  const [items, setItems] = useState(productos)
  const [expandedId, setExpandedId] = useState(null)
  const [search, setSearch] = useState('')
  const [filterSeccion, setFilterSeccion] = useState('')
  const [filterCat, setFilterCat] = useState('')
  const [filterMarca, setFilterMarca] = useState('')
  const [filterStock, setFilterStock] = useState('')     // '' | 'con' | 'sin' | 'bajo'
  const [filterDisp, setFilterDisp] = useState('')        // '' | 'si' | 'no'
  const [viewMode, setViewMode] = useState('detail')      // 'detail' | 'compact'

  const save = (updated) => { setItems(updated); onSave(updated) }

  const seccionesUnicas = [...new Set(items.map(p => p.seccion).filter(Boolean))].sort()
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
      seccion: seccionesUnicas[0] || 'Mujer',
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
    if (filterSeccion && p.seccion !== filterSeccion) return false
    if (filterCat && p.categoria !== filterCat) return false
    if (filterMarca && p.marca !== filterMarca) return false
    if (filterDisp === 'si' && !p.disponible) return false
    if (filterDisp === 'no' && p.disponible) return false
    if (filterStock === 'sin' && (p.stock || 0) > 0) return false
    if (filterStock === 'bajo' && (p.stock || 0) > 5) return false
    if (filterStock === 'con' && (p.stock || 0) <= 0) return false
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
        <h3 className="font-display text-sm uppercase tracking-editorial">
          Productos ({filtered.length}{filtered.length !== items.length ? ` de ${items.length}` : ''})
        </h3>
        <div className="flex items-center gap-2">
          <div className="flex border border-border">
            <button
              onClick={() => setViewMode('detail')}
              className={`p-1.5 transition-colors ${viewMode === 'detail' ? 'bg-primary text-white' : 'text-secondary hover:text-primary'}`}
              title="Vista detalle"
            >
              <LayoutGrid size={14} />
            </button>
            <button
              onClick={() => setViewMode('compact')}
              className={`p-1.5 transition-colors ${viewMode === 'compact' ? 'bg-primary text-white' : 'text-secondary hover:text-primary'}`}
              title="Vista compacta"
            >
              <List size={14} />
            </button>
          </div>
          <button
            onClick={addProducto}
            className="flex items-center gap-1.5 font-display text-[11px] uppercase tracking-editorial text-white bg-primary px-3 py-1.5 hover:bg-primary-hover transition-colors"
          >
            <Plus size={14} /> Nuevo producto
          </button>
        </div>
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
          value={filterSeccion}
          onChange={(e) => setFilterSeccion(e.target.value)}
          className="border border-border px-3 py-2 font-display text-[11px] uppercase tracking-editorial outline-none bg-white"
        >
          <option value="">Todas las secciones</option>
          {seccionesUnicas.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
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
        <select
          value={filterStock}
          onChange={(e) => setFilterStock(e.target.value)}
          className="border border-border px-3 py-2 font-display text-[11px] uppercase tracking-editorial outline-none bg-white"
        >
          <option value="">Todo el stock</option>
          <option value="con">Con stock</option>
          <option value="bajo">Stock bajo (5 o menos)</option>
          <option value="sin">Sin stock</option>
        </select>
        <select
          value={filterDisp}
          onChange={(e) => setFilterDisp(e.target.value)}
          className="border border-border px-3 py-2 font-display text-[11px] uppercase tracking-editorial outline-none bg-white"
        >
          <option value="">Disponibilidad</option>
          <option value="si">Disponible</option>
          <option value="no">No disponible</option>
        </select>
      </div>

      {/* Product list */}
      {viewMode === 'compact' ? (
        /* ── Compact table view ── */
        <div className="max-h-[70vh] overflow-y-auto">
          <table className="w-full text-left">
            <thead className="sticky top-0 bg-white border-b border-border z-10">
              <tr>
                <th className="font-display text-[10px] uppercase tracking-editorial text-secondary px-3 py-2">Producto</th>
                <th className="font-display text-[10px] uppercase tracking-editorial text-secondary px-3 py-2 hidden sm:table-cell">Categoria</th>
                <th className="font-display text-[10px] uppercase tracking-editorial text-secondary px-3 py-2 hidden md:table-cell">Marca</th>
                <th className="font-display text-[10px] uppercase tracking-editorial text-secondary px-3 py-2 text-right">Precio</th>
                <th className="font-display text-[10px] uppercase tracking-editorial text-secondary px-3 py-2 text-center">Stock</th>
                <th className="font-display text-[10px] uppercase tracking-editorial text-secondary px-3 py-2 text-center">Estado</th>
                <th className="font-display text-[10px] uppercase tracking-editorial text-secondary px-3 py-2 w-8"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((prod) => (
                <tr
                  key={prod.id}
                  className="hover:bg-light/50 transition-colors cursor-pointer"
                  onClick={() => { setViewMode('detail'); setExpandedId(prod.id) }}
                >
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-10 bg-light flex-shrink-0 overflow-hidden">
                        {prod.imagenes && prod.imagenes[0] ? (
                          <img src={prod.imagenes[0]} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center"><Image size={10} className="text-muted" /></div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-display text-[11px] uppercase tracking-editorial truncate">{prod.nombre || 'Sin nombre'}</p>
                        {prod.badge && (
                          <span className="font-display text-[8px] uppercase tracking-editorial bg-light px-1 py-px text-secondary">{prod.badge}</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-2 font-body text-[11px] text-secondary hidden sm:table-cell">{prod.categoria}</td>
                  <td className="px-3 py-2 font-body text-[11px] text-secondary hidden md:table-cell">{prod.marca || '—'}</td>
                  <td className="px-3 py-2 font-body text-[11px] text-right">{formatPrice(prod.precio)}</td>
                  <td className="px-3 py-2 text-center">
                    <span className={`font-body text-[11px] font-medium ${
                      (prod.stock || 0) <= 0 ? 'text-red-600' : (prod.stock || 0) <= 5 ? 'text-yellow-600' : 'text-primary'
                    }`}>
                      {prod.stock || 0}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-center">
                    <span className={`w-2 h-2 rounded-full inline-block ${prod.disponible ? 'bg-green-500' : 'bg-red-400'}`} />
                  </td>
                  <td className="px-3 py-2">
                    <ChevronDown size={12} className="text-muted" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
      /* ── Detail view (original) ── */
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
                  <div>
                    <label className="block font-display text-[10px] uppercase tracking-editorial text-secondary mb-1">Seccion</label>
                    <select
                      value={prod.seccion || 'Mujer'}
                      onChange={(e) => updateProducto(prod.id, 'seccion', e.target.value)}
                      className="w-full border border-border px-3 py-2 font-body text-sm outline-none focus:border-primary bg-white"
                    >
                      <option value="Mujer">Mujer</option>
                      <option value="Hombre">Hombre</option>
                      <option value="Kids">Kids</option>
                    </select>
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

                <div className="space-y-2">
                  <label className="block font-display text-[10px] uppercase tracking-editorial text-secondary">
                    Colores (opcional)
                  </label>
                  <p className="font-body text-[10px] text-muted -mt-1">
                    Cada color tiene un nombre, un codigo hex y una imagen asociada. En la tienda se muestran como circulos de color.
                  </p>
                  {(prod.colores || []).map((color, i) => (
                    <div key={i} className="flex items-end gap-2 p-2 border border-border bg-white">
                      <div className="flex-1">
                        <label className="block font-display text-[9px] uppercase tracking-editorial text-muted mb-0.5">Nombre</label>
                        <input
                          type="text"
                          value={color.nombre || ''}
                          onChange={(e) => {
                            const cols = [...(prod.colores || [])]
                            cols[i] = { ...cols[i], nombre: e.target.value }
                            updateProducto(prod.id, 'colores', cols)
                          }}
                          placeholder="Ej: Negro"
                          className="w-full border border-border px-2 py-1.5 font-body text-sm outline-none focus:border-primary"
                        />
                      </div>
                      <div className="w-24">
                        <label className="block font-display text-[9px] uppercase tracking-editorial text-muted mb-0.5">Color</label>
                        <div className="flex items-center gap-1.5">
                          <input
                            type="color"
                            value={color.hex || '#000000'}
                            onChange={(e) => {
                              const cols = [...(prod.colores || [])]
                              cols[i] = { ...cols[i], hex: e.target.value }
                              updateProducto(prod.id, 'colores', cols)
                            }}
                            className="w-8 h-8 border border-border cursor-pointer p-0"
                          />
                          <span className="font-body text-[10px] text-muted">{color.hex || '#000000'}</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <ImageField
                          label="Imagen del color"
                          value={color.imagen || ''}
                          onChange={(v) => {
                            const cols = [...(prod.colores || [])]
                            cols[i] = { ...cols[i], imagen: v }
                            updateProducto(prod.id, 'colores', cols)
                          }}
                        />
                      </div>
                      <button
                        onClick={() => updateProducto(prod.id, 'colores', (prod.colores || []).filter((_, idx) => idx !== i))}
                        className="p-1.5 text-muted hover:text-sale transition-colors flex-shrink-0 mb-1"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => updateProducto(prod.id, 'colores', [...(prod.colores || []), { nombre: '', hex: '#000000', imagen: '' }])}
                    className="font-display text-[10px] uppercase tracking-editorial text-primary hover:text-primary-hover transition-colors"
                  >
                    + Agregar color
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
      )}

      {filtered.length === 0 && (
        <p className="px-5 py-8 text-center font-body text-sm text-muted">
          {search || filterCat || filterMarca || filterStock || filterDisp ? 'No se encontraron productos' : 'No hay productos'}
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
