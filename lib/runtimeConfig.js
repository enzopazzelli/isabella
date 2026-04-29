import { negocio } from './config'

export function mergeNegocio(overrides) {
  const filtered = Object.fromEntries(
    Object.entries(overrides || {}).filter(([, v]) => v !== '' && v != null)
  )
  return { ...negocio, ...filtered }
}
