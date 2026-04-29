# Setup con la cuenta de la clienta — Isabella Boutique

Pasos para dejar el sitio funcionando con el Drive y el Apps Script de la clienta.

Asume que el código ya está deployado en Vercel y que vos tenés acceso al panel de Vercel y a una cuenta de Google con la que vas a configurar todo (idealmente la misma cuenta que la clienta usa en el negocio).

---

## 1. Crear la estructura en Drive (5 min)

Loguearse en Drive con la cuenta de la clienta y:

1. Crear una carpeta raíz llamada **`Isabella Boutique`** (o el nombre que prefieras).
2. Dentro, crear el Google Sheet con las hojas que el sitio consume (`productos`, `hero_slides`, `category_blocks`, `marcas`, `banners`, `testimonios`, `instagram_photos`, `promos`, `config`). Si ya existe en otro lado, moverlo acá.
3. Copiar el ID de la carpeta raíz desde la URL del browser:
   `https://drive.google.com/drive/folders/<ESTE_ES_EL_ID>`

> Las subcarpetas (`productos`, `hero`, `banners`, `category_blocks`, `instagram`, `marcas`) se crean **solas** la primera vez que se sube una foto desde el admin. No las crees a mano.

---

## 2. Apps Script (15 min)

### 2.1 Abrir el editor

Desde el Sheet → **Extensiones → Apps Script**. Eso crea un script ligado al Sheet.

### 2.2 Pegar el código

Reemplazar todo el contenido del archivo `Code.gs` por el snippet completo que está en [PLAN-UPLOAD-DRIVE.md](PLAN-UPLOAD-DRIVE.md) bajo la sección "Apps Script". Adaptar tu lógica de `overwrite` ya existente al `switch` de ese snippet (mantener la auth con `data.secret` y devolver con `jsonResponse(...)`).

**Antes de guardar:**
- En la constante `ROOT_FOLDER_ID`, pegar el ID que copiaste en el paso 1.

### 2.3 Configurar el secret

En el editor → **Project Settings (icono de engranaje) → Script Properties → Add script property**:

| Property | Value |
|---|---|
| `SYNC_SECRET` | un string largo y random (ej. generado con `openssl rand -hex 32`) |

Anotá el valor — lo vas a necesitar en el paso 3.

### 2.4 Deploy

**Deploy → New deployment → Type: Web app**:

- Description: `Isabella sync v1`
- Execute as: **Me** (la cuenta de la clienta)
- Who has access: **Anyone**

Click Deploy. La primera vez Google va a pedir autorizar permisos de Drive y Sheets — aceptar.

Al final te da una URL del tipo:
`https://script.google.com/macros/s/AKfycb.../exec`

**Copiala. Esa es `APPS_SCRIPT_URL`.**

### 2.5 Health-check

Abrir esa URL en una pestaña del browser. Tiene que devolver:

```json
{"ok":true,"message":"Isabella sync endpoint is running"}
```

Si ves HTML de Google con "Authorization required" o similar, volvé al paso 2.4 y verificá que **Who has access** esté en "Anyone".

---

## 3. Variables de entorno en Vercel (5 min)

En el dashboard de Vercel del proyecto → **Settings → Environment Variables**, agregar (para Production, Preview y Development):

| Name | Value |
|---|---|
| `APPS_SCRIPT_URL` | la URL `/exec` del paso 2.4 |
| `SYNC_SECRET` | el valor del paso 2.3 (mismo que en Script Properties) |
| `ADMIN_PASSWORD` | el password con el que la clienta entra al panel admin |
| `NEXT_PUBLIC_SHEET_ID` | el ID del Google Sheet (de la URL del documento, entre `/d/` y `/edit`) |

Después: **Deployments → último deployment → Redeploy** para que el sitio levante con las env vars nuevas.

> Para desarrollo local, copiar las mismas variables a un archivo `.env.local` en la raíz del proyecto. Si no seteás `ADMIN_PASSWORD` en dev, el panel acepta el password `isabella-dev` (solo cuando `NODE_ENV !== 'production'`).

