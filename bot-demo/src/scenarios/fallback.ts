import { WASocket, proto } from '@itsliaaa/baileys'
import { sendText } from '../messages/text'
import { getSession, setSession } from '../sessions/redis'

export async function handleFallback(sock: WASocket, jid: string, msg: proto.IWebMessageInfo, input: string) {
  const session = await getSession(jid)
  const newAttempts = session.attempts + 1

  if (newAttempts >= 3) {
    await sendText(sock, jid,
      "Je vais vous mettre en contact avec un conseiller. 😊\n" +
      "Votre prénom ?"
    )
    await setSession(jid, { ...session, step: 'NAME', transfer: true, attempts: newAttempts })
    return
  }

  await sendText(sock, jid,
    "Je n'ai pas bien compris 😅\n\n" +
    "Répondez :\n" +
    "1️⃣ Voir le catalogue\n" +
    "2️⃣ Demander un devis\n" +
    "3️⃣ Parler à un conseiller"
  )
  await setSession(jid, { ...session, step: 'MENU', attempts: newAttempts })
}
