export function getDriveImageUrl(url, width = 1200) {
  if (!url) return ''
  const str = String(url).trim()

  // Local public path — pass through as-is
  if (str.startsWith('/')) return str

  const sizeSuffix = width ? `=w${width}` : ''

  if (str.includes('lh3.googleusercontent.com')) {
    const base = str.split('=')[0]
    // Drive /d/ files don't support the =wN resize parameter
    if (base.includes('/d/')) return base
    return sizeSuffix ? `${base}${sizeSuffix}` : base
  }

  const patterns = [
    /\/file\/d\/([a-zA-Z0-9_-]+)/,
    /id=([a-zA-Z0-9_-]+)/,
    /\/d\/([a-zA-Z0-9_-]+)/,
  ]

  for (const pattern of patterns) {
    const match = str.match(pattern)
    if (match) {
      return `https://lh3.googleusercontent.com/d/${match[1]}${sizeSuffix}`
    }
  }

  if (str.startsWith('http')) return str

  return ''
}
