/**
 * Timeout d'inactivité par client (par JID).
 *
 * Quand une qualification est en cours et que le client ne répond plus :
 *   • après REMIND_MS → une relance douce ("Toujours là ?")
 *   • après EXPIRE_MS supplémentaires → on ferme proprement le contexte
 *
 * Fonctionne avec Redis comme avec le fallback mémoire, car on n'énumère
 * jamais les clés : chaque client a son propre timer, ré-armé à chaque
 * message et annulé dès que la conversation aboutit ou est transférée.
 * (Timers in-process : perdus au redémarrage, mais le TTL Redis de 30 min
 * expire de toute façon le contexte — pas de fuite.)
 */

import { WASocket } from '../types'
import { sendText } from '../messages/text'
import { getSession, clearSession, ConversationState } from './redis'

const REMIND_MS = 10 * 60 * 1000 // 10 min sans réponse → relance
const EXPIRE_MS = 5 * 60 * 1000 // +5 min → fermeture du contexte

type Timers = { remind?: NodeJS.Timeout; expire?: NodeJS.Timeout }
const timers = new Map<string, Timers>()

/** Étapes où une relance a du sens (qualification en cours). */
const ACTIVE_STEPS: ReadonlySet<ConversationState['step']> = new Set([
  'GREETING',
  'PROJECT',
  'USAGE',
  'ZONE',
  'BUDGET',
  'NAME',
  'PHONE',
  'CONFIRM',
])

export function isActiveStep(step: ConversationState['step']): boolean {
  return ACTIVE_STEPS.has(step)
}

export function cancelIdle(jid: string) {
  const t = timers.get(jid)
  if (!t) return
  if (t.remind) clearTimeout(t.remind)
  if (t.expire) clearTimeout(t.expire)
  timers.delete(jid)
}

/** (Ré)arme le timer d'inactivité pour un client en cours de qualification. */
export function armIdle(sock: WASocket, jid: string) {
  cancelIdle(jid)

  const remind = setTimeout(() => {
    // Relance douce, puis on programme la fermeture.
    void (async () => {
      // On re-vérifie l'état : si le contexte n'est plus actif, on abandonne.
      const s = await getSession(jid).catch(() => null)
      if (!s || !isActiveStep(s.step)) {
        cancelIdle(jid)
        return
      }

      await sendText(
        sock,
        jid,
        'Toujours là ? 😊 Répondez quand vous voulez, je garde votre demande de côté.'
      )

      const expire = setTimeout(() => {
        void clearSession(jid).catch(() => {})
        timers.delete(jid)
      }, EXPIRE_MS)
      expire.unref?.()

      timers.set(jid, { expire }) // plus de relance, uniquement l'expiration
    })()
  }, REMIND_MS)
  remind.unref?.()

  timers.set(jid, { remind })
}
