import { WASocket } from '../types'
import { sendText } from './text'
import { botConfig } from '../config/bot'

/**
 * Envoi intelligent d'une réponse, avec ou sans choix rapides.
 *
 * - 0 choix           → texte simple
 * - 1 à 3 choix       → boutons quick-reply natifs (format moderne du fork)
 * - 4+ choix          → liste déroulante (single_select)
 * - échec d'envoi     → repli automatique sur un texte numéroté (toujours livré)
 *
 * L'`id` de chaque bouton = son libellé : au clic, le libellé revient comme
 * message et est compris naturellement par le LLM. Les boutons ne fonctionnent
 * qu'en chat privé (déjà garanti par le filtre DM-only).
 */
export async function sendReply(
  sock: WASocket,
  jid: string,
  text: string,
  choices?: string[]
) {
  const opts = (choices || []).map((c) => c.trim()).filter(Boolean)

  if (opts.length === 0) {
    await sendText(sock, jid, text)
    return
  }

  try {
    if (opts.length <= 3) {
      await sock.sendMessage(jid, {
        text,
        footer: botConfig.brand,
        buttons: opts.map((c) => ({ text: c, id: c })),
      } as any)
    } else {
      await sock.sendMessage(jid, {
        text,
        footer: botConfig.brand,
        buttonText: 'Choisir',
        title: '',
        sections: [{ title: 'Options', rows: opts.map((c) => ({ title: c, rowId: c })) }],
      } as any)
    }
  } catch (err) {
    // Certaines versions WhatsApp n'affichent pas les boutons : on garantit la livraison.
    console.error('[Send] Boutons KO, repli texte:', (err as Error).message)
    const numbered = opts.map((c, i) => `${i + 1}. ${c}`).join('\n')
    await sendText(sock, jid, `${text}\n\n${numbered}`)
  }
}
