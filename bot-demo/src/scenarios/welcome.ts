import { WASocket, proto } from '@itsliaaa/baileys'
import { sendText } from '../messages/text'
import { getSession, setSession, clearSession } from '../sessions/redis'
import { insertLead } from '../db/sqlite'
import { notifyPrisca } from '../notify/prisca'
import { confirmationMessage } from '../utils/time'

export async function handleWelcome(sock: WASocket, jid: string, msg: proto.IWebMessageInfo, input: string) {
  const session = await getSession(jid)

  if (session.step === 'IDLE') {
    const model = session.model || 'ce modèle'

    await sendText(sock, jid,
      `Bonjour ! 👋 Merci pour votre intérêt pour *${model}*.\n\n` +
      `C'est pour quel usage ?\n` +
      `1️⃣ Résidence principale\n` +
      `2️⃣ Bureau / Commerce\n` +
      `3️⃣ Location`
    )

    await setSession(jid, { ...session, step: 'USAGE', source: 'site' })
    return
  }

  if (session.step === 'USAGE') {
    const usage = (
      { '1': 'Résidence principale', '2': 'Bureau / Commerce', '3': 'Location' } as Record<string, string>
    )[input] || input

    await sendText(sock, jid,
      "📍 Dans quelle zone de Ouagadougou prévoyez-vous de construire ?"
    )
    await setSession(jid, { ...session, step: 'ZONE', usage })
    return
  }

  if (session.step === 'ZONE') {
    await sendText(sock, jid,
      "📅 Vous avez un délai en tête ?\n\n" +
      "1️⃣ Moins de 3 mois\n" +
      "2️⃣ 3 à 6 mois\n" +
      "3️⃣ Plus de 6 mois"
    )
    await setSession(jid, { ...session, step: 'DELAY', zone: input })
    return
  }

  if (session.step === 'DELAY') {
    const delay = (
      { '1': 'Moins de 3 mois', '2': '3 à 6 mois', '3': 'Plus de 6 mois' } as Record<string, string>
    )[input] || input

    await sendText(sock, jid, "Votre numéro de téléphone (ex: 76000000) ?")
    await setSession(jid, { ...session, step: 'PHONE', delay })
    return
  }

  if (session.step === 'PHONE') {
    const phone = input.replace(/[^0-9]/g, '')
    if (phone.length < 6) {
      await sendText(sock, jid, "Ce numéro ne semble pas valide. Votre téléphone (ex: 76000000) ?")
      return
    }
    await sendText(sock, jid, "Et votre prénom ?")
    await setSession(jid, { ...session, step: 'NAME', phone })
    return
  }

  if (session.step === 'NAME') {
    const phone = session.phone || jid.replace(/[@:].*$/, '')

    const leadId = insertLead({
      name: input,
      phone,
      model: session.model,
      usage: session.usage,
      zone: session.zone,
      delay: session.delay,
    })

    console.log(`[Lead] Created #${leadId} — ${input} (${phone})`)

    const { syncLeadToMongo } = await import('../sync/mongo')
    syncLeadToMongo({
      name: input,
      phone,
      model: session.model,
      usage: session.usage,
      zone: session.zone,
      source: 'Site Web',
    })

    notifyPrisca(sock, {
      name: input,
      phone,
      model: session.model,
      usage: session.usage,
      zone: session.zone,
      source: 'Site Web',
    })

    await sendText(sock, jid, confirmationMessage(input))
    await clearSession(jid)
    return
  }
}
