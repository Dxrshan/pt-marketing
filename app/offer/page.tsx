import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { ADMIN_COOKIE, verifyOwnerToken } from '@/lib/adminAuth'
import OfferClient, { type BankDetails } from './OfferClient'

// Rendered on the server for every request, after checking the owner session again
// (the proxy checks first; this check means the page can never be served without it).
// Bank details live here, on the server, so they are never in the site's public JS.
export const dynamic = 'force-dynamic'

const BANK: BankDetails = {
  bankName: process.env.OFFER_BANK_NAME || 'Monzo Business',
  sortCode: process.env.OFFER_BANK_SORT_CODE || '04-00-03',
  accountNumber: process.env.OFFER_BANK_ACCOUNT_NUMBER || '98336645',
  accountName: process.env.OFFER_BANK_ACCOUNT_NAME || 'DNI LTD',
}

export default async function OfferPage() {
  const token = (await cookies()).get(ADMIN_COOKIE)?.value
  const owner = await verifyOwnerToken(token)
  if (!owner) redirect('/offer/login')
  return <OfferClient bank={BANK} />
}
