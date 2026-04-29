# Prompt: Isabella Añatuya Boutique — E-Commerce Editorial de Moda

Necesito que construyas una tienda online de una sola página (SPA-style) para **Isabella Añatuya Boutique**, una tienda de ropa femenina. El diseño debe seguir el estilo visual de marcas argentinas de moda como St. Marie, Delucca, Y-Lovers, Estancias Chiripa, Complot y Ossira: **minimalismo editorial, fotografía como protagonista, tipografía fina en mayúsculas, paleta blanco/negro, y una experiencia de navegación que se siente como hojear una revista de moda**.

El proyecto debe ser **100% personalizable** a través de un archivo de configuración central y un CMS basado en Google Sheets. La clienta debe poder administrar productos, imágenes del hero, textos sobre las imágenes principales, banners, y todo el contenido visual desde el panel de administración y Google Sheets.

---

## 1. IDENTIDAD VISUAL — DIRECCIÓN ESTÉTICA

### Filosofía de diseño
El sitio NO es una "tienda online genérica". Es una **experiencia editorial de moda**. Cada decisión de diseño debe priorizar:
- La fotografía como héroe absoluto (las imágenes mandan, la interfaz se hace invisible)
- Espacios blancos generosos (el vacío es parte del diseño)
- Tipografía fina, elegante, con tracking amplio en mayúsculas
- Cero ruido visual: sin gradientes llamativos, sin sombras pesadas, sin bordes redondeados exagerados, sin emojis
- Transiciones suaves y lentas (nada abrupto, todo fluido como pasando páginas)
- La sensación de "menos es más" en cada elemento

### Referencia del logo
El logo de Isabella usa una tipografía sans-serif ultra thin/light con tracking amplio (similar a Josefin Sans Light). "ISABELLA" en grande, debajo "— AÑATUYA BOUTIQUE —" más pequeño con líneas decorativas a los lados. Versión negra sobre fondo blanco y versión blanca sobre fondo negro.

---

## 2. DATOS DE LA MARCA

```js
// lib/config.js — Archivo central de configuración
export const negocio = {
  nombre: 'Isabella',
  subtitulo: 'Añatuya Boutique',
  descripcion: 'Tienda de moda femenina en Añatuya — Ropa, calzado y accesorios con estilo',
  whatsapp: '',            // Número con código de país (completar)
  instagram: '',           // Usuario sin @ (completar)
  facebook: '',            // URL completa (completar)
  email: '',               // Email de contacto (completar)
  ciudad: 'Añatuya',
  provincia: 'Santiago del Estero',
  pais: 'Argentina',
  direccion: '',           // Dirección del local (completar)
  url: '',                 // URL del sitio (completar)
  horario: '',             // Ej: 'Lunes a Sábado 9:00 - 13:00 / 17:00 - 21:00'
}

export const navLinks = [
  { label: 'INICIO', href: '#inicio' },
  { label: 'NUEVA COLECCIÓN', href: '#nueva-coleccion' },
  { label: 'PRODUCTOS', href: '#productos' },
  { label: 'CONTACTO', href: '#contacto' },
]
// NOTA: Los links de categoría se generan dinámicamente desde los datos de productos
```

---

## 3. STACK TÉCNICO

- **Framework:** Next.js 14 con App Router
- **Lenguaje:** JavaScript (NO TypeScript)
- **Estilos:** Tailwind CSS con tema personalizado en `tailwind.config.js`
- **Fuentes:** Google Fonts — Josefin Sans (Light, Regular, SemiBold) + Lato (Light, Regular)
- **Íconos:** Lucide React
- **CMS:** Google Sheets (API pública gviz, sin autenticación)
- **Imágenes:** Google Drive (URLs públicas convertidas a formato directo)
- **Persistencia local:** localStorage para carrito y pedidos
- **Checkout:** WhatsApp (no MercadoPago, no pasarela de pagos)
- **Deploy:** Vercel

---

## 4. TEMA Y COLORES (Tailwind config)

La paleta es intencionalmente restringida. En moda editorial, el color lo aportan las fotos, no la interfaz.

```js
// tailwind.config.js
colors: {
  primary: '#000000',         // Negro puro — textos principales, navbar, botones
  'primary-hover': '#1a1a1a', // Hover sutil sobre negro
  secondary: '#888888',       // Textos secundarios (precios cuotas, categorías)
  muted: '#AAAAAA',           // Textos muy suaves (placeholders, hints)
  light: '#FAFAFA',           // Fondo de secciones alternas (apenas perceptible)
  nude: '#F3EDE8',            // Fondo cálido opcional para secciones destacadas
  border: '#E5E5E5',          // Bordes ultra sutiles
  'border-dark': '#333333',   // Bordes en contextos oscuros
  sale: '#8B0000',            // Rojo oscuro elegante para descuentos (NO rojo chillón)
  whatsapp: '#25D366',        // Botón WhatsApp
  white: '#FFFFFF',
}

fontFamily: {
  display: ['Josefin Sans', 'sans-serif'],   // Títulos, nav, logo, categorías
  body: ['Lato', 'sans-serif'],               // Cuerpo de texto, descripciones, precios
}

letterSpacing: {
  'editorial': '0.15em',    // Para categorías y nav items
  'wide-title': '0.2em',    // Para títulos principales
  'logo': '0.25em',         // Para el nombre del logo
}
```

