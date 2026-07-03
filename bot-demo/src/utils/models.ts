export interface Model {
  ref: string
  name: string
  area: number
  bedrooms: number
  bathrooms: number
  type: 'plain-pied' | 'etage'
  floors: number
}

export const models: Model[] = [
  { ref: 'DQ101', name: 'Studio Modulaire',     area: 24,   bedrooms: 1, bathrooms: 1, type: 'plain-pied', floors: 1 },
  { ref: 'DQ102', name: 'Studio Confort',        area: 42,   bedrooms: 1, bathrooms: 1, type: 'plain-pied', floors: 1 },
  { ref: 'DQ103', name: 'T2 Économique',         area: 60,   bedrooms: 2, bathrooms: 1, type: 'plain-pied', floors: 1 },
  { ref: 'DQ104', name: 'T2 Familial',           area: 55,   bedrooms: 2, bathrooms: 1, type: 'plain-pied', floors: 1 },
  { ref: 'DQ105', name: 'T2 Duplex',             area: 50,   bedrooms: 2, bathrooms: 2, type: 'plain-pied', floors: 1 },
  { ref: 'DQ106', name: 'T3 Standard',           area: 77,   bedrooms: 2, bathrooms: 1, type: 'plain-pied', floors: 1 },
  { ref: 'DQ107', name: 'T3 Confort',            area: 100,  bedrooms: 2, bathrooms: 1, type: 'plain-pied', floors: 1 },
  { ref: 'DQ108', name: 'T4 Moderne',            area: 105,  bedrooms: 3, bathrooms: 2, type: 'plain-pied', floors: 1 },
  { ref: 'DQ109', name: 'T4 Familial',           area: 120,  bedrooms: 3, bathrooms: 2, type: 'plain-pied', floors: 1 },
  { ref: 'DQ110', name: 'T5 Espace',             area: 128,  bedrooms: 4, bathrooms: 2, type: 'plain-pied', floors: 1 },
  { ref: 'DQ111', name: 'T4 Luxe',               area: 133,  bedrooms: 3, bathrooms: 2, type: 'plain-pied', floors: 1 },
  { ref: 'DQ112', name: 'T4 Prestige',           area: 137,  bedrooms: 3, bathrooms: 2, type: 'plain-pied', floors: 1 },
  { ref: 'DQ113', name: 'T5 Grand Confort',      area: 186.5, bedrooms: 4, bathrooms: 2, type: 'plain-pied', floors: 1 },
  { ref: 'DQ114', name: 'Villa 3 Suites',        area: 225,  bedrooms: 3, bathrooms: 3, type: 'plain-pied', floors: 1 },
  { ref: 'DQ115', name: 'Villa 4 Suites',        area: 268,  bedrooms: 3, bathrooms: 4, type: 'plain-pied', floors: 1 },
  { ref: 'DQ201', name: 'T3 Duplex',             area: 85,   bedrooms: 3, bathrooms: 1, type: 'etage',   floors: 2 },
  { ref: 'DQ202', name: 'T3 Duplex Confort',     area: 130,  bedrooms: 3, bathrooms: 2, type: 'etage',   floors: 2 },
  { ref: 'DQ203', name: 'T4 Duplex',             area: 140,  bedrooms: 4, bathrooms: 2, type: 'etage',   floors: 2 },
  { ref: 'DQ204', name: 'T4 Duplex Supérieur',   area: 158,  bedrooms: 4, bathrooms: 3, type: 'etage',   floors: 2 },
  { ref: 'DQ205', name: 'Duplex Prestige',       area: 163,  bedrooms: 3, bathrooms: 3, type: 'etage',   floors: 2 },
  { ref: 'DQ206', name: 'Villa Duplex 4 Ch.',    area: 240,  bedrooms: 4, bathrooms: 3, type: 'etage',   floors: 2 },
  { ref: 'DQ207', name: 'Duplex 3 Suites Luxe',  area: 260,  bedrooms: 3, bathrooms: 3, type: 'etage',   floors: 2 },
  { ref: 'DQ208', name: 'Villa Duplex 4 Suites', area: 300,  bedrooms: 4, bathrooms: 4, type: 'etage',   floors: 2 },
  { ref: 'DQ209', name: 'Villa Prestige 5 Suites', area: 356, bedrooms: 5,bathrooms: 4, type: 'etage',   floors: 2 },
]

export function findModel(text: string): Model | undefined {
  const match = text.toUpperCase().match(/DQ\d{3}/)
  if (!match) return undefined
  return models.find((m) => m.ref === match[0])
}

export function modelSummary(m: Model): string {
  return `${m.ref} — ${m.name} (${m.area}m², ${m.bedrooms} ch., ${m.bathrooms} sdb)`
}
