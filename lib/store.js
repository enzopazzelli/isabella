// Centralized localStorage store for admin overrides
// When the admin edits content, it saves here. The landing reads from here first, then API fallback.

const STORE_PREFIX = 'isabella_admin_'

export function getStoreItem(key) {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(STORE_PREFIX + key)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function setStoreItem(key, value) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORE_PREFIX + key, JSON.stringify(value))
}

export function removeStoreItem(key) {
  if (typeof window === 'undefined') return
  localStorage.removeItem(STORE_PREFIX + key)
}

// Keys used:
// 'hero_slides' - hero carousel slides
// 'category_blocks' - category visual blocks
// 'banners' - editorial banners
// 'productos' - products list
// 'testimonios' - testimonials
// 'instagram' - instagram feed photos
// 'promos' - promo bar messages
// 'config' - general config (whatsapp, instagram user, etc.)
// 'textos' - landing page texts overrides
// 'newsletter_subs' - newsletter subscribers
