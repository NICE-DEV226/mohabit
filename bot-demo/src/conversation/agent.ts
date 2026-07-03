import { sendText } from '../messages/text'
import { sendReply } from '../messages/interactive'
import { WASocket } from '../types'
import { getSession, setSession, clearSession, ConversationState } from '../sessions/redis'
import { extractEntities, looksLikePhone, looksLikeName, isAffirmative, isFrustrated } from '../utils/extract'
import { detectIntent, getFaqAnswer, detectModel, validateBudget, Intent } from '../utils/intent'
import { insertLead } from '../db/sqlite'
import { notifyPrisca, notifyTransfer } from '../notify/prisca'
import { syncLeadToMongo } from '../sync/mongo'
import { confirmationMessage } from '../utils/time'
import { modelSummary, models } from '../utils/models'
import { converse, isLlmEnabled, ChatMessage } from './llm'

const TEAM_PHONE = process.env.TEAM_PHONE || process.env.PRISCA_NUMBER || '22601020304'

type Step = ConversationState['step']

const RATE_LIMIT_WINDOW = 10_000
const MAX_MSG_LENGTH = 500

const messageCache = new Map<string, { text: string; time: number }>()
const rateMap = new Map<string, number[]>()

function checkRateLimit(jid: string): boolean {
  const now = Date.now()
  const timestamps = rateMap.get(jid) || []
  const recent = timestamps.filter(t => now - t < RATE_LIMIT_WINDOW)
  recent.push(now)
  rateMap.set(jid, recent)
  return recent.length <= 3
}

function isDuplicate(jid: string, text: string): boolean {
  const key = `${jid}:${text}`
  const now = Date.now()
  const last = messageCache.get(key)
  if (last && now - last.time < 60_000) return true
  messageCache.set(key, { text, time: now })
  if (messageCache.size > 500) {
    const oldest = Date.now() - 120_000
    for (const [k, v] of messageCache) if (v.time < oldest) messageCache.delete(k)
  }
  return false
}

function capitalizeName(name: string): string {
  return name
    .trim()
    .split(/[\s-]+/)
    .map(part => {
      if (part.includes('-')) {
        return part.split('-').map(p => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase()).join('-')
      }
      return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
    })
    .join(' ')
}

function modelChoiceMessage(): string {
  const all = models.map(m => `• ${m.ref} — ${m.type}, ${m.bedrooms} pièces, ${m.area}m²`).join('\n')
  return `Voici nos modèles disponibles :\n\n${all}\n\nQuel modèle vous intéresse ? (ex: DQ101)`
}

function askNextQuestion(session: ConversationState, justAcknowledged?: string): { text: string; step: Step } {
  const s = { ...session }

  if (!s.model) {
    return {
      text: justAcknowledged
        ? `${justAcknowledged} Quel modèle vous intéresse parmi nos 24 modèles ? Vous pouvez consulter notre catalogue ici : https://moduhabitat.com/catalogue`
        : `Quel modèle vous intéresse parmi nos 24 modèles ? Vous pouvez consulter notre catalogue ici : https://moduhabitat.com/catalogue`,
      step: 'PROJECT',
    }
  }

  if (!s.usage) {
    return {
      text: justAcknowledged
        ? `${justAcknowledged} C'est pour quel usage ? Résidence principale, Bureau / Commerce, ou Location ?`
        : `C'est pour quel usage ? Résidence principale, Bureau / Commerce, ou Location ?`,
      step: 'USAGE',
    }
  }

  if (!s.zone) {
    return {
      text: justAcknowledged
        ? `${justAcknowledged} Dans quelle zone de Ouagadougou comptez-vous construire ?`
        : `Dans quelle zone de Ouagadougou comptez-vous construire ?`,
      step: 'ZONE',
    }
  }

  if (!s.budget) {
    return {
      text: justAcknowledged
        ? `${justAcknowledged} Avez-vous un budget approximatif en tête ? (ex: 10M, 15M FCFA)`
        : `Avez-vous un budget approximatif en tête ? (ex: 10M, 15M FCFA)`,
      step: 'BUDGET',
    }
  }

  if (!s.name) {
    return {
      text: justAcknowledged
        ? `${justAcknowledged} Puis-je avoir votre prénom ?`
        : `Puis-je avoir votre prénom ?`,
      step: 'NAME',
    }
  }

  if (!s.phone) {
    return {
      text: justAcknowledged
        ? `${justAcknowledged} Et votre numéro de téléphone ?`
        : `Et votre numéro de téléphone ?`,
      step: 'PHONE',
    }
  }

  const model = models.find(m => m.ref === s.model)
  const summary = [
    `📋 Récapitulatif de votre demande :`,
    model ? `• Modèle : ${modelSummary(model)}` : `• Modèle : ${s.model}`,
    `• Usage : ${s.usage}`,
    `• Zone : ${s.zone}`,
    `• Budget : ${s.budget}`,
    `• Nom : ${s.name}`,
    `• Téléphone : ${s.phone}`,
    ``,
    `Tout est correct ? (oui / non)`,
  ].join('\n')

  return { text: summary, step: 'CONFIRM' }
}

