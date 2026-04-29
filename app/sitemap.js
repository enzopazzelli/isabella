import { negocio } from '@/lib/config'
import { fetchAllData } from '@/lib/sheets'
import { defaultProductos } from '@/lib/defaults'

function slugify(text) {
  return String(text || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export default async function sitemap() {
  const baseUrl = negocio.url
  const now = new Date()

  let productos = defaultProductos
  try {
    const data = await fetchAllData()
    productos = data.productos || defaultProductos
  } catch {}

  const productUrls = productos.map((p) => ({
    url: `${baseUrl}/producto/${slugify(p.nombre) || p.id}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  return [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/#productos`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/#nueva-coleccion`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/#contacto`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    ...productUrls,
  ]
}
