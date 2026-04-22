'use client'

import { useState, useRef, useEffect } from 'react'
import { Share2, Check } from 'lucide-react'

export default function ShareButton({ producto, variant = 'icon' }) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/producto/${producto.id}`
    : ''
  const shareText = `${producto.nombre} - Isabella Boutique`

  const handleShare = async (type) => {
    const encodedUrl = encodeURIComponent(shareUrl)
    const encodedText = encodeURIComponent(shareText)

    switch (type) {
      case 'whatsapp':
        window.location.href = `https://wa.me/?text=${encodedText}%20${encodedUrl}`
        break
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, '_blank')
        break
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`, '_blank')
        break
      case 'copy':
        await navigator.clipboard.writeText(shareUrl)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
        break
      case 'native':
        if (navigator.share) {
          navigator.share({ title: shareText, url: shareUrl })
        }
        break
    }
    setOpen(false)
  }

  const buttonClass = variant === 'full'
    ? 'flex items-center gap-2 text-secondary hover:text-primary transition-colors font-display text-[11px] uppercase tracking-editorial'
    : 'p-1 text-secondary hover:text-primary transition-colors'

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(!open)} className={buttonClass}>
        <Share2 size={16} strokeWidth={1.5} />
        {variant === 'full' && <span>Compartir</span>}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 bg-white border border-border shadow-sm z-20 min-w-[160px] animate-fade-in">
          <button onClick={() => handleShare('whatsapp')} className="w-full text-left px-4 py-2.5 font-display text-[11px] uppercase tracking-editorial hover:bg-light transition-colors">
            WhatsApp
          </button>
          <button onClick={() => handleShare('facebook')} className="w-full text-left px-4 py-2.5 font-display text-[11px] uppercase tracking-editorial hover:bg-light transition-colors">
            Facebook
          </button>
          <button onClick={() => handleShare('twitter')} className="w-full text-left px-4 py-2.5 font-display text-[11px] uppercase tracking-editorial hover:bg-light transition-colors">
            X (Twitter)
          </button>
          <div className="border-t border-border" />
          <button onClick={() => handleShare('copy')} className="w-full text-left px-4 py-2.5 font-display text-[11px] uppercase tracking-editorial hover:bg-light transition-colors flex items-center gap-2">
            {copied ? <><Check size={12} /> Copiado</> : 'Copiar enlace'}
          </button>
          {typeof navigator !== 'undefined' && navigator.share && (
            <button onClick={() => handleShare('native')} className="w-full text-left px-4 py-2.5 font-display text-[11px] uppercase tracking-editorial hover:bg-light transition-colors">
              Mas opciones...
            </button>
          )}
        </div>
      )}
    </div>
  )
}
