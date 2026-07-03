import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import type { Lead } from '@/types'
import { notifyNewLead } from '@/lib/whatsapp-notify'

const MAX_LEN = 2000

function str(value: unknown, max = 200): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : ''
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validation minimale : nom + téléphone requis (le reste optionnel).
    const fullName = str(body.fullName, 120)
    const phone = str(body.phone, 40)
    if (fullName.length < 2 || phone.replace(/\D/g, '').length < 6) {
      return NextResponse.json(
        { success: false, error: 'Nom et téléphone valides requis' },
        { status: 400 }
      )
    }

    const client = await clientPromise
    const db = client.db()

    const lead: Lead = {
      fullName,
      email: str(body.email, 160),
      phone,
      projectType: str(body.projectType, 60) as Lead['projectType'],
      budget: str(body.budget, 60),
      dimensions: str(body.dimensions, 120),
      description: str(body.message ?? body.description, MAX_LEN),
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
