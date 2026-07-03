import { WASocket, proto } from '@itsliaaa/baileys'
import { sendText } from '../messages/text'
import { getSession, setSession } from '../sessions/redis'

export async function handleFAQ(sock: WASocket, jid: string, msg: proto.IWebMessageInfo, topic: string) {
  const session = await getSession(jid)

  const answers: Record<string, string> = {
    prix:
      "💰 Le prix dépend du modèle et des finitions choisis.\n\n" +
      "Un conseiller vous fera un *devis gratuit* personnalisé.\n" +
      "Répondez 2 pour demander un devis.",

    delai:
      "⚡ Nos maisons sont livrées en *15 à 20 jours* après confirmation.\n\n" +
      "Contre 6 à 12 mois pour la construction traditionnelle !",

    adresse:
      "📍 Nous sommes basés à *Ouagadougou*, Burkina Faso.\n" +
      "Nos conseillers se déplacent sur Ouaga et ses environs.\n" +
      "Dans quelle zone êtes-vous ?",

    qualite:
      "🏗️ *Nos garanties :*\n" +
      "• Durée de vie : ≥ 100 ans\n" +
      "• Résistance sismique : 8.5 degrés\n" +
      "• Résistance au vent : ≥ 150 km/h\n" +
      "• Anti-feu : ≥ 4 heures\n" +
      "• Isolation thermique : Δ ≥ 10°C",

    livraison:
      "✅ Nous livrons et installons *partout à Ouagadougou et environs*.\n" +
      "Montage intégral par notre équipe.",
  }

  const answer = answers[topic]
  if (!answer) return

  await sendText(sock, jid, answer)

  if (topic === 'prix' || topic === 'qualite') {
    await sendText(sock, jid,
      "Souhaitez-vous qu'un conseiller vous contacte ?\n" +
      "1️⃣ Oui, un devis\n" +
      "2️⃣ Parler à un conseiller"
    )
    await setSession(jid, { ...session, step: 'MENU' })
  }
}
