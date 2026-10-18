import type { Metadata } from 'next'
import LegalPage from '@/components/LegalPage'
import CookiePolicyContent from '@/components/legal/CookiePolicyContent'

export const metadata: Metadata = {
  title: 'Cookie Policy — DNI Studios',
  description: 'The Cookie Policy for DNI Studios, a product of DNI Ltd (trading as DNI Analytics).',
}

export default function Page() {
  return (
    <LegalPage title="Cookie Policy" updated="18 October 2026" current="/legal/cookie-policy">
      <CookiePolicyContent />
    </LegalPage>
  )
}
