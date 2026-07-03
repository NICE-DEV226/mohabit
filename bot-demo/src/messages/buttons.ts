import { WASocket } from '../types'

export async function sendButtons(
  sock: WASocket,
  jid: string,
  text: string,
  footer: string,
  buttons: { id: string; text: string }[]
) {
  try {
    await sock.sendMessage(jid, {
      text,
      footer,
      buttons: buttons.map((b) => ({
        buttonId: b.id,
        buttonText: { displayText: b.text },
      })),
      headerType: 1,
    } as any)
    console.log(`[Send] Boutons envoyés à ${jid}`)
  } catch (err) {
    console.error(`[Send] Erreur envoi boutons à ${jid}:`, err)
  }
}