### Reglas tipográficas
- **Navegación:** Josefin Sans Regular, 12-13px, uppercase, letter-spacing editorial
- **Títulos de sección:** Josefin Sans Light, 24-32px, uppercase, letter-spacing wide-title
- **Nombre de producto:** Josefin Sans Regular, 13-14px, uppercase, letter-spacing editorial
- **Precios:** Lato Regular, 14-15px
- **Descripciones:** Lato Light, 14px, color secondary
- **Botones:** Josefin Sans Regular, 12px, uppercase, letter-spacing editorial
- **Textos sobre hero:** Josefin Sans Light, 36-48px en desktop / 24-28px en mobile, uppercase, color blanco con text-shadow sutil

---

## 5. ESTRUCTURA DEL PROYECTO

```
app/
  layout.jsx            → Metadata SEO, Google Fonts, favicon, JSON-LD
  page.jsx              → Página principal, estado global (carrito, datos)
  globals.css           → Estilos globales + animaciones + marquee
  api/data/route.js     → API route que fetchea Google Sheets
  admin/
    page.jsx            → Redirect a dashboard
    dashboard/
      page.jsx          → Panel de administración
  robots.txt/route.js
  sitemap.xml/route.js

components/
  landing/
    PromoBar.jsx        → Marquee continuo de promociones
    Navbar.jsx          → Nav editorial con logo a la izquierda
    Hero.jsx            → Carrusel editorial full-width (administrable)
    CategoryBlocks.jsx  → Bloques visuales de categorías (administrable)
    ProductGrid.jsx     → Sección de productos con filtros
    ProductCard.jsx     → Card de producto estilo editorial
    FilterBar.jsx       → Filtros minimalistas
    QuickViewModal.jsx  → Modal de detalle de producto
    EditorialBanner.jsx → Banner visual intermedio (administrable)
    Testimonios.jsx     → Carrusel minimalista de testimonios
    InstagramFeed.jsx   → Grilla de fotos estilo feed de Instagram
    Newsletter.jsx      → Sección de suscripción al newsletter
    Footer.jsx          → Footer editorial
    CarritoPanel.jsx    → Panel lateral del carrito

  admin/
    PedidosManager.jsx  → Gestión de pedidos con métricas
    ContentManager.jsx  → Gestión visual de hero/banners/categorías

  ui/
    Modal.jsx           → Modal reutilizable
    ShareButton.jsx     → Botón compartir
    FormattedDescription.jsx
    SizeGuideLink.jsx

lib/
  config.js             → Configuración de la marca
  defaults.js           → Datos fallback
  sheets.js             → Fetch de Google Sheets
  drive.js              → Conversión URLs de Google Drive
  admin.js              → Config admin
  orders.js             → Gestión de pedidos en localStorage

public/
  logo-negro.jpeg       → Logo versión negra (para fondo blanco)
  logo-blanco.jpeg      → Logo versión blanca (para fondo negro/hero)
  favicon.png
  guiadetalles.jpeg     → Guía de talles (opcional)
```

---

## 6. FUNCIONALIDADES DETALLADAS

### 6.1 PromoBar (Marquee continuo)

Barra superior con texto promocional que se mueve continuamente de derecha a izquierda (estilo Y-Lovers / Estancias Chiripa).

- **Estilo:** Fondo negro, texto blanco, Josefin Sans 11px, uppercase, letter-spacing editorial
- **Implementación:** CSS animation con `@keyframes marquee` — duplicar el contenido para loop infinito sin gaps
- **Velocidad:** ~30-40 segundos para un ciclo completo (lento, elegante)
- Los mensajes se separan con un separador tipográfico como ` — ` o ` ✦ ` o ` | `
- Mensajes configurables desde Google Sheets (hoja "Config", clave `promos`, separados por `|`)
- Altura fija: ~32px en desktop, ~28px en mobile

### 6.2 Navbar — Logo a la izquierda, estilo Delucca / St. Marie / Estancias Chiripa

