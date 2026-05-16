# Setup con la cuenta de la clienta — Isabella Boutique

Pasos para dejar el sitio funcionando con la cuenta de Google de la clienta: el Sheet (catálogo + pedidos), el Drive (imágenes) y el panel de admin.

Asume que el código ya está deployado en Vercel y que tenés acceso al panel de Vercel + a una cuenta de Google con la que configurar todo (idealmente la misma que va a usar la clienta).

---

## 1. Crear el Sheet y la carpeta de Drive (10 min)

### 1.1 Carpeta raíz

1. En Drive, crear una carpeta llamada **`Isabella Boutique`** (o el nombre que prefieras).
2. Copiar el ID de la carpeta de la URL: `https://drive.google.com/drive/folders/<ESTE_ES_EL_ID>`.

> **Guardá este ID** — lo vas a pegar en el paso 2.3 como `DRIVE_ROOT_FOLDER_ID`.

> Las subcarpetas (`productos`, `hero`, `banners`, `category_blocks`, `instagram`, `marcas`) se crean **solas** la primera vez que se sube una foto desde el admin. No las crees a mano.

### 1.2 Sheet con las pestañas

1. Adentro de esa carpeta, crear un nuevo Google Sheet llamado **`Isabella Boutique CMS`**.
2. Crear las siguientes pestañas con los nombres **exactos**:

| Pestaña | Para qué sirve |
|---|---|
| `Productos` | Catálogo de productos |
| `Hero` | Slides del hero principal |
| `Categorias` | Bloques de categorías |
| `Marcas` | Carrusel de marcas |
| `Banners` | Banners editoriales |
| `Testimonios` | Testimonios de clientas |
| `Instagram` | Feed de Instagram |
| `Promos` | Mensajes de la barra promocional |
| `Config` | Datos del negocio (WhatsApp, redes, etc.) |
| `Pedidos` | Pedidos que llegan del carrito |

> No hace falta llenar nada a mano. La primera vez que se guarde algo desde el admin, las columnas se crean solas.

3. **Compartir el Sheet** (necesario para que el sitio público lea datos):
   - Botón "Compartir" (arriba a la derecha) → "Cualquier persona con el link puede ver".

4. Copiar el **ID del Sheet** (entre `/d/` y `/edit` en la URL).

> **Guardá este ID** — lo vas a pegar en el paso 3 como `NEXT_PUBLIC_SHEET_ID`.

---

## 2. Apps Script (10 min)

### 2.1 Abrir el editor

Desde el Sheet → **Extensiones → Apps Script**. Eso crea un script ligado al Sheet.

### 2.2 Pegar el código

1. Borrar todo el contenido del archivo `Codigo.gs` que aparece por defecto.
2. Copiar **todo** el contenido del archivo [`apps-script/Code.gs`](apps-script/Code.gs) del repositorio y pegarlo.
3. Guardar (Ctrl+S).

### 2.3 Configurar las Script Properties

Configuración del proyecto (engranaje a la izquierda) → **Propiedades del script** → Agregar dos propiedades:

| Clave | Valor |
|---|---|
| `SYNC_SECRET` | un string largo y random (ej. `openssl rand -hex 32` o inventar uno tipo `isabella-secret-2026-xyzabc`) |
| `DRIVE_ROOT_FOLDER_ID` | el ID de la carpeta del paso 1.1 |

Anotá el `SYNC_SECRET` — lo necesitás en el paso 3.

### 2.4 Deploy

**Implementar → Nueva implementación → Tipo: Aplicación web**:

- Descripción: `Isabella sync v1`
- Ejecutar como: **Yo** (la cuenta de la clienta)
- Quién tiene acceso: **Cualquier persona**

Click Implementar. La primera vez Google va a pedir autorizar permisos de Drive y Sheets — aceptar todo.

Al final aparece una URL del tipo:
`https://script.google.com/macros/s/AKfycb.../exec`

**Copiala. Esa es `APPS_SCRIPT_URL`.**

