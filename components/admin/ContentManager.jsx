'use client'

import { ExternalLink } from 'lucide-react'
import { getSheetEditUrl } from '@/lib/admin'

function SectionPreview({ title, description, items, sheetName, renderItem }) {
  return (
    <div className="border border-border p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-sm uppercase tracking-editorial">{title}</h3>
        <a
          href={getSheetEditUrl(sheetName)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 font-body text-xs text-secondary hover:text-primary transition-colors"
        >
          Editar en Sheets <ExternalLink size={12} />
        </a>
      </div>
      <p className="font-body text-xs text-secondary mb-4">{description}</p>
      {items && items.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {items.map((item, i) => renderItem(item, i))}
        </div>
      ) : (
        <p className="font-body text-sm text-muted italic">Sin datos configurados</p>
      )}
    </div>
  )
}

export default function ContentManager({ heroSlides = [], categoryBlocks = [], banners = [], instagramPhotos = [] }) {
  return (
    <div>
      <SectionPreview
        title="Hero Slides"
        description="Subi la imagen a Google Drive, pone el link aca, y el titulo que quieras mostrar."
        items={heroSlides}
        sheetName="Hero"
        renderItem={(slide) => (
          <div key={slide.id} className="border border-border overflow-hidden">
            <div className="aspect-video bg-light">
              {slide.imagen ? (
                <img src={slide.imagen} alt={slide.titulo} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                  <span className="font-body text-xs text-muted">Sin imagen</span>
                </div>
              )}
            </div>
            <div className="p-2">
              <p className="font-display text-[10px] uppercase tracking-editorial truncate">{slide.titulo || 'Sin titulo'}</p>
              <p className="font-body text-[10px] text-secondary truncate">{slide.subtitulo || ''}</p>
            </div>
          </div>
        )}
      />

      <SectionPreview
        title="Bloques de Categorias"
        description="Cada categoria necesita una foto linda. Ideal: foto de modelo con la prenda representativa."
        items={categoryBlocks}
        sheetName="Categorias"
        renderItem={(block) => (
          <div key={block.id} className="border border-border overflow-hidden">
            <div className="aspect-square bg-light">
              {block.imagen ? (
                <img src={block.imagen} alt={block.nombre} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                  <span className="font-body text-xs text-muted">Sin imagen</span>
                </div>
              )}
            </div>
            <div className="p-2">
              <p className="font-display text-[10px] uppercase tracking-editorial">{block.nombre}</p>
            </div>
          </div>
        )}
      />

      <SectionPreview
        title="Banners Editoriales"
        description="Banners que aparecen entre secciones. Configura la ubicacion: pre-productos, mid-productos o post-productos."
        items={banners}
        sheetName="Banners"
        renderItem={(banner) => (
          <div key={banner.id} className="border border-border overflow-hidden">
            <div className="aspect-video bg-light">
              {banner.imagen ? (
                <img src={banner.imagen} alt={banner.titulo} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                  <span className="font-body text-xs text-muted">Sin imagen</span>
                </div>
              )}
            </div>
            <div className="p-2">
              <p className="font-display text-[10px] uppercase tracking-editorial truncate">{banner.titulo || 'Sin titulo'}</p>
              <p className="font-body text-[10px] text-secondary">{banner.ubicacion}</p>
            </div>
          </div>
        )}
      />

      <SectionPreview
        title="Feed Instagram"
        description="Subi fotos cuadradas para el feed. No usa la API de Instagram, se cargan manualmente."
        items={instagramPhotos}
        sheetName="Instagram"
        renderItem={(photo) => (
          <div key={photo.id} className="border border-border overflow-hidden">
            <div className="aspect-square bg-light">
              {photo.imagen ? (
                <img src={photo.imagen} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200" />
              )}
            </div>
          </div>
        )}
      />
    </div>
  )
}
