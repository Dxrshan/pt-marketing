import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

// Self-hosted at build time: no render-blocking request chain to Google Fonts.
const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'DNI Studios — The Command Centre for Elite Personal Trainers',
  description: 'Manage clients, log sessions in real time, track payments, and grow your training business — all in one professional platform built for PTs.',
  keywords: 'personal trainer software, PT management app, fitness business software, client management personal trainer',
  metadataBase: new URL('https://www.dnianalytics.com'),
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon-32.png', type: 'image/png', sizes: '32x32' },
    ],
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: 'DNI Studios — Built for Elite Personal Trainers',
    description: 'Stop juggling WhatsApp, spreadsheets, and sticky notes. DNI Studios is the all-in-one platform for serious PTs.',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'DNI Studios' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og-image.png'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`scroll-smooth ${inter.variable}`}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
