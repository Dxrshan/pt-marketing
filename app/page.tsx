import Nav from '@/components/Nav'
import { CineHero, ProductReveal, Statement, FeatureGallery, BigNumbers } from '@/components/Cinematic'
import { SmoothScroll, Cursor, Magnetic, WordBand } from '@/components/Polish'
import PricingSection from '@/components/PricingSection'
import EmailCaptureSection from '@/components/EmailCaptureSection'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main style={{ background: '#050607' }}>
      <SmoothScroll />
      <Cursor />
      <Magnetic />
      <Nav />
      <CineHero />
      <ProductReveal />
      <Statement />
      <WordBand words={['Schedule', 'Track', 'Get paid', 'Grow']} />
      <FeatureGallery />
      <BigNumbers />
      <WordBand words={['Built for PTs', 'Made in the UK', 'No per-seat fees']} reverse />
      <PricingSection />
      <EmailCaptureSection />
      <Footer />
    </main>
  )
}
