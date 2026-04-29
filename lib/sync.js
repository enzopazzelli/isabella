// Client-side sync helper.
//
// Every admin save() writes to localStorage (fast local feedback) and
// additionally calls syncEntity() which POSTs to /api/sync. The API route
// forwards the write to the Google Apps Script using a server-side secret.
//
// Behavior:
//  - Fire-and-forget. Never throws to the caller. If the sheet is down or
//    not configured, the admin UI must keep working.
//  - Auth: reads the admin password from sessionStorage (stored on login)
//    and sends it as the Authorization header. If empty, the API will reject
//    with 401 and the admin must log in again.
//  - Silent no-op when called from a server render (no window).

const AUTH_KEY = 'isabella_admin_pass'

export function setAdminPass(pass) {
  if (typeof window === 'undefined') return
  try { sessionStorage.setItem(AUTH_KEY, pass) } catch {}
}

export function getAdminPass() {
  if (typeof window === 'undefined') return ''
  try { return sessionStorage.getItem(AUTH_KEY) || '' } catch { return '' }
}

export function clearAdminPass() {
  if (typeof window === 'undefined') return
  try { sessionStorage.removeItem(AUTH_KEY) } catch {}
}

/**
 * Push a full entity overwrite to the sheet.
 *
 * @param {string} entityKey  one of: productos, hero_slides, category_blocks,
 *                            marcas, banners, testimonios, instagram_photos,
 *                            promos, config
 * @param {Array|Object} data the admin's in-memory data for that entity
 */
export async function syncEntity(entityKey, data) {
  if (typeof window === 'undefined') return { ok: false, error: 'ssr' }

  try {
    const res = await fetch('/api/sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAdminPass()}`,
      },
      body: JSON.stringify({ entity: entityKey, data }),
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      console.warn('[sync] failed', entityKey, err)
      return { ok: false, error: err.error || res.statusText }
    }
    return await res.json()
  } catch (err) {
    console.warn('[sync] network error', entityKey, err)
    return { ok: false, error: String(err) }
  }
}
