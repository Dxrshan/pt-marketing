import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
// dnianalytics.com is verified in Resend, so send from it directly — the
// shared onboarding@resend.dev sender only delivers to the Resend account's
// own signup email, which silently blocked every notify email to
// darshan.mashru@dnianalytics.com until now.
const FROM = 'DNI Studio <hello@dnianalytics.com>'

export async function POST(req: NextRequest) {
  try {
    const { email, name, type, source } = await req.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 })
    }

    const cleanEmail = email.toLowerCase().trim()
    const firstName = (name || '').trim()

    // Tells you a signup happened. Errors are logged (not swallowed) so a
    // failure actually shows up in Vercel's logs instead of vanishing silently.
    const notify = await resend.emails.send({
      from:    FROM,
      to:      'darshan.mashru@dnianalytics.com',
      subject: `New early access signup: ${cleanEmail}`,
      html: `
        <div style="font-family:sans-serif;max-width:480px;padding:24px;background:#f9f9f9;border-radius:8px;">
          <h2 style="margin:0 0 8px;color:#111;">New early access signup 🎉</h2>
          <p style="color:#555;margin:0 0 20px;">Someone just signed up on dnianalytics.com</p>
          <table style="border-collapse:collapse;width:100%;background:white;border-radius:6px;padding:16px;">
            <tr><td style="padding:10px 16px;color:#999;font-size:13px;border-bottom:1px solid #f0f0f0">Name</td><td style="padding:10px 16px;font-weight:700;color:#111;border-bottom:1px solid #f0f0f0">${firstName || '—'}</td></tr>
            <tr><td style="padding:10px 16px;color:#999;font-size:13px;border-bottom:1px solid #f0f0f0">Email</td><td style="padding:10px 16px;font-weight:700;color:#111;border-bottom:1px solid #f0f0f0">${cleanEmail}</td></tr>
            <tr><td style="padding:10px 16px;color:#999;font-size:13px;border-bottom:1px solid #f0f0f0">Type</td><td style="padding:10px 16px;font-weight:600;color:#111;border-bottom:1px solid #f0f0f0">${type === 'studio' ? 'Studio / Gym' : 'Solo Trainer'}</td></tr>
            <tr><td style="padding:10px 16px;color:#999;font-size:13px;">Source</td><td style="padding:10px 16px;font-weight:600;color:#111;">${source || 'homepage'}</td></tr>
          </table>
          <p style="margin:16px 0 0;font-size:12px;color:#aaa;">${new Date().toLocaleString('en-GB', { timeZone: 'Europe/London' })}</p>
        </div>
      `,
    })
    if (notify.error) console.error('Waitlist notify email failed:', notify.error)

    // Confirms it to the person who actually signed up — didn't exist before.
    const confirm = await resend.emails.send({
      from:    FROM,
      to:      cleanEmail,
      subject: `You're on the list${firstName ? `, ${firstName}` : ''}! 🎉`,
      html: `
        <div style="font-family:sans-serif;max-width:480px;padding:24px;background:#f9f9f9;border-radius:8px;">
          <h2 style="margin:0 0 8px;color:#111;">You're in${firstName ? `, ${firstName}` : ''}! 🎉</h2>
          <p style="color:#555;line-height:1.6;">Thanks for joining the DNI Studio founding members list. Your founding member pricing is locked in, and we'll be in touch soon with your early access details.</p>
          <p style="color:#555;line-height:1.6;">The app's already live — <a href="https://app.dnianalytics.com" style="color:#5b7bff;">try it here</a>.</p>
          <p style="color:#999;font-size:13px;margin-top:24px;">— Darshan, founder of DNI Studio</p>
        </div>
      `,
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