> Cada vez que edites el código del Apps Script tenés que hacer una **nueva implementación** (no alcanza con guardar). El link `/exec` siempre apunta a la última implementación activa.

### 2.5 Health-check

Abrir esa URL en una pestaña del navegador. Tiene que responder con el texto:

```
ok
```

Si ves HTML de Google con "Authorization required" o similar, volvé al paso 2.4 y verificá que **Quién tiene acceso** esté en "Cualquier persona".

---

## 3. Variables de entorno en Vercel (5 min)

En el dashboard de Vercel del proyecto → **Settings → Environment Variables**, agregar (para Production, Preview y Development):

| Name | Value |
|---|---|
| `APPS_SCRIPT_URL` | la URL `/exec` del paso 2.4 |
| `SYNC_SECRET` | el valor del paso 2.3 (mismo que en Script Properties) |
| `ADMIN_PASSWORD` | el password con el que la clienta entra al panel admin |
| `NEXT_PUBLIC_SHEET_ID` | el ID del Sheet (paso 1.2) |

Después: **Deployments → último deployment → Redeploy** para que el sitio levante con las env vars nuevas.

> Para desarrollo local, copiar las mismas variables a un archivo `.env.local` en la raíz del proyecto (hay un `.env.local.example` de referencia). Si no seteás `ADMIN_PASSWORD` en dev, el panel acepta `isabella-dev` como fallback (solo cuando `NODE_ENV !== 'production'`).

---

## 4. Smoke test end-to-end (10 min)

1. Abrir `https://<tu-dominio-vercel>/admin` y loguearse con `ADMIN_PASSWORD`.
2. Editar algo simple — ej. el título de un slide del Hero.
3. Guardar. Abrir el Sheet → pestaña **Hero**. Las filas tienen que aparecer con los datos editados.
4. Volver al admin → **Productos** → click **Subir** dentro de un campo de imagen.
5. Elegir una imagen `.jpg` o `.webp` chica (≤ 2 MB para la primera prueba).
6. Esperar el spinner. La URL del campo debería pasar a `https://lh3.googleusercontent.com/d/<file-id>` y el preview tiene que renderizar.
7. Guardar. Abrir Drive → carpeta raíz. Tiene que haberse creado `Isabella Boutique/productos/` con la foto adentro.
8. La foto en Drive debe tener permiso **"Cualquier usuario que tenga el enlace"** (verificar con click derecho → Compartir).
9. Recargar el sitio público y verificar que se ve la foto del producto.
10. Hacer un pedido de prueba: agregar al carrito desde el sitio público, completar el checkout con el botón de WhatsApp. Volver al admin → **Pedidos**. El pedido tiene que aparecer ahí.

Repetir el upload con una foto en cada otra entidad (`Hero`, `Banner`, `Category`, `Instagram`, `Marca`) para validar que las 6 subcarpetas se crean bien.

---

## 5. Troubleshooting

### La URL `/exec` devuelve HTML en vez de `ok`
- El deploy no está activo. Volver a Implementar → Administrar implementaciones → editar → asegurarse que **Quién tiene acceso = Cualquier persona** y **Ejecutar como = Yo**.

### Subir una foto devuelve `unauthorized`
- El `SYNC_SECRET` en Vercel y en Script Properties no coinciden. Verificar exacto, sin espacios.

### Subir devuelve `apps script 502` o `invalid JSON from apps script`
- Algo tiró excepción dentro del script. Ir a `script.google.com` → tu proyecto → **Ejecuciones** (icono de reloj) y ver el log del último request. Causas típicas:
  - `DRIVE_ROOT_FOLDER_ID` no configurado o mal pegado.
  - La carpeta raíz fue movida a la papelera.
  - Permisos de Drive revocados (re-autorizar el script desde Implementar → Administrar).

