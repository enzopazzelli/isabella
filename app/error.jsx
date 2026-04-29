'use client'

import { useEffect } from 'react'

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-md text-center">
        <h2 className="font-display font-light text-2xl uppercase tracking-wide-title text-primary mb-4">
          Algo salió mal
        </h2>
        <p className="font-body text-sm text-secondary mb-8">
          Ocurrió un error al cargar esta página. Probá de nuevo en unos segundos.
        </p>
        <button
          onClick={reset}
          className="border border-primary text-primary font-display text-xs uppercase tracking-editorial px-8 py-2.5 hover:bg-primary hover:text-white transition-all duration-300"
        >
          Reintentar
        </button>
      </div>
    </div>
  )
}
