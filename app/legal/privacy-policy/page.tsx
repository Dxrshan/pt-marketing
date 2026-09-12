import type { Metadata } from 'next'
import LegalPage from '@/components/LegalPage'

export const metadata: Metadata = {
  title: 'Privacy Policy — DNI Studio',
  description: 'The Privacy Policy for DNI Studio, a product of DNI Analytics Ltd.',
  robots: { index: true, follow: true },
}

export default function Page() {
  return <LegalPage title="Privacy Policy" policy="privacy" current="/legal/privacy-policy" />
}