**Layout desktop:**
```
[ ISABELLA ]     [ INICIO | NUEVA COLECCIÓN | PRODUCTOS | CONTACTO ]     [ 🔍 ] [ 🛒 ]
```
- **Logo a la izquierda, prominente.** NO usar la imagen del logo — renderizar "ISABELLA" como texto en Josefin Sans Light, ~28-32px, uppercase, letter-spacing logo (0.25em), color negro. Esto es más limpio, escala bien, y matchea exactamente con la identidad de la marca. Debajo del nombre, opcionalmente en pantallas grandes, mostrar "AÑATUYA BOUTIQUE" en Josefin Sans Light 9-10px, letter-spacing 0.3em, color secondary (igual que en el logo original con las líneas a los lados — pero sin las líneas, solo el texto)
- **Links de navegación al centro:** Josefin Sans Regular 12px, uppercase, letter-spacing editorial (0.15em), color primary. Hover: color secondary con transición suave. El link activo (basado en scroll position) tiene un borde inferior de 1px negro (no subrayado grueso)
- **Íconos a la derecha:** Búsqueda (Search de Lucide, stroke-width: 1.5) + Carrito (ShoppingBag, stroke-width: 1.5) con badge numérico negro/blanco
- **Fondo:** Blanco con borde inferior `border-b border-border` (1px, ultra sutil)
- **Sticky:** Se queda fijo al scrollear. Sin sombra — solo el borde inferior. Al scrollear agrega `bg-white/95 backdrop-blur-sm`
- **Altura:** ~70-80px en desktop, ~60px en mobile
- Los links del nav incluyen los de `navLinks` de config.js. Las categorías de productos NO van en el nav principal — se acceden desde los CategoryBlocks o desde los filtros en la sección de productos

**Mobile:**
```
[ ☰ ]     [ ISABELLA ]     [ 🔍 ] [ 🛒 ]
```
- Hamburguesa a la izquierda (ícono de 3 líneas finas, stroke-width: 1.5)
- "ISABELLA" centrado en Josefin Sans Light ~22px (sin "Añatuya Boutique" en mobile para no apretar)
- Búsqueda + carrito a la derecha
- **Menú mobile (overlay fullscreen):**
  - Fondo blanco
  - "ISABELLA" arriba centrado con "AÑATUYA BOUTIQUE" debajo
  - Links de navegación centrados verticalmente, Josefin Sans Light 22px, uppercase, letter-spacing wide, gap 2rem entre links
  - Debajo de los links principales, las categorías de productos como sublinks más pequeños (13px, color secondary, letter-spacing editorial)
  - Redes sociales en la parte inferior (íconos finos de Instagram, Facebook, WhatsApp)
  - Animación: fade-in del overlay + stagger de los links (cada uno entra con delay incremental 0.05s)
  - Botón X arriba a la derecha para cerrar (ícono X de Lucide, stroke-width: 1.5)
  - Cierra con Escape también

**Búsqueda:**
- Click en ícono de búsqueda despliega un input a full-width debajo del navbar (push content down, no overlay)
- Input con borde inferior solo, sin bordes laterales ni fondo (estilo editorial)
- Placeholder: "Buscar productos..." en Lato Light italic, color muted
- Filtra productos en tiempo real por nombre y categoría
- Scrollea automáticamente a la sección productos al escribir
- Click en X o Escape cierra la barra de búsqueda

### 6.3 Hero — Carrusel editorial full-width (ADMINISTRABLE)

**Esta es la sección más importante del sitio.** Debe funcionar como las portadas de las marcas de referencia.

**Visual:**
- Imágenes a full-width, full-viewport height (100vh en desktop, 70vh en mobile)
- Si la imagen no llena el viewport, usar `object-cover` para que siempre se vea full
- Texto superpuesto sobre la imagen (posición configurable desde Sheets)
- Texto en Josefin Sans Light, blanco, uppercase, con `text-shadow: 0 2px 20px rgba(0,0,0,0.3)` para legibilidad
- Botón CTA opcional debajo del texto: borde blanco fino, fondo transparente, texto blanco, hover invierte (fondo blanco, texto negro)
- Sin overlay oscuro sobre la imagen (la foto debe verse pura). Si el texto no es legible, usar un gradient sutil solo en la zona del texto: `linear-gradient(to top, rgba(0,0,0,0.4), transparent)`

**Carrusel:**
- 2-5 slides configurables desde Google Sheets
- Transición crossfade (no slide horizontal — el fade es más editorial)
- Autoplay: cambio cada 5-6 segundos
- Indicadores: líneas horizontales finas en la parte inferior (estilo timeline), la activa se llena progresivamente con una animación de width
- Sin flechas de navegación (las líneas de progreso son suficientes)
- Pausa autoplay al hover (desktop)

**Administrable desde Google Sheets (Hoja "Hero"):**

| ID | ImagenURL | Titulo | Subtitulo | TextoBoton | LinkBoton | PosicionTexto | Orden | Activo |

- `ImagenURL`: URL de Google Drive
- `Titulo`: Texto principal sobre la imagen (ej: "NUEVA COLECCIÓN", "INVIERNO 2026")
- `Subtitulo`: Texto secundario más pequeño (ej: "Descubrí los nuevos arrivals")
- `TextoBoton`: Texto del CTA (ej: "VER COLECCIÓN"). Si está vacío, no muestra botón
- `LinkBoton`: Anchor o URL al que apunta el botón (ej: "#productos", o URL externa)
- `PosicionTexto`: Donde se ubica el texto sobre la imagen: `center`, `bottom-left`, `bottom-center`, `bottom-right`. Default: `center`
- `Orden`: Orden numérico
- `Activo`: TRUE/FALSE — permite activar/desactivar slides sin borrarlos

