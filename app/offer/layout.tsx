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
  title: 'Founding Offer — DNI Studio',
  description: 'Your DNI Studio founding quote: choose a plan, review what is included, and lock in your rate.',
}

export default function OfferLayout({ children }: { children: React.ReactNode }) {
  return <div className={display.variable}>{children}</div>
}
