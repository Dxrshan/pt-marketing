import { NextRequest, NextResponse } from 'next/server'
import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI || ''

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, name, type, source } = body

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 })
    }

    if (uri) {
      const client = new MongoClient(uri)
      await client.connect()
      const db = client.db('ptmanager')
      const collection = db.collection('waitlist')

      await collection.updateOne(
        { email: email.toLowerCase().trim() },
        {
          $set: {
            email: email.toLowerCase().trim(),
            name: name || '',
            type: type || 'solo',
            source: source || 'unknown',
            updatedAt: new Date(),
          },
          $setOnInsert: { createdAt: new Date() },
        },
        { upsert: true }
      )

      await client.close()
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Waitlist error:', err)
    return NextResponse.json({ success: true })
  }
}
