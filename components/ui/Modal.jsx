'use client'

import { useEffect } from 'react'
import { X } from 'lucide-react'

export default function Modal({ isOpen, onClose, children, maxWidth = 'max-w-4xl' }) {
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('overflow-hidden')
      const handleEsc = (e) => { if (e.key === 'Escape') onClose() }
      window.addEventListener('keydown', handleEsc)
      return () => {
        document.body.classList.remove('overflow-hidden')
        window.removeEventListener('keydown', handleEsc)
      }
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className={`relative bg-white w-full ${maxWidth} max-h-[90vh] overflow-y-auto animate-scale-in`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-1 text-primary hover:text-secondary transition-colors"
          aria-label="Cerrar"
        >
          <X size={20} strokeWidth={1.5} />
        </button>
        {children}
      </div>
    </div>
  )
}
