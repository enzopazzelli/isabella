import { SHEET_ID } from './config'
import { getDriveImageUrl } from './drive'

async function fetchSheet(sheetName) {
  if (!SHEET_ID) return null

  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&headers=1&sheet=${encodeURIComponent(sheetName)}`

  try {
    const res = await fetch(url, { next: { revalidate: 300 } })
    const text = await res.text()
    // Remove the prefix "/*O_o*/\ngoogle.visualization.Query.setResponse(" and suffix ");"
    const json = JSON.parse(text.substring(47).slice(0, -2))
    const cols = json.table.cols.map(c => c.label)
    const rows = json.table.rows.map(row => {
      const obj = {}
      row.c.forEach((cell, i) => {
        obj[cols[i]] = cell ? (cell.v !== null ? cell.v : '') : ''
      })
      return obj
    })
    return rows
  } catch {
    return null
  }
}

function parseProductos(rows) {
  if (!rows) return null
  return rows
    .filter(r => String(r.Disponible).toUpperCase() !== 'FALSE')
    .map(r => ({
      id: String(r.ID || ''),
      nombre: String(r.Nombre || ''),
      categoria: String(r.Categoria || ''),
      descripcion: String(r.Descripcion || ''),
      precio: Number(r.Precio) || 0,
      precioAnterior: r.PrecioAnterior ? Number(r.PrecioAnterior) : null,
      talles: String(r.Talles || '').split(',').map(t => t.trim()).filter(Boolean),
      badge: r.Badge ? String(r.Badge) : null,
      imagenes: String(r.ImagenURL || '').split('|').map(u => getDriveImageUrl(u.trim())).filter(Boolean),
      stock: r.Stock !== undefined ? Number(r.Stock) : 99,
      disponible: String(r.Disponible).toUpperCase() !== 'FALSE',
      orden: Number(r.Orden) || 0,
    }))
    .sort((a, b) => a.orden - b.orden)
}

function parseHero(rows) {
  if (!rows) return null
  return rows
    .filter(r => String(r.Activo).toUpperCase() !== 'FALSE')
    .map(r => ({
      id: String(r.ID || ''),
      imagen: getDriveImageUrl(String(r.ImagenURL || '')),
      titulo: String(r.Titulo || ''),
      subtitulo: String(r.Subtitulo || ''),
      textoBoton: String(r.TextoBoton || ''),
      linkBoton: String(r.LinkBoton || ''),
      posicionTexto: String(r.PosicionTexto || 'center'),
      orden: Number(r.Orden) || 0,
    }))
    .sort((a, b) => a.orden - b.orden)
}

function parseCategorias(rows) {
  if (!rows) return null
  return rows
    .filter(r => String(r.Activo).toUpperCase() !== 'FALSE')
    .map(r => ({
      id: String(r.ID || ''),
      nombre: String(r.Nombre || ''),
      imagen: getDriveImageUrl(String(r.ImagenURL || '')),
      orden: Number(r.Orden) || 0,
    }))
    .sort((a, b) => a.orden - b.orden)
}

function parseBanners(rows) {
  if (!rows) return null
  return rows
    .filter(r => String(r.Activo).toUpperCase() !== 'FALSE')
    .map(r => ({
      id: String(r.ID || ''),
      imagen: getDriveImageUrl(String(r.ImagenURL || '')),
      titulo: String(r.Titulo || ''),
      subtitulo: String(r.Subtitulo || ''),
      textoBoton: String(r.TextoBoton || ''),
      linkBoton: String(r.LinkBoton || ''),
      posicionTexto: String(r.PosicionTexto || 'center'),
      ubicacion: String(r.Ubicacion || 'pre-productos'),
      orden: Number(r.Orden) || 0,
    }))
    .sort((a, b) => a.orden - b.orden)
}

function parseTestimonios(rows) {
  if (!rows) return null
  return rows.map(r => ({
    id: String(r.ID || ''),
    nombre: String(r.Nombre || ''),
    texto: String(r.Texto || ''),
  }))
}

function parseInstagram(rows) {
  if (!rows) return null
  return rows
    .filter(r => String(r.Activo).toUpperCase() !== 'FALSE')
    .map(r => ({
      id: String(r.ID || ''),
      imagen: getDriveImageUrl(String(r.ImagenURL || '')),
      orden: Number(r.Orden) || 0,
    }))
    .sort((a, b) => a.orden - b.orden)
}

function parseFaq(rows) {
  if (!rows) return null
  return rows.map(r => ({
    pregunta: String(r.Pregunta || ''),
    respuesta: String(r.Respuesta || ''),
  }))
}

function parseConfig(rows) {
  if (!rows) return null
  const config = {}
  rows.forEach(r => {
    config[String(r.Clave || '')] = String(r.Valor || '')
  })
  return config
}

export async function fetchAllData() {
  const [productos, hero, categorias, banners, testimonios, instagram, faq, config] =
    await Promise.all([
      fetchSheet('Productos'),
      fetchSheet('Hero'),
      fetchSheet('Categorias'),
      fetchSheet('Banners'),
      fetchSheet('Testimonios'),
      fetchSheet('Instagram'),
      fetchSheet('FAQ'),
      fetchSheet('Config'),
    ])

  return {
    productos: parseProductos(productos),
    heroSlides: parseHero(hero),
    categoryBlocks: parseCategorias(categorias),
    banners: parseBanners(banners),
    testimonios: parseTestimonios(testimonios),
    instagramPhotos: parseInstagram(instagram),
    faqs: parseFaq(faq),
    config: parseConfig(config),
  }
}
