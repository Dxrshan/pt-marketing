import type { Metadata } from 'next'
import LegalPage from '@/components/LegalPage'
import DpaContent from '@/components/legal/DpaContent'

export const metadata: Metadata = {
  title: 'Data Processing Agreement — DNI Studios',
  description: 'The Article 28 UK GDPR data processing agreement between DNI Ltd (trading as DNI Analytics) and studios using DNI Studios.',
}

export default function Page() {
  return (
    <LegalPage title="Data Processing Agreement" updated="18 October 2026" current="/legal/dpa">
      <DpaContent />
    </LegalPage>
  )
}
