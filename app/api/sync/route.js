import { NextResponse } from 'next/server'
import { getEntity } from '@/lib/sheetMappers'
import { callAppsScript } from '@/lib/appsScriptClient'
import { isAuthorized } from '@/lib/auth'

export const runtime = 'nodejs'

export async function POST(req) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  }

  let body
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid json' }, { status: 400 })
  }

  const { entity, data } = body || {}
  const mapping = getEntity(entity)
  if (!mapping) {
    return NextResponse.json({ ok: false, error: `unknown entity: ${entity}` }, { status: 400 })
  }

  const rows = mapping.toRows(data || [])
  const result = await callAppsScript({
    action: 'overwrite',
    sheet: mapping.sheetName,
    rows,
  })

  const status = result.ok ? 200 : 500
  return NextResponse.json(result, { status })
}
