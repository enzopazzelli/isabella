import { SHEET_ID } from './config'

export function getSheetUrl(sheetName) {
  if (!SHEET_ID) return '#'
  return `https://docs.google.com/spreadsheets/d/${SHEET_ID}/edit#gid=0`
}

export function getSheetEditUrl(sheetName) {
  if (!SHEET_ID) return '#'
  return `https://docs.google.com/spreadsheets/d/${SHEET_ID}/edit`
}

export function parseDriveImageUrl(url) {
  if (!url || typeof url !== 'string') return url
  // Format: https://drive.google.com/file/d/FILE_ID/view...
  const fileMatch = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/)
  if (fileMatch) return `https://lh3.googleusercontent.com/d/${fileMatch[1]}`
  // Format: https://drive.google.com/open?id=FILE_ID
  const openMatch = url.match(/drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/)
  if (openMatch) return `https://lh3.googleusercontent.com/d/${openMatch[1]}`
  // Format: https://drive.google.com/uc?id=FILE_ID
  const ucMatch = url.match(/drive\.google\.com\/uc\?.*id=([a-zA-Z0-9_-]+)/)
  if (ucMatch) return `https://lh3.googleusercontent.com/d/${ucMatch[1]}`
  return url
}

export function isDriveUrl(url) {
  return typeof url === 'string' && url.includes('drive.google.com')
}
