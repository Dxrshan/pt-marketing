import type { Metadata } from 'next'
import LegalPage from '@/components/LegalPage'
import TermsOfServiceContent from '@/components/legal/TermsOfServiceContent'

export const metadata: Metadata = {
  title: 'Terms of Service — DNI Studio',
  description: 'The Terms of Service for DNI Studio, a product of DNI Analytics Ltd.',
}

export default function Page() {
  return (
    <LegalPage title="Terms of Service" updated="12 September 2026" current="/legal/terms-of-service">
      <TermsOfServiceContent />
    </LegalPage>
  )
}
