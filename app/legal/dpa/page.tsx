import type { Metadata } from 'next'
import LegalPage from '@/components/LegalPage'
import DpaContent from '@/components/legal/DpaContent'

export const metadata: Metadata = {
  title: 'Data Processing Agreement',
  description: 'The data processing agreement between DNI Ltd and studios using DNI Studios.',
  alternates: { canonical: '/legal/dpa' },
  // Keep legal pages out of Google results (and its sitelinks); links still work.
  robots: { index: false, follow: true },
}

export default function Page() {
  return (
    <LegalPage title="Data Processing Agreement" updated="21 November 2026" current="/legal/dpa">
      <DpaContent />
    </LegalPage>
  )
}
