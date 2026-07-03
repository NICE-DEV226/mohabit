export type Intent =
  | 'salutation'
  | 'catalogue'
  | 'devis'
  | 'conseiller'
  | 'prix'
  | 'delai'
  | 'qualite'
  | 'contact'
  | 'oui'
  | 'non'
  | 'transfert'
  | 'refuse'
  | 'inconnu'

const GREETINGS = ['bonjour', 'bonsoir', 'salut', 'allô', 'allo', 'hi', 'hello', 'slt', 'cc', 'bonsoir']

const FAQ_ANSWERS: Record<string, string> = {
  prix:
    "💰 Les prix varient selon le modèle et les finitions. Nos modèles DQ commencent à partir de 5M FCFA. " +
    "Je peux vous faire un devis personnalisé si vous voulez.",
  delai:
    "⚡ Livraison en *15 à 20 jours* après commande — contre 6 à 12 mois en construction traditionnelle.",
  qualite:
    "🏗️ *Nos garanties :*\n" +
    "• Durée de vie : ≥ 100 ans\n" +
    "• Résistance sismique : 8.5 degrés\n" +
    "• Résistance au vent : ≥ 150 km/h\n" +
    "• Anti-feu : ≥ 4 heures\n" +
    "• Isolation thermique : Δ ≥ 10°C",
  contact:
    "📍 Basés à *Ouagadougou*, Burkina Faso.\n" +
    "Nos conseillers se déplacent sur Ouaga et ses environs.",
}

export const MIN_BUDGET_FCFA = 5_000_000

export function detectIntent(text: string, previousIntent?: Intent): Intent {
  const lower = text.toLowerCase().trim()
  const t = text.trim()

  if (/^(1|2|3|4|5)$/.test(t)) return 'inconnu'

  if (/conseiller|agent|humain|parler à.*(?:quelqu'un|humain)|transfert|passe.*(?:conseiller|humain)/.test(lower)) return 'conseiller'
  if (/stop|arrête|ça suffit|je veux un humain|laisse tomber|pas toi/.test(lower)) return 'transfert'

  if (/devis|construire|bâtir|projet/.test(lower)) return 'devis'
  if (/prix|combien|coût|coûte|tarif|budget|paye/.test(lower)) return 'prix'
  if (/catalogue|modèle|voir|montrer|dq\d{3}/i.test(text)) return 'catalogue'
  if (/délai|delai|temps|durée|rapide|vite|semaine|jour|quand/.test(lower)) return 'delai'
  if (/solide|qualité|acier|garantie|durée de vie|an/.test(lower)) return 'qualite'

  if (/bonjour|bonsoir|salut|allô|allo|hi|hello|slt|cc|hey/.test(lower)) return 'salutation'

  if (/oui|ok|d'accord|dac|yes|ouais|volontiers|exact|voilà|parfait/.test(lower)) return 'oui'
  if (/non|nan|nop|pas besoin|rien|jamais/.test(lower)) return 'non'
  if (/adresse|où|bureau|localisation|trouver|situé/.test(lower)) return 'contact'
  if (/je ne (sais|veux)|pas intéressé|merci|plus tard/.test(lower)) return 'refuse'

  return 'inconnu'
}

export function getFaqAnswer(topic: string): string | undefined {
  return FAQ_ANSWERS[topic]
}

export function isGreeting(text: string): boolean {
  return GREETINGS.some((g) => text.toLowerCase().includes(g))
}

export function detectModel(text: string): string | null {
  const match = text.match(/DQ\d{3}/i)
  return match ? match[0].toUpperCase() : null
}

export function validateBudget(budgetText: string): { valid: boolean; amount?: number; message?: string } {
  const digits = budgetText.replace(/[^0-9]/g, '')
  if (!digits) return { valid: false, message: 'Je n\'ai pas bien compris le montant.' }
  const amount = parseInt(digits, 10)
  if (amount < MIN_BUDGET_FCFA) {
    return { valid: false, amount, message: `Nos modèles commencent à partir de 5M FCFA. Avec ${(amount / 1_000_000).toFixed(1)}M, cela risque d'être insuffisant. Voulez-vous réviser votre budget ?` }
  }
  return { valid: true, amount }
}