function welcomeMessage(name?: string): string {
  if (name) {
    return `Bonjour ${name} ! 👋 Heureux de vous revoir chez *Modu Habitat International*.\n\nQue puis-je pour vous aujourd'hui ?`
  }
  return `Bonjour ! 👋 Bienvenue chez *Modu Habitat International*.\n\nNous concevons et livrons des maisons modulaires en acier à Ouagadougou en *15 à 20 jours*.\n\nQue puis-je pour vous ? Vous cherchez un modèle en particulier, un devis, ou des informations ?`
}

function acknowledgeEntity(key: string, value: string): string | null {
  const acknowledgments: Record<string, string[]> = {
    model: [
      `Excellent choix ! Le ${value} est un très beau modèle.`,
      `Le ${value}, une très bonne sélection !`,
      `Parfait, le ${value} est disponible.`,
    ],
    usage: [
      `Très bien !`,
      `Parfait !`,
      `Compris !`,
    ],
    zone: [
      `${value}, une belle zone !`,
      `${value}, très bien !`,
      `${value}, parfait !`,
    ],
    budget: [
      `Parfait, ça correspond tout à fait à nos modèles.`,
      `Très bien, c'est une enveloppe cohérente.`,
      `Parfait !`,
    ],
  }

  const options = acknowledgments[key]
  if (!options) return null
  return options[Math.floor(Math.random() * options.length)]
}

async function requestInfo(sock: WASocket, jid: string, session: ConversationState, step: Step, prompt: string) {
  await sendText(sock, jid, prompt)
  await setSession(jid, { ...session, step })
}

async function transferToHuman(sock: WASocket, jid: string, session: ConversationState) {
  if (session.phone || session.name) {
    await notifyTransfer(sock, session.phone || 'Non renseigné', session.name || 'Prospect')
    await sendText(sock, jid,
      `Je vous passe un conseiller. 🙏\n` +
      `Un agent va vous contacter au ${session.phone || 'numéro renseigné'}.\n` +
      `Merci pour votre confiance !`
    )
  } else {
    await sendText(sock, jid, `Je comprends. Quel est votre numéro de téléphone pour qu'on vous contacte ?`)
    const updated = { ...session, step: 'PHONE' as Step, transfer: true }
    await setSession(jid, updated)
    return
  }
  await setSession(jid, { ...session, step: 'TRANSFER' as Step })
}

/** Persiste le lead (SQLite + Mongo) et notifie l'équipe. N'envoie AUCUN message au prospect. */
function persistLead(sock: WASocket, session: ConversationState) {
  const name = session.name || 'Prospect'
  const phone = session.phone || 'Non fourni'

  insertLead({
    name,
    phone,
    model: session.model,
    usage: session.usage,
    zone: session.zone,
    budget: session.budget,
    source: 'WhatsApp',
  })

  console.log(`[Lead] ${name} (${phone})`)

  syncLeadToMongo({
    name,
    phone,
    model: session.model,
    usage: session.usage,
    zone: session.zone,
    budget: session.budget,
    source: 'WhatsApp',
  })

  notifyPrisca(sock, { name, phone, model: session.model, usage: session.usage, zone: session.zone, source: 'WhatsApp' })
}

async function qualifyAndFinish(sock: WASocket, jid: string, session: ConversationState): Promise<string> {
  const name = session.name || 'Prospect'
  persistLead(sock, session)
  return confirmationMessage(name)
}

