'use client'
import { useEffect } from 'react'
import { TERMLY_EMBED_SCRIPT, TERMLY_POLICY_IDS, type TermlyPolicy } from '@/lib/termly'

/**
 * Renders a Termly-hosted policy. Termly's script finds the div by its
 * `name="termly-embed"` attribute and swaps it for an iframe from app.termly.io.
 *
 * The script is injected on mount and torn down on unmount: it only does its
 * swap once per load, so on a client-side route change back to a legal page a
 * script left in the document would never fire again and the div would sit empty.
 */
export default function TermlyEmbed({ policy }: { policy: TermlyPolicy }) {
  const dataId = TERMLY_POLICY_IDS[policy]

  useEffect(() => {
    if (!dataId) return
    const script = document.createElement('script')
    script.src = TERMLY_EMBED_SCRIPT
    script.async = true
    document.body.appendChild(script)
    return () => { script.remove() }
  }, [dataId])

  if (!dataId) {
    return (
      <div style={{
        padding: '28px 24px', borderRadius: 'var(--radius)',
        background: 'var(--card)', border: '1px solid var(--card-border)',
        color: 'var(--text-muted)', fontSize: 15, lineHeight: 1.7,
      }}>
        This document is being finalised and will be published here shortly. In
        the meantime, email{' '}
        <a href="mailto:darshan.mashru@dnianalytics.com" style={{ color: 'var(--accent-light)' }}>
          darshan.mashru@dnianalytics.com
        </a>{' '}
        with any questions.
      </div>
    )
  }

  // `name` isn't in React's typings for <div>, but Termly's script keys off it.
  const embedProps = { name: 'termly-embed', 'data-id': dataId } as React.HTMLAttributes<HTMLDivElement>
  return <div {...embedProps} />
}
