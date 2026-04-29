# Plan — Subida de imágenes desde el admin a Drive

> **Para el agente que implemente esto:** antes de empezar a codear, revisar la sección **"Preguntas a confirmar con el usuario"** al final de este documento y consultar al usuario cualquier punto que no haya sido resuelto. No tomes esas decisiones unilateralmente.

---

## Objetivo

Hoy la web lee productos, categorías, banners, etc. desde Google Sheets/Drive (CRM-as-a-sheet). Lo que falta es la dirección inversa: que el panel de admin permita **subir imágenes desde el equipo local**, las almacene en una carpeta de Drive, genere la URL pública, y la inserte en el campo `imagen` correspondiente del sheet.

El flujo completo deseado:

```
[admin: <input type="file">]
    ↓ multipart
[/api/upload-image]
    ↓ base64 + secret
[Apps Script: action=uploadImage]
    ↓
[Drive folder: Isabella Assets/{subfolder}]
    ↓ permisos: ANYONE_WITH_LINK
    → URL: https://lh3.googleusercontent.com/d/{fileId}
    ↑
[ImageField.onChange(url)]
    ↑
[manager state]
    ↑ syncEntity (ya existe)
[Sheet: campo imagen actualizado]
```

---

## Diagnóstico del stack actual

Lo que ya está armado y se reusa tal cual:

- [lib/sync.js](lib/sync.js) — cliente browser que postea a `/api/sync`.
- [app/api/sync/route.js](app/api/sync/route.js) — autoriza con Bearer (admin password) y reenvía al Apps Script.
- [lib/appsScriptClient.js](lib/appsScriptClient.js) — cliente server-side. Maneja el redirect 302 de Apps Script y reenvía el body manualmente. **Reusable directamente para el upload.**
- [components/admin/ImageField.jsx](components/admin/ImageField.jsx) — input que acepta paste/drag de URL de Drive y la convierte a `lh3.googleusercontent.com/d/{id}`.
- [lib/drive.js](lib/drive.js) — resuelve cualquier formato de URL de Drive a la URL directa del CDN.

**El sync de campos al sheet ya funciona.** Lo único que falta es el path archivo local → Drive → URL.

---

## Análisis de opciones

### Opción A — Apps Script hace el upload (recomendada)
Agregar acción `uploadImage` al Apps Script. El frontend manda el archivo (base64) a `/api/upload-image`; el backend lo reenvía al Apps Script con `SYNC_SECRET`; el script crea el archivo en Drive, lo hace público, y devuelve la URL.

- **Pros:** reusa toda la infraestructura existente. Cero credenciales nuevas (sin Service Account, sin OAuth, sin Cloudinary). El Apps Script ya corre con la cuenta del dueño del Drive, así que crea archivos en SU Drive.
- **Contras:** base64 infla el payload ~33%. Apps Script tiene ~50 MB de límite por request; en la práctica conviene capar a ~5–8 MB.

### Opción B — Service Account + Drive API directo desde Next.js
Service Account JSON en env, habilitar Drive API, compartir la carpeta con el SA. Upload directo desde el servidor.

- **Pros:** sin overhead de Apps Script, multipart real, mejor para archivos grandes.
- **Contras:** una credencial más para rotar y guardar en Vercel; setup adicional.

### Opción C — Cloudinary (Fase 6 del PLAN-OPTIMIZACION.md)
Ya documentada. Más rápida y con transformaciones built-in, pero rompe la coherencia "todo en Drive" que se eligió.

**→ Recomendación: Opción A.** Encaja con la decisión de usar Drive como CRM. Si crece y molesta, migramos a B o C.

---

## Plan detallado (Opción A)

### 1. Apps Script — agregar acciones nuevas

En el Apps Script web app actual, agregar al `doPost` el case:

