import { Josefin_Sans, Lato } from 'next/font/google'
import './globals.css'
import { negocio } from '@/lib/config'

const josefin = Josefin_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '600'],
  variable: '--font-josefin',
  display: 'swap',
})

const lato = Lato({
  subsets: ['latin'],
  weight: ['300', '400'],
  variable: '--font-lato',
  display: 'swap',
})

export const metadata = {
  title: `${negocio.nombre} — ${negocio.subtitulo}`,
  description: negocio.descripcion,
  keywords: ['moda femenina', 'ropa mujer', 'boutique', 'Añatuya', 'Santiago del Estero', 'Argentina', 'Isabella'],
  openGraph: {
    title: `${negocio.nombre} — ${negocio.subtitulo}`,
    description: negocio.descripcion,
    type: 'website',
    locale: 'es_AR',
  },
}

export default function RootLayout({ children }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: `${negocio.nombre} ${negocio.subtitulo}`,
    description: negocio.descripcion,
    address: {
      '@type': 'PostalAddress',
      addressLocality: negocio.ciudad,
      addressRegion: negocio.provincia,
      addressCountry: negocio.pais,
    },
  }

  return (
    <html lang="es" className={`${josefin.variable} ${lato.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-body text-primary bg-white antialiased">
        {children}
      </body>
    </html>
  )
}
