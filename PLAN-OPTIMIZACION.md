# Plan de optimización y SEO — Isabella Boutique

Plan ordenado por ROI (impacto / esfuerzo). Cada fase es independiente y se puede mergear por separado.

---

## Fase 1 — Imágenes (mayor impacto en LCP)

**Problema:** 23 MB en `/public/imgs` (PNGs de 1.1–3.2 MB cada uno). Todos los componentes usan `<img>` nativo, sin lazy ni responsive.

### Tareas
- [x] Convertir los 10 PNG de `/public/imgs/*.PNG` a WebP (calidad ~80) y AVIF.
  - Target: hero <200 KB, cards <80 KB.
  - Mantener los originales en `/public/imgs/raw/` para el admin si hace falta.
- [x] Reemplazar `<img>` por `next/image` en:
  - `components/landing/Hero.jsx` — primera slide con `priority`, resto `loading="lazy"`.
  - `components/landing/ProductCard.jsx` — con `sizes="(max-width:768px) 50vw, 25vw"`.
  - `components/landing/CategoryBlocks.jsx`.
  - `components/landing/InstagramFeed.jsx`.
  - `components/landing/EditorialBanner.jsx`.
  - `app/producto/[id]/ProductoClient.jsx` (galería).
- [x] Actualizar `next.config.js` con `formats`, `minimumCacheTTL`, `deviceSizes`, `imageSizes`, y `remotePatterns` para `lh3.googleusercontent.com` y `drive.google.com`.
- [x] Para imágenes de Google Drive (`lib/drive.js`): apendear `=w{N}` al URL de `lh3.googleusercontent.com/d/{id}` para que el CDN de Google sirva tamaños correctos. Default `w=1200`, configurable por caller.
- [x] `<link rel="preconnect" href="https://lh3.googleusercontent.com">` en `app/layout.jsx`.

**Impacto esperado:** LCP de ~5–8 s a <2 s en 4G.

---

## Fase 2 — Server Components + ISR

**Problema:** `app/page.jsx` y `app/producto/[id]/page.jsx` son `'use client'` completo. El HTML inicial llega vacío, el cliente hace `fetch('/api/data')` y recién ahí pinta. Sin SEO real.

### Tareas
- [ ] Refactor `app/page.jsx`:
  - Sacar `'use client'` del archivo raíz.
  - `fetchAllData()` en el server (con `export const revalidate = 300`).
  - Extraer a componentes client solo lo interactivo: `<HomeClient>` que reciba los datos por props y maneje cart, quickview, dark mode, filtros.
- [ ] Refactor `app/producto/[id]/page.jsx`:
  - Convertir a server component.
  - `generateStaticParams()` generando todos los slugs desde `fetchAllData()`.
  - `generateMetadata({ params })` con title, description, OG image por producto.
  - Aislar interacción (talle, color, qty, cart) en `<ProductoClient>`.
- [ ] Eliminar `fetch('/api/data')` desde `app/page.jsx:43` y `app/producto/[id]/page.jsx:41` (los datos llegan por props).
- [ ] Mantener `/api/data` solo para el panel admin.
- [ ] Evitar FOUC de dark mode: script inline en `<head>` que lea `localStorage.isabella_theme` antes del primer paint.

**Impacto esperado:** FCP/TTFB mucho mejor. HTML indexable con contenido real.

---

## Fase 3 — SEO estructural

### Tareas
- [x] Setear `negocio.url` real en `lib/config.js:14` (placeholder `https://isabella-boutique.vercel.app` — cambiar al dominio final cuando se sepa).
- [x] En `app/layout.jsx` agregar a `metadata`:
  - `metadataBase: new URL(negocio.url)`
  - `alternates: { canonical: '/' }`
  - `robots: { index: true, follow: true }`
  - `twitter: { card: 'summary_large_image', ... }`
  - `icons` (apuntando a `/logo-negro.jpeg` por ahora — sustituir por favicon real cuando lo tengamos)
  - `viewport` y `themeColor` (export separado, API de Next 14).
