'use client'

import { useState, useEffect } from 'react'
import { ChevronDown, ChevronUp, Search, Check, X, Trash2 } from 'lucide-react'
import { getOrders, getMetrics, updateOrderStatus, deleteOrder } from '@/lib/orders'

function MetricCard({ label, value, sub }) {
  return (
    <div className="border border-border p-4">
      <p className="font-body text-xs text-secondary uppercase">{label}</p>
      <p className="font-display text-2xl mt-1">{value}</p>
      {sub && <p className="font-body text-xs text-muted mt-1">{sub}</p>}
    </div>
  )
}

export default function PedidosManager() {
  const [orders, setOrders] = useState([])
  const [metrics, setMetrics] = useState(null)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('todos')
  const [expandedId, setExpandedId] = useState(null)

  const refresh = () => {
    setOrders(getOrders())
    setMetrics(getMetrics())
  }

  useEffect(() => { refresh() }, [])

  const formatPrice = (p) =>
    new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0 }).format(p)

  const handleStatus = (id, status) => {
    updateOrderStatus(id, status)
    refresh()
  }

  const handleDelete = (id) => {
    deleteOrder(id)
    refresh()
  }

  const filtered = orders.filter(o => {
    if (filter !== 'todos' && o.estado !== filter) return false
    if (search) {
      const q = search.toLowerCase()
      return o.id.toLowerCase().includes(q) ||
        (o.cliente || '').toLowerCase().includes(q) ||
        (o.items || []).some(i => i.nombre.toLowerCase().includes(q))
    }
    return true
  })

  const statusColors = {
    pendiente: 'text-yellow-600 bg-yellow-50',
    confirmado: 'text-green-700 bg-green-50',
    cancelado: 'text-red-700 bg-red-50',
  }

  return (
    <div>
      {/* Metrics */}
      {metrics && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
          <MetricCard label="Total" value={metrics.total} />
          <MetricCard label="Confirmados" value={metrics.confirmados} />
          <MetricCard label="Pendientes" value={metrics.pendientes} />
          <MetricCard label="Cancelados" value={metrics.cancelados} />
          <MetricCard label="Ingresos" value={formatPrice(metrics.ingresos)} />
          <MetricCard label="Conversion" value={`${metrics.conversion}%`} />
        </div>
      )}

      {/* Top Products */}
      {metrics && metrics.topProductos.length > 0 && (
        <div className="border border-border p-4 mb-6">
          <h3 className="font-display text-sm uppercase tracking-editorial mb-3">Top Productos</h3>
          <div className="space-y-2">
            {metrics.topProductos.map((p) => {
              const max = metrics.topProductos[0].cantidad
              return (
                <div key={p.nombre} className="flex items-center gap-3">
                  <span className="font-body text-xs w-32 truncate">{p.nombre}</span>
                  <div className="flex-1 h-2 bg-light overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${(p.cantidad / max) * 100}%` }} />
                  </div>
                  <span className="font-body text-xs text-secondary w-8 text-right">{p.cantidad}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar pedido..."
            className="w-full pl-9 pr-3 py-2 border border-border font-body text-sm outline-none focus:border-primary transition-colors"
          />
        </div>
        <div className="flex gap-2">
          {['todos', 'pendiente', 'confirmado', 'cancelado'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`font-display text-[11px] uppercase tracking-editorial px-3 py-2 border transition-colors ${
                filter === f ? 'bg-primary text-white border-primary' : 'border-border hover:border-primary'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-2">
        {filtered.map((order) => (
          <div key={order.id} className="border border-border">
            <button
              onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
              className="w-full flex items-center justify-between p-4 text-left"
            >
              <div className="flex items-center gap-3">
                <span className="font-display text-xs uppercase tracking-editorial">{order.id}</span>
                <span className={`font-display text-[10px] uppercase tracking-editorial px-2 py-0.5 ${statusColors[order.estado] || ''}`}>
                  {order.estado}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-body text-sm">{formatPrice(order.total || 0)}</span>
                {expandedId === order.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </div>
            </button>

            {expandedId === order.id && (
              <div className="px-4 pb-4 border-t border-border pt-3">
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div>
                    <p className="font-body text-xs text-secondary">Cliente</p>
                    <p className="font-body text-sm">{order.cliente || 'Sin nombre'}</p>
                  </div>
                  <div>
                    <p className="font-body text-xs text-secondary">Fecha</p>
                    <p className="font-body text-sm">{new Date(order.fecha).toLocaleString('es-AR')}</p>
                  </div>
                </div>

                {order.notas && (
                  <div className="mb-3">
                    <p className="font-body text-xs text-secondary">Notas</p>
                    <p className="font-body text-sm">{order.notas}</p>
                  </div>
                )}

                <div className="mb-3">
                  <p className="font-body text-xs text-secondary mb-1">Items</p>
                  {(order.items || []).map((item, i) => (
                    <div key={i} className="flex justify-between font-body text-sm py-0.5">
                      <span>{item.nombre} {item.talle !== 'Unico' ? `(${item.talle})` : ''} x{item.cantidad}</span>
                      <span>{formatPrice(item.precio * item.cantidad)}</span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  {order.estado !== 'confirmado' && (
                    <button
                      onClick={() => handleStatus(order.id, 'confirmado')}
                      className="flex items-center gap-1 font-display text-[10px] uppercase tracking-editorial px-3 py-1.5 bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 transition-colors"
                    >
                      <Check size={12} /> Confirmar
                    </button>
                  )}
                  {order.estado !== 'cancelado' && (
                    <button
                      onClick={() => handleStatus(order.id, 'cancelado')}
                      className="flex items-center gap-1 font-display text-[10px] uppercase tracking-editorial px-3 py-1.5 bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 transition-colors"
                    >
                      <X size={12} /> Cancelar
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(order.id)}
                    className="flex items-center gap-1 font-display text-[10px] uppercase tracking-editorial px-3 py-1.5 border border-border text-secondary hover:text-primary hover:border-primary transition-colors"
                  >
                    <Trash2 size={12} /> Eliminar
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {filtered.length === 0 && (
          <p className="text-center py-8 font-body text-sm text-muted">
            No hay pedidos {filter !== 'todos' ? `con estado "${filter}"` : ''}
          </p>
        )}
      </div>
    </div>
  )
}
