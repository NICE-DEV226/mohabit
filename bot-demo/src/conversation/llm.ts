/**
 * Couche de compréhension naturelle via Groq (API compatible OpenAI).
 *
 * Le LLM lit l'historique + les infos déjà collectées, comprend le message
 * libre (fautes, paraphrases, hors-script) et renvoie :
 *   - une réponse naturelle à envoyer
 *   - les "slots" extraits/mis à jour (modèle, usage, zone, budget, prénom, tel)
 *   - une action déterministe pour le code : continuer / finaliser / transférer
 *
 * Le code reste maître des actions (création de lead, notif, transfert).
 * Si GROQ_API_KEY est absente ou l'appel échoue -> l'appelant retombe sur le
 * moteur à règles (dégradation gracieuse).
 */

import { botConfig } from '../config/bot'
import { models } from '../utils/models'

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'
const MODEL = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile'
const TIMEOUT_MS = 12_000

export type ChatMessage = { role: 'user' | 'assistant'; content: string }

export type LlmSlots = Partial<
  Record<'model' | 'usage' | 'zone' | 'budget' | 'name' | 'phone', string>
>

export interface LlmTurn {
  reply: string
  slots: LlmSlots
  /** continue = poursuivre la conversation ; finalize = infos réunies + accord ; handoff = passer un humain */
  action: 'continue' | 'finalize' | 'handoff'
  /** Réponses rapides proposées au prospect (boutons). Vide pour les questions ouvertes. */
  buttons?: string[]
}

export function isLlmEnabled(): boolean {
  return Boolean(process.env.GROQ_API_KEY)
}

function catalogueSummary(): string {
  return models
    .map((m) => `${m.ref} (${m.area}m², ${m.bedrooms}ch, ${m.type})`)
    .join(', ')
}

function systemPrompt(collected: LlmSlots): string {
  const known = Object.entries(collected)
    .filter(([, v]) => v)
    .map(([k, v]) => `${k}=${v}`)
    .join(', ') || 'aucune'

  const toCollect = botConfig.collect.map((c) => `  • ${c.label}`).join('\n')
  const facts = botConfig.facts.map((f) => `  - ${f}`).join('\n')
  const guidelines = botConfig.guidelines.map((g) => `- ${g}`).join('\n')

  return [
    botConfig.persona,
    '',
    `Entreprise : ${botConfig.brand}, ${botConfig.city}, ${botConfig.country}.`,
    `Catalogue complet : ${botConfig.catalogueUrl}`,
    '',
    'Objectif : qualifier le prospect naturellement (sans interrogatoire) en récoltant, au fil de la conversation :',
    toCollect,
    '',
    'Faits que tu peux affirmer :',
    facts,
    `Références exactes du catalogue à utiliser : ${catalogueSummary()}.`,
    '',
    'Règles de conversation :',
    guidelines,
    '',
    `Infos déjà collectées : ${known}.`,
    '',
    'Actions de sortie :',
    `- action="handoff" ${botConfig.rules.handoff}.`,
    `- action="finalize" ${botConfig.rules.finalize}.`,
    '- action="continue" sinon.',
    '',
    'Boutons de réponse rapide :',
    "- Quand ta question est à CHOIX FERMÉ (usage, délai, oui/non, menu d'accueil…), propose 2 à 4 réponses courtes dans \"buttons\" (libellés ≤ 24 caractères) pour que le prospect réponde en 1 clic.",
    '- Pour les questions OUVERTES (zone, budget, prénom, numéro de téléphone), laisse "buttons" vide.',
    '- Les libellés des boutons doivent être des réponses possibles à ta question (ex: "🏠 Résidence", "🏢 Bureau", "🔑 Location").',
    '',
    'Réponds STRICTEMENT en JSON (aucun texte hors JSON) avec ce schéma :',
    '{',
    '  "reply": "<message à envoyer, français, court, style WhatsApp, gras avec *astérisques*>",',
    '  "slots": { "model": "DQ103", "usage": "...", "zone": "...", "budget": "...", "name": "...", "phone": "..." },',
    '  "action": "continue" | "finalize" | "handoff",',
    '  "buttons": ["Choix 1", "Choix 2", "Choix 3"]',
    '}',
    'Dans "slots", ne mets QUE les champs que ce message permet d\'extraire/confirmer (omets les autres). "model" doit être une référence DQ exacte. "buttons" est optionnel (omets-le ou mets [] si pas pertinent).',
  ].join('\n')
}

function normalize(raw: any): LlmTurn | null {
  if (!raw || typeof raw.reply !== 'string') return null
  const action: LlmTurn['action'] =
    raw.action === 'finalize' || raw.action === 'handoff' ? raw.action : 'continue'
  const slots: LlmSlots = {}
  const s = raw.slots || {}
  for (const key of ['model', 'usage', 'zone', 'budget', 'name', 'phone'] as const) {
    if (typeof s[key] === 'string' && s[key].trim()) slots[key] = s[key].trim()
  }

  let buttons: string[] | undefined
  if (Array.isArray(raw.buttons)) {
    const b = raw.buttons
      .filter((x: unknown) => typeof x === 'string' && x.trim())
      .map((x: string) => x.trim().slice(0, 24)) // libellés courts
      .slice(0, 4) // max 4 (au-delà -> liste)
    if (b.length) buttons = b
  }

  return { reply: raw.reply.trim(), slots, action, buttons }
}

export async function converse(
  history: ChatMessage[],
  collected: LlmSlots,
  userText: string
): Promise<LlmTurn | null> {
  const key = process.env.GROQ_API_KEY
  if (!key) return null

  const messages = [
    { role: 'system', content: systemPrompt(collected) },
    ...history,
    { role: 'user', content: userText },
  ]

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)

  try {
    const res = await fetch(GROQ_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        messages,
        temperature: 0.4,
        max_tokens: 400,
        response_format: { type: 'json_object' },
      }),
      signal: controller.signal,
    })

    if (!res.ok) {
      console.error(`[LLM] HTTP ${res.status}: ${await res.text().catch(() => '')}`)
      return null
    }

    const data = (await res.json()) as any
    const content = data.choices?.[0]?.message?.content
    if (!content) return null

    return normalize(JSON.parse(content))
  } catch (err) {
    console.error('[LLM] Erreur:', (err as Error).message)
    return null
  } finally {
    clearTimeout(timer)
  }
}
