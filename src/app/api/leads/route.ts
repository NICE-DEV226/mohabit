import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import type { Lead } from '@/types'
import { notifyNewLead } from '@/lib/whatsapp-notify'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const client = await clientPromise
    const db = client.db()

    const lead: Lead = {
      fullName: body.fullName,
      email: body.email,
      phone: body.phone,
      projectType: body.projectType,
      budget: body.budget,
      dimensions: body.dimensions || '',
      description: body.description,
      status: 'new',
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection<Lead>('leads').insertOne(lead)

    // Notification WhatsApp (asynchrone, ne bloque pas la réponse)
    notifyNewLead({
      fullName: lead.fullName,
      phone: lead.phone,
      projectType: lead.projectType,
      budget: lead.budget,
      _id: result.insertedId.toString(),
    })

    return NextResponse.json(
      { success: true, id: result.insertedId },
      { status: 201 }
    )
  } catch {
    return NextResponse.json(
      { success: false, error: 'Erreur lors de l\'envoi de la demande' },
      { status: 500 }
    )
  }
}
