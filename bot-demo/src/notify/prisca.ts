import { WASocket } from '../types'

const PRISCA_JID = (process.env.PRISCA_NUMBER || '22600000000') + '@s.whatsapp.net'

export async function notifyPrisca(
  sock: WASocket,
  data: {
    name: string
    phone: string
    model?: string
    usage?: string
    zone?: string
    source: string
  }
) {
  const msg =
    `🔔 *Nouveau lead — Modu Habitat*\n\n` +
    `Nom     : ${data.name}\n` +
    `Tel     : ${data.phone}\n` +
    `Modèle  : ${data.model || 'À qualifier'}\n` +
    `Usage   : ${data.usage || 'Non renseigné'}\n` +
    `Zone    : ${data.zone || 'Non renseignée'}\n` +
    `Source  : ${data.source}\n\n` +
    `→ wa.me/${data.phone.replace(/[^0-9]/g, '')}`

  try {
    await sock.sendMessage(PRISCA_JID, { text: msg })
    console.log('[Notify] Prisca notified')
  } catch (err) {
    console.error('[Notify] Failed to notify Prisca:', err)
  }
}

export async function notifyTransfer(sock: WASocket, phone: string, name: string) {
  const msg =
    `🚨 *TRANSFERT DEMANDÉ*\n\n` +
    `*${name}* (${phone}) veut parler à un conseiller maintenant.\n\n` +
    `→ wa.me/${phone.replace(/[^0-9]/g, '')}`

  try {
    await sock.sendMessage(PRISCA_JID, { text: msg })
  } catch (err) {
    console.error('[Notify] Transfer failed:', err)
  }
}
