import type { Metadata } from 'next'
import Nav from '@/components/Nav'
import PageIntro from '@/components/PageIntro'
import PricingSection from '@/components/PricingSection'
import PricingFaq from '@/components/PricingFaq'
import EmailCaptureSection from '@/components/EmailCaptureSection'
import Footer from '@/components/Footer'
import BreadcrumbJsonLd from '@/components/BreadcrumbJsonLd'

export const metadata: Metadata = {
  title: 'Personal Trainer Software Pricing & Plans',
  description: 'Simple pricing for PT studios: one plan with every feature, from £49/month. Unlimited trainers and clients, 30-day money-back guarantee, no setup fees for founding studios.',
  alternates: { canonical: '/pricing' },
  openGraph: {
    title: 'DNI Studios Pricing: one plan, everything included', url: '/pricing', siteName: 'DNI Studios', type: 'website', locale: 'en_GB',
    images: [{ url: '/og-image.png?v=4', width: 1200, height: 630, alt: 'DNI Studios' }],
  },
}

export default function PricingPage() {
  return (
    <main>
      <BreadcrumbJsonLd name="Pricing" path="/pricing" />
      <Nav />
      <PageIntro
        crumb="Pricing"
        title="Simple pricing for"
        accent="PT studios."
        intro="One plan with every feature. Unlimited trainers and clients, and no per-seat fees."
      />
      <div style={{ marginTop: -110 }}><PricingSection bare /></div>
      <PricingFaq />
      <EmailCaptureSection />
      <Footer />
    </main>
  )
}
