import type { Metadata } from 'next'
import { Fraunces } from 'next/font/google'

// Display serif for the offer page only; the rest of the site keeps Inter.
const display = Fraunces({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  axes: ['opsz'],
  display: 'swap',
  variable: '--font-display',
})

export const metadata: Metadata = {
  title: 'Proposal',
  description: 'DNI Studios pricing for PT studios: monthly, quarterly or annual plans from £59/month, with free onboarding and setup for founding studios.',
  alternates: { canonical: '/offer' },
  // This is the editable invoice used on sales calls; the public pricing page is /pricing.
  robots: { index: false, follow: true },
  openGraph: {
    title: 'DNI Studios Pricing & Founding Offer', url: '/offer', siteName: 'DNI Studios', type: 'website', locale: 'en_GB',
    images: [{ url: '/og-image.png?v=4', width: 1200, height: 630, alt: 'DNI Studios' }],
  },
}

export default function OfferLayout({ children }: { children: React.ReactNode }) {
  return <div className={display.variable}>{children}</div>
}
