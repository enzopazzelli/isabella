const ORDERS_KEY = 'isabella_orders'

// ---------- Async variants that go through /api/orders ----------
// These are used by the public checkout (append) and by the admin panel
// (list / update / delete). All fall back silently so the UI keeps working
// if the Sheet is not configured.

function authHeader() {
  if (typeof window === 'undefined') return {}
  try {
    const pass = sessionStorage.getItem('isabella_admin_pass') || ''
    return pass ? { Authorization: `Bearer ${pass}` } : {}
  } catch {
    return {}
  }
}

export async function postOrderRemote(order) {
  try {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order),
    })
    if (!res.ok) return { ok: false }
    return await res.json()
  } catch {
    return { ok: false }
  }
}

export async function fetchOrdersRemote() {
  try {
    const res = await fetch('/api/orders', { headers: authHeader() })
    if (!res.ok) return null
    const data = await res.json()
    return Array.isArray(data.orders) ? data.orders : null
  } catch {
    return null
  }
}

export async function updateOrderStatusRemote(id, estado) {
  try {
    const res = await fetch('/api/orders', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...authHeader() },
      body: JSON.stringify({ id, estado }),
    })
    return res.ok
  } catch {
    return false
  }
}

export async function deleteOrderRemote(id) {
  try {
    const res = await fetch('/api/orders', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', ...authHeader() },
      body: JSON.stringify({ id }),
    })
    return res.ok
  } catch {
    return false
  }
}

export function generateOrderId() {
  const now = new Date()
  const yy = String(now.getFullYear()).slice(2)
  const mm = String(now.getMonth() + 1).padStart(2, '0')
  const dd = String(now.getDate()).padStart(2, '0')
  const rand = String(Math.floor(Math.random() * 10000)).padStart(4, '0')
  return `IS-${yy}${mm}${dd}-${rand}`
}

export function getOrders() {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]')
  } catch {
    return []
  }
}

export function saveOrder(order) {
  const orders = getOrders()
  orders.unshift(order)
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders))
  return order
}

export function updateOrderStatus(orderId, status) {
  const orders = getOrders()
  const idx = orders.findIndex(o => o.id === orderId)
  if (idx !== -1) {
    orders[idx].estado = status
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders))
  }
  return orders
}

export function deleteOrder(orderId) {
  const orders = getOrders().filter(o => o.id !== orderId)
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders))
  return orders
}

export function getMetrics() {
  const orders = getOrders()
  const confirmados = orders.filter(o => o.estado === 'confirmado')
  const cancelados = orders.filter(o => o.estado === 'cancelado')
  const pendientes = orders.filter(o => o.estado === 'pendiente')
  const ingresos = confirmados.reduce((sum, o) => sum + (o.total || 0), 0)

  // Top productos
  const productCount = {}
  confirmados.forEach(o => {
    (o.items || []).forEach(item => {
      const key = item.nombre
      productCount[key] = (productCount[key] || 0) + item.cantidad
    })
  })
  const topProductos = Object.entries(productCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([nombre, cantidad]) => ({ nombre, cantidad }))

  return {
    total: orders.length,
    confirmados: confirmados.length,
    cancelados: cancelados.length,
    pendientes: pendientes.length,
    ingresos,
    conversion: orders.length ? Math.round((confirmados.length / orders.length) * 100) : 0,
    topProductos,
  }
}

export function getStockUsed() {
  const orders = getOrders().filter(o => o.estado === 'confirmado')
  const stock = {}
  orders.forEach(o => {
    (o.items || []).forEach(item => {
      const key = `${item.id}-${item.talle}`
      stock[key] = (stock[key] || 0) + item.cantidad
    })
  })
  return stock
}
