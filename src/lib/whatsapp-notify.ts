import { siteConfig } from '@/config/site'

const WHATSAPP_TOKEN = process.env.WHATSAPP_API_TOKEN
const WHATSAPP_PHONE_ID = process.env.WHATSAPP_PHONE_ID
const TEAM_PHONE = process.env.WHATSAPP_TEAM_PHONE
const API_VERSION = 'v18.0'

function projectLabel(type: string): string {
  const map: Record<string, string> = {
    'maison-acier': 'Maison Acier',
    'conteneur': 'Conteneur de Vie',
    'modulaire': 'Construction Modulaire',
  }
  return map[type] || type
}

export async function notifyNewLead(lead: {
  fullName: string
  phone: string
  projectType: string
  budget?: string
  _id?: string
}) {
  if (!WHATSAPP_TOKEN || !WHATSAPP_PHONE_ID || !TEAM_PHONE) {
    console.log('[WhatsApp] Notification skipped: API not configured')
    return { sent: false, reason: 'not_configured' }
  }

  const dashboardUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
  const leadUrl = `${dashboardUrl}/dashboard/leads/${lead._id?.toString() || ''}`

  const message = `🔔 *Nouveau Lead — ${siteConfig.brand.name}*
*Nom* : ${lead.fullName}
*Tel* : ${lead.phone}
*Projet* : ${projectLabel(lead.projectType)}${lead.budget ? `\n*Budget* : ${lead.budget}` : ''}
→ ${leadUrl}`

  try {
    const res = await fetch(
      `https://graph.facebook.com/${API_VERSION}/${WHATSAPP_PHONE_ID}/messages`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${WHATSAPP_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: TEAM_PHONE,
          type: 'text',
          text: { body: message },
        }),
      }
    )

    if (!res.ok) {
      const err = await res.text()
      console.error('[WhatsApp] Notification failed:', err)
      return { sent: false, reason: 'api_error' }
    }

    console.log('[WhatsApp] Notification sent successfully')
    return { sent: true }
  } catch (err) {
    console.error('[WhatsApp] Notification error:', err)
    return { sent: false, reason: 'exception' }
  }
}
