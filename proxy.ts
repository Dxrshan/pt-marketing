import { NextResponse, type NextRequest } from 'next/server'
import { ADMIN_COOKIE, verifyOwnerToken } from './lib/adminAuth'

// First gate for the proposal page: no valid owner session, no page (redirect to the
// sign-in). The page itself checks again on the server, so this can't be skipped.
export async function proxy(req: NextRequest) {
  const user = await verifyOwnerToken(req.cookies.get(ADMIN_COOKIE)?.value)
  if (!user) {
    const url = req.nextUrl.clone()
    url.pathname = '/offer/login'
    url.search = ''
    const res = NextResponse.redirect(url)
    res.cookies.delete(ADMIN_COOKIE)
    return res
  }
  const res = NextResponse.next()
  res.headers.set('Cache-Control', 'private, no-store')
  return res
}

// /offer and anything under it, except the sign-in page itself.
export const config = { matcher: ['/offer', '/offer/((?!login$).*)'] }
