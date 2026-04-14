'use client'

import { useState, useRef } from 'react'
import { Upload, Link, Image, CheckCircle } from 'lucide-react'
import { parseDriveImageUrl, isDriveUrl } from '@/lib/admin'

export default function ImageField({ label, value, onChange, placeholder = 'URL de imagen o link de Google Drive' }) {
  const [dragging, setDragging] = useState(false)
  const [converted, setConverted] = useState(false)
  const inputRef = useRef(null)

  const handleChange = (raw) => {
    if (isDriveUrl(raw)) {
      const directUrl = parseDriveImageUrl(raw)
      onChange(directUrl)
      setConverted(true)
      setTimeout(() => setConverted(false), 2500)
    } else {
      onChange(raw)
      setConverted(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)

    const text = e.dataTransfer.getData('text/plain') || e.dataTransfer.getData('text/uri-list')
    if (text) {
      handleChange(text.trim())
      return
    }

    const html = e.dataTransfer.getData('text/html')
    if (html) {
      const match = html.match(/src="([^"]+)"/)
      if (match) {
        handleChange(match[1])
        return
      }
    }
  }

  return (
    <div>
      <label className="block font-display text-[10px] uppercase tracking-editorial text-secondary mb-1">
        {label}
      </label>
      <div
        className={`relative border transition-colors ${
          dragging ? 'border-primary bg-light/50 border-dashed' : 'border-border'
        }`}
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
      >
        <div className="flex items-center">
          <input
            ref={inputRef}
            type="text"
            value={value || ''}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={placeholder}
            className="flex-1 px-3 py-2 font-body text-sm outline-none bg-transparent"
          />
          {converted && (
            <span className="flex items-center gap-1 pr-3 text-green-600">
              <CheckCircle size={12} />
              <span className="font-display text-[9px] uppercase tracking-editorial">Drive OK</span>
            </span>
          )}
        </div>

        {dragging && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 pointer-events-none">
            <div className="flex items-center gap-2 text-primary">
              <Upload size={16} />
              <span className="font-display text-[11px] uppercase tracking-editorial">Soltar link aqui</span>
            </div>
          </div>
        )}
      </div>

      <p className="font-body text-[10px] text-muted mt-1 flex items-center gap-1">
        <Link size={9} />
        Acepta rutas locales (/imgs/foto.png) o links de Google Drive
      </p>

      {value && (
        <div className="mt-2 w-20 h-20 border border-border overflow-hidden bg-light">
          <img
            src={value}
            alt=""
            className="w-full h-full object-cover"
            onError={(e) => { e.target.style.display = 'none' }}
          />
        </div>
      )}
    </div>
  )
}
