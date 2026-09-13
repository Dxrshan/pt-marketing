import type { Metadata } from 'next'
import LegalPage from '@/components/LegalPage'
import DpaContent from '@/components/legal/DpaContent'

export const metadata: Metadata = {
  title: 'Data Processing Agreement — DNI Studio',
  description: 'The Article 28 UK GDPR data processing agreement between DNI Analytics Ltd and studios using DNI Studio.',
}

export default function Page() {
  return (
    <LegalPage title="Data Processing Agreement" updated="13 September 2026" current="/legal/dpa">
      <DpaContent />
    </LegalPage>
  )
}
