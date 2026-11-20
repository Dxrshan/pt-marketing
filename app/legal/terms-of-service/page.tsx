import type { Metadata } from 'next'
import LegalPage from '@/components/LegalPage'
import TermsOfServiceContent from '@/components/legal/TermsOfServiceContent'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'The terms that govern use of the DNI Studios platform, provided by DNI Ltd.',
  alternates: { canonical: '/legal/terms-of-service' },
  // Keep legal pages out of Google results (and its sitelinks); links still work.
  robots: { index: false, follow: true },
}

export default function Page() {
  return (
    <LegalPage title="Terms of Service" updated="18 October 2026" current="/legal/terms-of-service">
      <TermsOfServiceContent />
    </LegalPage>
  )
}
