'use client'

import { useState } from 'react'
import Modal from './Modal'

export default function SizeGuideLink() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="font-body text-xs text-secondary underline hover:text-primary transition-colors"
      >
        Guia de talles
      </button>
      <Modal isOpen={open} onClose={() => setOpen(false)} maxWidth="max-w-lg">
        <div className="p-8">
          <h3 className="font-display text-lg uppercase tracking-wide-title mb-6">Guia de talles</h3>
          <img
            src="/guiadetalles.jpeg"
            alt="Guia de talles"
            className="w-full"
            onError={(e) => {
              e.target.style.display = 'none'
              e.target.nextSibling.style.display = 'block'
            }}
          />
          <div className="hidden">
            <p className="text-secondary font-body text-sm leading-relaxed">
              Para conocer tu talle exacto, escribinos por WhatsApp y te asesoramos con las medidas de cada prenda.
            </p>
          </div>
        </div>
      </Modal>
    </>
  )
}
