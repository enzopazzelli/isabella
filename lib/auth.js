function getExpectedPassword() {
  const envPass = process.env.ADMIN_PASSWORD
  if (envPass) return envPass
  if (process.env.NODE_ENV !== 'production') return 'isabella-dev'
  return ''
}

export function checkPassword(candidate) {
  const expected = getExpectedPassword()
  return Boolean(expected) && candidate === expected
}

export function isAuthorized(req) {
  const header = req.headers.get('authorization') || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : ''
  return checkPassword(token)
}
