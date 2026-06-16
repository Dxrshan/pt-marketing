import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'PT Manager — The Command Centre for Elite Personal Trainers',
  description: 'Manage clients, log sessions in real time, track payments, and grow your training business — all in one professional platform built for PTs.',
  keywords: 'personal trainer software, PT management app, fitness business software, client management personal trainer',
  openGraph: {
    title: 'PT Manager — Built for Elite Personal Trainers',
    description: 'Stop juggling WhatsApp, spreadsheets, and sticky notes. PT Manager is the all-in-one platform for serious PTs.',
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
