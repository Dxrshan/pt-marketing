import type { Metadata } from 'next'
import LegalPage from '@/components/LegalPage'
import PrivacyPolicyContent from '@/components/legal/PrivacyPolicyContent'

export const metadata: Metadata = {
  title: 'Privacy Policy — DNI Studios',
  description: 'The Privacy Policy for DNI Studios, a product of DNI Ltd (trading as DNI Analytics).',
}

export default function Page() {
  return (
    <LegalPage title="Privacy Policy" updated="18 October 2026" current="/legal/privacy-policy">
      <PrivacyPolicyContent />
    </LegalPage>
  )
}