**Panel admin → Sección "Hero":**
- Preview de cada slide con la imagen, título y subtítulo
- Link directo a la hoja "Hero" en Google Sheets para editar
- Instrucciones claras: "Subí la imagen a Google Drive, poné el link acá, y el título que quieras mostrar"

### 6.4 CategoryBlocks — Bloques de categorías visuales (ADMINISTRABLE)

Sección inmediatamente después del hero. Bloques de imagen con nombre de categoría superpuesto (estilo Delucca: SWEATERS, ABRIGOS, PANTALONES).

**Layout:**
- Desktop: 3-4 columnas iguales
- Mobile: 2 columnas o scroll horizontal
- Cada bloque: imagen cuadrada o 3:4, con nombre de la categoría centrado en texto blanco uppercase sobre la imagen
- Hover: zoom sutil de la imagen (scale 1.05, transition 0.6s ease)
- Click: scrollea a la sección productos y activa el filtro de esa categoría

**Administrable desde Google Sheets (Hoja "Categorias"):**

| ID | Nombre | ImagenURL | Orden | Activo |

- `Nombre`: Nombre que se muestra sobre la imagen (ej: "ABRIGOS", "DENIM", "VESTIDOS")
- `ImagenURL`: URL de Google Drive de la foto editorial de esa categoría
- `Orden` y `Activo`: Para ordenar y mostrar/ocultar

**Panel admin → Sección "Categorías":**
- Preview de los bloques
- Link a la hoja en Google Sheets
- Instrucciones: "Cada categoría necesita una foto linda. Ideal: foto de modelo con la prenda representativa de esa categoría"

### 6.5 Productos — Grilla editorial con filtros minimalistas

**Título de sección:** "NUEVA COLECCIÓN" o "PRODUCTOS" — Josefin Sans Light, 28px, uppercase, centrado, con una línea decorativa corta debajo (40px de ancho, 1px de alto, color primary)

**Grilla:**
- Desktop: 4 columnas (sin sidebar de filtros — los filtros van arriba de la grilla)
- Tablet: 3 columnas
- Mobile: 2 columnas
- Gap: 16px en mobile, 20px en desktop
- Padding horizontal generoso: px-6 en mobile, px-12 en desktop

**FilterBar (filtros arriba de la grilla, inline):**
- **Desktop:** Una fila horizontal con los filtros:
  - Categorías como pills/tabs (click activa/desactiva)
  - Dropdown minimalista de "Ordenar por" (Nombre A-Z, Precio menor/mayor, Nuevos primero)
  - Dropdown de talles
  - Dropdown de precio (rangos dinámicos)
  - Todos los dropdowns: borde fino, fondo blanco, tipografía Josefin Sans 11px uppercase
- **Mobile:** Botón "FILTRAR" que expande/colapsa el panel de filtros. Cuando se expande, muestra pills de categoría + dropdowns
- Indicador de filtros activos + "Limpiar" en texto underline
- Contador de resultados: "24 productos" en Lato Light 13px, color secondary

### 6.6 ProductCard — Estilo editorial minimalista

**Imagen:**
- Aspect ratio 3:4 (retrato, como foto de modelo)
- `object-cover` para que siempre llene el contenedor
- Si no hay imagen: fondo `bg-light` con el nombre del producto centrado en texto muted
- **Hover desktop:** Muestra segunda imagen (si existe) con crossfade transition (0.5s). Si solo tiene 1 imagen, hace zoom sutil (scale 1.03)
- **Badge:** Texto pequeño posicionado arriba a la izquierda: NUEVO (fondo negro, texto blanco), SALE -XX% (fondo sale, texto blanco), ÚLTIMAS (fondo nude, texto primary). Tipografía 10px, uppercase, letter-spacing editorial, padding 4px 10px
- Productos sin stock: imagen con `opacity-50` y `grayscale`, badge "AGOTADO"

**Quick-add (hover desktop only):**
- Un botón "AGREGAR" aparece centrado en la parte inferior de la imagen con fade-in
- Fondo blanco/90, texto negro, borde fino negro, Josefin Sans 11px uppercase
- Si tiene múltiples talles: el botón dice "VER TALLES" y abre QuickView
- **Usar `pointer-events-none` / `group-hover:pointer-events-auto`** para no interferir en mobile

**Info debajo de la imagen:**
- Categoría: Lato Light 11px, uppercase, color secondary, letter-spacing 0.1em
- Nombre: Josefin Sans Regular 13px, uppercase, color primary, letter-spacing editorial
- Precio: Lato Regular 14px, color primary
- Precio anterior (si SALE): Lato Regular 13px, tachado, color secondary, al lado del precio actual
- Cuotas: Lato Light 11px, color muted (ej: "3 cuotas sin interés de $XX.XXX")
- Sin borde en la card, sin sombra, sin fondo — la card es simplemente imagen + texto

**Click en la card:** Abre QuickView modal

### 6.7 QuickView Modal

