export interface ExtractedEntities {
  model?: string
  phone?: string
  name?: string
  zone?: string
  budget?: string
  usage?: string
}

const MODEL_RE = /DQ\d{3}/i
const PHONE_RE = /\b(\d{6,12})\b/
const NAME_RE = /(?:je m'appelle|mon nom|c'est|moi c'est|appelle-moi|prénom)\s+([A-Za-zéèêëàâùûüôöîïç\-]+)/i
const ZONE_KEYWORDS = [
  'ouaga 2000', 'tanghin', 'patte d\'oie', 'karpu', 'nongremassom', 'waoghi',
  'pissy', 'samandin', 'gounghin', 'dapoya', 'baskuy', 'tampouy', 'bilbalogho',
  'koubri', 'saaba', 'komsilga', 'kouritenga', 'ziniaré',
]
const BUDGET_RE = /(\d+)\s*(?:m|millions?|M)\s*(?:f[cf]?[ae]?)?/i
const BUDGET_RE2 = /(\d+)\s*(?:f[cf]?[ae]?)/i
const USAGE_KEYWORDS: Record<string, string[]> = {
  'Résidence principale': ['habiter', 'vivre', 'résidence', 'maison', 'dormir', 'famille', 'coucher', 'loger'],
  'Bureau / Commerce': ['bureau', 'commerce', 'boutique', 'entreprise', 'travail', 'business', 'magasin'],
  'Location': ['location', 'louer', 'locatif', 'rentabiliser', 'revenu', 'investissement', 'loyer'],
}

export function extractEntities(text: string): ExtractedEntities {
  const lower = text.toLowerCase()
  const entities: ExtractedEntities = {}

  const modelMatch = text.match(MODEL_RE)
  if (modelMatch) entities.model = modelMatch[0].toUpperCase()

  const phones = text.match(PHONE_RE)
  if (phones) entities.phone = phones[1]

  const nameMatch = text.match(NAME_RE)
  if (nameMatch) entities.name = nameMatch[1].charAt(0).toUpperCase() + nameMatch[1].slice(1).toLowerCase()

  const zoneMatch = ZONE_KEYWORDS.find((z) => lower.includes(z))
  if (zoneMatch) entities.zone = zoneMatch.charAt(0).toUpperCase() + zoneMatch.slice(1)

  const budgetMatch = text.match(BUDGET_RE) || text.match(BUDGET_RE2)
  if (budgetMatch) entities.budget = budgetMatch[0]

  for (const [usage, keywords] of Object.entries(USAGE_KEYWORDS)) {
    if (keywords.some((kw) => lower.includes(kw))) {
      entities.usage = usage
      break
    }
  }

  return entities
}

export function looksLikePhone(text: string): boolean {
  const cleaned = text.replace(/[^0-9]/g, '')
  return cleaned.length >= 6 && cleaned.length <= 12
}

const NON_NAMES = new Set(['oui', 'non', 'ok', 'dac', 'yes', 'no', 'si', 'merci', 'bonjour', 'bonsoir', 'salut', 'hello', 'hi', 'cc', 'slt', 'allo', 'allô', 'hey'])

export function looksLikeName(text: string): boolean {
  const trimmed = text.trim().toLowerCase()
  if (trimmed.length < 2) return false
  if (NON_NAMES.has(trimmed)) return false
  return /^[A-Za-zéèêëàâùûüôöîïç\-]+$/.test(trimmed)
}

export function isAffirmative(text: string): boolean {
  const t = text.trim().toLowerCase()
  return ['oui', 'ok', 'd\'accord', 'accord', 'dac', 'dacc', 'yes', 'yep', 'ouais', 'volontiers', 'vas-y', 'vasy', 'bien sûr', 'exact', 'c\'est ça', 'voilà', 'parfait'].includes(t)
}

export function isNegative(text: string): boolean {
  const t = text.trim().toLowerCase()
  return ['non', 'nan', 'nop', 'non merci', 'pas besoin', 'rien', 'aucun', 'pas du tout', 'jamais'].includes(t)
}

export function isFrustrated(text: string): boolean {
  const lower = text.toLowerCase().trim()
  const cues = [
    'ça ne marche pas', 'tu comprends rien', 'nul', 'mauvais', 'énervé', 'fâché', 'agacé',
    'stop', 'arrête', 'ça suffit', 'trop long', 'tu répètes', 'toujours la même',
    'je t\'ai déjà dit', 'tu m\'écoutes pas', 'pas content', 'insupportable',
    'l\'humain', 'pas toi', 'passe moi', 'ça m\'énerve',
  ]
  const hasCue = cues.some(c => lower.includes(c))
  const hasUppercase = text.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ]/g, '').length > 5 &&
    text.split('').filter(c => c >= 'A' && c <= 'Z').length > text.length * 0.4
  const repeatedChars = /(.)\1{4,}/.test(text)
  const veryShort = text.length < 3 && text.trim().length > 0
  return hasCue || hasUppercase || repeatedChars || veryShort
}
