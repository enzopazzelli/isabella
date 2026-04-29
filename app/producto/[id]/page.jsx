import { notFound } from 'next/navigation'
import ProductoClient from './ProductoClient'
import { fetchAllData } from '@/lib/sheets'
import { defaultProductos } from '@/lib/defaults'
import { mergeNegocio } from '@/lib/runtimeConfig'

export const revalidate = 300

function slugify(text) {
  return String(text || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

async function getData() {
  try {
    const data = await fetchAllData()
    return {
      productos: data.productos || defaultProductos,
      negocio: mergeNegocio(data.config),
    }
  } catch {
    return { productos: defaultProductos, negocio: mergeNegocio(null) }
  }
}

async function getProductos() {
  const { productos } = await getData()
  return productos
}

function findProducto(productos, id) {
  return productos.find(p => String(p.id) === String(id) || slugify(p.nombre) === id)
}

export async function generateStaticParams() {
  const productos = await getProductos()
  return productos.map(p => ({ id: slugify(p.nombre) || String(p.id) }))
}

export async function generateMetadata({ params }) {
  const { productos, negocio } = await getData()
  const producto = findProducto(productos, params.id)

  if (!producto) {
    return { title: 'Producto no encontrado' }
  }

  const title = `${producto.nombre} — ${negocio.nombre} ${negocio.subtitulo}`
  const description = (producto.descripcion || `${producto.nombre} - ${producto.categoria || ''} ${producto.marca || ''}`.trim()).slice(0, 160)
  const image = producto.imagenes?.[0]

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      locale: 'es_AR',
      images: image ? [{ url: image, width: 1200, height: 1600, alt: producto.nombre }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: image ? [image] : [],
    },
  }
}

function absoluteUrl(baseUrl, path) {
  if (!path) return ''
  if (/^https?:\/\//.test(path)) return path
  return `${baseUrl}${path.startsWith('/') ? '' : '/'}${path}`
}

export default async function ProductoPage({ params }) {
  const { productos, negocio } = await getData()
  const producto = findProducto(productos, params.id)

  if (!producto) notFound()

  const slug = slugify(producto.nombre) || String(producto.id)
  const productUrl = `${negocio.url}/producto/${slug}`
  const images = (producto.imagenes || []).filter(Boolean).map(p => absoluteUrl(negocio.url, p))
  const inStock = producto.disponible !== false && (producto.stock == null || Number(producto.stock) > 0)

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: producto.nombre,
    description: producto.descripcion || `${producto.nombre}${producto.categoria ? ` — ${producto.categoria}` : ''}`,
    image: images.length ? images : undefined,
    sku: String(producto.id),
    brand: producto.marca ? { '@type': 'Brand', name: producto.marca } : undefined,
    category: producto.categoria || undefined,
    offers: {
      '@type': 'Offer',
      url: productUrl,
      price: Number(producto.precio) || 0,
      priceCurrency: 'ARS',
      availability: inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
    },
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: negocio.url },
      ...(producto.categoria
        ? [{ '@type': 'ListItem', position: 2, name: producto.categoria, item: `${negocio.url}/#productos` }]
        : []),
      { '@type': 'ListItem', position: producto.categoria ? 3 : 2, name: producto.nombre, item: productUrl },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <ProductoClient producto={producto} negocio={negocio} />
    </>
  )
}
