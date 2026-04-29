import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const body = await request.json()
    if (process.env.NODE_ENV !== 'production') {
      console.log('[vitals]', body)
    }
  } catch {}
  return NextResponse.json({ ok: true })
}