```js
case 'uploadImage': {
  // payload: { filename, mimeType, dataBase64, subfolder? }
  const root = getOrCreateFolder('Isabella Assets')
  const folder = subfolder ? getOrCreateChild(root, subfolder) : root
  const blob = Utilities.newBlob(
    Utilities.base64Decode(dataBase64),
    mimeType,
    filename
  )
  const file = folder.createFile(blob)
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW)
  const fileId = file.getId()
  return {
    ok: true,
    fileId,
    url: `https://lh3.googleusercontent.com/d/${fileId}`,
  }
}
```

Helpers necesarios en el Apps Script:
- `getOrCreateFolder(name)` — busca por nombre en la raíz del Drive del usuario, lo crea si no existe.
- `getOrCreateChild(parent, name)` — idem pero dentro de `parent`.

Estructura de carpetas propuesta: una raíz **"Isabella Assets"**, subcarpetas por entidad (`productos`, `hero`, `banners`, `category_blocks`, `instagram`, `marcas`). El parámetro `subfolder` es opcional — el Apps Script lo crea si no existe.

**Acción opcional `deleteImage`** para limpiar archivos huérfanos cuando se sustituye una imagen. Recomiendo dejarla para una segunda iteración — Drive es barato y conservar historial puede ser útil.

### 2. Next.js — nueva route `/api/upload-image`

Crear [app/api/upload-image/route.js](app/api/upload-image/route.js):

- `export const runtime = 'nodejs'`
- Auth: mismo Bearer que `/api/sync` (ver refactor en punto 5).
- Acepta `multipart/form-data` con `file` + `subfolder` opcional.
- Valida MIME contra whitelist: `image/jpeg`, `image/png`, `image/webp`, `image/gif`.
- Valida tamaño: ≤ 5 MB (configurable por env var si fuera necesario).
- Convierte a base64: `Buffer.from(await file.arrayBuffer()).toString('base64')`.
- Llama:
  ```js
  callAppsScript({
    action: 'uploadImage',
    filename: file.name,
    mimeType: file.type,
    dataBase64,
    subfolder,
  })
  ```
- Devuelve `{ ok, url, fileId }` o `{ ok: false, error }` con status apropiado.

Códigos de error a manejar:
- 401 sin/mal Bearer
- 400 sin file o MIME no soportado
- 413 file > 5 MB
- 502 Apps Script falla
- 504 timeout (el redirect de Apps Script ya está manejado en `appsScriptClient.js`)

### 3. Cliente — extender `ImageField.jsx`

Cambios en [components/admin/ImageField.jsx](components/admin/ImageField.jsx):

- Botón nuevo "Subir desde mi equipo" al lado del input de URL.
- `<input type="file" accept="image/*" hidden ref={fileInputRef}>`.
- Estados nuevos: `uploading: boolean`, `uploadError: string | null`. (Mantener el `converted` actual.)
- Indicador de progreso: spinner de lucide-react (ya disponible).
- En `onChange` del file input:
  1. Validar tamaño/tipo en cliente (UX, no seguridad).
  2. `setUploading(true)`, limpiar error.
  3. Construir `FormData`, POST a `/api/upload-image` con header `Authorization: Bearer ${getAdminPass()}`.
  4. Si OK → `onChange(url)`, `setConverted(true)`.
  5. Si falla → `setUploadError(...)`, mostrar mensaje inline.
  6. `setUploading(false)`.
- Prop nueva `subfolder` (string, opcional) que cada manager pasa según su entidad:

| Manager | subfolder |
|---|---|
| ProductoManager | `productos` |
| HeroManager | `hero` |
| BannerManager | `banners` |
| CategoryManager | `category_blocks` |
| InstagramManager | `instagram` |
| BrandManager | `marcas` |

### 4. Sheet sync

**No requiere cambios.** Cuando `ImageField.onChange(url)` actualiza el state del manager y el usuario guarda, `syncEntity()` ya pushea la fila completa con la URL nueva al sheet vía Apps Script (`overwrite` action). Pipeline ya probado.

### 5. Refactor — extraer auth a `lib/auth.js`

Extraer `isAuthorized(req)` que está en [app/api/sync/route.js](app/api/sync/route.js) a un módulo nuevo `lib/auth.js` y reusar en `/api/upload-image`. Una función, dos llamadores.

```js
// lib/auth.js
import { adminPassword as fallbackPassword } from '@/lib/config'

