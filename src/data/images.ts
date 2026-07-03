/**
 * Images du catalogue — résolution par convention de dossier.
 *
 * Déposer les fichiers ; ils sont scannés au build (npm run gen:config) :
 *   • Photos d'un produit : public/catalogue/<ref>/*.jpg  (ex: public/catalogue/dq103/1.jpg)
 *   • Image d'une catégorie : public/services/<catégorie>.jpg (ex: public/services/maison-acier.jpg)
 *
 * Cascade de fallback : photos du produit → image de service de sa catégorie → [] (placeholder UI).
 */

import { catalogueImages, serviceImages } from './images.generated'

export function getServiceImage(category: string): string | null {
  return serviceImages[category.toLowerCase()] ?? null
}

export function getModelImages(model: { slug: string; category: string }): string[] {
  const own = catalogueImages[model.slug.toLowerCase()]
  if (own?.length) return own
  const service = getServiceImage(model.category)
  return service ? [service] : []
}
