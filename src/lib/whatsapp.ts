const PHONE = process.env.NEXT_PUBLIC_WHATSAPP || '22600000000'

export function waLink(message: string) {
  return `https://wa.me/${PHONE}?text=${encodeURIComponent(message)}`
}

export function waMessage(product: string) {
  return `Bonjour Modu Habitat, je suis intéressé par ${product}. Puis-je avoir un devis ?`
}