async function handleConversationRules(sock: WASocket, jid: string, text: string) {
  const truncated = text.length > MAX_MSG_LENGTH ? text.slice(0, MAX_MSG_LENGTH) + '…' : text
  const session = await getSession(jid)
  const intent = detectIntent(truncated, session.previousIntent as Intent | undefined)
  const entities = extractEntities(truncated)
  const modelRef = entities.model || detectModel(truncated)
  const frustrated = isFrustrated(truncated)

  console.log(`[Agent] step=${session.step} intent=${intent} frustrated=${frustrated} msg="${truncated.slice(0, 60)}"`)

  const merged: ConversationState = {
    ...session,
    attempts: 0,
    previousIntent: intent,
    model: modelRef || session.model,
    usage: entities.usage || session.usage,
    zone: entities.zone || session.zone,
    budget: entities.budget || session.budget,
    name: entities.name || session.name,
    phone: entities.phone || session.phone,
    frustrated: frustrated || session.frustrated || false,
  }

  // Frustrated user -> fast track to human (unless explicitly asking for conseiller)
  if (frustrated && intent !== 'conseiller' && intent !== 'transfert' && !session.transfer) {
    merged.frustrated = true
    if (session.attempts && session.attempts >= 1) {
      await transferToHuman(sock, jid, merged)
      return
    }
    await sendText(sock, jid,
      `Je vois que vous n'êtes pas satisfait(e). 😕 Je vais faire de mon mieux pour vous aider. ` +
      `Dites-moi ce que vous cherchez et je vous guiderai, ou je peux vous passer un conseiller si vous préférez.`
    )
    await setSession(jid, { ...merged, step: session.step || 'GREETING', attempts: (session.attempts || 0) + 1 })
    return
  }

  // Transfer or human request at any point
  if (intent === 'conseiller' || intent === 'transfert') {
    await transferToHuman(sock, jid, merged)
    return
  }

  // User declines (not interested, maybe later)
  if (intent === 'refuse') {
    await sendText(sock, jid,
      `Pas de problème ! 😊\n` +
      `N'hésitez pas à revenir quand vous voulez. Vous pouvez aussi consulter notre catalogue ici :\n` +
      `👉 https://moduhabitat.com/catalogue\n\n` +
      `Bonne journée !`
    )
    await clearSession(jid)
    return
  }

  // FAQ intents (price, delay, quality, contact)
  if (intent === 'prix' || intent === 'delai' || intent === 'qualite' || intent === 'contact') {
    const answer = getFaqAnswer(intent)
    if (answer) {
      await sendText(sock, jid, answer)
    }
    // After FAQ, if we're in an active qualification, continue. Otherwise offer.
    if (session.step !== 'IDLE' && session.step !== 'GREETING') {
      const { text: next, step } = askNextQuestion(merged)
      await sendText(sock, jid, next)
      await setSession(jid, { ...merged, step })
      return
    }
    await sendText(sock, jid, `Souhaitez-vous que je prépare un devis personnalisé pour votre projet ?`)
    await setSession(jid, { ...merged, step: 'GREETING' })
    return
  }

  // Catalogue request
  if (intent === 'catalogue') {
    let msg = `🏘️ Découvrez nos 24 modèles :\n👉 https://moduhabitat.com/catalogue\n\n`
    if (merged.model) {
      const model = models.find(m => m.ref === merged.model)
      msg += model ? `Le ${modelSummary(model)} est disponible.\n\n` : `Le ${merged.model} est dans notre catalogue.\n\n`
    }
    msg += `Souhaitez-vous un devis pour un modèle en particulier ?`
    await sendText(sock, jid, msg)
    await setSession(jid, { ...merged, step: 'GREETING' })
    return
  }

  // Devis intent: jump into qualification flow
  if (intent === 'devis') {
    if (merged.model || merged.usage || merged.zone || merged.budget || merged.name || merged.phone) {
      const { text: next, step } = askNextQuestion(merged)
      await sendText(sock, jid, next)
      await setSession(jid, { ...merged, step })
      return
    }
    await sendText(sock, jid,
      `Je peux vous établir un devis personnalisé. 🏠\n` +
      `Dites-moi d'abord : quel type de projet avez-vous en tête ? (ex: maison d'habitation, bureau, location)`
    )
    await setSession(jid, { ...merged, step: 'USAGE' })
    return
  }

  // --- State machine ---

  if (session.step === 'DONE') {
    await clearSession(jid)
    await sendText(sock, jid, welcomeMessage())
    await setSession(jid, { step: 'GREETING' as Step, source: 'direct', attempts: 0 })
    return
  }

  if (session.step === 'IDLE' || session.step === 'GREETING') {
    if (merged.model || merged.usage || merged.zone || merged.budget || merged.name || merged.phone) {
      const { text: next, step } = askNextQuestion(merged)
      await sendText(sock, jid, next)
      await setSession(jid, { ...merged, step })
      return
    }
    await sendText(sock, jid, welcomeMessage())
    await setSession(jid, { ...merged, step: 'GREETING' })
    return
  }

  // Confirmation handling
  if (session.step === 'CONFIRM') {
    if (isAffirmative(truncated) || intent === 'oui') {
      const msg = await qualifyAndFinish(sock, jid, merged)
      await sendText(sock, jid, msg)
      await clearSession(jid)
      return
    }
    if (intent === 'non' || isAffirmative(truncated) === false) {
      await sendText(sock, jid,
        `D'accord, je comprends. Qu'est-ce que vous souhaitez modifier ?\n` +
        `Dites-moi : le modèle, l'usage, la zone, le budget, ou bien recommencer ?`
      )
      await setSession(jid, { ...merged, step: 'PROJECT' })
      return
    }
    // User provided new info (e.g., new phone, name) at confirm step
    if (looksLikePhone(truncated) && merged.phone !== session.phone) {
      merged.phone = truncated.replace(/[^0-9]/g, '')
      const { text: next, step } = askNextQuestion(merged, `Numéro mis à jour !`)
      await sendText(sock, jid, next)
      await setSession(jid, { ...merged, step })
      return
    }
    if (looksLikeName(truncated) && merged.name !== session.name) {
      merged.name = capitalizeName(truncated)
      const { text: next, step } = askNextQuestion(merged, `Prénom mis à jour !`)
      await sendText(sock, jid, next)
      await setSession(jid, { ...merged, step })
      return
    }
    if (modelRef && modelRef !== session.model) {
      merged.model = modelRef
      const { text: next, step } = askNextQuestion(merged, `Modèle changé pour ${modelRef} !`)
      await sendText(sock, jid, next)
      await setSession(jid, { ...merged, step })
      return
    }
    // If user didn't say oui/non and didn't provide new info, reprompt
    await sendText(sock, jid, `Tout est correct ? Répondez par *oui* ou *non*.`)
    await setSession(jid, merged)
    return
  }

  // Handle 'oui' during any non-confirm step -> advance
  if (intent === 'oui') {
    const { text: next, step } = askNextQuestion(merged)
    await sendText(sock, jid, next)
    await setSession(jid, { ...merged, step })
    return
  }

  // Handle 'non' during any non-confirm step
  if (intent === 'non') {
    const attempts = (session.attempts || 0) + 1
    merged.attempts = attempts

    if (attempts >= 2) {
      await transferToHuman(sock, jid, merged)
      return
    }
    await sendText(sock, jid, `D'accord, que puis-je faire pour vous ?`)
    await setSession(jid, { ...merged, step: 'GREETING', attempts })
    return
  }

  // Check if message contains a phone number
  if (looksLikePhone(truncated) && !merged.phone) {
    merged.phone = truncated.replace(/[^0-9]/g, '')
    if (!merged.name) {
      await sendText(sock, jid, `Merci ! Et votre prénom ?`)
      await setSession(jid, { ...merged, step: 'NAME' })
      return
    }
    const { text: next, step } = askNextQuestion(merged, `Merci ${merged.name} !`)
    await sendText(sock, jid, next)
    await setSession(jid, { ...merged, step })
    return
  }

  // Check if message looks like a name
  if (looksLikeName(truncated) && !merged.name) {
    merged.name = capitalizeName(truncated)
    if (!merged.phone) {
      await sendText(sock, jid, `Enchanté ${merged.name} ! Quel est votre numéro de téléphone ?`)
      await setSession(jid, { ...merged, step: 'PHONE' })
      return
    }
    const { text: next, step } = askNextQuestion(merged, `Merci ${merged.name} !`)
    await sendText(sock, jid, next)
    await setSession(jid, { ...merged, step })
    return
  }

  // General case: determine what info we just got
  const justGot: string[] = []
  if (merged.model && modelRef && modelRef !== session.model) justGot.push('model')
  if (merged.usage && entities.usage && entities.usage !== session.usage) justGot.push('usage')
  if (merged.zone && entities.zone && entities.zone !== session.zone) justGot.push('zone')
  if (merged.budget && entities.budget && entities.budget !== session.budget) justGot.push('budget')

  if (justGot.length > 0) {
    const ack = acknowledgeEntity(justGot[0], merged[justGot[0] as keyof ConversationState] as string)
    const { text: next, step } = askNextQuestion(merged, ack || undefined)
    await sendText(sock, jid, next)
    await setSession(jid, { ...merged, step })
    return
  }

  // Budget validation (if budget was mentioned but not as new entity)
  const budgetText = entities.budget
  if (budgetText && !session.budget) {
    const validation = validateBudget(budgetText)
    if (!validation.valid && validation.message) {
      await sendText(sock, jid, validation.message)
      await setSession(jid, { ...merged, attempts: (session.attempts || 0) + 1 })
      return
    }
  }

  // No new info extracted — progressive fallback
  const attempts = (session.attempts || 0) + 1
  merged.attempts = attempts
  merged.frustrated = frustrated || merged.frustrated || false

  if (attempts >= 3) {
    await transferToHuman(sock, jid, merged)
    return
  }

  if (attempts >= 2) {
    await sendText(sock, jid,
      `Je n'ai pas encore bien compris. 😅\n` +
      `Vous pouvez me dire par exemple :\n` +
      `• "Je cherche une maison" pour un projet\n` +
      `• "DQ101" pour un modèle précis\n` +
      `• "Prix" pour les tarifs\n` +
      `• "Conseiller" pour parler à quelqu'un`
    )
    await setSession(jid, merged)
    return
  }

  await sendText(sock, jid,
    `Je n'ai pas bien compris 😅 Pouvez-vous reformuler ?\n` +
    `Je suis là pour vous aider à trouver la maison idéale.`
  )
  await setSession(jid, merged)
}

