# Isabella — Añatuya Boutique

Landing + e-commerce editorial para **Isabella Boutique** (Añatuya, Santiago del Estero). Construido con Next.js 14 (App Router), React 18, JavaScript y Tailwind CSS. Panel de administración integrado que permite al dueño editar todo el contenido sin tocar código, con persistencia en `localStorage` y fallback a Google Sheets.

---

## Stack

- **Framework:** Next.js 14.2 (App Router, export estático compatible)
- **UI:** React 18 + Tailwind CSS 3 (tema editorial B/N custom)
- **Iconos:** lucide-react
- **Datos:** Google Sheets (opcional) vía gviz — el sitio funciona sin configurar nada porque tiene defaults reales
- **Imágenes:** Google Drive (conversión automática de links a `lh3.googleusercontent.com`) o cualquier URL pública
- **Persistencia del admin:** `localStorage` del navegador del dueño (no necesita base de datos)

---

## Estructura del proyecto

```
isabella/
├── app/
│   ├── page.jsx                  → Landing pública
│   ├── layout.jsx                → Root layout + fuentes
│   ├── globals.css               → Estilos globales, animaciones, dark mode
│   ├── admin/
│   │   └── dashboard/page.jsx    → Panel de administración
│   └── api/
│       └── data/route.js         → API que lee Sheets (con fallback a defaults)
│
├── components/
│   ├── landing/                  → Componentes públicos
│   │   ├── PromoBar, Navbar, Hero
│   │   ├── CategoryBlocks, BrandsCarousel, EditorialBanner
│   │   ├── ProductGrid, ProductCard, FilterBar, QuickViewModal
│   │   ├── Testimonios, InstagramFeed
│   │   ├── Newsletter, Footer, CarritoPanel
│   │
│   ├── admin/                    → CRUD del panel
│   │   ├── HeroManager, CategoryManager, BrandManager
│   │   ├── BannerManager, ProductoManager
│   │   ├── PromoManager, TestimonioManager, InstagramManager
│   │   ├── ConfigManager, PedidosManager
│   │   └── ImageField            → Input reusable con drag&drop + Drive
│   │
│   └── ui/                       → Modal, FormattedDescription, ShareButton, SizeGuideLink
│
├── lib/
│   ├── config.js                 → Datos del negocio + password admin + SHEET_ID
│   ├── defaults.js               → Contenido semilla (productos, hero, banners, etc.)
│   ├── sheets.js                 → Lectura de Google Sheets (parser gviz)
│   ├── drive.js                  → Conversión de links de Google Drive
│   ├── admin.js                  → Helpers del admin + parse de URLs Drive
│   ├── store.js                  → Wrapper sobre localStorage (`isabella_admin_*`)
│   └── orders.js                 → Persistencia de pedidos + métricas
│
├── public/imgs/                  → Imágenes por defecto del sitio
├── tailwind.config.js            → Tema custom (primary, secondary, sale, etc.)
├── next.config.js
└── package.json
```

---

## Instalación y desarrollo

Requiere **Node.js 18+**.

```bash
# 1. Instalar dependencias
npm install

# 2. Arrancar en modo desarrollo
npm run dev
# → http://localhost:3000

# 3. Build de producción
npm run build
npm start
```

No hay archivos `.env` obligatorios. El sitio arranca con contenido semilla incluido.

---

## Cómo fluyen los datos

Prioridad de lectura en la landing (de mayor a menor):

1. **`localStorage` — overrides del admin** (`isabella_admin_*`)
   Todo lo que el dueño edita desde `/admin/dashboard` se guarda acá y tiene la prioridad más alta.
2. **API `/api/data` — Google Sheets**
   Si hay `SHEET_ID` configurado en [lib/config.js](lib/config.js), se leen los datos en vivo.
3. **`lib/defaults.js` — semilla**
   Contenido por defecto para que el sitio siempre tenga algo que mostrar.

Esto permite mostrarle el sitio al cliente funcionando al 100% sin backend, y que el dueño lo personalice solo desde el navegador.

