import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'

// Self-hosted at build time: no render-blocking request chain to Google Fonts.
const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-inter' })
const mono = JetBrains_Mono({ subsets: ['latin'], display: 'swap', variable: '--font-mono', weight: ['400', '500'] })

const SITE = 'https://www.dnianalytics.com'
const TITLE = 'DNI Studios — Personal Trainer & PT Studio Management Software'
const DESCRIPTION =
  'Run your PT studio from one place: clients, bookings, workouts, payments and leads. Built in the UK for personal trainers. Plans from £49/month.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: { default: TITLE, template: '%s | DNI Studios' },
  description: DESCRIPTION,
  applicationName: 'DNI Studios',
  keywords: [
    'personal trainer software', 'PT studio management', 'personal training app', 'gym management software UK',
    'client management for personal trainers', 'PT booking software', 'fitness studio software',
  ],
  alternates: { canonical: '/' },
  icons: {
    icon: [
      { url: '/favicon.ico?v=3', sizes: 'any' },
      { url: '/icon-32.png?v=3', type: 'image/png', sizes: '32x32' },
      { url: '/icon-192.png?v=4', type: 'image/png', sizes: '192x192' },
      { url: '/icon-512.png?v=4', type: 'image/png', sizes: '512x512' },
    ],
    apple: '/apple-touch-icon.png?v=4',
  },
  manifest: '/manifest.webmanifest',
  openGraph: {
    type: 'website',
    url: SITE,
    siteName: 'DNI Studios',
    locale: 'en_GB',
    title: 'DNI Studios — Run your PT studio from one place',
    description: DESCRIPTION,
    images: [{ url: '/og-image.png?v=4', width: 1200, height: 630, alt: 'DNI Studios: run your PT studio from one place' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DNI Studios — Run your PT studio from one place',
    description: DESCRIPTION,
    images: ['/og-image.png?v=4'],
  },
  robots: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  other: { 'theme-color': '#111318' },
}

// Structured data: tells Google the site's name (shown instead of the domain),
// who runs it, its logo, and what the product is.
const JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${SITE}/#website`,
      url: SITE,
      name: 'DNI Studios',
      alternateName: ['DNI Studio', 'DNI Studios PT Software'],
      publisher: { '@id': `${SITE}/#organization` },
      inLanguage: 'en-GB',
    },
    {
      '@type': 'Organization',
      '@id': `${SITE}/#organization`,
      name: 'DNI Studios',
      legalName: 'DNI Ltd',
      url: SITE,
      logo: { '@type': 'ImageObject', url: `${SITE}/icon-512.png`, width: 512, height: 512 },
      image: `${SITE}/og-image.png`,
      description: 'DNI Studios is studio management software for personal trainers, made by DNI Ltd (trading as DNI Analytics).',
    },
    {
      '@type': 'SoftwareApplication',
      name: 'DNI Studios',
      url: SITE,
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web, iOS, Android',
      description: DESCRIPTION,
      publisher: { '@id': `${SITE}/#organization` },
      offers: {
        '@type': 'AggregateOffer',
        priceCurrency: 'GBP',
        lowPrice: '49',
        highPrice: '69',
        offerCount: 3,
        url: `${SITE}/pricing`,
      },
    },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`scroll-smooth ${inter.variable} ${mono.variable}`}>
      <body className="antialiased">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
        {children}
      </body>
    </html>
  )
}
