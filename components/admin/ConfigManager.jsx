'use client'

import { useState, useEffect } from 'react'
import { Save, ExternalLink, RotateCcw } from 'lucide-react'
import { negocio } from '@/lib/config'
import { getStoreItem, setStoreItem, removeStoreItem } from '@/lib/store'
import { getSheetEditUrl } from '@/lib/admin'
import { syncEntity } from '@/lib/sync'

export default function ConfigManager() {
  const [config, setConfig] = useState({
    whatsapp: negocio.whatsapp,
    instagram: negocio.instagram,
    facebook: negocio.facebook,
    tiktok: negocio.tiktok,
    email: negocio.email,
    direccion: negocio.direccion,
    horario: negocio.horario,
    url: negocio.url,
  })
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const stored = getStoreItem('config')
    if (stored) setConfig(prev => ({ ...prev, ...stored }))
  }, [])

  const handleSave = () => {
    setStoreItem('config', config)
    syncEntity('config', config)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleReset = () => {
    removeStoreItem('config')
    removeStoreItem('hero_slides')
    removeStoreItem('category_blocks')
    removeStoreItem('marcas')
    removeStoreItem('banners')
    removeStoreItem('productos')
    removeStoreItem('testimonios')
    removeStoreItem('promos')
    window.location.reload()
  }

  return (
    <div className="space-y-6">
      {/* General config */}
      <div className="bg-white border border-border">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div>
            <h3 className="font-display text-sm uppercase tracking-editorial">Datos del negocio</h3>
            <p className="font-body text-[11px] text-secondary mt-1">Informacion de contacto y redes sociales</p>
          </div>
          <button
            onClick={handleSave}
            className={`flex items-center gap-1.5 font-display text-[11px] uppercase tracking-editorial px-3 py-1.5 transition-colors ${
              saved ? 'bg-green-600 text-white' : 'bg-primary text-white hover:bg-primary-hover'
            }`}
          >
            <Save size={14} /> {saved ? 'Guardado' : 'Guardar'}
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ConfigField label="WhatsApp" sublabel="Numero con codigo de pais (ej: 5493854123456)" value={config.whatsapp} onChange={(v) => setConfig(c => ({ ...c, whatsapp: v }))} />
            <ConfigField label="Instagram" sublabel="Usuario sin @ (ej: isabella_boutique)" value={config.instagram} onChange={(v) => setConfig(c => ({ ...c, instagram: v }))} />
            <ConfigField label="Facebook" sublabel="URL completa de la pagina" value={config.facebook} onChange={(v) => setConfig(c => ({ ...c, facebook: v }))} />
            <ConfigField label="TikTok" sublabel="Usuario sin @ (ej: isabella_anatuya)" value={config.tiktok} onChange={(v) => setConfig(c => ({ ...c, tiktok: v }))} />
            <ConfigField label="Email" value={config.email} onChange={(v) => setConfig(c => ({ ...c, email: v }))} />
            <ConfigField label="Direccion" value={config.direccion} onChange={(v) => setConfig(c => ({ ...c, direccion: v }))} />
            <ConfigField label="Horario" sublabel="Ej: Lunes a Sabado 9:00 - 13:00 / 17:00 - 21:00" value={config.horario} onChange={(v) => setConfig(c => ({ ...c, horario: v }))} />
            <ConfigField label="URL del sitio" sublabel="Para SEO y sitemap" value={config.url} onChange={(v) => setConfig(c => ({ ...c, url: v }))} />
          </div>
        </div>
      </div>

      {/* Google Sheets */}
      <div className="bg-white border border-border">
        <div className="px-5 py-4 border-b border-border">
          <h3 className="font-display text-sm uppercase tracking-editorial">Google Sheets (CMS)</h3>
          <p className="font-body text-[11px] text-secondary mt-1">
            Si tenes configurado un Google Sheet, los datos se sincronizan automaticamente. Los cambios hechos desde este panel sobreescriben los del Sheet.
          </p>
        </div>
        <div className="p-5 space-y-3">
          {['Productos', 'Hero', 'Categorias', 'Marcas', 'Banners', 'Testimonios', 'Instagram', 'Promos', 'FAQ', 'Config'].map(sheet => (
            <a
              key={sheet}
              href={getSheetEditUrl(sheet)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between border border-border px-4 py-2.5 hover:border-primary transition-colors"
            >
              <span className="font-display text-[11px] uppercase tracking-editorial">{sheet}</span>
              <ExternalLink size={12} className="text-secondary" />
            </a>
          ))}
        </div>
      </div>

      {/* Reset */}
      <div className="bg-white border border-sale/30">
        <div className="px-5 py-4 border-b border-sale/30">
          <h3 className="font-display text-sm uppercase tracking-editorial text-sale">Zona peligrosa</h3>
        </div>
        <div className="p-5">
          <p className="font-body text-sm text-secondary mb-4">
            Restaurar todos los datos del panel a los valores por defecto. Esto borra todas las personalizaciones hechas desde el admin.
          </p>
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 font-display text-[11px] uppercase tracking-editorial text-sale border border-sale px-4 py-2 hover:bg-sale hover:text-white transition-all"
          >
            <RotateCcw size={14} /> Restaurar valores por defecto
          </button>
        </div>
      </div>
    </div>
  )
}

function ConfigField({ label, sublabel, value, onChange }) {
  return (
    <div>
      <label className="block font-display text-[10px] uppercase tracking-editorial text-secondary mb-0.5">{label}</label>
      {sublabel && <p className="font-body text-[10px] text-muted mb-1">{sublabel}</p>}
      <input
        type="text"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-border px-3 py-2 font-body text-sm outline-none focus:border-primary transition-colors"
      />
    </div>
  )
}
