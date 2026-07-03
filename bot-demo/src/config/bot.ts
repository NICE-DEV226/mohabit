/**
 * Chargeur de la config du bot.
 *
 * 👉 Le paramétrage se fait dans `config/bot.yaml` (à la racine de bot-demo).
 * Ce fichier ne fait que lire ce YAML, le valider et l'exposer typé au reste
 * du code. En principe tu n'as pas à le modifier — édite le .yaml.
 */

import { readFileSync } from 'fs'
import { resolve } from 'path'
import { parse } from 'yaml'

export interface BotConfig {
  brand: string
  city: string
  country: string
  catalogueUrl: string
  persona: string
  facts: string[]
  collect: { key: string; label: string }[]
  guidelines: string[]
  rules: { handoff: string; finalize: string }
}

// bot.yaml vit à bot-demo/config/bot.yaml ; ce fichier est à bot-demo/src/config/
const CONFIG_PATH = resolve(__dirname, '../../config/bot.yaml')

function loadConfig(): BotConfig {
  try {
    const raw = readFileSync(CONFIG_PATH, 'utf8')
    const cfg = parse(raw) as BotConfig
    // Validation minimale : on échoue vite et clairement si le YAML est cassé.
    if (!cfg?.brand || !Array.isArray(cfg.collect) || !cfg.rules) {
      throw new Error('Champs requis manquants (brand, collect, rules)')
    }
    return cfg
  } catch (err) {
    console.error(`[Config] Impossible de charger ${CONFIG_PATH}:`, (err as Error).message)
    throw err
  }
}

export const botConfig: BotConfig = loadConfig()
