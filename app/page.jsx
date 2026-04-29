import HomeClient from './HomeClient'
import { fetchAllData } from '@/lib/sheets'
import { mergeNegocio } from '@/lib/runtimeConfig'
import {
  defaultHeroSlides,
  defaultCategoryBlocks,
  defaultProductos,
  defaultTestimonios,
  defaultBanners,
  defaultInstagramPhotos,
  defaultPromos,
  defaultMarcas,
} from '@/lib/defaults'

export const revalidate = 300

export default async function HomePage() {
  let data = {}
  try {
    data = await fetchAllData()
  } catch {
    data = {}
  }

  const promos = data.promos
    || (data.config?.promos ? String(data.config.promos).split('|').map(s => s.trim()) : null)
    || defaultPromos

  const negocioRuntime = mergeNegocio(data.config)

  return (
    <HomeClient
      initialHeroSlides={data.heroSlides || defaultHeroSlides}
      initialCategoryBlocks={data.categoryBlocks || defaultCategoryBlocks}
      initialProductos={data.productos || defaultProductos}
      initialTestimonios={data.testimonios || defaultTestimonios}
      initialBanners={data.banners || defaultBanners}
      initialInstagramPhotos={data.instagramPhotos || defaultInstagramPhotos}
      initialMarcas={data.marcas || defaultMarcas}
      initialPromos={promos}
      negocio={negocioRuntime}
    />
  )
}
