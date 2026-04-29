import { NextResponse } from 'next/server'
import { callAppsScript } from '@/lib/appsScriptClient'
import { isAuthorized } from '@/lib/auth'

export const runtime = 'nodejs'

const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
const ALLOWED_SUBFOLDERS = new Set(['productos', 'hero', 'banners', 'category_blocks', 'instagram', 'marcas'])
const MAX_BYTES = 5 * 1024 * 1024

export async function POST(req) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  }

  let form
  try {
    form = await req.formData()
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid form data' }, { status: 400 })
  }

  const file = form.get('file')
  if (!file || typeof file === 'string') {
    return NextResponse.json({ ok: false, error: 'missing file' }, { status: 400 })
  }

  if (!ALLOWED_MIME.has(file.type)) {
    return NextResponse.json(
      { ok: false, error: `unsupported mime type: ${file.type || 'unknown'}` },
      { status: 400 }
    )
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { ok: false, error: `file too large (max ${MAX_BYTES} bytes)` },
      { status: 413 }
    )
  }

  const rawSubfolder = form.get('subfolder')
  let subfolder = ''
  if (typeof rawSubfolder === 'string' && rawSubfolder.trim()) {
    const candidate = rawSubfolder.trim()
    if (!ALLOWED_SUBFOLDERS.has(candidate)) {
      return NextResponse.json({ ok: false, error: `invalid subfolder: ${candidate}` }, { status: 400 })
    }
    subfolder = candidate
  }

  const dataBase64 = Buffer.from(await file.arrayBuffer()).toString('base64')

  const result = await callAppsScript({
    action: 'uploadImage',
    filename: file.name || 'upload',
    mimeType: file.type,
    dataBase64,
    subfolder,
  })

  if (!result.ok) {
    return NextResponse.json(result, { status: 502 })
  }

  return NextResponse.json(result, { status: 200 })
}
