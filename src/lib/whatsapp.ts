import { siteConfig } from '@/config/site'

const PHONE = siteConfig.contact.whatsapp

export function waLink(message: string) {
  return `https://wa.me/${PHONE}?text=${encodeURIComponent(message)}`
}

export function waMessage(product: string) {
  return siteConfig.whatsapp.productMessage(product)
}