export function isAuthorized(req) {
  const header = req.headers.get('authorization') || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : ''
  const expected = process.env.ADMIN_PASSWORD || fallbackPassword
  return Boolean(token) && token === expected
}
```

---

## Seguridad

- **Auth:** Bearer token (admin password). Sin token → 401.
- **MIME whitelist:** `image/jpeg`, `image/png`, `image/webp`, `image/gif`. Otro tipo → 400.
- **Size cap:** 5 MB en cliente (UX) y servidor (autoridad). Por encima → 413.
- **Apps Script secret:** `SYNC_SECRET` ya está. Sin él el Apps Script ignora la request.
- Las dos validaciones (Bearer en Next + secret en Apps Script) son obligatorias — defense in depth.

---

## Riesgos y notas operativas

- **Quotas de Apps Script:** 6 MB por response, 6 min de timeout, 90 min/día de ejecución para cuentas gratis. Para uploads individuales de imágenes no se rompe.
- **Permisos de archivo:** hay que setear `ANYONE_WITH_LINK` para que `lh3.googleusercontent.com` lo sirva. **Si la clienta tiene Drive bajo Workspace con políticas restrictivas, esto puede fallar — probar antes con un archivo de muestra desde el Apps Script editor.**
- **Doble upload accidental:** si el usuario sube la misma foto dos veces, quedan dos archivos. Aceptable. Si molesta, dedupe por hash de contenido.
- **Latencia:** local → Next.js → Apps Script → Drive es ~3–8 s para 1–2 MB. Más lento que Cloudinary directo, pero tolerable para un admin.
- **Variables de entorno requeridas (ya existen, solo verificar):** `APPS_SCRIPT_URL`, `SYNC_SECRET`, `ADMIN_PASSWORD` (o que `lib/config.js` tenga el fallback).

---

## Preguntas a confirmar con el usuario antes de implementar

**Importante: el agente que implemente esto debe preguntar estos puntos al usuario antes de escribir código. No asumir defaults.**

1. **Estructura de carpetas en Drive.** ¿Una sola carpeta "Isabella Assets" para todas las imágenes, o subcarpetas por entidad (`productos`, `hero`, `banners`, etc.)? Recomendación: subcarpetas, facilita encontrar fotos manualmente.

2. **Tamaño máximo de archivo.** ¿5 MB suficiente? Las fotos WebP de producto raramente pasan de 500 KB. Si la clienta sube originales sin convertir podrían llegar a 3–4 MB.

3. **Política de reemplazo.** Cuando un producto cambia de foto, ¿la vieja se borra automáticamente del Drive o queda como historial? Recomendación: dejarla (Drive es barato, historial es útil).

4. **Formato de URL guardada en el sheet.** ¿`https://lh3.googleusercontent.com/d/{id}` (URL directa, renderiza al toque) o `https://drive.google.com/file/d/{id}/view` (link para humanos)? `lib/drive.js` resuelve cualquiera de las dos. Recomendación: la directa, un paso menos.

5. **¿Mantener también el input de URL manual en `ImageField`?** Hoy permite pegar un link de Drive ya existente. Recomendación: sí, casos borde (foto ya subida por otro lado, link compartido por la clienta, etc.).

6. **¿Implementar la acción `deleteImage` ahora o después?** Recomendación: después, cuando empiece a haber Drive sucio.

---

## Estimación de esfuerzo

| Tarea | Tiempo |
|---|---|
| Apps Script: acción `uploadImage` + helpers de carpeta | ~30 min |
| `/api/upload-image` + refactor de auth a `lib/auth.js` | ~30 min |
| `ImageField` con botón de upload + estados | ~45 min |
| Pasar `subfolder` desde los 6 managers | ~15 min |
| Pruebas end-to-end con archivo real | ~30 min |
| **Total** | **~2.5 h** |

Asume que `APPS_SCRIPT_URL`, `SYNC_SECRET` y `ADMIN_PASSWORD` ya están seteados en `.env.local` y que el Apps Script web app está deployado.

---

## Orden de ejecución sugerido

1. Refactor de `isAuthorized` a `lib/auth.js` (5 min, sin riesgo).
2. Acción `uploadImage` en el Apps Script + test manual desde el editor del script con un base64 chiquito.
3. `/api/upload-image` con un test usando `curl` o el cliente Postman/Bruno.
4. `ImageField` con el botón nuevo, conectado a un solo manager (ej. `ProductoManager`) para validar el flujo end-to-end.
5. Propagar `subfolder` a los 5 managers restantes.
6. Smoke test final: subir una foto desde el admin de cada tipo de entidad.

---

## ESTADO — Implementado en código

Todo el lado del código ya está hecho. Lo que falta es **configuración** con la cuenta de la clienta:

- `lib/auth.js` — helper `isAuthorized` extraído.
- `app/api/sync/route.js` — usa el helper.
- `app/api/upload-image/route.js` — recibe multipart, valida MIME (`jpeg/png/webp/gif`) y tamaño (≤ 5 MB), valida `subfolder` contra whitelist, convierte a base64 y delega al Apps Script.
- `components/admin/ImageField.jsx` — botón "Subir" con spinner + estado de error inline. Se mantiene el input de URL manual y el drag/drop.
- 6 managers (`ProductoManager`, `HeroManager`, `BannerManager`, `CategoryManager`, `InstagramManager`, `BrandManager`) pasan el `subfolder` correspondiente.

---

## CONFIGURACIÓN — pasos al pasar a la cuenta de la clienta

