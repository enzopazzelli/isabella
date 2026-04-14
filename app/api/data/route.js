import { NextResponse } from 'next/server'
import { fetchAllData } from '@/lib/sheets'
import {
  defaultHeroSlides,
  defaultCategoryBlocks,
  defaultProductos,
  defaultTestimonios,
  defaultBanners,
  defaultInstagramPhotos,
  defaultFaqs,
  defaultPromos,
} from '@/lib/defaults'

export async function GET() {
  try {
    const data = await fetchAllData()

    return NextResponse.json({
      productos: data.productos || defaultProductos,
      heroSlides: data.heroSlides || defaultHeroSlides,
      categoryBlocks: data.categoryBlocks || defaultCategoryBlocks,
      banners: data.banners || defaultBanners,
      testimonios: data.testimonios || defaultTestimonios,
      instagramPhotos: data.instagramPhotos || defaultInstagramPhotos,
      faqs: data.faqs || defaultFaqs,
      config: data.config || { promos: defaultPromos.join('|') },
    })
  } catch {
    return NextResponse.json({
      productos: defaultProductos,
      heroSlides: defaultHeroSlides,
      categoryBlocks: defaultCategoryBlocks,
      banners: defaultBanners,
      testimonios: defaultTestimonios,
      instagramPhotos: defaultInstagramPhotos,
      faqs: defaultFaqs,
      config: { promos: defaultPromos.join('|') },
    })
  }
}
