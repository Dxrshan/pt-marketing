import type { Metadata } from 'next'
import LegalPage from '@/components/LegalPage'
import CookiePolicyContent from '@/components/legal/CookiePolicyContent'

export const metadata: Metadata = {
  title: 'Cookie Policy',
  description: 'Which cookies DNI Studios uses and how to control them.',
  alternates: { canonical: '/legal/cookie-policy' },
  // Keep legal pages out of Google results (and its sitelinks); links still work.
  robots: { index: false, follow: true },
}

export default function Page() {
  return (
    <LegalPage title="Cookie Policy" updated="18 October 2026" current="/legal/cookie-policy">
      <CookiePolicyContent />
    </LegalPage>
  )
}
