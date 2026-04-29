import { NextResponse } from 'next/server'
import { callAppsScript } from '@/lib/appsScriptClient'
import { isAuthorized } from '@/lib/auth'

export const runtime = 'nodejs'

// POST — public checkout. A shopper places an order; we append it to the
// Pedidos sheet. Minimal validation: require id + items. No auth: it's a
// public endpoint, but any row without an id is rejected, and the Apps
// Script dedupes by id.
export async function POST(req) {
  let order
  try {
    order = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid json' }, { status: 400 })
  }

  if (!order || typeof order !== 'object' || !order.id || !Array.isArray(order.items)) {
    return NextResponse.json({ ok: false, error: 'invalid order' }, { status: 400 })
  }

  const result = await callAppsScript({ action: 'appendOrder', order })
  const status = result.ok ? 200 : 500
  return NextResponse.json(result, { status })
}

// GET — admin only. Returns all orders from the Pedidos sheet.
export async function GET(req) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  }

  const result = await callAppsScript({ action: 'listOrders' })
  const status = result.ok ? 200 : 500
  return NextResponse.json(result, { status })
}

// PATCH — admin only. Updates the Estado of a specific order.
// Body: { id: 'IS-...', estado: 'confirmado' | 'cancelado' | 'pendiente' }
export async function PATCH(req) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  }

  let body
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid json' }, { status: 400 })
  }

  const { id, estado } = body || {}
  if (!id || !estado) {
    return NextResponse.json({ ok: false, error: 'missing id or estado' }, { status: 400 })
  }

  const result = await callAppsScript({ action: 'updateOrder', id, estado })
  const status = result.ok ? 200 : 500
  return NextResponse.json(result, { status })
}

// DELETE — admin only. Body: { id: 'IS-...' }
export async function DELETE(req) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  }

  let body
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid json' }, { status: 400 })
  }

  const { id } = body || {}
  if (!id) return NextResponse.json({ ok: false, error: 'missing id' }, { status: 400 })

  const result = await callAppsScript({ action: 'deleteOrder', id })
  const status = result.ok ? 200 : 500
  return NextResponse.json(result, { status })
}
