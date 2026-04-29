export function eqCi(a, b) {
  if (a == null || b == null) return a === b
  return String(a).toLowerCase() === String(b).toLowerCase()
}
