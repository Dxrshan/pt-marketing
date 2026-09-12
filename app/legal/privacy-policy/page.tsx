import type { Metadata } from 'next'
import LegalPage from '@/components/LegalPage'
import PrivacyPolicyContent from '@/components/legal/PrivacyPolicyContent'

export const metadata: Metadata = {
  title: 'Privacy Policy — DNI Studio',
  description: 'The Privacy Policy for DNI Studio, a product of DNI Analytics Ltd.',
}

export default function Page() {
  return (
    <LegalPage title="Privacy Policy" updated="12 September 2026" current="/legal/privacy-policy">
      <PrivacyPolicyContent />
    </LegalPage>
  )
}