### El Sheet no se actualiza al guardar desde el admin
- Verificar `APPS_SCRIPT_URL` y `SYNC_SECRET` en Vercel.
- Abrir DevTools del navegador (F12 → Console) en el admin, buscar warnings `[sync]`.
- En Vercel → Logs, buscar errores en `/api/sync` o `/api/orders`.

### La imagen sube pero no se ve en el sitio
- Abrir la URL `https://lh3.googleusercontent.com/d/<file-id>` directo en el navegador. Si tampoco ahí carga, el archivo no quedó público (debería pasar automático, pero si la cuenta es Workspace con políticas restrictivas puede bloquearse).

### Login al admin no funciona
- Limpiar `sessionStorage` del navegador (DevTools → Application → Storage → Clear) y volver a loguear.
- Verificar que `ADMIN_PASSWORD` esté seteado en Vercel (sin esa env var, en producción el panel rechaza todo login).

---

## 6. Cómo funciona por dentro

```
Admin guarda algo
  ├─ localStorage (feedback inmediato, funciona offline)
  └─ POST /api/sync → Apps Script → escribe en el Google Sheet
                                        ↓
Visitante abre la tienda
  └─ /api/data → lee el Sheet via gviz → renderiza la landing
```

```
Admin sube una imagen
  └─ POST /api/upload-image → Apps Script → crea archivo en Drive
                                                ↓
                         devuelve URL pública (lh3.googleusercontent.com/d/...)
                                                ↓
                         se guarda en el campo del producto y luego al Sheet
```

```
Cliente hace checkout
  ├─ localStorage (copia local)
  ├─ WhatsApp (mensaje directo al dueño con el detalle)
  └─ POST /api/orders → Apps Script → append en pestaña "Pedidos"
```

```
Admin abre la pestaña Pedidos
  └─ GET /api/orders → Apps Script → lee pestaña "Pedidos" → muestra en el panel
```

- Si el Apps Script no está configurado (`APPS_SCRIPT_URL` vacío), todo el sync se desactiva silenciosamente y el sitio sigue funcionando con los defaults de `lib/defaults.js`. **No se rompe nada.**
- El sync es **fire-and-forget**: si falla el Sheet, la UI del admin no se cuelga. Solo aparece un warning en la consola.

---

## 7. Checklist final

- [ ] Carpeta raíz creada en Drive de la clienta.
- [ ] Sheet con las 10 pestañas dentro de la carpeta raíz, compartido como "cualquiera con el link".
- [ ] Apps Script con el contenido de `apps-script/Code.gs` pegado.
- [ ] `SYNC_SECRET` y `DRIVE_ROOT_FOLDER_ID` configurados como Script Properties.
- [ ] Apps Script desplegado como Web App con "Cualquier persona" + "Ejecutar como: Yo".
- [ ] `/exec` abierta en navegador devuelve `ok`.
- [ ] `APPS_SCRIPT_URL`, `SYNC_SECRET`, `ADMIN_PASSWORD`, `NEXT_PUBLIC_SHEET_ID` configurados en Vercel.
- [ ] Vercel redeployado después de agregar env vars.
- [ ] Smoke test: una foto subida desde admin aparece en el Sheet, en Drive y en el sitio público.
- [ ] Smoke test: un pedido del carrito aparece en la pestaña Pedidos del Sheet y en la pestaña Pedidos del admin.

---

## Estructura de columnas del Sheet (referencia)

No hace falta crearlas a mano (se generan al guardar por primera vez), pero si querés precargar datos directo en el Sheet, estas son las columnas esperadas:

### Productos
`ID | Nombre | Seccion | Categoria | Marca | Descripcion | Precio | PrecioAnterior | Talles | Badge | ImagenURL | Stock | Disponible | Orden`

- `Seccion`: `Mujer`, `Hombre` o `Kids`
- `Talles`: separados por coma (`S,M,L,XL`)
- `ImagenURL`: múltiples imágenes separadas por `|`
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

- `Items`: JSON serializado (no editar a mano).
- `Estado`: `pendiente`, `confirmado`, o `cancelado`.
