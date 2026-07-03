import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { ObjectId } from 'mongodb'
import { authOptions } from '@/lib/auth'
import clientPromise from '@/lib/mongodb'
import type { Lead } from '@/types'

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const client = await clientPromise
    const db = client.db()
    const lead = await db.collection<Lead>('leads').findOne({ _id: new ObjectId(params.id) as any })

    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
    }

    return NextResponse.json(lead)
  } catch {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const client = await clientPromise
    const db = client.db()

    const update: Partial<Lead> = {}
    if (body.status) update.status = body.status
    if (body.lostReason !== undefined) update.lostReason = body.lostReason
    if (body.notes !== undefined) update.notes = body.notes
    update.updatedAt = new Date()

    const result = await db.collection<Lead>('leads').updateOne(
      { _id: new ObjectId(params.id) as any },
      { $set: update }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const client = await clientPromise
    const db = client.db()
    const result = await db.collection<Lead>('leads').deleteOne({ _id: new ObjectId(params.id) as any })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
  }
}
