import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { notifyNewLead } from '@/lib/whatsapp-notify'
// import type { Conversation } from '@/lib/whatsapp-bot'
import { getInitialStep, handleOption, getReply, detectModel } from '@/lib/whatsapp-bot'
import type { Conversation } from '@/lib/whatsapp-bot'
import type { Lead } from '@/types'

const WHATSAPP_TOKEN = process.env.WHATSAPP_API_TOKEN
const WHATSAPP_PHONE_ID = process.env.WHATSAPP_PHONE_ID
const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || 'modu-verify-token'

// GET — Meta webhook verification
export async function GET(request: NextRequest) {
  const mode = request.nextUrl.searchParams.get('hub.mode')
  const token = request.nextUrl.searchParams.get('hub.verify_token')
  const challenge = request.nextUrl.searchParams.get('hub.challenge')

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('[Webhook] Verified by Meta')
    return new NextResponse(challenge, { status: 200 })
  }

  return new NextResponse('Forbidden', { status: 403 })
}

// POST — Incoming WhatsApp messages
export async function POST(request: NextRequest) {
  if (!WHATSAPP_TOKEN || !WHATSAPP_PHONE_ID) {
    return NextResponse.json({ error: 'Not configured' }, { status: 200 })
  }

  try {
    const body = await request.json()

    // Ignore delivery receipts
    if (body.entry?.[0]?.changes?.[0]?.value?.statuses) {
      return NextResponse.json({ ok: true })
    }

    const message = extractMessage(body)
    if (!message) return NextResponse.json({ ok: true })

    const { from: phone, text } = message

    const client = await clientPromise
    const db = client.db()
    const conversations = db.collection('conversations')

    let conversation: any = await conversations.findOne({ phone })

    if (!conversation) {
      // NEW conversation — start qualification
      const step = getInitialStep(text)
      const model = detectModel(text)

      conversation = {
        phone,
        step,
        data: model ? { model } : {},
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      await conversations.insertOne(conversation)

      // Send the first question
      const reply = getReply(step, conversation.data)
      if (reply) await sendWhatsApp(phone, reply)

      return NextResponse.json({ ok: true })
    }

    // EXISTING conversation — process response
    const { nextStep, reply, isComplete } = handleOption(conversation.step as any, text)

    // Collect data
    const setFields: Record<string, unknown> = {
      step: nextStep,
      updatedAt: new Date(),
    }
    const dataUpdate: Record<string, string> = { ...conversation.data }

    if (conversation.step === 'usage' && ['1', '2', '3', '4'].includes(text)) {
      const usageMap: Record<string, string> = {
        '1': 'Résidence principale',
        '2': 'Résidence secondaire',
        '3': 'Bureau / Commerce',
        '4': 'Location',
      }
      dataUpdate.usage = usageMap[text] || text
    }
    if (conversation.step === 'zone' && text.length >= 2) {
      dataUpdate.zone = text
    }
    if (conversation.step === 'name' && text.length >= 1) {
      dataUpdate.name = text
    }
    if (conversation.step === 'idle' || conversation.step === 'menu') {
      const model = detectModel(text)
      if (model) dataUpdate.model = model
    }

    setFields.data = dataUpdate
    await conversations.updateOne({ phone }, { $set: setFields as any })

    // Send reply
    if (reply) await sendWhatsApp(phone, reply)

    // If complete — create lead
    if (isComplete) {
      const fullName = (dataUpdate.name || phone).trim()
      const modelRef = dataUpdate.model || ''

      const lead: Lead = {
        fullName,
        phone,
        email: '',
        projectType: modelRef.startsWith('DQ') ? 'maison-acier' : 'autre',
        source: 'whatsapp',
        description: [
          modelRef ? `Modèle: ${modelRef}` : '',
          dataUpdate.usage ? `Usage: ${dataUpdate.usage}` : '',
          dataUpdate.zone ? `Zone: ${dataUpdate.zone}` : '',
        ].filter(Boolean).join(' — '),
        status: 'new',
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const result = await db.collection<Lead>('leads').insertOne(lead)

      notifyNewLead({
        fullName: lead.fullName,
        phone: lead.phone,
        projectType: lead.projectType,
        _id: result.insertedId.toString(),
      })

      await conversations.deleteOne({ phone })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[Webhook] Error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 200 })
  }
}

function extractMessage(body: any): { from: string; text: string } | null {
  try {
    const messages = body.entry?.[0]?.changes?.[0]?.value?.messages
    if (!messages?.[0]) return null
    const msg = messages[0]
    if (msg.type !== 'text') return null
    return {
      from: msg.from.replace('+', ''),
      text: msg.text.body.trim(),
    }
  } catch {
    return null
  }
}

async function sendWhatsApp(to: string, text: string) {
  try {
    await fetch(
      `https://graph.facebook.com/v18.0/${WHATSAPP_PHONE_ID}/messages`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${WHATSAPP_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to,
          type: 'text',
          text: { body: text },
        }),
      }
    )
  } catch (err) {
    console.error('[Webhook] Send error:', err)
  }
}
