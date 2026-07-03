import { WASocket, proto } from '@itsliaaa/baileys'
import { sendText } from '../messages/text'
import { getSession, setSession, clearSession, ConversationState } from '../sessions/redis'
import { insertLead } from '../db/sqlite'
import { notifyPrisca } from '../notify/prisca'
import { confirmationMessage } from '../utils/time'

export async function handleDirect(sock: WASocket, jid: string, msg: proto.IWebMessageInfo, input: string) {
  const session = await getSession(jid)
  console.log(`[Direct] step=${session.step} input="${input}"`)

  if (session.step === 'IDLE') {
    console.log('[Direct] Envoi menu principal...')
    await sendText(sock, jid,
      "Bonjour ! 👋 Bienvenue chez *Modu Habitat International*.\n\n" +
      "Nous construisons des maisons modulaires en acier livrées en *15 à 20 jours* à Ouagadougou.\n\n" +
      "Répondez :\n" +
      "1️⃣ Voir le catalogue\n" +
      "2️⃣ Demander un devis\n" +
      "3️⃣ Parler à un conseiller"
    )
    await setSession(jid, { ...session, step: 'MENU', source: 'direct' })
    return
  }

  if (session.step === 'MENU') {
    if (input === '1' || input === 'menu_catalogue') {
      await sendText(sock, jid,
        "Découvrez nos 24 modèles sur notre catalogue en ligne :\n\n" +
        "👉 https://moduhabitat.com/catalogue\n\n" +
        "Répondez 1 pour un devis, 2 pour un conseiller."
      )
      await setSession(jid, { ...session, step: 'MENU' })
      return
    }

    if (input === '3' || input === 'menu_conseiller') {
      await sendText(sock, jid, "Votre numéro de téléphone (ex: 76000000) ?")
      await setSession(jid, { ...session, step: 'PHONE', transfer: true })
      return
    }

    if (input === '2' || input === 'menu_devis') {
      await sendText(sock, jid,
        "Parfait ! Je vais vous poser quelques questions pour préparer votre devis.\n\n" +
        "C'est pour quel usage ?\n" +
        "1️⃣ Résidence principale\n" +
        "2️⃣ Bureau / Commerce\n" +
        "3️⃣ Location"
      )
      await setSession(jid, { ...session, step: 'USAGE' })
      return
    }

    await sendText(sock, jid, "Répondez 1 (catalogue), 2 (devis) ou 3 (conseiller).")
    return
  }

  if (session.step === 'USAGE') {
    const usage = (
      { '1': 'Résidence principale', '2': 'Bureau / Commerce', '3': 'Location' } as Record<string, string>
    )[input] || input

    await sendText(sock, jid,
      "📍 Dans quelle zone de Ouagadougou prévoyez-vous de construire ?\n" +
      "(Ex: Ouaga 2000, Tanghin, Patte d'Oie, etc.)"
    )
    await setSession(jid, { ...session, step: 'ZONE', usage })
    return
  }

  if (session.step === 'ZONE') {
    await sendText(sock, jid,
      "💰 Quel budget envisagez-vous ?\n\n" +
      "1️⃣ Moins de 5M FCFA\n" +
      "2️⃣ 5–10M FCFA\n" +
      "3️⃣ Plus de 10M FCFA\n" +
      "4️⃣ Je ne sais pas"
    )
    await setSession(jid, { ...session, step: 'BUDGET', zone: input })
    return
  }

  if (session.step === 'BUDGET') {
    const budget = (
      { '1': 'Moins de 5M FCFA', '2': '5–10M FCFA', '3': 'Plus de 10M FCFA', '4': 'Je ne sais pas' } as Record<string, string>
    )[input] || input

    await sendText(sock, jid, "Votre numéro de téléphone (ex: 76000000) ?")
    await setSession(jid, { ...session, step: 'PHONE', budget })
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
    const isTransfer = session.transfer
    const phone = session.phone || jid.replace(/[@:].*$/, '')

    if (isTransfer) {
      const { notifyTransfer } = await import('../notify/prisca')
      await notifyTransfer(sock, phone, input)
      const teamPhone = process.env.TEAM_PHONE || process.env.PRISCA_NUMBER || '22601020304'
      await sendText(sock, jid,
        `Merci ${input} ! 🙏\n\n` +
        `Un conseiller va vous contacter très rapidement au ${phone}.\n\n` +
        `Vous pouvez aussi nous joindre directement au ${teamPhone}.\n` +
        `Bonne journée !`
      )
      await clearSession(jid)
      return
    }

    const leadId = insertLead({
      name: input,
      phone,
      usage: session.usage,
      zone: session.zone,
      budget: session.budget,
      source: 'WhatsApp Direct',
    })
    console.log(`[Lead] Created #${leadId} — ${input} (${phone})`)

    const { syncLeadToMongo } = await import('../sync/mongo')
    syncLeadToMongo({
      name: input,
      phone,
      usage: session.usage,
      zone: session.zone,
      budget: session.budget,
      source: 'WhatsApp Direct',
    })

    notifyPrisca(sock, {
      name: input,
      phone,
      usage: session.usage,
      zone: session.zone,
      source: 'WhatsApp Direct',
    })
    await sendText(sock, jid, confirmationMessage(input))
    await clearSession(jid)
    return
  }
}
