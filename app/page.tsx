import Nav from '@/components/Nav'
import { CineHero, ProductReveal, Statement, FeatureGallery, BigNumbers } from '@/components/Cinematic'
import PricingSection from '@/components/PricingSection'
import EmailCaptureSection from '@/components/EmailCaptureSection'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main style={{ background: '#050607' }}>
      <Nav />
      <CineHero />
      <ProductReveal />
      <Statement />
      <FeatureGallery />
      <BigNumbers />
      <PricingSection />
      <EmailCaptureSection />
      <Footer />
    </main>
  )
}
