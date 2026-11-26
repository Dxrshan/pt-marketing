import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

// dnianalytics.com is verified in Resend, so send from it directly — the
// shared onboarding@resend.dev sender only delivers to the Resend account's
// own signup email, which silently blocked every notify email to
// darshan.mashru@dnianalytics.com until now.
const FROM = 'DNI Studios <hello@dnianalytics.com>'

// Table-based layout (not flex/grid) — the only structure that survives
// Outlook desktop's Word rendering engine as well as Gmail/Apple Mail.
// Every color has a plain fallback declared before any gradient, since
// gradients silently no-op in clients that don't support them.
const emailShell = (bodyHtml: string) => `
<div style="background:#0a0a12;padding:40px 20px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;margin:0 auto;">
    <tr>
      <td style="padding-bottom:28px;">
        <table role="presentation" cellpadding="0" cellspacing="0" align="center" style="margin:0 auto;">
          <tr>
            <td align="center"><img src="https://www.dnianalytics.com/email-logo.png?v=1" width="220" alt="DNI Studios" style="display:block;width:220px;height:auto;border:0;outline:none;text-decoration:none;" /></td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="background:#12121e;border:1px solid #232336;border-radius:20px;">
        ${bodyHtml}
      </td>
    </tr>
    <tr>
      <td style="padding-top:24px;text-align:center;">
        <p style="margin:0;font-size:12.5px;color:#5f5f75;">DNI Ltd, trading as DNI Analytics · Company No. 15630271 · <a href="https://dnianalytics.com" style="color:#7c8cff;text-decoration:none;">dnianalytics.com</a></p>
      </td>
    </tr>
  </table>
</div>`

export async function POST(req: NextRequest) {
  try {
    const { email, name, type, source } = await req.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 })
    }

    // Created per request, not at module load: the Resend constructor throws
    // without a key, and Next evaluates this module at build time, so a build
    // without RESEND_API_KEY (e.g. Vercel previews) would fail outright.
    const resend = new Resend(process.env.RESEND_API_KEY)

    const cleanEmail = email.toLowerCase().trim()
    const firstName = (name || '').trim()

    // Tells you a signup happened. Errors are logged (not swallowed) so a
    // failure actually shows up in Vercel's logs instead of vanishing silently.
    const notify = await resend.emails.send({
      from:    FROM,
      to:      'darshan.mashru@dnianalytics.com',
      subject: `New demo request: ${cleanEmail}`,
      html: emailShell(`
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          <tr><td style="padding:32px 32px 20px;text-align:center;">
            <div style="font-size:34px;margin-bottom:12px;">🎉</div>
            <div style="font-size:20px;font-weight:800;color:#ffffff;letter-spacing:-0.4px;">New demo request</div>
            <div style="font-size:13.5px;color:#8b8ba3;margin-top:4px;">Someone wants a demo. Reply within 24 hours.</div>
          </td></tr>
          <tr><td style="padding:0 24px 24px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#191927;border-radius:14px;overflow:hidden;">
              ${[
                ['Name', firstName || '—'],
                ['Email', cleanEmail],
                ['Type', type === 'studio' ? '🏢 Studio / Gym' : '👤 Solo Trainer'],
                ['Source', source || 'homepage'],
              ].map(([label, val], i, arr) => `
              <tr>
                <td style="padding:13px 18px;font-size:12px;color:#7a7a92;text-transform:uppercase;letter-spacing:0.05em;${i < arr.length - 1 ? 'border-bottom:1px solid #232336;' : ''}">${label}</td>
                <td style="padding:13px 18px;font-size:14px;font-weight:700;color:#ffffff;text-align:right;${i < arr.length - 1 ? 'border-bottom:1px solid #232336;' : ''}">${val}</td>
              </tr>`).join('')}
            </table>
          </td></tr>
          <tr><td style="padding:0 32px 28px;text-align:center;">
            <p style="margin:0;font-size:12px;color:#5f5f75;">${new Date().toLocaleString('en-GB', { timeZone: 'Europe/London' })}</p>
          </td></tr>
        </table>
      `),
    })
    if (notify.error) console.error('Waitlist notify email failed:', notify.error)

    // Confirms it to the person who actually signed up — didn't exist before.
    const confirm = await resend.emails.send({
      from:    FROM,
      to:      cleanEmail,
      subject: `Your DNI Studios demo${firstName ? `, ${firstName}` : ''}`,
      html: emailShell(`
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          <tr><td style="padding:40px 32px 8px;text-align:center;">
            <div style="font-size:42px;margin-bottom:14px;">🎉</div>
            <div style="font-size:24px;font-weight:800;color:#ffffff;letter-spacing:-0.5px;">You're in${firstName ? `, ${firstName}` : ''}!</div>
          </td></tr>
          <tr><td style="padding:14px 32px 0;text-align:center;">
            <p style="margin:0 0 12px;font-size:15px;line-height:1.7;color:#a3a3b8;">Thanks for booking a <span style="color:#c7d2fe;font-weight:700;">DNI Studios</span> demo.</p>
            <p style="margin:0;font-size:15px;line-height:1.7;color:#a3a3b8;">I'll be in touch within 24 hours to find a time that suits you.</p>
          </td></tr>
          <tr><td style="padding:28px 32px 8px;text-align:center;">
            <table role="presentation" cellpadding="0" cellspacing="0" align="center" style="margin:0 auto;">
              <tr><td style="border-radius:12px;background:#e9ecef;background:linear-gradient(180deg,#ffffff,#c9ced5);">
                <a href="https://app.dnianalytics.com" style="display:inline-block;padding:14px 32px;font-size:15px;font-weight:700;color:#0b0c0f;text-decoration:none;">Try DNI Studios →</a>
              </td></tr>
            </table>
          </td></tr>
          <tr><td style="padding:16px 32px 36px;text-align:center;">
            <p style="margin:0 0 20px;font-size:12.5px;color:#5f5f75;">The app's already live — no need to wait.</p>
            <p style="margin:0;font-size:13px;color:#8b8ba3;">— Darshan, founder of DNI Studios</p>
          </td></tr>
        </table>
      `),
    })
    if (confirm.error) console.error('Waitlist confirm email failed:', confirm.error)

    // Only report failure if the notify email (the one that tells you a lead
    // exists) failed — that's the one that actually matters if it breaks.
    if (notify.error) {
      return NextResponse.json({ success: false, error: 'Failed to process signup' }, { status: 500 })
    }
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Waitlist error:', err)
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 })
  }
}
