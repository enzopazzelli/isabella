// Mapping functions between JS entity objects (as used in the admin) and
// Google Sheet rows (with capitalized Spanish column names, matching the
// parsers in lib/sheets.js).
//
// Each entity exposes:
//   sheetName        — tab name in the Google Sheet
//   toRows(items)    — converts the admin's JS array into an array of row
//                      objects ready to be written as-is by the Apps Script
//
// When adding a new entity, also add its parser to lib/sheets.js so the
// landing can read it back.

const entities = {
  productos: {
    sheetName: 'Productos',
    toRows: (items) => items.map(p => ({
      ID: String(p.id ?? ''),
      Nombre: String(p.nombre ?? ''),
      Seccion: String(p.seccion ?? ''),
      Categoria: String(p.categoria ?? ''),
      Marca: String(p.marca ?? ''),
      Descripcion: String(p.descripcion ?? ''),
      Precio: Number(p.precio) || 0,
      PrecioAnterior: p.precioAnterior != null ? Number(p.precioAnterior) : '',
      Talles: Array.isArray(p.talles) ? p.talles.join(',') : String(p.talles ?? ''),
      Badge: p.badge ?? '',
      ImagenURL: Array.isArray(p.imagenes) ? p.imagenes.join('|') : String(p.imagenes ?? ''),
      Stock: Number(p.stock) || 0,
      Disponible: p.disponible === false ? 'FALSE' : 'TRUE',
      Orden: Number(p.orden) || 0,
    })),
  },

  hero_slides: {
    sheetName: 'Hero',
    toRows: (items) => items.map(s => ({
      ID: String(s.id ?? ''),
      ImagenURL: String(s.imagen ?? ''),
      Titulo: String(s.titulo ?? ''),
      Subtitulo: String(s.subtitulo ?? ''),
      TextoBoton: String(s.textoBoton ?? ''),
      LinkBoton: String(s.linkBoton ?? ''),
      PosicionTexto: String(s.posicionTexto ?? 'center'),
      Activo: s.activo === false ? 'FALSE' : 'TRUE',
      Orden: Number(s.orden) || 0,
    })),
  },

  category_blocks: {
    sheetName: 'Categorias',
    toRows: (items) => items.map(c => ({
      ID: String(c.id ?? ''),
      Nombre: String(c.nombre ?? ''),
      ImagenURL: String(c.imagen ?? ''),
      Activo: c.activo === false ? 'FALSE' : 'TRUE',
      Orden: Number(c.orden) || 0,
    })),
  },

  marcas: {
    sheetName: 'Marcas',
    toRows: (items) => items.map(m => ({
      ID: String(m.id ?? ''),
      Nombre: String(m.nombre ?? ''),
      Logo: String(m.logo ?? ''),
      Orden: Number(m.orden) || 0,
    })),
  },

  banners: {
    sheetName: 'Banners',
    toRows: (items) => items.map(b => ({
      ID: String(b.id ?? ''),
      ImagenURL: String(b.imagen ?? ''),
      Titulo: String(b.titulo ?? ''),
      Subtitulo: String(b.subtitulo ?? ''),
      TextoBoton: String(b.textoBoton ?? ''),
      LinkBoton: String(b.linkBoton ?? ''),
      PosicionTexto: String(b.posicionTexto ?? 'center'),
      Ubicacion: String(b.ubicacion ?? 'pre-productos'),
      Activo: b.activo === false ? 'FALSE' : 'TRUE',
      Orden: Number(b.orden) || 0,
    })),
  },

  testimonios: {
    sheetName: 'Testimonios',
    toRows: (items) => items.map(t => ({
      ID: String(t.id ?? ''),
      Nombre: String(t.nombre ?? ''),
      Texto: String(t.texto ?? ''),
    })),
  },

  instagram_photos: {
    sheetName: 'Instagram',
    toRows: (items) => items.map(i => ({
      ID: String(i.id ?? ''),
      ImagenURL: String(i.imagen ?? ''),
      Activo: i.activo === false ? 'FALSE' : 'TRUE',
      Orden: Number(i.orden) || 0,
    })),
  },

  promos: {
    sheetName: 'Promos',
    // Promos come in as an array of strings. We store one per row.
    toRows: (items) => items.map((txt, idx) => ({
      ID: String(idx + 1),
      Texto: String(txt ?? ''),
      Orden: idx + 1,
    })),
  },

  config: {
    sheetName: 'Config',
    // Config is a flat key/value object. Each key becomes one row.
    toRows: (obj) => Object.entries(obj || {}).map(([k, v]) => ({
      Clave: String(k),
      Valor: v == null ? '' : String(v),
    })),
  },
}

export function getEntity(key) {
  return entities[key] || null
}

export function listEntityKeys() {
  return Object.keys(entities)
}