---

## Panel de administración

**URL:** `/admin` (redirige al dashboard)
**Contraseña por defecto:** `isabella2026` (cambiala en [lib/config.js](lib/config.js#L27))

### Pestañas

| Pestaña | Administra |
|---|---|
| **LANDING** | Hero, bloques de categorías, marcas, banners editoriales, feed de Instagram |
| **PRODUCTOS** | ABM de productos (nombre, categoría, marca, precio, descripción, talles, imágenes, stock, disponibilidad) |
| **TEXTOS Y PROMOS** | Mensajes de la barra superior (marquee) y testimonios |
| **PEDIDOS** | Pedidos recibidos vía carrito + métricas (ingresos, conversión, top productos) |
| **CONFIGURACIÓN** | WhatsApp, redes, dirección, horario, URL del sitio; botón de reset total |

### Funciones clave del admin

- **Modo oscuro** independiente del de la landing (toggle Sun/Moon en el header)
- **Drag & drop de imágenes** en todos los managers (arrastrás un link de Drive o una URL y se pega automáticamente)
- **Conversión automática de links de Google Drive** → formato servido por `lh3.googleusercontent.com`
- **Reordenamiento** (subir/bajar) en hero, categorías, marcas, banners, productos, Instagram
- **Reset total** desde Configuración (limpia todos los overrides del `localStorage`)

### Cómo entrar al admin desde la tienda

Hay un ícono de engranaje discreto al lado del "Todos los derechos reservados" en el Footer. También se puede ir directo a `/admin`.

---

## Features de la landing

- **PromoBar** — marquee infinito con mensajes editables
- **Navbar transparente** sobre el hero, se ilumina al hacer scroll o hover
- **Hero** full-screen con crossfade entre slides + barra de progreso
- **CategoryBlocks** — grid editorial con click → filtro de productos
- **BrandsCarousel** — marquee infinito de marcas, persiste aunque no haya marcas cargadas (cae a defaults para demo)
- **EditorialBanners** — banners con ubicación configurable (pre/mid/post productos)
- **ProductGrid** con FilterBar (categoría, marca, precio, orden), búsqueda en vivo desde el navbar, scroll reveal
- **ProductCard** con badge, precio tachado, hover zoom, botones rápidos (QuickView / Agregar), estado **agotado** cuando `disponible: false` o `stock <= 0`
- **QuickViewModal** — galería, talles, cantidad, cuotas, descripción formateada, share, link a WhatsApp si está agotado
- **CarritoPanel** — lateral derecho, edit talles/cantidad, checkout por WhatsApp con ID de pedido
- **Testimonios**, **InstagramFeed** (6 cuadros clickeables), **Newsletter**, **Footer**
- **Dark mode** de la landing con toggle Sun/Moon en el navbar, persistido en `localStorage` (`isabella_theme`)
- **Scroll reveal** con IntersectionObserver
- **Scrollbar** minimalista en desktop, invisible en mobile

---

## Tema y diseño

El tema está en [tailwind.config.js](tailwind.config.js) con una paleta editorial B/N:

- `primary` — negro principal (texto, botones)
- `secondary` — gris medio (subtítulos)
- `muted` — gris claro (placeholders)
- `border` — borde fino
- `light` — fondo suave (secciones alternadas)
- `sale` — rojo boutique (descuentos, errores)
- `whatsapp` — verde oficial de WhatsApp

Fuentes: **Lato** (body) + una display serif editorial. Las clases utilitarias custom son `font-display`, `tracking-editorial`, `tracking-logo`, `tracking-wide-title`.

---

## Google Drive como CMS de imágenes

El admin acepta cualquiera de estos formatos y los convierte solos:

```
https://drive.google.com/file/d/FILE_ID/view?usp=sharing
https://drive.google.com/open?id=FILE_ID
https://drive.google.com/uc?id=FILE_ID
```

→ se guardan como `https://lh3.googleusercontent.com/d/FILE_ID` (servido directo, sin CORS).

**IMPORTANTE:** el archivo en Drive tiene que tener permiso **"Cualquier persona con el link"** o no se va a ver.

---

## Persistencia

| Tipo | Dónde vive |
|---|---|
| Overrides del admin | `localStorage`, prefijo `isabella_admin_*` |
| Carrito del cliente | `localStorage.isabella_cart` |
| Tema del usuario | `localStorage.isabella_theme` (landing) / `isabella_admin_dark` (panel) |
| Sesión admin | `localStorage.isabella_admin_auth` |
| Pedidos recibidos | `localStorage.isabella_orders` |
| Contenido público (opcional) | Google Sheets vía `SHEET_ID` |

> ⚠️ Como todo vive en el `localStorage` del navegador donde se edita, **los cambios del admin son locales a ese navegador**. Ver "Cosas que faltan configurar" más abajo.

---

## Scripts disponibles

```bash
npm run dev      # dev server en http://localhost:3000
npm run build    # build de producción
npm start        # servir el build
npm run lint     # next lint
```

---

## Deploy

El proyecto está listo para **Vercel** (cero configuración: detecta Next.js automáticamente). También funciona en Netlify, Cloudflare Pages o cualquier host que soporte Next 14 App Router.

Pasos para Vercel:
1. Push a GitHub (repo: https://github.com/enzopazzelli/isabella.git)
2. Importar el repo en [vercel.com/new](https://vercel.com/new)
3. Deploy — no hace falta agregar variables de entorno salvo que quieras conectar Sheets

---

## ⚠️ Cosas que faltan configurar

Esta sección lista todo lo que el dueño/cliente tiene que completar antes de salir a producción. **Son los pasos pendientes reales del proyecto**, ordenados por prioridad.

### 🔴 Crítico (no sale a prod sin esto)

#### 1. Número de WhatsApp
- **Archivo:** [lib/config.js](lib/config.js#L5) → campo `whatsapp`
- **Formato:** internacional sin `+` ni espacios, ej: `5493854123456`
- **Por qué:** sin esto, el botón de checkout del carrito y el botón "Consultar por WhatsApp" de productos agotados no funcionan.
- **También editable desde:** Panel admin → Configuración → WhatsApp (se guarda en `localStorage`, pero es mejor hardcodearlo en `config.js` para que el sitio deployado lo tenga siempre).

#### 2. Contraseña del admin
- **Archivo:** [lib/config.js](lib/config.js#L27) → `adminPassword`
- **Actual:** `isabella2026` (débil, hay que cambiarla)
- **Recomendado:** mover a variable de entorno. Como está en un archivo cliente, cualquiera que inspeccione el bundle puede verla. Para un admin serio hay que moverlo a una API route con verificación server-side.

#### 3. Imágenes reales del negocio
- **Dónde:** [lib/defaults.js](lib/defaults.js)
- **Actual:** rutas `/imgs/IMG_99XX.PNG` apuntando a `public/imgs/` (placeholders)
- **Qué cambiar:** subir las fotos reales a Google Drive y reemplazar todos los links — o cargarlas desde el panel admin. Aplica a: hero slides, category blocks, banners, productos, testimonios, Instagram feed, logos de marcas.

### 🟡 Importante (antes del lanzamiento público)

#### 4. Google Sheet (opcional pero recomendado)
- **Archivo:** [lib/config.js](lib/config.js#L25) → `SHEET_ID = ''`
- **Para qué sirve:** que el contenido público persista cross-device sin depender del `localStorage` del navegador del dueño.
- **Pasos:**
  1. Crear un Google Sheet con pestañas: `Productos`, `Hero`, `Categorias`, `Banners`, `Testimonios`, `Instagram`, `Marcas`, `Config`
  2. Publicar en web: Archivo → Compartir → Publicar en la web
  3. Compartir: "Cualquiera con el link, lector"
  4. Copiar el ID del sheet (lo que va entre `/d/` y `/edit` en la URL)
  5. Pegarlo en `SHEET_ID`
- **Estructura esperada de columnas:** revisar [lib/sheets.js](lib/sheets.js) — cada función `parseXxx()` muestra qué columnas se esperan.
- **Limitación conocida:** la lectura es read-only desde el sitio. Para editar, el dueño abre el Sheet directamente (hay links desde el admin).

#### 5. ~~Persistencia real del admin~~ ✅ RESUELTO
- **Solución implementada:** cada vez que el admin guarda algo, se escribe en `localStorage` (feedback inmediato) y se sincroniza al Google Sheet vía Apps Script. Los visitantes leen del Sheet. Los datos ya no dependen de un solo navegador.
- **Guía de configuración:** ver [SETUP-SYNC.md](SETUP-SYNC.md)

#### 6. ~~Pedidos centralizados~~ ✅ RESUELTO
- **Solución implementada:** al confirmar el carrito, además de abrir WhatsApp, el pedido se envía a `/api/orders` → Apps Script → pestaña `Pedidos` del Sheet. El admin puede ver, confirmar, cancelar y eliminar pedidos desde cualquier dispositivo.
- **Guía de configuración:** ver [SETUP-SYNC.md](SETUP-SYNC.md)

#### 7. Metadatos SEO + favicon + OG image
- **Archivo:** [app/layout.jsx](app/layout.jsx) — revisar el objeto `metadata`
- **Faltan:**
  - `title` y `description` finales
  - `metadataBase` con el dominio real
  - Open Graph image (imagen de share en WhatsApp/Instagram)
  - Favicon (hoy probablemente es el default de Next)
  - `robots.txt` y `sitemap.xml` — existen como rutas pero revisar que apunten al dominio final

#### 8. Dominio + URL canónica
- **Archivo:** [lib/config.js](lib/config.js#L14) → `negocio.url`
- Actualmente vacío. Setearlo al dominio final impacta en SEO y en share buttons.

### 🟢 Nice to have (post-lanzamiento)

#### 9. Email del negocio
- **Archivo:** [lib/config.js](lib/config.js#L9) → `negocio.email`
- Usado en el footer y en formularios de contacto si se agregan.

#### 10. Horario de atención
- **Archivo:** [lib/config.js](lib/config.js#L15) → `negocio.horario`
- Se muestra en el footer si está cargado.

#### 11. Newsletter real
- **Archivo:** [components/landing/Newsletter.jsx](components/landing/Newsletter.jsx)
- Hoy guarda emails en `localStorage` (`isabella_admin_newsletter_subs`). Para que sirva de verdad, conectar a Mailchimp, Brevo, Google Sheets o similar.

#### 12. Analytics
- Agregar Google Analytics / Plausible / Umami en [app/layout.jsx](app/layout.jsx). Hoy no hay tracking.

#### 13. Feed de Instagram real
- El `InstagramFeed` usa fotos estáticas cargadas manualmente desde el admin. Si se quiere feed en vivo, integrar la Graph API de Instagram (requiere app de Meta aprobada). La mayoría de boutiques usan la versión manual porque es más simple y no depende de aprobaciones externas.

#### 14. Tests
- El proyecto no tiene tests (ni unitarios ni E2E). Para un sitio de este tamaño no es bloqueante, pero si se van a agregar features sería buena idea sumar al menos Playwright para el flujo de compra.

#### 15. CI/CD
- No hay GitHub Actions. Vercel ya hace deploy automático en cada push a main, con eso alcanza para MVP.

---

## Credenciales y secretos

Ninguno de estos está committeado en el repo. Hay que configurarlos manualmente:

| Item | Dónde va | Estado |
|---|---|---|
| WhatsApp del negocio | `lib/config.js` | ❌ vacío |
| Password admin | `lib/config.js` | ⚠️ default débil |
| Google Sheet ID | `lib/config.js` | ❌ vacío |
| Email del negocio | `lib/config.js` | ❌ vacío |
| Instagram Graph API token | — | no implementado |
| Mailchimp API key | — | no implementado |

---

## Repositorio

https://github.com/enzopazzelli/isabella.git

## Licencia

Proyecto privado para Isabella Añatuya Boutique.
