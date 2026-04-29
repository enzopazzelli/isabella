import { Josefin_Sans, Lato } from 'next/font/google'
import './globals.css'
import { negocio } from '@/lib/config'
import WebVitals from '@/components/WebVitals'

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

const siteName = `${negocio.nombre} ${negocio.subtitulo}`
const siteTitle = `${negocio.nombre} — ${negocio.subtitulo}`

export const metadata = {
  metadataBase: new URL(negocio.url),
  title: {
    default: siteTitle,
    template: `%s — ${siteName}`,
  },
  description: negocio.descripcion,
  keywords: ['moda femenina', 'ropa mujer', 'boutique', 'Añatuya', 'Santiago del Estero', 'Argentina', 'Isabella'],
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  openGraph: {
    title: siteTitle,
    description: negocio.descripcion,
    url: '/',
    siteName,
    type: 'website',
    locale: 'es_AR',
  },
  twitter: {
    card: 'summary_large_image',
    title: siteTitle,
    description: negocio.descripcion,
  },
  icons: {
    icon: '/logo-negro.jpeg',
    apple: '/logo-negro.jpeg',
  },
}

export const viewport = {
  themeColor: '#ffffff',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${negocio.url}#organization`,
        name: siteName,
        url: negocio.url,
        logo: `${negocio.url}/logo-negro.jpeg`,
        sameAs: [
          negocio.instagram ? `https://www.instagram.com/${negocio.instagram}` : null,
          negocio.facebook || null,
          negocio.tiktok ? `https://www.tiktok.com/@${negocio.tiktok}` : null,
        ].filter(Boolean),
      },
      {
        '@type': 'WebSite',
        '@id': `${negocio.url}#website`,
        url: negocio.url,
        name: siteName,
        description: negocio.descripcion,
        inLanguage: 'es-AR',
        publisher: { '@id': `${negocio.url}#organization` },
        potentialAction: {
          '@type': 'SearchAction',
          target: `${negocio.url}/?q={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'LocalBusiness',
        '@id': `${negocio.url}#localbusiness`,
        name: siteName,
        description: negocio.descripcion,
        url: negocio.url,
        image: `${negocio.url}/logo-negro.jpeg`,
        address: {
          '@type': 'PostalAddress',
          streetAddress: negocio.direccion,
          addressLocality: negocio.ciudad,
          addressRegion: negocio.provincia,
          addressCountry: negocio.pais,
        },
      },
    ],
  }

  return (
    <html lang="es-AR" className={`${josefin.variable} ${lato.variable}`} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://lh3.googleusercontent.com" />
        <link rel="dns-prefetch" href="https://lh3.googleusercontent.com" />
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(localStorage.getItem('isabella_theme')==='dark')document.documentElement.classList.add('dark-landing')}catch(e){}`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-body text-primary bg-white antialiased">
        <WebVitals />
        {children}
      </body>
    </html>
  )
}
