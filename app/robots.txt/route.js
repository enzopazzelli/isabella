import { negocio } from '@/lib/config'

export function GET() {
  const body = `User-agent: *
Allow: /
Disallow: /admin/

Sitemap: ${negocio.url || 'https://isabella-boutique.vercel.app'}/sitemap.xml
`

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain' },
  })
}