// ─────────────────────────── Chemin LLM (conversation naturelle) ───────────────────────────

const MAX_HISTORY = 16 // 8 échanges gardés pour le contexte

/** Déduit l'étape courante à partir des infos manquantes (pour l'idle + fallback). */
function nextStepFromSlots(s: ConversationState): Step {
  if (!s.model) return 'PROJECT'
  if (!s.usage) return 'USAGE'
  if (!s.zone) return 'ZONE'
  if (!s.budget) return 'BUDGET'
  if (!s.name) return 'NAME'
  if (!s.phone) return 'PHONE'
  return 'CONFIRM'
}

async function handleConversationLLM(sock: WASocket, jid: string, text: string) {
  const truncated = text.length > MAX_MSG_LENGTH ? text.slice(0, MAX_MSG_LENGTH) + '…' : text
  const session = await getSession(jid)

  const collected = {
    model: session.model,
    usage: session.usage,
    zone: session.zone,
    budget: session.budget,
    name: session.name,
    phone: session.phone,
  }
  const history: ChatMessage[] = session.history || []

  const turn = await converse(history, collected, truncated)

  // Groq indisponible ou réponse invalide -> dégradation vers le moteur à règles.
  if (!turn) {
    await handleConversationRules(sock, jid, text)
    return
  }

  const merged: ConversationState = {
    ...session,
    model: turn.slots.model || session.model,
    usage: turn.slots.usage || session.usage,
    zone: turn.slots.zone || session.zone,
    budget: turn.slots.budget || session.budget,
    name: turn.slots.name ? capitalizeName(turn.slots.name) : session.name,
    phone: turn.slots.phone ? turn.slots.phone.replace(/[^0-9]/g, '') : session.phone,
  }

  const newHistory: ChatMessage[] = [
    ...history,
    { role: 'user' as const, content: truncated },
    { role: 'assistant' as const, content: turn.reply },
  ].slice(-MAX_HISTORY)

  // Boutons de réponse rapide uniquement pendant la conversation (pas à la clôture).
  await sendReply(sock, jid, turn.reply, turn.action === 'continue' ? turn.buttons : undefined)

  // Transfert humain demandé/détecté par le LLM.
  if (turn.action === 'handoff') {
    if (merged.phone || merged.name) {
      notifyTransfer(sock, merged.phone || 'Non renseigné', merged.name || 'Prospect')
      await clearSession(jid)
    } else {
      // Pas encore de contact : on continue pour récupérer le numéro.
      await setSession(jid, { ...merged, step: 'PHONE', transfer: true, history: newHistory })
    }
    return
  }

  // Infos réunies + accord : on crée le lead (la reply LLM sert de confirmation).
  if (turn.action === 'finalize' && merged.name && merged.phone) {
    persistLead(sock, merged)
    await clearSession(jid)
    return
  }

  await setSession(jid, { ...merged, step: nextStepFromSlots(merged), history: newHistory })
}

/**
 * Point d'entrée : rate-limit + anti-doublon communs, puis route vers le LLM
 * (si GROQ_API_KEY présente) ou le moteur à règles.
 */
export async function handleConversation(sock: WASocket, jid: string, text: string) {
  if (!checkRateLimit(jid)) return
  if (isDuplicate(jid, text)) return

  if (isLlmEnabled()) {
    await handleConversationLLM(sock, jid, text)
    return
  }
  await handleConversationRules(sock, jid, text)
}
