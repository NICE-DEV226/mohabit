export interface Conversation {
  _id?: string
  phone: string
  step: string
  data: Record<string, string>
  createdAt: Date
  updatedAt: Date
}

export type Step =
  | 'idle'
  | 'menu'
  | 'usage'
  | 'zone'
  | 'name'
  | 'done'

const modelRefRegex = /\b(DQ\d{3})\b/i

const menuText = `Bonjour ! Bienvenue chez *Modu Habitat International* 👋

Nous proposons des maisons modulaires livrées en 15 à 20 jours.

Que recherchez-vous ?
1️⃣ Voir notre catalogue
2️⃣ Parler à un conseiller
3️⃣ Obtenir un devis`

function usageText(name: string): string {
  return `Merci ${name} 😊 Quelques questions rapides pour mieux vous aider.

C'est pour quel usage ?
1️⃣ Résidence principale
2️⃣ Résidence secondaire
3️⃣ Bureau / Commerce
4️⃣ Location`
}

const zoneText = `Dans quelle zone de Ouagadougou prévoyez-vous de construire ?`

const nameText = `Merci ! Et votre prénom pour qu'un conseiller vous rappelle ?`

function doneText(name: string): string {
  return `Parfait ${name} ! Un conseiller Modu Habitat vous contactera dans les 24h 🙏

Bonne journée !`
}

const catalogText = `Découvrez nos 24 modèles sur notre catalogue en ligne :

https://moduhabitat.com/catalogue

Vous pouvez aussi nous dire quel type de modèle vous intéresse pour qu'un conseiller vous aide.`

export function detectModel(text: string): string | null {
  const match = text.match(modelRefRegex)
  return match ? match[1].toUpperCase() : null
}

export function getReply(step: Step, data: Record<string, string>): string | null {
  switch (step) {
    case 'idle':
      return null
    case 'menu':
      return menuText
    case 'usage':
      return usageText(data.name || '')
    case 'zone':
      return zoneText
    case 'name':
      return nameText
    case 'done':
      return doneText(data.name || '')
  }
}

export function handleOption(step: Step, text: string): {
  nextStep: Step
  reply: string | null
  isComplete: boolean
} {
  const t = text.trim()

  switch (step) {
    case 'menu':
      if (t === '1') {
        return { nextStep: 'idle', reply: catalogText, isComplete: false }
      }
      if (t === '2' || t === '3') {
        return { nextStep: 'name', reply: nameText, isComplete: false }
      }
      return { nextStep: 'menu', reply: menuText, isComplete: false }

    case 'usage':
      if (['1', '2', '3', '4'].includes(t)) {
        return { nextStep: 'zone', reply: zoneText, isComplete: false }
      }
      return { nextStep: 'usage', reply: usageText(''), isComplete: false }

    case 'zone':
      if (t.length >= 2) {
        return { nextStep: 'name', reply: nameText, isComplete: false }
      }
      return { nextStep: 'zone', reply: zoneText, isComplete: false }

    case 'name':
      if (t.length >= 1) {
        return { nextStep: 'done', reply: doneText(t), isComplete: true }
      }
      return { nextStep: 'name', reply: nameText, isComplete: false }

    default:
      return { nextStep: 'menu', reply: menuText, isComplete: false }
  }
}

export function getInitialStep(text: string): Step {
  const model = detectModel(text)
  if (model) return 'usage'
  return 'menu'
}
