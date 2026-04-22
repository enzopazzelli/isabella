# Guia de configuracion — Sync con Google Sheets

Esta guia explica como conectar el panel de administracion de Isabella con Google Sheets para que todo lo que se edite desde el admin se guarde en la nube (no solo en el navegador). Tambien permite que los pedidos del carrito lleguen automaticamente a una pestaña del Sheet.

---

## Que resuelve

| Antes | Despues |
|---|---|
| Los cambios del admin vivian solo en el `localStorage` del navegador del dueño | Los cambios se guardan en Google Sheets y cualquier dispositivo los ve |
| Los pedidos del carrito solo existian en el navegador del cliente | Los pedidos se registran automaticamente en la pestaña `Pedidos` del Sheet |
| Si el dueño cambiaba de compu/celu, perdia todo | Los datos se sincronizan desde cualquier navegador autenticado |

---

## Requisitos previos

- Una cuenta de Google (la misma que tiene el Sheet del proyecto)
- Node.js 18+ para desarrollo local
- El proyecto ya corriendo con `npm run dev`

---

## Paso 1 — Crear el Google Sheet (si no existe)

Si ya tenes un Sheet con datos del proyecto (el famoso `SHEET_ID`), se pueden reusar. Si no:

1. Ir a [sheets.new](https://sheets.new) y crear uno nuevo.
2. Renombrarlo a **"Isabella Boutique"** (o como quieras).
3. Crear las siguientes pestañas (hojas) en la parte de abajo. Los nombres tienen que ser **exactamente** estos:

| Pestaña | Para que sirve |
|---|---|
| `Productos` | Catalogo de productos |
| `Hero` | Slides del hero principal |
| `Categorias` | Bloques de categorias |
| `Marcas` | Carousel de marcas |
| `Banners` | Banners editoriales |
| `Testimonios` | Testimonios de clientes |
| `Instagram` | Feed de Instagram |
| `Promos` | Mensajes de la barra promocional |
| `Config` | Datos del negocio (WhatsApp, redes, etc.) |
| `Pedidos` | Pedidos que llegan del carrito |

> No hace falta llenar nada a mano. La primera vez que guardes algo desde el admin, las columnas se crean solas.

4. **Publicar el Sheet para lectura** (necesario para que la landing lea datos via gviz):
   - Archivo → Compartir → Publicar en la web → Publicar todo
   - Compartir: "Cualquiera con el link puede ver" (lector)

5. Copiar el **ID del Sheet** (el string largo entre `/d/` y `/edit` en la URL).

---

## Paso 2 — Crear el Apps Script

El Apps Script es un pequeño programa que Google ejecuta gratis y que recibe las escrituras del sitio.

1. Desde el Sheet: **Extensiones → Apps Script** (se abre el editor de Apps Script).
2. Borrar todo el contenido del archivo `Codigo.gs` que aparece.
3. Copiar y pegar **todo** el contenido de [`apps-script/Code.gs`](apps-script/Code.gs) del repositorio.
4. Guardar (Ctrl+S).

### Configurar el secreto

5. En el editor de Apps Script: **Configuracion del proyecto** (icono de engranaje a la izquierda) → **Propiedades del script** → **Agregar propiedad**:
   - **Clave:** `SYNC_SECRET`
   - **Valor:** un string largo y random. Ejemplo: abre una terminal y ejecuta `openssl rand -hex 32`. O inventalo: `mi_clave_super_secreta_isabella_2026_xyzabc`.
   - **Guardalo en un lugar seguro** porque lo vas a necesitar en el paso 4.

### Deployar como Web App

6. Click en **Implementar** (o Deploy) → **Nueva implementacion**.
7. Tipo: **App web**.
8. Configurar:
   - **Descripcion:** `Sync Isabella`
   - **Ejecutar como:** `Yo` (tu cuenta de Google)
   - **Quien tiene acceso:** `Cualquier persona`
9. Click en **Implementar**.
10. Google te va a pedir permisos. Aceptar todo (es tu propio Sheet, no pasa nada).
11. Copiar la **URL del deployment** (termina en `/exec`). La vas a necesitar en el paso 4.

> **IMPORTANTE:** cada vez que edites el codigo del Apps Script tenes que hacer una **nueva implementacion** (no alcanza con guardar). El link `/exec` siempre apunta a la ultima implementacion activa.

---

## Paso 3 — Verificar que el Apps Script funciona

Abri la URL del deployment en el navegador. Deberia responder con el texto:

```
ok
```

Si da error 403 o redirige a login, revisá que "Quien tiene acceso" sea "Cualquier persona".

---

## Paso 4 — Variables de entorno

### Desarrollo local

Crear un archivo `.env.local` en la raiz del proyecto (ya hay un `.env.local.example` como referencia):

```env
APPS_SCRIPT_URL=https://script.google.com/macros/s/AKfyc.../exec
SYNC_SECRET=el_mismo_string_que_pusiste_en_el_apps_script
ADMIN_PASSWORD=isabella2026
```

### Produccion (Vercel)

En el dashboard de Vercel: **Project → Settings → Environment Variables**. Agregar las mismas tres variables:

| Variable | Valor |
|---|---|
| `APPS_SCRIPT_URL` | La URL `/exec` del Apps Script |
| `SYNC_SECRET` | El mismo secreto que pusiste como Script Property |
| `ADMIN_PASSWORD` | La contrasena del admin (idealmente distinta de la default) |

> Despues de agregar las variables, hay que hacer un **redeploy** para que tomen efecto.

---

## Paso 5 — Configurar el SHEET_ID (lectura publica)

Si todavia no lo hiciste, pegar el ID del Sheet en [`lib/config.js`](lib/config.js#L25):

```js
export const SHEET_ID = 'PEGALO_ACA'
```

Esto permite que la landing publica lea los datos del Sheet (via la URL de gviz que ya existia). Los datos que el admin sincroniza al Sheet van a estar disponibles automaticamente para todos los visitantes.

---

## Paso 6 — Probar

1. Arrancar el sitio: `npm run dev`
2. Ir a `/admin`, loguearte.
3. Editar algo (ej: cambiar un texto del Hero).
4. Guardar.
5. Abrir el Google Sheet → pestaña `Hero`. Deberian aparecer las filas con los datos que acabas de guardar.
6. Agregar un producto al carrito y hacer checkout por WhatsApp. Abrir el Sheet → pestaña `Pedidos`. Deberia haber una fila nueva con el pedido.

Si el Sheet no se actualiza:
- Verificar que `APPS_SCRIPT_URL` y `SYNC_SECRET` estan correctos en `.env.local`
- Abrir la consola del navegador (F12 → Console). Buscar mensajes `[sync]` — si hay errores, aparecen ahi.
- En la consola de Vercel (Vercel → Project → Logs), buscar errores en las API routes `/api/sync` o `/api/orders`.

---

## Como funciona por dentro

```
Admin guarda algo
  ├─ localStorage (feedback inmediato, funciona offline)
  └─ POST /api/sync → Apps Script → escribe en el Google Sheet
                                        ↓
Visitante abre la tienda
  └─ /api/data → lee el Sheet via gviz → renderiza la landing
```

```
Cliente hace checkout
  ├─ localStorage (copia local)
  ├─ WhatsApp (mensaje directo al dueño)
  └─ POST /api/orders → Apps Script → append en pestaña "Pedidos"
```

```
Admin abre la pestaña Pedidos
  └─ GET /api/orders → Apps Script → lee pestaña "Pedidos" → muestra en el panel
```

- Si el Apps Script no esta configurado (`APPS_SCRIPT_URL` vacio), todo funciona exactamente como antes (solo localStorage). **No se rompe nada.**
- El sync es **fire-and-forget**: si falla el Sheet, la UI del admin no se congela ni muestra errores bloqueantes. Solo aparece un warning en la consola del navegador.

---

## Pestañas del Sheet — Estructura de columnas

No hace falta crearlas a mano. Se generan al guardar por primera vez. Pero si queres precargar datos directo en el Sheet, estas son las columnas esperadas:

### Productos
`ID | Nombre | Seccion | Categoria | Marca | Descripcion | Precio | PrecioAnterior | Talles | Badge | ImagenURL | Stock | Disponible | Orden`

- `Seccion`: `Mujer`, `Hombre` o `Kids`
- `Talles`: separados por coma (`S,M,L,XL`)
- `ImagenURL`: multiples imagenes separadas por `|`
- `Disponible`: `TRUE` o `FALSE`

### Hero
`ID | ImagenURL | Titulo | Subtitulo | TextoBoton | LinkBoton | PosicionTexto | Activo | Orden`

### Categorias
`ID | Nombre | ImagenURL | Activo | Orden`

### Marcas
`ID | Nombre | Logo | Orden`

### Banners
`ID | ImagenURL | Titulo | Subtitulo | TextoBoton | LinkBoton | PosicionTexto | Ubicacion | Activo | Orden`

### Testimonios
`ID | Nombre | Texto`

### Instagram
`ID | ImagenURL | Activo | Orden`

### Promos
`ID | Texto | Orden`

### Config
`Clave | Valor`

Ejemplo:
| Clave | Valor |
|---|---|
| whatsapp | 5493854123456 |
| instagram | isabella_anatuya |

### Pedidos
`ID | Fecha | Cliente | Notas | Total | Estado | Items`

- `Items`: JSON serializado (ej: `[{"nombre":"Blazer","precio":89990,"cantidad":1}]`). No editar a mano.
- `Estado`: `pendiente`, `confirmado`, o `cancelado`

---

## Instrucciones para la clienta (duena del negocio)

Hola! Estos son los pasos para que tu tienda online guarde los datos en la nube:

### Lo que necesitas hacer vos

1. **Abri tu Google Sheet** (tu desarrollador te va a pasar el link si no lo tenes).
2. Anda a **Extensiones → Apps Script**.
3. Tu desarrollador te va a pasar un codigo para pegar ahi. Pegalo, guarda, y segui las instrucciones que te de para "implementar" (deploy).
4. Una vez que este funcionando, cada vez que edites algo en el panel de admin de tu sitio, los cambios se guardan automaticamente en el Sheet.
5. Los pedidos que hagan tus clientes desde el carrito tambien aparecen solos en la pestaña **Pedidos** del Sheet.

### Lo que NO necesitas hacer

- No necesitas editar el Sheet a mano (el panel admin se encarga).
- No necesitas entender el codigo.
- Si algo falla, el sitio sigue funcionando como antes — no se rompe nada.

### Si algo no funciona

- Verifica que el Sheet este compartido como "Cualquier persona con el link puede ver".
- Si los pedidos no aparecen, pedile a tu desarrollador que revise las variables de entorno en Vercel.
