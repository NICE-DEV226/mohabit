import { readSync } from 'fs'
import {
  useMultiFileAuthState,
  DisconnectReason,
  makeWASocket,
  fetchLatestBaileysVersion,
  isJidGroup,
  isJidBroadcast,
  isJidNewsletter,
} from '@itsliaaa/baileys'
import { Boom } from '@hapi/boom'
import pino from 'pino'
import { handleIncoming } from './handler'
import { startApi } from './api/server'

let retryCount = 0
const MAX_RETRIES = 10
let apiStarted = false
// Empêche plusieurs chaînes de reconnexion en parallèle (l'événement 'close'
// peut être émis plusieurs fois) — sinon on créerait plusieurs sockets et on
// traiterait chaque message en double.
let reconnecting = false

/**
 * DM uniquement : on rejette groupes (@g.us), diffusions/statuts (@broadcast),
 * et chaînes/newsletters. On ne garde que les conversations privées
 * (@s.whatsapp.net et @lid, l'adressage "hidden number" de WhatsApp).
 */
function isDirectMessage(jid: string | null | undefined): boolean {
  if (!jid) return false
  if (isJidGroup(jid) || isJidBroadcast(jid) || isJidNewsletter(jid)) return false
  return jid.endsWith('@s.whatsapp.net') || jid.endsWith('@lid')
}

function askQuestion(query: string): string {
  process.stdout.write(query)
  const buf = Buffer.alloc(1024)
  const bytes = readSync(0, buf, 0, 1024, null)
  return buf.toString('utf8', 0, bytes).trim()
}

export async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState('auth_info')

  const { version, isLatest } = await fetchLatestBaileysVersion()
  console.log(`[Baileys] v${version.join('.')}, isLatest: ${isLatest}`)

  let pairingPhone = ''

  if (!state.creds.registered) {
    console.log('\n═══════════════════════════════════════')
    console.log('  CONNEXION WHATSAPP')
    console.log('')
    console.log('  1  QR code')
    console.log('  2  Code d\'appairage')
    console.log('')
    const choice = askQuestion('  > ')

    if (choice === '2') {
      const phone = askQuestion('  Numero du bot (indicatif inclus) > ')
      const cleaned = phone.replace(/[^0-9]/g, '')
      if (cleaned.length >= 6) {
        pairingPhone = cleaned
      } else {
        console.log('  Numero invalide. Passage en QR code.')
      }
    }
  }

  const sock = makeWASocket({
    version,
    auth: state,
    logger: pino({ level: process.env.LOG_LEVEL || 'error' }),
    printQRInTerminal: !pairingPhone,
    browser: ['Chrome', 'Safari', '130.0.0.0'],
    syncFullHistory: false,
    connectTimeoutMs: 60000,
    keepAliveIntervalMs: 10000,
    defaultQueryTimeoutMs: 60000,
    retryRequestDelayMs: 1000,
    maxMsgRetryCount: 5,
    enableAutoSessionRecreation: false,
    markOnlineOnConnect: true,
    // Ignore groupes / diffusions / newsletters dès la réception (perf + DM-only)
    shouldIgnoreJid: (jid: string) => isJidGroup(jid) || isJidBroadcast(jid) || isJidNewsletter(jid),
  })

  sock.ev.on('creds.update', async () => {
    await saveCreds()
  })

  let pairingDone = false

  sock.ev.on('connection.update', async (update: any) => {
    const { connection, lastDisconnect, qr } = update

    if (qr && pairingPhone && !pairingDone && !state.creds.registered) {
      pairingDone = true
      console.log('\nGeneration du code d\'appairage...')
      try {
        const code = await sock.requestPairingCode(pairingPhone, undefined)
        console.log('\n═══════════════════════════════════════')
        console.log('🔑 CODE D\'APPAIRAGE')
        console.log(`   ${code}`)
        console.log('')
        console.log('WhatsApp → Appareils lies →')
        console.log('"Lier avec le numero de telephone"')
        console.log(`Entre le code : ${code}`)
        console.log('═══════════════════════════════════════\n')
      } catch (err) {
        console.error('[Bot] Erreur code:', err)
      }
      return
    }

    if (connection === 'open') {
      retryCount = 0
      reconnecting = false
      console.log(`[Bot] Connecte: ${sock.user?.id}`)
      if (!apiStarted) {
        apiStarted = true
        startApi(sock)
      }
    }

    if (connection === 'close') {
      const statusCode = new Boom(lastDisconnect?.error).output.statusCode
      const reason = lastDisconnect?.error?.message || 'Inconnu'
      if (statusCode === DisconnectReason.loggedOut) {
        console.log('[Bot] Session expiree. Supprime auth_info/ et relance.')
        apiStarted = false
        return
      }
      // Un seul planificateur de reconnexion à la fois.
      if (reconnecting) return
      if (retryCount >= MAX_RETRIES) {
        console.log('[Bot] Trop de tentatives. Arret.')
        return
      }
      reconnecting = true
      retryCount++
      const delay = Math.min(1000 * 2 ** retryCount, 30_000)
      console.log(`[Bot] Deconnecte (${statusCode}: ${reason}). Reconnexion dans ${delay / 1000}s (${retryCount}/${MAX_RETRIES})`)
      setTimeout(() => {
        reconnecting = false
        startBot().catch((err) => console.error('[Bot] Echec reconnexion:', err))
      }, delay)
    }
  })

  sock.ev.on('messages.upsert', ({ messages, type }: any) => {
    // 'notify' = nouveaux messages temps réel. 'append' = historique/sync -> on ignore
    // pour ne jamais répondre à d'anciens messages après une reconnexion.
    if (type !== 'notify') return

    for (const msg of messages || []) {
      const jid = msg.key?.remoteJid
      if (msg.key?.fromMe || !msg.message) continue
      if (!isDirectMessage(jid)) continue // DM uniquement, jamais les groupes
      handleIncoming(sock, msg).catch((err: Error) => console.error('[Bot] Erreur message:', err))
    }
  })

  return sock
}
