export function getDriveImageUrl(url) {
  if (!url) return ''
  const str = String(url).trim()

  // Already a direct lh3 URL
  if (str.includes('lh3.googleusercontent.com')) return str

  // Extract file ID from various Google Drive URL formats
  const patterns = [
    /\/file\/d\/([a-zA-Z0-9_-]+)/,
    /id=([a-zA-Z0-9_-]+)/,
    /\/d\/([a-zA-Z0-9_-]+)/,
  ]

  for (const pattern of patterns) {
    const match = str.match(pattern)
    if (match) {
      return `https://lh3.googleusercontent.com/d/${match[1]}`
    }
  }

  // If it's already a direct URL (not Drive), return as-is
  if (str.startsWith('http')) return str

  return ''
}