- [x] `lang="es-AR"` en `<html>` (hoy `es`).
- [x] Crear `app/opengraph-image.jsx` — generado dinámicamente con `next/og` (en vez de jpg estático: queda en sync con `negocio` y no requiere asset binario).
- [x] Agregar `Product` JSON-LD en `app/producto/[id]/page.jsx` con `price`, `priceCurrency: 'ARS'`, `availability`, `image`, `brand`, `sku`.
- [x] Agregar `BreadcrumbList` JSON-LD en producto.
- [x] En `app/layout.jsx` extender el JSON-LD: sumar `Organization` y `WebSite` (con `SearchAction` para habilitar sitelinks search box). Estructurado como `@graph` con `@id` cruzados.
- [x] Sitemap dinámico: reemplazar `app/sitemap.xml/route.js` por `app/sitemap.js` (API nativa de Next), listando home + todos los productos + secciones principales.
- [x] `app/admin/layout.jsx` con `robots: { index: false, follow: false }`.

---

## Fase 4 — Bundle y runtime

### Tareas
- [x] Actualizar `lucide-react` (`^1.8.0` → `^1.11.0`, última publicada).
- [x] Revisar `tailwind.config.js` — ya estaba bien (paths solo a `app/`, `components/`, `lib/`).
- [x] Extraer hook `useScrollReveal()` (`lib/hooks/useScrollReveal.js`) — reemplazado en `ProductGrid`, `InstagramFeed`, `EditorialBanner`, `Testimonios`, `Newsletter`. Hook hace `unobserve` tras el primer trigger.
- [x] Consolidar `useEffect` en `app/HomeClient.jsx` — de 6 efectos a 3 (1 init + 2 sync). Bonus: agregamos flag `hydrated` para que el writer de `cart` no pise `localStorage` antes de hidratar.
- [x] `export const revalidate = 300` explícito en `app/api/data/route.js`.

---

## Fase 5 — Nice to have

- [x] `app/manifest.js` (PWA básica) — generada dinámicamente desde `negocio` config. **TODO**: reemplazar el icon 512×512 por un PNG real cuando esté.
- [x] `app/loading.jsx` y `app/error.jsx` para UX de transiciones.
- [ ] `next-sitemap` si crece el catálogo (>1k productos). — descartado por ahora, el sitemap nativo de Next alcanza.
- [x] Analytics de Core Web Vitals — `components/WebVitals.jsx` usando `useReportWebVitals` de `next/web-vitals`. En dev loguea a consola, en prod hace beacon a `/api/vitals`. Sin dependencias extra.
- [x] Revisar peso de `app/globals.css` — 5.9 KB, todo el CSS está en uso. No requiere intervención.

---

## Orden de ejecución sugerido

1. **Fase 1** (imágenes) — visible al instante, no toca arquitectura.
2. **Fase 2** (server components) — destraba la Fase 3.
3. **Fase 3** (SEO) — requiere Fase 2 lista para metadata dinámica.
4. **Fase 4** (bundle) — pulido.
5. **Fase 5** — opcional.

## Métricas objetivo (PageSpeed Insights mobile)

| Métrica | Actual estimado | Objetivo |
|---|---|---|
| LCP | 5–8 s | <2.5 s |
| FCP | 2–3 s | <1.5 s |
| CLS | ? | <0.1 |
| Performance score | 40–55 | >85 |
| SEO score | 80–85 | 100 |

---

## Fase 6 — Migración a Cloudinary (cuando Drive empiece a molestar)

**Problema que resuelve:** `lh3.googleusercontent.com` es un endpoint no documentado de Google sin SLA. Fragilidad por permisos, rate limits en tráfico alto, cache stale al reemplazar archivos, cuota de Vercel Image Optimization agotada si crece el catálogo. Drive sirve para MVP pero no para escala.

