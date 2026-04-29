import { ImageResponse } from 'next/og'
import { negocio } from '@/lib/config'

export const runtime = 'edge'
export const alt = `${negocio.nombre} ${negocio.subtitulo}`
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #f7f3ee 0%, #e8d9c5 100%)',
          color: '#1a1a1a',
          fontFamily: 'serif',
          padding: 80,
        }}
      >
        <div style={{ fontSize: 28, letterSpacing: 8, marginBottom: 24, opacity: 0.7 }}>
          {negocio.ciudad.toUpperCase()} · {negocio.provincia.toUpperCase()}
        </div>
        <div style={{ fontSize: 140, fontWeight: 300, lineHeight: 1, letterSpacing: -2 }}>
          {negocio.nombre}
        </div>
        <div style={{ fontSize: 44, marginTop: 12, letterSpacing: 4, opacity: 0.85 }}>
          {negocio.subtitulo.toUpperCase()}
        </div>
        <div style={{ fontSize: 26, marginTop: 56, opacity: 0.65, textAlign: 'center', maxWidth: 900 }}>
          {negocio.descripcion}
        </div>
      </div>
    ),
    { ...size },
  )
}
