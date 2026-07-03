export function isBusinessHours(): boolean {
  const now = new Date()
  const hour = now.getHours()
  const day = now.getDay()
  return day >= 1 && day <= 5 && hour >= 9 && hour < 18
}

export function greetingMessage(): string {
  return isBusinessHours()
    ? 'Nos conseillers sont disponibles en ce moment même. Vous aurez une réponse rapide !'
    : 'Nos conseillers sont disponibles de 09h à 18h (lun–ven). Vous serez contacté dès leur retour.'
}

export function confirmationMessage(name: string): string {
  const now = new Date()
  const hour = now.getHours()
  const isLate = hour >= 18 || hour < 9

  if (isLate) {
    return `Merci *${name}* ! 🙏\n` +
      `Votre demande a bien été reçue.\n` +
      `Nos conseillers vous contacteront dès demain matin (09h).\n` +
      `Bonne soirée !`
  }
  return `Merci *${name}* ! 🙏\n` +
    `Un conseiller Modu Habitat va vous contacter très prochainement.\n` +
    `Bonne journée !`
}
