import { NextRequest, NextResponse } from 'next/server'
import { MongoClient } from 'mongodb'
import { Resend } from 'resend'

const uri    = process.env.MONGODB_URI    || ''
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, name, type, source } = body

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 })
    }

    const cleanEmail = email.toLowerCase().trim()

    // ── Save to MongoDB ───────────────────────────────────────────
    if (uri) {
      const client = new MongoClient(uri)
      await client.connect()
      const db = client.db('ptmanager')
      await db.collection('waitlist').updateOne(
        { email: cleanEmail },
        {
          $set:         { email: cleanEmail, name: name || '', type: type || 'solo', source: source || 'unknown', updatedAt: new Date() },
          $setOnInsert: { createdAt: new Date() },
        },
        { upsert: true }
      )
      await client.close()
    }

    // ── Notify Darshan ────────────────────────────────────────────
    if (resend) {
      await resend.emails.send({
        from:    'DNI Studio <onboarding@resend.dev>',
        to:      'darshan.mashru@dnianalytics.co.uk',
        subject: `New early access signup: ${cleanEmail}`,
        html: `
          <div style="font-family:sans-serif;max-width:480px;padding:24px;">
            <h2 style="margin:0 0 8px;">New early access signup 🎉</h2>
            <p style="color:#555;margin:0 0 16px;">Someone just signed up for early access on dnianalytics.com.</p>
            <table style="border-collapse:collapse;width:100%">
              <tr><td style="padding:8px 0;color:#999;font-size:13px;">Email</td><td style="padding:8px 0;font-weight:600">${cleanEmail}</td></tr>
              ${name ? `<tr><td style="padding:8px 0;color:#999;font-size:13px;">Name</td><td style="padding:8px 0;font-weight:600">${name}</td></tr>` : ''}
              <tr><td style="padding:8px 0;color:#999;font-size:13px;">Source</td><td style="padding:8px 0;font-weight:600">${source || 'unknown'}</td></tr>
              <tr><td style="padding:8px 0;color:#999;font-size:13px;">Time</td><td style="padding:8px 0;font-weight:600">${new Date().toLocaleString('en-GB', { timeZone: 'Europe/London' })}</td></tr>
            </table>
          </div>
        `,
      })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Waitlist error:', err)
    return NextResponse.json({ success: true })
  }
}
