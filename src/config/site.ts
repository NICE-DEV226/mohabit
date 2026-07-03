/**
 * Configuration du site — API publique consommée par toute l'app.
 *
 * 👉 Le paramétrage se fait dans `config/site.yaml` (généré en TS par
 * `scripts/gen-site-config.mjs`). Ce fichier ne fait qu'assembler les données
 * générées + les parties dynamiques (numéro WhatsApp depuis .env, fonctions
 * de message). Édite le .yaml, pas ce fichier.
 */

import { siteData } from './site.generated'

const brandName = siteData.brand.name

// Numéro WhatsApp : priorité à la variable d'env (publique), sinon fallback YAML.
const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP || siteData.contact.whatsappFallback

export const siteConfig = {
  ...siteData,
  contact: {
    ...siteData.contact,
    /** Numéro WhatsApp effectif (env > fallback), au format wa.me */
    whatsapp,
  },
  whatsapp: {
    quoteMessage: siteData.whatsapp.quoteMessage.replace(/\{brand\}/g, brandName),
    productMessage: (product: string) =>
      siteData.whatsapp.productMessageTemplate
        .replace(/\{brand\}/g, brandName)
        .replace(/\{product\}/g, product),
  },
}

export type SiteConfig = typeof siteConfig
