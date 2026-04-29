import { negocio } from '@/lib/config'

export default function manifest() {
  return {
    name: `${negocio.nombre} ${negocio.subtitulo}`,
    short_name: negocio.nombre,
    description: negocio.descripcion,
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    orientation: 'portrait',
    lang: 'es-AR',
    icons: [
      {
        src: '/logo-negro.jpeg',
        sizes: '512x512',
        type: 'image/jpeg',
        purpose: 'any',
      },
    ],
  }
}
