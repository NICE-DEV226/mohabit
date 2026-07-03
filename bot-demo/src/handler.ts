import type { proto } from '@itsliaaa/baileys'
import { handleConversation } from './conversation/agent'
import { withLock } from './sessions/lock'
import { getSession } from './sessions/redis'
import { armIdle, cancelIdle, isActiveStep } from './sessions/idle'
import { WASocket } from './types'

function extractText(msg: proto.IWebMessageInfo): string {
  const m = msg.message
  if (!m) return ''

  // Boutons modernes (native flow / quick_reply) : l'id choisi est dans paramsJson.
  const flowJson = (m as any).interactiveResponseMessage?.nativeFlowResponseMessage?.paramsJson
  if (flowJson) {
    try {
      const p = JSON.parse(flowJson)
      if (p?.id) return String(p.id).trim()
    } catch { /* ignore */ }
  }

  const buttonId = m.buttonsResponseMessage?.selectedButtonId
  if (buttonId) return buttonId

  const listId = m.listResponseMessage?.singleSelectReply?.selectedRowId
  if (listId) return listId

  return (
    m.conversation ||
    m.extendedTextMessage?.text ||
    m.buttonsResponseMessage?.selectedDisplayText ||
    m.imageMessage?.caption ||
    m.videoMessage?.caption ||
    ''
  ).trim()
}

export async function handleIncoming(sock: WASocket, msg: proto.IWebMessageInfo) {
  const key = msg.key
  if (!key || key.fromMe || !msg.message) return

  const jid = key.remoteJid!
  const text = extractText(msg)

  if (!text) return

  console.log(`[MSG] ${jid}: ${text.slice(0, 80)}`)

  // Accusé de lecture immédiat (coche bleue) — le prospect voit qu'on a reçu.
  sock.readMessages([key]).catch(() => {})
  // Indicateur "en train d'écrire..." pendant qu'on prépare la réponse.
  sock.sendPresenceUpdate('composing', jid).catch(() => {})

  try {
    // Sérialisé par JID : les messages d'un même client sont traités dans
    // l'ordre, sans écrasement de contexte (voir sessions/lock.ts).
    await withLock(jid, async () => {
      await handleConversation(sock, jid, text)
      // (Ré)arme ou annule le timeout d'inactivité selon l'état résultant.
      const state = await getSession(jid)
      if (isActiveStep(state.step)) armIdle(sock, jid)
      else cancelIdle(jid)
    })
  } catch (err) {
    console.error(`[Agent] Erreur ${jid}:`, err)
  } finally {
    // On coupe l'indicateur de frappe une fois la/les réponse(s) envoyée(s).
    sock.sendPresenceUpdate('paused', jid).catch(() => {})
  }
}
