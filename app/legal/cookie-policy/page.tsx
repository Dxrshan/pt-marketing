import type { Metadata } from 'next'
import LegalPage from '@/components/LegalPage'

export const metadata: Metadata = {
  title: 'Cookie Policy — DNI Studio',
  description: 'The Cookie Policy for DNI Studio, a product of DNI Analytics Ltd.',
  robots: { index: true, follow: true },
}

export default function Page() {
  return <LegalPage title="Cookie Policy" policy="cookies" current="/legal/cookie-policy" />
}
