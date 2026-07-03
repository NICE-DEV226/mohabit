import { WASocket } from '../types'

export async function sendText(sock: WASocket, jid: string, text: string) {
  try {
    await sock.sendMessage(jid, { text })
    console.log(`[Send] Texte envoyé à ${jid}`)
  } catch (err) {
    console.error(`[Send] Erreur envoi texte à ${jid}:`, err)
  }
}
