import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const { email, source } = await req.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 })
    }

    await resend.emails.send({
      from:    'DNI Studio <onboarding@resend.dev>',
      to:      'darshan.mashru@dnianalytics.co.uk',
      subject: `New early access signup: ${email.toLowerCase().trim()}`,
      html: `
        <div style="font-family:sans-serif;max-width:480px;padding:24px;background:#f9f9f9;border-radius:8px;">
          <h2 style="margin:0 0 8px;color:#111;">New early access signup 🎉</h2>
          <p style="color:#555;margin:0 0 20px;">Someone just signed up on dnianalytics.com</p>
          <table style="border-collapse:collapse;width:100%;background:white;border-radius:6px;padding:16px;">
            <tr><td style="padding:10px 16px;color:#999;font-size:13px;border-bottom:1px solid #f0f0f0">Email</td><td style="padding:10px 16px;font-weight:700;color:#111;border-bottom:1px solid #f0f0f0">${email.toLowerCase().trim()}</td></tr>
            <tr><td style="padding:10px 16px;color:#999;font-size:13px;">Source</td><td style="padding:10px 16px;font-weight:600;color:#111;">${source || 'homepage'}</td></tr>
          </table>
          <p style="margin:16px 0 0;font-size:12px;color:#aaa;">${new Date().toLocaleString('en-GB', { timeZone: 'Europe/London' })}</p>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Waitlist error:', err)
    return NextResponse.json({ success: true })
  }
}
