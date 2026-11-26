import { NextRequest, NextResponse } from 'next/server'
import { ADMIN_COOKIE, ADMIN_COOKIE_MAX_AGE, loginOwner } from '@/lib/adminAuth'

// Same-origin only: a form on another site can't sign anyone in or out here.
function sameOrigin(req: NextRequest) {
  const origin = req.headers.get('origin')
  return !!origin && origin === req.nextUrl.origin
}

const noStore = { 'Cache-Control': 'no-store' }

// Sign in with the app account. On success the session goes into an HttpOnly cookie;
// the token itself is never returned to the browser.
export async function POST(req: NextRequest) {
  if (!sameOrigin(req)) return NextResponse.json({ error: 'Forbidden' }, { status: 403, headers: noStore })
  const body = await req.json().catch(() => null)
  const email = typeof body?.email === 'string' ? body.email.trim().slice(0, 254) : ''
  const password = typeof body?.password === 'string' ? body.password.slice(0, 200) : ''
  const accountId = typeof body?.accountId === 'string' ? body.accountId.slice(0, 64) : undefined
  if (!email || !password) return NextResponse.json({ error: 'Email and password required' }, { status: 400, headers: noStore })

  const result = await loginOwner(email, password, accountId)
  if (!result.ok) {
    return NextResponse.json({ error: result.error, ...(result.chooseAccount ? { chooseAccount: result.chooseAccount } : {}) }, { status: result.status, headers: noStore })
  }
  const res = NextResponse.json({ ok: true }, { headers: noStore })
  res.cookies.set(ADMIN_COOKIE, result.token, {
    httpOnly: true, secure: true, sameSite: 'strict', path: '/', maxAge: ADMIN_COOKIE_MAX_AGE,
  })
  return res
}

// Sign out.
export async function DELETE(req: NextRequest) {
  if (!sameOrigin(req)) return NextResponse.json({ error: 'Forbidden' }, { status: 403, headers: noStore })
  const res = NextResponse.json({ ok: true }, { headers: noStore })
  res.cookies.set(ADMIN_COOKIE, '', { httpOnly: true, secure: true, sameSite: 'strict', path: '/', maxAge: 0 })
  return res
}
