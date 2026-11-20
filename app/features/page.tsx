import type { Metadata } from 'next'
import Nav from '@/components/Nav'
import PageIntro from '@/components/PageIntro'
import FeaturesSection from '@/components/FeaturesSection'
import HowItWorks from '@/components/HowItWorks'
import EmailCaptureSection from '@/components/EmailCaptureSection'
import Footer from '@/components/Footer'
import BreadcrumbJsonLd from '@/components/BreadcrumbJsonLd'

export const metadata: Metadata = {
  title: 'Personal Trainer Software Features',
  description: 'Scheduling, client progress tracking, a client app, payments and invoicing, a lead pipeline and team permissions: every DNI Studios feature, included on every plan.',
  alternates: { canonical: '/features' },
  openGraph: {
    title: 'DNI Studios Features: everything a PT studio needs', url: '/features', siteName: 'DNI Studios', type: 'website', locale: 'en_GB',
    images: [{ url: '/og-image.png?v=4', width: 1200, height: 630, alt: 'DNI Studios' }],
  },
}

export default function FeaturesPage() {
  return (
    <main>
      <BreadcrumbJsonLd name="Features" path="/features" />
      <Nav />
      <PageIntro
        crumb="Features"
        title="Personal trainer software,"
        accent="built for studios."
        intro="Bookings, client progress, payments and leads in one place, so you can stop juggling WhatsApp, spreadsheets and five different apps."
      />
      <div style={{ marginTop: -80 }}><FeaturesSection /></div>
      <HowItWorks />
      <EmailCaptureSection />
      <Footer />
    </main>
  )
}
