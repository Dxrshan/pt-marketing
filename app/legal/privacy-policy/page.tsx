import type { Metadata } from 'next'
import LegalPage from '@/components/LegalPage'
import PrivacyPolicyContent from '@/components/legal/PrivacyPolicyContent'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How DNI Studios (DNI Ltd) collects, uses and protects personal data.',
  alternates: { canonical: '/legal/privacy-policy' },
  // Keep legal pages out of Google results (and its sitelinks); links still work.
  robots: { index: false, follow: true },
}

export default function Page() {
  return (
    <LegalPage title="Privacy Policy" updated="18 October 2026" current="/legal/privacy-policy">
      <PrivacyPolicyContent />
    </LegalPage>
  )
}
