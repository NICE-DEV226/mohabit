import { createClient, RedisClientType } from 'redis'

const TTL = 60 * 30 // 30 min d'inactivité avant expiration du contexte

export type ConversationState = {
  step: 'IDLE' | 'GREETING' | 'PROJECT' | 'USAGE' | 'ZONE' | 'BUDGET' | 'NAME' | 'PHONE' | 'CONFIRM' | 'DONE' | 'TRANSFER'
  model?: string
  usage?: string
  zone?: string
  budget?: string
  name?: string
  phone?: string
  source: 'site' | 'direct'
  attempts: number
  transfer?: boolean
  frustrated?: boolean
  previousIntent?: string
  /** Historique de conversation pour le contexte LLM (rôle/contenu) */
  history?: { role: 'user' | 'assistant'; content: string }[]
  /** Horodatage de création du contexte (analytics / idle) */
  createdAt?: number
  /** Dernière activité — rafraîchie à chaque écriture */
  lastActivity?: number
}

function freshState(): ConversationState {
  const now = Date.now()
  return { step: 'IDLE', source: 'direct', attempts: 0, createdAt: now, lastActivity: now }
}

// ─────────────────────────────── Connexion Redis ───────────────────────────────
// Objectifs seniors :
//  • une seule tentative de connexion en vol (promesse mémoïsée)
//  • handler 'error' obligatoire (sinon node-redis peut crasher le process)
//  • si Redis est down, on bascule en mémoire ET on réessaie après un cooldown
//    (au lieu de rester en mémoire pour toujours)

let client: RedisClientType | null = null
let connecting: Promise<RedisClientType | null> | null = null
let nextRetryAt = 0
const RETRY_COOLDOWN = 30_000

async function getClient(): Promise<RedisClientType | null> {
  if (client?.isReady) return client
  if (connecting) return connecting
  if (Date.now() < nextRetryAt) return null

  connecting = (async () => {
    try {
      const c: RedisClientType = createClient({
        url: process.env.REDIS_URL || 'redis://localhost:6379',
        socket: {
          // Reconnexion bornée : quelques essais rapides puis on abandonne
          // (on repassera par le cooldown ci-dessus).
          reconnectStrategy: (retries) => (retries > 5 ? false : Math.min(retries * 200, 2000)),
        },
      })
      // IMPÉRATIF : sans ce handler, une erreur émise ferait planter le bot.
      c.on('error', () => {})
      c.on('end', () => {
        if (client === c) client = null
      })
      await c.connect()
      client = c
      console.log('[Redis] Connecté')
      return c
    } catch {
      client = null
      nextRetryAt = Date.now() + RETRY_COOLDOWN
      console.log('[Redis] Indisponible → cache mémoire (nouvel essai dans 30s)')
      return null
    } finally {
      connecting = null
    }
  })()

  return connecting
}

// ─────────────────────────────── Fallback mémoire ──────────────────────────────
// Utilisé quand Redis est indisponible. Avec GC des entrées expirées et plafond
// pour éviter toute fuite mémoire sur un process longue durée.

const fallbackStore = new Map<string, { state: ConversationState; expires: number }>()
const FALLBACK_MAX = 5000
let lastSweep = 0

function sweepFallback() {
  const now = Date.now()
  if (now - lastSweep < 60_000) return // au plus une fois par minute
  lastSweep = now

  for (const [k, v] of fallbackStore) {
    if (v.expires <= now) fallbackStore.delete(k)
  }
  if (fallbackStore.size > FALLBACK_MAX) {
    // On évince les plus proches de l'expiration en premier.
    const excess = fallbackStore.size - FALLBACK_MAX
    const oldest = [...fallbackStore.entries()]
      .sort((a, b) => a[1].expires - b[1].expires)
      .slice(0, excess)
    for (const [k] of oldest) fallbackStore.delete(k)
  }
}

// ─────────────────────────────── API publique ──────────────────────────────────

export async function getSession(jid: string): Promise<ConversationState> {
  const c = await getClient()
  if (c) {
    try {
      const raw = await c.get(`session:${jid}`)
      if (raw) return JSON.parse(raw) as ConversationState
      return freshState()
    } catch {
      /* bascule fallback */
    }
  }

  const entry = fallbackStore.get(jid)
  if (entry && entry.expires > Date.now()) return entry.state
  return freshState()
}

export async function setSession(jid: string, state: ConversationState) {
  // Horodatage systématique : createdAt préservé, lastActivity rafraîchi.
  const stamped: ConversationState = {
    ...state,
    createdAt: state.createdAt ?? Date.now(),
    lastActivity: Date.now(),
  }

  const c = await getClient()
  if (c) {
    try {
      await c.setEx(`session:${jid}`, TTL, JSON.stringify(stamped))
      return
    } catch {
      /* bascule fallback */
    }
  }

  sweepFallback()
  fallbackStore.set(jid, { state: stamped, expires: Date.now() + TTL * 1000 })
}

export async function clearSession(jid: string) {
  const c = await getClient()
  if (c) {
    try {
      await c.del(`session:${jid}`)
      return
    } catch {
      /* bascule fallback */
    }
  }

  fallbackStore.delete(jid)
}
