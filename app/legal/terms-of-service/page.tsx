import type { Metadata } from 'next'
import LegalPage from '@/components/LegalPage'

export const metadata: Metadata = {
  title: 'Terms of Service — DNI Studio',
  description: 'The Terms of Service for DNI Studio, a product of DNI Analytics Ltd.',
  robots: { index: true, follow: true },
}

export default function Page() {
  return <LegalPage title="Terms of Service" policy="terms" current="/legal/terms-of-service" />
}