- Overlay con fondo `bg-black/50` con `backdrop-blur-sm`
- Modal centrado, fondo blanco, max-width 900px
- **Desktop:** Grid 2 columnas (55% imagen | 45% info)
- **Mobile:** 1 columna (imagen arriba, info debajo, scroll interno)

**Columna imagen:**
- Imagen principal grande
- Thumbnails debajo (horizontal scroll si muchas)
- Flechas de navegación finas
- Click en imagen principal: no hace nada (no lightbox por ahora)

**Columna info:**
- Categoría (Lato Light 11px, uppercase, secondary, letter-spacing)
- Nombre (Josefin Sans Regular 18px, uppercase)
- Precio (Lato Regular 20px) + precio anterior tachado si SALE
- Cuotas (Lato Light 12px, muted)
- Línea separadora (1px, border)
- Descripción (Lato Regular 14px, color secondary, line-height 1.7. Soporta listas con guiones → renderizar como `<ul><li>`)
- Selector de talle: pills con borde fino. Talle seleccionado: fondo negro, texto blanco. Sin seleccionar: fondo blanco, borde negro fino. Validación: si no selecciona, borde rojo + mensaje "Seleccioná un talle"
- Selector de cantidad (+/-)
- Botón "AGREGAR AL CARRITO": fondo negro, texto blanco, full-width, Josefin Sans 12px uppercase, height 48px. Hover: fondo primary-hover
- Botón "COMPRAR AHORA": borde negro fino, fondo blanco, texto negro, full-width. Click: agrega al carrito y abre el panel
- Link "Guía de talles" (underline, Lato 12px, secondary)
- Botón compartir (ícono Share2 de Lucide)
- **Producto sin stock:** Mensaje "PRODUCTO AGOTADO" + botón "CONSULTAR POR WHATSAPP"
- Cierra con Escape, click en backdrop, o botón X (fino, arriba derecha)

### 6.8 CarritoPanel (Panel lateral)

- Slide-in desde la derecha, ancho 420px en desktop, full-width en mobile
- Overlay `bg-black/40` detrás
- Bloquea scroll del body cuando está abierto
- Header: "CARRITO" en Josefin Sans 14px uppercase + botón X
- Línea separadora

**Estado vacío:**
- Ícono ShoppingBag (stroke-width 1, tamaño grande, color muted)
- "Tu carrito está vacío" en Josefin Sans Light 16px
- Botón "VER PRODUCTOS" (borde negro fino)

**Con items:**
- Cada item: thumbnail (60x80px, 3:4), nombre (Josefin Sans 12px uppercase), talle, precio unitario, controles de cantidad (+/-), subtotal, botón eliminar (ícono X fino)
- **Cambio de talle:** Click en el talle abre un mini-selector de pills. Si ya existe un item con el nuevo talle, fusionar cantidades
- Link "Guía de talles" arriba de los items
- Separador
- Campos: Nombre del comprador (input con borde inferior solo) y Notas (textarea minimal)
- Total: Josefin Sans SemiBold 18px
- Botón "FINALIZAR COMPRA POR WHATSAPP": fondo whatsapp, texto blanco, full-width, con ícono MessageCircle

**Checkout WhatsApp:**
- Genera ID de pedido formato `IS-YYMMDD-XXXX`
- Guarda pedido en localStorage con estado "pendiente"
- Arma mensaje formateado para WhatsApp con todos los datos
- Navega a `wa.me/...` con `window.location.href` (NO `window.open`)

### 6.9 EditorialBanner — Banner visual intermedio (ADMINISTRABLE)

Banner a full-width que aparece entre la sección de categorías y los productos, o entre bloques de productos. Funciona como un "respiro visual" tipo lookbook.

**Visual:**
- Imagen full-width, height 50vh en desktop, 40vh en mobile
- Texto superpuesto opcional (mismo estilo que el hero)
- Puede tener botón CTA opcional

**Administrable desde Google Sheets (Hoja "Banners"):**

| ID | ImagenURL | Titulo | Subtitulo | TextoBoton | LinkBoton | PosicionTexto | Ubicacion | Orden | Activo |

- `Ubicacion`: "pre-productos", "mid-productos", "post-productos" — indica dónde se inserta el banner en el flujo de la página
- Mismo sistema de posición de texto que el Hero

### 6.10 Testimonios — Carrusel minimalista

- Fondo light o nude
- Título: "LO QUE DICEN NUESTRAS CLIENTAS" — Josefin Sans Light, uppercase, centrado
- Cards sin borde ni sombra: solo texto centrado
- Comillas decorativas grandes (tipográficas, "") en color muted arriba del texto
- Texto del testimonio en Lato Regular 15px italic, color primary
- Nombre: Josefin Sans Regular 12px, uppercase, color secondary
- Sin estrellas (en este estilo editorial no se usan. Si la clienta las quiere, agregarlas en versión sutil: puntos o líneas en vez de estrellas amarillas)
- Carrusel con autoplay lento (8 segundos), dots minimalistas debajo (círculos pequeños, 6px, borde fino)
- Datos desde Google Sheets (hoja "Testimonios")

