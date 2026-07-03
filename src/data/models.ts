export interface Model {
  ref: string
  slug: string
  name: string
  area: number
  bedrooms: number
  bathrooms: number
  type: 'plain-pied' | 'etage'
  floors: number
  category: 'maison-acier' | 'conteneur' | 'modulaire'
  description: string
  specs: Record<string, string>
  images: string[]
}

export const models: Model[] = [
  {
    ref: 'DQ101', slug: 'dq101', name: 'Studio Modulaire',
    area: 24, bedrooms: 1, bathrooms: 1, type: 'plain-pied', floors: 1,
    category: 'maison-acier',
    description: 'Studio compact et fonctionnel, idéal pour une personne ou un petit bureau. Montage rapide, entretien minimal.',
    specs: { isolation: 'Δ ≥ 10°C', sismic: '8.5 degrés', fire: '≥ 4 heures', wind: '≥ 150 km/h', sound: '≥ 45 dB' },
    images: [],
  },
  {
    ref: 'DQ102', slug: 'dq102', name: 'Studio Confort',
    area: 42, bedrooms: 1, bathrooms: 1, type: 'plain-pied', floors: 1,
    category: 'maison-acier',
    description: 'Studio spacieux avec coin salon. Parfait pour célibataire ou location meublée.',
    specs: { isolation: 'Δ ≥ 10°C', sismic: '8.5 degrés', fire: '≥ 4 heures', wind: '≥ 150 km/h', sound: '≥ 45 dB' },
    images: [],
  },
  {
    ref: 'DQ103', slug: 'dq103', name: 'T2 Économique',
    area: 60, bedrooms: 2, bathrooms: 1, type: 'plain-pied', floors: 1,
    category: 'maison-acier',
    description: 'Logement 2 pièces économique, idéal pour un jeune couple ou investissement locatif.',
    specs: { isolation: 'Δ ≥ 10°C', sismic: '8.5 degrés', fire: '≥ 4 heures', wind: '≥ 150 km/h', sound: '≥ 45 dB' },
    images: [],
  },
  {
    ref: 'DQ104', slug: 'dq104', name: 'T2 Familial',
    area: 55, bedrooms: 2, bathrooms: 1, type: 'plain-pied', floors: 1,
    category: 'maison-acier',
    description: 'Agencement optimisé pour petite famille. Séjour lumineux et chambres confortables.',
    specs: { isolation: 'Δ ≥ 10°C', sismic: '8.5 degrés', fire: '≥ 4 heures', wind: '≥ 150 km/h', sound: '≥ 45 dB' },
    images: [],
  },
  {
    ref: 'DQ105', slug: 'dq105', name: 'T2 Duplex',
    area: 50, bedrooms: 2, bathrooms: 2, type: 'plain-pied', floors: 1,
    category: 'maison-acier',
    description: 'T2 avec deux salles de bain, confort supérieur pour petits espaces.',
    specs: { isolation: 'Δ ≥ 10°C', sismic: '8.5 degrés', fire: '≥ 4 heures', wind: '≥ 150 km/h', sound: '≥ 45 dB' },
    images: [],
  },
  {
    ref: 'DQ106', slug: 'dq106', name: 'T3 Standard',
    area: 77, bedrooms: 2, bathrooms: 1, type: 'plain-pied', floors: 1,
    category: 'maison-acier',
    description: 'Maison 3 pièces avec grand séjour. Le choix idéal pour une famille débutante.',
    specs: { isolation: 'Δ ≥ 10°C', sismic: '8.5 degrés', fire: '≥ 4 heures', wind: '≥ 150 km/h', sound: '≥ 45 dB' },
    images: [],
  },
  {
    ref: 'DQ107', slug: 'dq107', name: 'T3 Confort',
    area: 100, bedrooms: 2, bathrooms: 1, type: 'plain-pied', floors: 1,
    category: 'maison-acier',
    description: 'Maison 100m² avec grand séjour et cuisine américaine. Belle luminosité.',
    specs: { isolation: 'Δ ≥ 10°C', sismic: '8.5 degrés', fire: '≥ 4 heures', wind: '≥ 150 km/h', sound: '≥ 45 dB' },
    images: [],
  },
  {
    ref: 'DQ108', slug: 'dq108', name: 'T4 Moderne',
    area: 105, bedrooms: 3, bathrooms: 2, type: 'plain-pied', floors: 1,
    category: 'maison-acier',
    description: 'Maison 4 pièces moderne avec deux salles de bain. Parfait pour famille avec enfants.',
    specs: { isolation: 'Δ ≥ 10°C', sismic: '8.5 degrés', fire: '≥ 4 heures', wind: '≥ 150 km/h', sound: '≥ 45 dB' },
    images: [],
  },
  {
    ref: 'DQ109', slug: 'dq109', name: 'T4 Familial',
    area: 120, bedrooms: 3, bathrooms: 2, type: 'plain-pied', floors: 1,
    category: 'maison-acier',
    description: 'Grande maison familiale avec espace repas dédié. Confort et fonctionnalité.',
    specs: { isolation: 'Δ ≥ 10°C', sismic: '8.5 degrés', fire: '≥ 4 heures', wind: '≥ 150 km/h', sound: '≥ 45 dB' },
    images: [],
  },
  {
    ref: 'DQ110', slug: 'dq110', name: 'T5 Espace',
    area: 128, bedrooms: 4, bathrooms: 2, type: 'plain-pied', floors: 1,
    category: 'maison-acier',
    description: 'Maison 5 pièces avec 4 chambres. Idéale pour grande famille ou colocation.',
    specs: { isolation: 'Δ ≥ 10°C', sismic: '8.5 degrés', fire: '≥ 4 heures', wind: '≥ 150 km/h', sound: '≥ 45 dB' },
    images: [],
  },
  {
    ref: 'DQ111', slug: 'dq111', name: 'T4 Luxe',
    area: 133, bedrooms: 3, bathrooms: 2, type: 'plain-pied', floors: 1,
    category: 'maison-acier',
    description: 'Maison de luxe avec finitions haut de gamme. Séjour cathédrale et dressing.',
    specs: { isolation: 'Δ ≥ 10°C', sismic: '8.5 degrés', fire: '≥ 4 heures', wind: '≥ 150 km/h', sound: '≥ 45 dB' },
    images: [],
  },
  {
    ref: 'DQ112', slug: 'dq112', name: 'T4 Prestige',
    area: 137, bedrooms: 3, bathrooms: 2, type: 'plain-pied', floors: 1,
    category: 'maison-acier',
    description: 'Prestige et espace. Grande suite parentale avec dressing et salle d\'eau privative.',
    specs: { isolation: 'Δ ≥ 10°C', sismic: '8.5 degrés', fire: '≥ 4 heures', wind: '≥ 150 km/h', sound: '≥ 45 dB' },
    images: [],
  },
  {
    ref: 'DQ113', slug: 'dq113', name: 'T5 Grand Confort',
    area: 186.5, bedrooms: 4, bathrooms: 2, type: 'plain-pied', floors: 1,
    category: 'maison-acier',
    description: 'Grande maison 5 pièces. Séjour monumental, cuisine indépendante, buanderie.',
    specs: { isolation: 'Δ ≥ 10°C', sismic: '8.5 degrés', fire: '≥ 4 heures', wind: '≥ 150 km/h', sound: '≥ 45 dB' },
    images: [],
  },
  {
    ref: 'DQ114', slug: 'dq114', name: 'Villa 3 Suites',
    area: 225, bedrooms: 3, bathrooms: 3, type: 'plain-pied', floors: 1,
    category: 'maison-acier',
    description: 'Villa de standing avec 3 suites parentales. Espaces généreux, finition premium.',
    specs: { isolation: 'Δ ≥ 10°C', sismic: '8.5 degrés', fire: '≥ 4 heures', wind: '≥ 150 km/h', sound: '≥ 45 dB' },
    images: [],
  },
  {
    ref: 'DQ115', slug: 'dq115', name: 'Villa 4 Suites',
    area: 268, bedrooms: 3, bathrooms: 4, type: 'plain-pied', floors: 1,
    category: 'maison-acier',
    description: 'Villa de luxe 4 salles de bain. Prestige absolu en plain-pied.',
    specs: { isolation: 'Δ ≥ 10°C', sismic: '8.5 degrés', fire: '≥ 4 heures', wind: '≥ 150 km/h', sound: '≥ 45 dB' },
    images: [],
  },
  {
    ref: 'DQ201', slug: 'dq201', name: 'T3 Duplex',
    area: 85, bedrooms: 3, bathrooms: 1, type: 'etage', floors: 2,
    category: 'maison-acier',
    description: 'Duplex économique avec 3 chambres. Vie jour/nuit séparée sur deux niveaux.',
    specs: { isolation: 'Δ ≥ 10°C', sismic: '8.5 degrés', fire: '≥ 4 heures', wind: '≥ 150 km/h', sound: '≥ 45 dB' },
    images: [],
  },
  {
    ref: 'DQ202', slug: 'dq202', name: 'T3 Duplex Confort',
    area: 130, bedrooms: 3, bathrooms: 2, type: 'etage', floors: 2,
    category: 'maison-acier',
    description: 'Duplex spacieux 3 chambres, 2 salles de bain. Terrasse panoramique à l\'étage.',
    specs: { isolation: 'Δ ≥ 10°C', sismic: '8.5 degrés', fire: '≥ 4 heures', wind: '≥ 150 km/h', sound: '≥ 45 dB' },
    images: [],
  },
  {
    ref: 'DQ203', slug: 'dq203', name: 'T4 Duplex',
    area: 140, bedrooms: 4, bathrooms: 2, type: 'etage', floors: 2,
    category: 'maison-acier',
    description: 'Duplex 4 chambres. Idéal pour famille nombreuse avec séparation jour/nuit.',
    specs: { isolation: 'Δ ≥ 10°C', sismic: '8.5 degrés', fire: '≥ 4 heures', wind: '≥ 150 km/h', sound: '≥ 45 dB' },
    images: [],
  },
  {
    ref: 'DQ204', slug: 'dq204', name: 'T4 Duplex Supérieur',
    area: 158, bedrooms: 4, bathrooms: 3, type: 'etage', floors: 2,
    category: 'maison-acier',
    description: 'Duplex supérieur 4 chambres, 3 salles de bain. Confort familial haut de gamme.',
    specs: { isolation: 'Δ ≥ 10°C', sismic: '8.5 degrés', fire: '≥ 4 heures', wind: '≥ 150 km/h', sound: '≥ 45 dB' },
    images: [],
  },
  {
    ref: 'DQ205', slug: 'dq205', name: 'Duplex Prestige',
    area: 163, bedrooms: 3, bathrooms: 3, type: 'etage', floors: 2,
    category: 'maison-acier',
    description: 'Duplex prestige 3 suites parentales. Chaque niveau avec salle d\'eau privative.',
    specs: { isolation: 'Δ ≥ 10°C', sismic: '8.5 degrés', fire: '≥ 4 heures', wind: '≥ 150 km/h', sound: '≥ 45 dB' },
    images: [],
  },
  {
    ref: 'DQ206', slug: 'dq206', name: 'Villa Duplex 4 Chambres',
    area: 240, bedrooms: 4, bathrooms: 3, type: 'etage', floors: 2,
    category: 'maison-acier',
    description: 'Villa duplex avec 4 chambres et 3 salles de bain. Espaces de réception généreux.',
    specs: { isolation: 'Δ ≥ 10°C', sismic: '8.5 degrés', fire: '≥ 4 heures', wind: '≥ 150 km/h', sound: '≥ 45 dB' },
    images: [],
  },
  {
    ref: 'DQ207', slug: 'dq207', name: 'Duplex 3 Suites Luxe',
    area: 260, bedrooms: 3, bathrooms: 3, type: 'etage', floors: 2,
    category: 'maison-acier',
    description: 'Duplex de luxe 3 suites. Prestige, volume et finitions d\'exception.',
    specs: { isolation: 'Δ ≥ 10°C', sismic: '8.5 degrés', fire: '≥ 4 heures', wind: '≥ 150 km/h', sound: '≥ 45 dB' },
    images: [],
  },
  {
    ref: 'DQ208', slug: 'dq208', name: 'Villa Duplex 4 Suites',
    area: 300, bedrooms: 4, bathrooms: 4, type: 'etage', floors: 2,
    category: 'maison-acier',
    description: 'Villa duplex 4 suites parentales. Le summum du confort pour grande famille.',
    specs: { isolation: 'Δ ≥ 10°C', sismic: '8.5 degrés', fire: '≥ 4 heures', wind: '≥ 150 km/h', sound: '≥ 45 dB' },
    images: [],
  },
  {
    ref: 'DQ209', slug: 'dq209', name: 'Villa Prestige 5 Suites',
    area: 356, bedrooms: 5, bathrooms: 4, type: 'etage', floors: 2,
    category: 'maison-acier',
    description: 'Villa prestige 5 chambres, 4 salles de bain. La plus grande réalisation Daquan.',
    specs: { isolation: 'Δ ≥ 10°C', sismic: '8.5 degrés', fire: '≥ 4 heures', wind: '≥ 150 km/h', sound: '≥ 45 dB' },
    images: [],
  },
]

export const modelBySlug: Record<string, Model> = Object.fromEntries(
  models.map((m) => [m.slug, m])
)

export function getModel(slug: string): Model | undefined {
  return modelBySlug[slug]
}

export const plainPiedModels = models.filter((m) => m.type === 'plain-pied')
export const etageModels = models.filter((m) => m.type === 'etage')

export const bedroomCounts = Array.from(new Set(models.map((m) => m.bedrooms))).sort((a, b) => a - b)
export const areaRanges = [
  { label: 'Petit (< 80m²)', min: 0, max: 80 },
  { label: 'Moyen (80–150m²)', min: 80, max: 150 },
  { label: 'Grand (> 150m²)', min: 150, max: Infinity },
]
