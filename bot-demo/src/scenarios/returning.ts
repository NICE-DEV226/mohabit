import { WASocket, proto } from '@itsliaaa/baileys'
import { sendText } from '../messages/text'
import { getSession, setSession } from '../sessions/redis'
import { models, modelSummary } from '../utils/models'

export async function handleReturning(sock: WASocket, jid: string, msg: proto.IWebMessageInfo, input: string) {
  const session = await getSession(jid)

  if (session.step !== 'IDLE') {
    await sendText(sock, jid,
      "Je vois que vous avez déjà commencé une discussion.\n" +
      "Répondez 1 pour continuer, 2 pour recommencer."
    )
    return
  }

  if (session.step === 'IDLE') {
    const modelMatch = input.toUpperCase().match(/DQ\d{3}/)
    if (modelMatch) {
      const model = models.find((m) => m.ref === modelMatch[0])
      if (model) {
        await sendText(sock, jid,
          `Bonjour ! Vous vous intéressez au *${modelSummary(model)}* ?\n` +
          `C'est pour quel usage ?\n` +
          `1️⃣ Résidence principale\n` +
          `2️⃣ Bureau / Commerce\n` +
          `3️⃣ Location`
        )
        await setSession(jid, { ...session, step: 'USAGE', model: model.ref, source: 'site' })
        return
      }
    }

    await sendText(sock, jid,
      "Bonjour chez *Modu Habitat International* ! 🏘️\n\n" +
      "Répondez :\n" +
      "1️⃣ Voir le catalogue\n" +
      "2️⃣ Demander un devis\n" +
      "3️⃣ Parler à un conseiller"
    )
    await setSession(jid, { ...session, step: 'MENU', source: 'direct' })
  }
}