### 6.11 InstagramFeed — Grilla de fotos

- Título: "SEGUINOS EN INSTAGRAM" + "@isabella_boutique" (o el user real) como link
- Grilla de 4-6 fotos cuadradas (en una fila en desktop, 2x3 en mobile)
- Hover: overlay negro al 30% con ícono de Instagram centrado en blanco
- **Implementación simple:** Las fotos se cargan desde Google Sheets (hoja "Instagram") o desde Google Drive. NO usar la API de Instagram (requiere token y expira). La clienta sube las fotos manualmente
- Click en una foto: abre la cuenta de Instagram en nueva pestaña

**Hoja "Instagram":**
| ID | ImagenURL | Orden | Activo |

### 6.12 Newsletter — Sección de suscripción

- Fondo negro, texto blanco
- "SUSCRIBITE PARA RECIBIR NOVEDADES" — Josefin Sans Light 20px, uppercase, centrado
- Input de email + botón "ENVIAR" en la misma línea
- Input: fondo transparente, borde inferior blanco, texto blanco, placeholder en muted
- Botón: borde blanco, fondo transparente, texto blanco, hover: fondo blanco texto negro
- La suscripción puede guardarse en Google Sheets (hoja "Suscriptores") via una API route simple, o simplemente abrir un mailto/WhatsApp con el email

### 6.13 Footer — Editorial

- Fondo negro o primary-dark
- Logo versión blanca centrado arriba
- Columnas debajo:
  - **NAVEGACIÓN:** Links del sitio (uppercase, Josefin Sans 11px, letter-spacing, color white/70, hover white)
  - **CONTACTO:** Dirección, horario, email, teléfono
  - **SEGUINOS:** Íconos de Instagram, Facebook, WhatsApp (finos, blancos)
- Línea separadora fina (border-dark)
- Copyright: "© 2026 Isabella Añatuya Boutique" — Lato Light 11px, color white/50
- Links: Cambios y devoluciones, Preguntas frecuentes (abren modal o scroll a sección)
- Medios de pago: íconos pequeños en blanco/gris (opcional si la clienta no cobra online)

### 6.14 Compartir

- **Variante "icon"** (ProductCard hover): Botón que abre dropdown
- **Variante "full"** (QuickView): Botón ancho
- Redes: WhatsApp, Facebook, X (Twitter)
- "Copiar enlace" con feedback visual
- Si `navigator.share` disponible, agregar "Más opciones..."
- Click fuera cierra el dropdown
- Estilo del dropdown: fondo blanco, borde fino, sombra sutil (`shadow-sm`), Josefin Sans 11px

---

## 7. CMS — GOOGLE SHEETS

### 7.1 Estructura de la Spreadsheet

**Hoja "Productos":**
| ID | Nombre | Categoria | Descripcion | Precio | PrecioAnterior | Talles | Badge | ImagenURL | Stock | Disponible | Orden |
- `Talles`: separados por coma (ej: `S, M, L, XL`)
- `ImagenURL`: URLs de Google Drive separadas por `|` (primera imagen = principal, segunda = hover)
- `Badge`: NUEVO, SALE, ÚLTIMAS, o vacío
- `Disponible`: TRUE/FALSE
- `Categoria` y `Talles`: el código convierte a String antes de procesar

**Hoja "Hero":**
| ID | ImagenURL | Titulo | Subtitulo | TextoBoton | LinkBoton | PosicionTexto | Orden | Activo |

**Hoja "Categorias":**
| ID | Nombre | ImagenURL | Orden | Activo |

**Hoja "Banners":**
| ID | ImagenURL | Titulo | Subtitulo | TextoBoton | LinkBoton | PosicionTexto | Ubicacion | Orden | Activo |

**Hoja "Testimonios":**
| ID | Nombre | Texto | Estrellas |

**Hoja "Instagram":**
| ID | ImagenURL | Orden | Activo |

**Hoja "FAQ":**
| Pregunta | Respuesta |
(Las respuestas soportan listas: líneas con `-`, `*` o `•` → `<ul><li>`)

**Hoja "Config":**
| Clave | Valor |
- `promos` (separadas por `|`)
- `instagramUser` (para mostrar @username)
- Cualquier otro valor configurable

### 7.2 Fetch de datos
- API pública gviz: `https://docs.google.com/spreadsheets/d/{SHEET_ID}/gviz/tq?tqx=out:json&headers=1&sheet={sheetName}`
- Parsear respuesta JSON (quitar prefijo de 47 chars y sufijo de 2 chars)
- Revalidar cada 300 segundos (`next: { revalidate: 300 }`)
- Si falla, usar datos fallback de `lib/defaults.js`
- API route `/api/data` devuelve todos los datos juntos

### 7.3 Google Drive para imágenes
- Convertir `drive.google.com/file/d/{ID}/...` → `https://lh3.googleusercontent.com/d/{ID}`
- Función helper `getDriveImageUrl(url)`

---