---

## 4. Smoke test end-to-end (5 min)

1. Abrir `https://<tu-dominio-vercel>/admin` y loguearse con `ADMIN_PASSWORD`.
2. Ir a la sección **Productos**.
3. En cualquier producto, click en **Subir** dentro de un campo de imagen.
4. Elegir una imagen `.jpg` o `.webp` chica (≤ 2 MB para la primera prueba).
5. Esperar el spinner. La URL del campo debería pasar a algo como:
   `https://lh3.googleusercontent.com/d/<file-id>`
6. El preview de la imagen debe renderizar abajo del input.
7. Click en **Guardar**. Ir al sheet y verificar que la columna `imagenes` del producto se actualizó con la URL nueva.
8. Ir a Drive → carpeta raíz. Debería haberse creado `Isabella Boutique/productos/` con la foto adentro.
9. La foto en Drive debe tener permiso **"Cualquier usuario que tenga el enlace"** (verificar haciendo click derecho → Compartir).
10. Recargar el sitio público y verificar que la foto del producto se ve.

Si hasta acá funciona, repetir con una foto en cada otra entidad (`Hero`, `Banner`, `Category`, `Instagram`, `Marca`) para validar que las 6 subcarpetas se crean bien.

---

## 5. Troubleshooting

### La URL `/exec` devuelve HTML en vez de JSON
- El deploy no está activo. Volver a Deploy → Manage deployments → editar → asegurarse que **Who has access = Anyone** y **Execute as = Me**.

### Subir una foto devuelve `unauthorized`
- El `SYNC_SECRET` en Vercel y en Script Properties no coinciden. Verificar exacto, sin espacios.

### Subir devuelve `apps script 502` o `invalid JSON from apps script`
- Algo tiró excepción dentro del script. Ir a `script.google.com` → tu proyecto → **Executions** (icono de reloj) y ver el log del último request. Causas típicas:
  - `ROOT_FOLDER_ID` mal pegado.
  - La carpeta raíz fue movida a la papelera.
  - Permisos de Drive revocados (re-autorizar el script).

### La imagen sube pero no se ve en el sitio
- Abrir la URL `https://lh3.googleusercontent.com/d/<file-id>` directo en el browser. Si tampoco ahí carga, el archivo no quedó público. Revisar manualmente en Drive: click derecho → Compartir → "Cualquier usuario que tenga el enlace puede ver".
- Si la cuenta de la clienta es Google Workspace con políticas restrictivas, esto puede estar bloqueado a nivel organización. En ese caso, alternativa: cambiar la URL devuelta por el script a `https://drive.google.com/file/d/{id}/view` ([lib/drive.js](lib/drive.js) ya la convierte).

### Login al admin no funciona después del cambio de `ADMIN_PASSWORD`
- Limpiar `sessionStorage` del browser (`localStorage.clear()` desde DevTools) y volver a loguear.

---

## 6. Checklist final

- [ ] Carpeta raíz creada en Drive de la clienta y compartida (si la clienta no es la dueña del Apps Script).
- [ ] Sheet con todas las hojas dentro de la carpeta raíz.
- [ ] `ROOT_FOLDER_ID` pegado en el script.
- [ ] `SYNC_SECRET` configurado como Script Property y como env var en Vercel.
- [ ] `APPS_SCRIPT_URL` y `ADMIN_PASSWORD` configurados en Vercel.
- [ ] Deploy del Apps Script con "Anyone" + "Execute as: Me".
- [ ] `/exec` abierta en browser devuelve `{"ok":true,...}`.
- [ ] Vercel redeployado después de agregar env vars.
- [ ] Smoke test: una foto subida desde admin aparece en el sheet, en Drive, y en el sitio público.
- [ ] `ADMIN_PASSWORD` seteado en Vercel (sin él, el panel rechaza cualquier login en producción).