### Señales que disparan la migración
- Quejas de imágenes rotas (permiso "Restringido" accidental en Drive).
- Caída de performance en días de alto tráfico (campaña IG, sale).
- Cuota de Vercel Image Optimization agotada (free tier: 1000 sources/mes).
- La clienta se confunde con el flujo de Drive (permisos, links, reemplazos).
- Catálogo > 300 productos con múltiples fotos cada uno.

### Tareas

- [ ] Crear cuenta en Cloudinary. Free tier: 25GB storage + 25GB bandwidth/mes (alcanza tranquilo para una boutique chica).
- [ ] Crear un **upload preset unsigned** en el dashboard de Cloudinary para habilitar subida desde el admin sin exponer API secret.
- [ ] Variables de entorno en `.env.local`:
  ```
  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=xxx
  NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=isabella_unsigned
  ```
- [ ] Reemplazar `components/admin/ImageField.jsx`:
  - Botón **Subir desde PC** que abra `cloudinary-upload-widget` (script oficial).
  - Al terminar el upload, el widget devuelve `secure_url` del tipo `https://res.cloudinary.com/{cloud}/image/upload/v123/isabella/foto.jpg`.
  - Guardar esa URL en el campo como hoy con Drive. Mismo formato de string, mismo flow a sheet.
  - Mantener el input manual para casos borde (pegar URL ya en Cloudinary).
- [ ] Crear `lib/cloudinary.js`:
  ```js
  export function getCloudinaryUrl(url, { width = 1200, quality = 'auto', format = 'auto' } = {}) {
    if (!url || !url.includes('res.cloudinary.com')) return url
    // Inyectar transformaciones: /upload/f_auto,q_auto,w_1200/
    return url.replace('/upload/', `/upload/f_${format},q_${quality},w_${width}/`)
  }
  ```
- [ ] Reemplazar llamadas a `getDriveImageUrl()` en `lib/sheets.js` por un router que detecte el dominio:
  ```js
  function normalizeImageUrl(url) {
    if (!url) return ''
    if (url.includes('res.cloudinary.com')) return getCloudinaryUrl(url)
    if (url.includes('lh3.googleusercontent.com') || url.includes('drive.google.com')) return getDriveImageUrl(url)
    return url
  }
  ```
  Así conviven URLs de Drive (legacy) y Cloudinary (nuevas) sin romper nada durante la transición.
- [ ] Agregar `res.cloudinary.com` a `remotePatterns` en `next.config.js`.
- [ ] **Migración de assets existentes** (opcional, cuando haya tiempo):
  - Script `scripts/migrate-drive-to-cloudinary.js` que lea el sheet, baje cada imagen de Drive, la suba a Cloudinary vía API, y reescriba la fila con la URL nueva.
  - Correr una sola vez. Conservar Drive como backup por un mes antes de limpiar.
- [ ] Actualizar docs internas / nota para la clienta: "ahora subís la foto directo desde el botón del admin, ya no hace falta pasar por Drive".

### Beneficios esperados
- Upload UX 10× más simple para la clienta (un botón vs. subir a Drive → compartir → copiar link → pegar).
- Transformaciones built-in: `c_fill,g_auto` (crop inteligente al producto), `e_bgremoval` (quitar fondo), `e_art:aurora` (filtros), zoom de producto en dos resoluciones.
- CDN con SLA, sin riesgo de throttling silencioso.
- Versioning automático (cambiar imagen = URL nueva = cache invalidado).
- Menos carga en Vercel Image Optimization: Cloudinary ya devuelve AVIF/WebP con `f_auto`, podés hasta saltear `<Image>` de Next si querés.

### Costo estimado
- **Free tier**: 25GB/25GB. Para <500 productos × 4 imágenes × 200KB promedio = ~400MB storage. Sobra 60× de margen.
- **Paid** ($89/mes): solo si el sitio explota en tráfico. No es el caso esperado.
