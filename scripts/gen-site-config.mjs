/**
 * Génère src/config/site.generated.ts à partir de config/site.yaml.
 *
 * Le site tourne dans le navigateur : on ne peut donc PAS lire le YAML au
 * runtime avec `fs`. On le transforme donc en module TS au build (script lancé
 * par `predev` et `prebuild`). Édite config/site.yaml, jamais le fichier généré.
 */

import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parse } from 'yaml'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')

const banner = (src) =>
  '// ⚠️ FICHIER GÉNÉRÉ — NE PAS ÉDITER.\n' +
  `// Source : ${src} — régénéré par \`npm run gen:config\`.\n\n`

// ── 1. Config du site (YAML → TS) ───────────────────────────
const data = parse(readFileSync(resolve(root, 'config/site.yaml'), 'utf8'))
writeFileSync(
  resolve(root, 'src/config/site.generated.ts'),
  banner('config/site.yaml') + `export const siteData = ${JSON.stringify(data, null, 2)} as const\n`
)
console.log('[gen:config] src/config/site.generated.ts généré')

// ── 2. Images du catalogue (scan des dossiers → TS) ─────────
// Convention : public/catalogue/<ref>/*.jpg  et  public/services/<catégorie>.jpg
const IMG_RE = /\.(jpe?g|png|webp|avif|gif)$/i

function scanCatalogue() {
  const dir = resolve(root, 'public/catalogue')
  const map = {}
  if (!existsSync(dir)) return map
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue
    const files = readdirSync(resolve(dir, entry.name))
      .filter((f) => IMG_RE.test(f))
      .sort()
      .map((f) => `/catalogue/${entry.name}/${f}`)
    if (files.length) map[entry.name.toLowerCase()] = files
  }
  return map
}

function scanServices() {
  const dir = resolve(root, 'public/services')
  const map = {}
  if (!existsSync(dir)) return map
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isFile() && IMG_RE.test(entry.name)) {
      map[entry.name.replace(IMG_RE, '').toLowerCase()] = `/services/${entry.name}`
    }
  }
  return map
}

const catalogueImages = scanCatalogue()
const serviceImages = scanServices()

writeFileSync(
  resolve(root, 'src/data/images.generated.ts'),
  banner('public/catalogue/ et public/services/') +
    `export const catalogueImages: Record<string, string[]> = ${JSON.stringify(catalogueImages, null, 2)}\n\n` +
    `export const serviceImages: Record<string, string> = ${JSON.stringify(serviceImages, null, 2)}\n`
)
console.log(
  `[gen:config] src/data/images.generated.ts généré (${Object.keys(catalogueImages).length} produits, ${Object.keys(serviceImages).length} services)`
)
