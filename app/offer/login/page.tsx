'use client'

import { useState } from 'react'
import BrandLogo from '../../../components/BrandLogo'

type Account = { id: string; name: string; role: string; studioName: string }

// Sign-in for the sales proposal. Uses your DNI Studios app login; only the
// platform owner account gets in.
export default function OfferLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [accounts, setAccounts] = useState<Account[] | null>(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (accountId?: string) => {
    setBusy(true); setError('')
    try {
      const res = await fetch('/api/offer-auth', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, ...(accountId ? { accountId } : {}) }),
      })
      const body = await res.json().catch(() => ({}))
      if (res.ok) { window.location.replace('/offer'); return }
      if (res.status === 409 && body.chooseAccount) { setAccounts(body.chooseAccount); return }
      setError(body.error || 'Sign-in failed')
      setPassword('')
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <main style={S.page}>
      <form style={S.card} onSubmit={e => { e.preventDefault(); submit() }}>
        <BrandLogo height={40} />
        <h1 style={S.h1}>Proposals</h1>
        <p style={S.sub}>Sign in with your DNI Studios admin account.</p>

        {accounts ? (
          <div style={{ display: 'grid', gap: 8 }}>
            <p style={S.sub}>Which account?</p>
            {accounts.map(a => (
              <button key={a.id} type="button" style={S.choice} disabled={busy} onClick={() => submit(a.id)}>
                <strong>{a.studioName}</strong><span style={{ color: '#9aa0a8' }}> · {a.name} ({a.role.replace('_', ' ')})</span>
              </button>
            ))}
            <button type="button" style={S.link} onClick={() => setAccounts(null)}>Back</button>
          </div>
        ) : (
          <>
            <label style={S.label} htmlFor="ol-email">Email</label>
            <input id="ol-email" style={S.input} type="email" autoComplete="username" required value={email} onChange={e => setEmail(e.target.value)} />
            <label style={S.label} htmlFor="ol-pass">Password</label>
            <input id="ol-pass" style={S.input} type="password" autoComplete="current-password" required value={password} onChange={e => setPassword(e.target.value)} />
            <button type="submit" style={{ ...S.btn, opacity: busy ? 0.6 : 1 }} disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
          </>
        )}
        {error && <p role="alert" style={S.err}>{error}</p>}
      </form>
    </main>
  )
}

const S: Record<string, React.CSSProperties> = {
  page: { minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#0b0b10', padding: 16, fontFamily: 'Inter, -apple-system, Segoe UI, sans-serif' },
  card: { width: '100%', maxWidth: 380, background: '#14141c', border: '1px solid #262633', borderRadius: 18, padding: 28, display: 'grid', gap: 10, color: '#eef0f2' },
  h1: { fontSize: 22, margin: '14px 0 0', fontWeight: 700 },
  sub: { fontSize: 14, color: '#9aa0a8', margin: '0 0 6px' },
  label: { fontSize: 13, color: '#c9cdd3', marginTop: 4 },
  input: { background: '#0e0e14', border: '1px solid #2c2c3a', borderRadius: 10, padding: '11px 12px', color: '#fff', fontSize: 15, outline: 'none' },
  btn: { marginTop: 10, background: '#f1f3f5', color: '#111318', border: 'none', borderRadius: 10, padding: '12px 14px', fontSize: 15, fontWeight: 700, cursor: 'pointer' },
  choice: { textAlign: 'left', background: '#0e0e14', border: '1px solid #2c2c3a', borderRadius: 10, padding: '11px 12px', color: '#fff', fontSize: 14, cursor: 'pointer' },
  link: { background: 'none', border: 'none', color: '#9aa0a8', fontSize: 13, cursor: 'pointer', justifySelf: 'start', padding: 0 },
  err: { color: '#ff8a8a', fontSize: 13.5, margin: '4px 0 0' },
}
