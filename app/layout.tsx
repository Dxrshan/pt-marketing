import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'DNI Studio — The Command Centre for Elite Personal Trainers',
  description: 'Manage clients, log sessions in real time, track payments, and grow your training business — all in one professional platform built for PTs.',
  keywords: 'personal trainer software, PT management app, fitness business software, client management personal trainer',
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:%232563EB;stop-opacity:1" /><stop offset="100%" style="stop-color:%2306B6D4;stop-opacity:1" /></linearGradient></defs><rect width="32" height="32" rx="6" fill="url(%23g)"/><path d="M16 4L10 16h6l-1 8 10-12h-9l1-8z" fill="white"/></svg>',
  },
  openGraph: {
    title: 'DNI Studio — Built for Elite Personal Trainers',
    description: 'Stop juggling WhatsApp, spreadsheets, and sticky notes. DNI Studio is the all-in-one platform for serious PTs.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
