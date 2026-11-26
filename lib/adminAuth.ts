// Server-only. Gate for the sales proposal (/offer): only the platform owner's account
// in the DNI Studios app may open it. Nothing here is ever sent to the browser.
//
// How it works: you sign in at /offer/login with your normal app.dnianalytics.com
// login. This site checks those credentials against the app's own API (bcrypt,
// brute-force throttling and session revocation all live there), then keeps the app's
// session token in an HttpOnly, Secure, SameSite=Strict cookie that page scripts can't
// read. Every request to /offer re-checks that token with the app, so signing out,
// changing your password or being demoted locks the page immediately.

export const ADMIN_COOKIE = '__Host-dni_admin'
export const ADMIN_COOKIE_MAX_AGE = 60 * 60 // seconds: 1 hour, then sign in again

const APP_API = (process.env.APP_API_URL || 'https://app.dnianalytics.com').replace(/\/+$/, '')
// The platform owner's studio. Studio owners who are customers are super_admins of
// their own studio, so the role alone is not enough: it must be this studio.
const OWNER_STUDIO_ID = process.env.OFFER_OWNER_STUDIO_ID || '00000000-0000-4000-8000-000000000001'

export type AppUser = { id: string; email: string; name: string; role: string; studioId: string | null }

export function isOwner(user: AppUser | null | undefined): user is AppUser {
  return !!user && user.role === 'super_admin' && user.studioId === OWNER_STUDIO_ID
}

async function appFetch(path: string, init: RequestInit = {}) {
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), 8000)
  try {
    return await fetch(`${APP_API}${path}`, { ...init, signal: ctrl.signal, cache: 'no-store' })
  } finally {
    clearTimeout(timer)
  }
}

// The signed-in owner for this session token, or null. Fails closed: any error,
// timeout or unexpected answer means "not signed in".
export async function verifyOwnerToken(token: string | undefined | null): Promise<AppUser | null> {
  if (!token || typeof token !== 'string' || token.length > 4096 || !/^[\w-]+\.[\w-]+\.[\w-]+$/.test(token)) return null
  try {
    const res = await appFetch('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } })
    if (!res.ok) return null
    const user = (await res.json()) as AppUser
    return isOwner(user) ? user : null
  } catch {
    return null
  }
}

export type LoginResult =
  | { ok: true; token: string }
  | { ok: false; status: number; error: string; chooseAccount?: { id: string; name: string; role: string; studioName: string }[] }

// Checks email + password with the app. Only the owner account gets a token back.
export async function loginOwner(email: string, password: string, accountId?: string): Promise<LoginResult> {
  let res: Response
  try {
    res = await appFetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, ...(accountId ? { accountId } : {}) }),
    })
  } catch {
    return { ok: false, status: 503, error: 'Could not reach the app. Please try again.' }
  }
  const body = await res.json().catch(() => ({}))
  if (!res.ok) return { ok: false, status: res.status === 429 ? 429 : 401, error: body.error || 'Invalid email or password' }
  if (body.chooseAccount) return { ok: false, status: 409, error: 'Choose an account', chooseAccount: body.chooseAccount }
  const token: string | undefined = body.token
  if (!token || !isOwner(body.user)) return { ok: false, status: 403, error: 'This account cannot open proposals.' }
  return { ok: true, token }
}
