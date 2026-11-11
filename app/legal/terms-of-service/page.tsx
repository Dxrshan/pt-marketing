import type { Metadata } from 'next'
import LegalPage from '@/components/LegalPage'
import TermsOfServiceContent from '@/components/legal/TermsOfServiceContent'

export const metadata: Metadata = {
  title: 'Terms of Service — DNI Studios',
  description: 'The Terms of Service for DNI Studios, a product of DNI Ltd (trading as DNI Analytics).',
}

export default function Page() {
  return (
    <LegalPage title="Terms of Service" updated="19 October 2026" current="/legal/terms-of-service">
      <TermsOfServiceContent />
    </LegalPage>
  )
}
