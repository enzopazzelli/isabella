'use client'

import { useState, useRef } from 'react'
import { Upload, Link, CheckCircle, Loader2, AlertCircle } from 'lucide-react'
import { parseDriveImageUrl, isDriveUrl } from '@/lib/admin'
import { getAdminPass } from '@/lib/sync'

const MAX_BYTES = 5 * 1024 * 1024
const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

export default function ImageField({
  label,
  value,
  onChange,
  placeholder = 'URL de imagen o link de Google Drive',
  subfolder,
}) {
  const [dragging, setDragging] = useState(false)
  const [converted, setConverted] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState(null)
  const inputRef = useRef(null)
  const fileInputRef = useRef(null)

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

  const handleFile = async (file) => {
    if (!file) return
    setUploadError(null)

    if (!ALLOWED_MIME.includes(file.type)) {
      setUploadError('Formato no soportado (usar JPG, PNG, WEBP o GIF)')
      return
    }
    if (file.size > MAX_BYTES) {
      setUploadError('Archivo muy grande (máx 5 MB)')
      return
    }

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      if (subfolder) formData.append('subfolder', subfolder)

      const res = await fetch('/api/upload-image', {
        method: 'POST',
        headers: { Authorization: `Bearer ${getAdminPass()}` },
        body: formData,
      })

      const json = await res.json().catch(() => ({}))

      if (!res.ok || !json.ok) {
        setUploadError(json.error || `Error ${res.status}`)
        return
      }

      onChange(json.url)
      setConverted(true)
      setTimeout(() => setConverted(false), 2500)
    } catch (err) {
      setUploadError(String(err.message || err))
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
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
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-1 px-3 py-2 border-l border-border text-secondary hover:text-primary hover:bg-light/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Subir desde mi equipo"
          >
            {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
            <span className="font-display text-[10px] uppercase tracking-editorial">
              {uploading ? 'Subiendo...' : 'Subir'}
            </span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            hidden
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
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

      {uploadError && (
        <p className="font-body text-[11px] text-red-600 mt-1 flex items-center gap-1">
          <AlertCircle size={11} />
          {uploadError}
        </p>
      )}

      <p className="font-body text-[10px] text-muted mt-1 flex items-center gap-1">
        <Link size={9} />
        Subí un archivo o pegá una URL/link de Google Drive
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