### 1. Apps Script (en `script.google.com` con la cuenta de la clienta)

**Pre-requisito:** crear a mano una carpeta en Drive (ej. `Isabella Assets`) y copiar su ID de la URL (`https://drive.google.com/drive/folders/<ESTE_ID>`). Esa carpeta es donde van a vivir las fotos y, idealmente, también el sheet del CRM. Las subcarpetas (`productos`, `hero`, etc.) se crean solas dentro de ella la primera vez que se sube una foto de cada tipo.

Agregar al Apps Script existente (el que ya maneja `overwrite`):

```js
// === Constantes ===
const ROOT_FOLDER_ID = 'PEGAR_AQUI_EL_ID_DE_LA_CARPETA_RAIZ'

// === doPost con try/catch global ===
// Si tu doPost actual no tiene try/catch, envolvelo así. Si ya lo tiene,
// solo agregá el case 'uploadImage' al switch.
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents)
    const secret = PropertiesService.getScriptProperties().getProperty('SYNC_SECRET')
    if (data.secret !== secret) {
      return jsonResponse({ ok: false, error: 'unauthorized' })
    }

    switch (data.action) {
      case 'overwrite':
        // ... tu lógica existente ...
        return jsonResponse({ ok: true })

      case 'uploadImage': {
        const root = DriveApp.getFolderById(ROOT_FOLDER_ID)
        const folder = data.subfolder ? getOrCreateChild(root, data.subfolder) : root
        const blob = Utilities.newBlob(
          Utilities.base64Decode(data.dataBase64),
          data.mimeType,
          data.filename
        )
        const file = folder.createFile(blob)
        file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW)
        const fileId = file.getId()
        return jsonResponse({
          ok: true,
          fileId: fileId,
          url: 'https://lh3.googleusercontent.com/d/' + fileId,
        })
      }

      default:
        return jsonResponse({ ok: false, error: 'unknown action: ' + data.action })
    }
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err) })
  }
}

// === Health-check para abrir en el browser ===
function doGet() {
  return jsonResponse({ ok: true, message: 'Isabella sync endpoint is running' })
}

// === Helpers ===
function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON)
}

function getOrCreateChild(parent, name) {
  const it = parent.getFoldersByName(name)
  return it.hasNext() ? it.next() : parent.createFolder(name)
}
```

> El cliente Next.js ([lib/appsScriptClient.js](lib/appsScriptClient.js)) manda el secret dentro del body como `data.secret`. Asegurate de que el chequeo de auth lea `data.secret`, no `data.token`.

Después del cambio:
1. **Redeployar** el Web App como **nueva versión** (Deploy → Manage deployments → editar → nueva versión). Si no es nueva versión, los cambios no se aplican.
2. Verificar que `SYNC_SECRET` esté configurado como Script Property (Project Settings → Script Properties).
3. **Health-check**: abrir la URL `/exec` en el browser. Debería responder `{"ok":true,"message":"Isabella sync endpoint is running"}`. Si ves HTML de Google es que el deploy no está activo o la URL está mal copiada.
4. **Test desde el editor**: ejecutar manualmente una función que llame `uploadImage` con un base64 mínimo y verificar que aparezca un archivo en la carpeta raíz con permiso "Cualquiera con el enlace puede ver".

### 2. Variables de entorno (Vercel + `.env.local`)

```
APPS_SCRIPT_URL=https://script.google.com/macros/s/.../exec
SYNC_SECRET=<el mismo string que esté como Script Property en el Apps Script>
ADMIN_PASSWORD=<password del panel admin>
```

`SYNC_SECRET` también tiene que estar configurado como **Script Property** dentro del Apps Script (Project Settings → Script Properties), con el mismo valor.

### 3. Smoke test

1. Loguearse al admin con `ADMIN_PASSWORD`.
2. En cualquier `ImageField` (ej. una foto de producto), tocar **Subir** y elegir un archivo ≤ 5 MB.
3. Spinner → URL `https://lh3.googleusercontent.com/d/...` aparece en el input y el preview renderiza.
4. Guardar el producto y verificar en el sheet que la celda `imagenes` quedó actualizada.
5. Verificar en Drive que se creó la carpeta `Isabella Assets/productos/` con el archivo.

Si algo falla, los códigos esperados de `/api/upload-image` son:
- 401 → falta/erra el Bearer (revisar que el admin esté logueado).
- 400 → MIME no soportado o `subfolder` inválido.
- 413 → archivo > 5 MB.
- 502 → Apps Script falló (revisar logs en `script.google.com` → Executions).
