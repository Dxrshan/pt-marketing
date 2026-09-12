import type { Metadata } from 'next'
import LegalPage from '@/components/LegalPage'
import CookiePolicyContent from '@/components/legal/CookiePolicyContent'

export const metadata: Metadata = {
  title: 'Cookie Policy — DNI Studio',
  description: 'The Cookie Policy for DNI Studio, a product of DNI Analytics Ltd.',
}

export default function Page() {
  return (
    <LegalPage title="Cookie Policy" updated="12 September 2026" current="/legal/cookie-policy">
      <CookiePolicyContent />
    </LegalPage>
  )
}