## 8. PANEL DE ADMINISTRACIÓN

Ruta: `/admin/dashboard` — Protegido con contraseña simple (localStorage)

### 8.1 Tabs del panel

**Tab "Contenido Visual":**
- **Hero slides:** Preview de cada slide activo con imagen, título, subtítulo. Link a la hoja "Hero" para editar
- **Bloques de categoría:** Preview de los bloques. Link a la hoja "Categorias"
- **Banners editoriales:** Preview. Link a la hoja "Banners"
- **Feed Instagram:** Preview de la grilla. Link a la hoja "Instagram"
- Cada sección con instrucciones claras de cómo subir/cambiar imágenes y textos

**Tab "Productos":**
- Link directo a la hoja "Productos" en Google Sheets
- Guía de uso: cómo agregar productos, formatos de campos, cómo poner imágenes

**Tab "Pedidos":**
- Cards de métricas: Total, Confirmados, Cancelados, Pendientes, Ingresos, Tasa de conversión
- Top productos (barras de progreso)
- Lista de pedidos con filtros + búsqueda
- Cada pedido expandible: items, cliente, notas, fecha
- Acciones: Confirmar, Cancelar, Eliminar
- Pedidos en localStorage

**Tab "Configuración":**
- Link a la hoja "Config"
- Link a la hoja "FAQ"
- Link a la hoja "Testimonios"

### 8.2 Gestión de pedidos (lib/orders.js)
- `generateOrderId()` → formato `IS-YYMMDD-XXXX`
- `getOrders()`, `saveOrder()`, `updateOrderStatus()`, `deleteOrder()`
- `getMetrics()` → totales, ingresos, conversión, top productos
- `getStockUsed()` → cantidades de pedidos confirmados por producto+talle

---

## 9. SEO Y PERFORMANCE

- Metadata completa en `layout.jsx` (title, description, keywords, openGraph)
- Structured data JSON-LD (LocalBusiness + Product)
- `robots.txt` y `sitemap.xml` como route handlers
- Favicon configurable
- Google Fonts optimizado con `next/font/google`
- Imágenes con `next/image` donde sea posible (o `<img>` con lazy loading)
- Scroll reveal con IntersectionObserver

---

## 10. RESPONSIVE Y UX

- **Mobile first** en todo
- **Navbar desktop:** Logo "ISABELLA" a la izquierda | Links centro | Búsqueda + Carrito derecha
- **Navbar mobile:** Hamburguesa izq | "ISABELLA" centro | Búsqueda + Carrito der
- **Hero:** 70vh en mobile (no 100vh para que se vea que hay contenido abajo)
- **CategoryBlocks:** 2 columnas en mobile
- **ProductGrid:** 2 columnas en mobile, 3 en tablet, 4 en desktop
- **Filtros mobile:** Botón "FILTRAR" que expande/colapsa panel inline (NO drawer desde abajo)
- **QuickView:** 1 columna en mobile con scroll interno
- **Carrito:** Full width en mobile, 420px en desktop
- **Hover effects:** Solo desktop (`pointer-events-none` + `group-hover:pointer-events-auto`)
- Todos los modales cierran con Escape
- Scroll suave para navegación interna (`scroll-behavior: smooth`)

---

## 11. ANIMACIONES (globals.css)

```css
/* ===== MARQUEE (PromoBar) ===== */
@keyframes marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
.animate-marquee {
  animation: marquee 35s linear infinite;
}

/* ===== SCROLL REVEAL ===== */
.scroll-reveal {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.8s ease, transform 0.8s ease;
}
.scroll-reveal.visible {
  opacity: 1;
  transform: translateY(0);
}

/* ===== FADE IN ===== */
.animate-fade-in {
  animation: fadeIn 0.4s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* ===== CROSSFADE (Hero) ===== */
.hero-slide {
  transition: opacity 1.2s ease-in-out;
}

/* ===== SCALE IN (Modals) ===== */
.animate-scale-in {
  animation: scaleIn 0.3s ease-out;
}
@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.97); }
  to { opacity: 1; transform: scale(1); }
}

/* ===== SLIDE IN (Carrito, Menú) ===== */
.animate-slide-in-right {
  animation: slideInRight 0.35s ease-out;
}
@keyframes slideInRight {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}

/* ===== MENU LINKS STAGGER ===== */
.menu-link-enter {
  opacity: 0;
  transform: translateY(15px);
  animation: menuLinkIn 0.4s ease-out forwards;
}
@keyframes menuLinkIn {
  to { opacity: 1; transform: translateY(0); }
}

/* ===== IMAGE HOVER ZOOM ===== */
.img-zoom {
  transition: transform 0.6s ease;
}
.group:hover .img-zoom {
  transform: scale(1.05);
}

/* ===== HERO PROGRESS BAR ===== */
@keyframes progressFill {
  from { width: 0%; }
  to { width: 100%; }
}
.hero-progress-active .hero-progress-bar {
  animation: progressFill 5.5s linear forwards;
}
```

---

