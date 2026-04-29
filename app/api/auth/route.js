import { NextResponse } from 'next/server'
import { checkPassword } from '@/lib/auth'

export const runtime = 'nodejs'

export async function POST(req) {
  let body
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid json' }, { status: 400 })
  }

  const { password } = body || {}
  if (typeof password !== 'string' || !password) {
    return NextResponse.json({ ok: false, error: 'missing password' }, { status: 400 })
  }

  if (!checkPassword(password)) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  }

  return NextResponse.json({ ok: true })
}