## 12. DATOS FALLBACK (lib/defaults.js)

Crear un archivo con datos de ejemplo realistas para que el sitio se vea completo incluso sin Google Sheets. Usar categorías genéricas de moda femenina y productos placeholder.

- `heroSlides` → array de 3 slides con título, subtítulo, posición de texto, imagen placeholder (usar gradientes CSS elegantes como fallback: negro, nude, gris oscuro)
- `categorias` → array: Abrigos, Denim, Vestidos, Remeras, Pantalones, Accesorios
- `categoryBlocks` → array de 4-6 bloques con imagen placeholder
- `productos` → array de ~12-16 productos con nombres reales de moda (ej: "Blazer Milano", "Jean Straight Selena", "Vestido Lino Toscana")
- `testimonios` → array de ~4 testimonios
- `faqs` → array de ~6 preguntas frecuentes (envíos, talles, cambios, pagos, WhatsApp, horario)
- `banners` → array de 1-2 banners editoriales
- `instagramPhotos` → array de 6 items con placeholder
- `promos` → array de ~4 mensajes: "ENVÍOS A TODO EL PAÍS", "3 CUOTAS SIN INTERÉS", etc.

Cada producto: id, nombre, categoria, descripcion, precio, precioAnterior (null si no tiene), talles (array), badge (null o string), imagenes (array — vacío para placeholders), stock, disponible.

---

## 13. INSTRUCCIONES DE IMPLEMENTACIÓN

### Orden de construcción:
1. `lib/config.js` con los datos de Isabella
2. `tailwind.config.js` con la paleta editorial blanco/negro y fuentes Josefin Sans + Lato
3. `app/globals.css` con animaciones (marquee, scroll-reveal, crossfade, etc.)
4. `app/layout.jsx` con metadata SEO + Google Fonts via `next/font/google`
5. `lib/defaults.js` con datos placeholder completos
6. `lib/sheets.js`, `lib/drive.js`, `lib/admin.js`, `lib/orders.js`
7. Componentes UI reutilizables (`Modal`, `ShareButton`, `FormattedDescription`, `SizeGuideLink`)
8. Componentes de landing en orden de aparición visual:
   - PromoBar → Navbar → Hero → CategoryBlocks → EditorialBanner → ProductGrid + FilterBar + ProductCard → QuickViewModal → Testimonios → InstagramFeed → Newsletter → Footer → CarritoPanel
9. `app/page.jsx` conectando todo (estado carrito, fetch datos, callbacks)
10. Panel admin (`ContentManager`, `PedidosManager`)
11. API route `/api/data`
12. `robots.txt` y `sitemap.xml`
13. Testear en mobile y desktop

### Consideraciones importantes:
- **NO usar TypeScript** — todo en JavaScript (.js/.jsx)
- **NO usar pasarelas de pago** — solo WhatsApp checkout
- **NO usar `window.open`** para WhatsApp — usar `window.location.href`
- **NO usar bordes redondeados grandes** (`rounded-lg`, `rounded-xl`) — usar `rounded-none` o máximo `rounded-sm` para mantener la estética editorial
- **NO usar sombras pesadas** — máximo `shadow-sm` y solo donde sea funcional (dropdowns)
- **NO usar gradientes de color como decoración** — solo gradientes sutiles de transparencia sobre imágenes para legibilidad de texto
- **NO usar emojis** en ningún lado del sitio (excepto si la clienta lo pide explícitamente en algún promo)
- Todos los valores numéricos de Sheets deben coercionarse a String con `String()` antes de `.split()` o comparaciones
- Filtros de precio: dinámicos (terciles de datos reales)
- Carrito agrupa items por producto + talle
- Cambio de talle en carrito: si ya existe item con ese talle, fusionar cantidades
- Producto con múltiples talles: botón "Agregar" del ProductCard debe abrir QuickView para selección de talle
- Imágenes del hero, categorías y banners: si no hay imagen configurada, mostrar un placeholder elegante (fondo degradado oscuro con el nombre de la sección en texto fino)

---

## 14. CHECKLIST DE ESTILO VISUAL

Antes de dar por terminado cualquier componente, verificar:

- [ ] ¿La tipografía usa Josefin Sans para títulos/nav y Lato para body? ¿No se coló Inter, Arial o system fonts?
- [ ] ¿Los textos de UI están en uppercase con letter-spacing editorial?
- [ ] ¿Los colores son solo blanco, negro, grises y los definidos en el tema? ¿No hay azules, púrpuras o colores random?
- [ ] ¿Los bordes son de 1px y ultra sutiles?
- [ ] ¿No hay rounded-lg ni sombras pesadas?
- [ ] ¿Los espacios blancos son generosos? ¿La página "respira"?
- [ ] ¿La fotografía/imagen es el centro visual de cada sección?
- [ ] ¿Las transiciones son suaves (>0.3s) y no abruptas?
- [ ] ¿En mobile se ve limpio, sin elementos apretados?
- [ ] ¿El sitio se siente como una revista de moda y no como una tienda genérica?
