# CDC Bot WhatsApp — Démo (Baileys)
## Modu Habitat International
*Version démo — Juin 2026*
*Rédigé par Azaël Sawadogo*

---

## 1. Objectif de la Démo

Montrer à Mme Prisca et à l'équipe Modu Habitat que le bot fonctionne **concrètement** sur WhatsApp, sans attendre la mise en place de l'API Meta officielle.

La démo utilise **Baileys** — une librairie Node.js open source qui connecte un vrai numéro WhatsApp via QR code, sans compte Meta Business, sans frais.

---

## 2. Différences Démo vs Production

| Aspect | Démo (Baileys) | Production (Meta API) |
|--------|---------------|----------------------|
| Connexion | QR code scan | Compte Meta Business vérifié |
| Numéro | N'importe quel numéro WhatsApp | Numéro dédié Meta |
| Coût | Gratuit | Gratuit jusqu'à 1000 conv/mois |
| Boutons natifs | Fork Baileys (`@itsliaaa/baileys`) | Meta Interactive Messages |
| Stabilité | Peut se déconnecter | Stable, production-grade |
| Objectif | Valider les scénarios avec Prisca | Livraison client finale |

> ⚠️ **Important** : La démo tourne sur ton ordinateur ou un VPS. Le code backend (scénarios, états, création de leads) est **identique** entre démo et prod. Seule la couche d'envoi/réception des messages change.

---

## 3. Stack Technique Démo

```
@itsliaaa/baileys     → Connexion WhatsApp + boutons interactifs
Node.js + TypeScript  → Runtime
Redis (local)         → Sessions de conversation
SQLite                → Leads (pas besoin de PostgreSQL pour la démo)
express               → API interne (création leads, notifications)
```

**Pourquoi `@itsliaaa/baileys` et pas `@whiskeysockets/baileys` ?**

Le repo officiel WhiskeySockets a retiré le support des boutons interactifs. Le fork `@itsliaaa/baileys` les maintient avec :
- `buttons` → boutons rapides (max 3)
- `sections` → list picker (plusieurs options groupées)
- Fonctionne en chat privé uniquement ✅ (notre cas)

---

## 4. Architecture du Projet

```
bot-demo/
├── src/
│   ├── index.ts              → Point d'entrée, init socket Baileys
│   ├── connection.ts         → Gestion connexion QR + reconnexion auto
│   ├── handler.ts            → Router principal des messages entrants
│   ├── sessions/
│   │   └── redis.ts          → Gestion états conversations (Redis)
│   ├── scenarios/
│   │   ├── welcome.ts        → Scénario A (depuis site, modèle connu)
│   │   ├── direct.ts         → Scénario B (contact direct)
│   │   ├── returning.ts      → Scénario C (prospect connu)
│   │   ├── faq.ts            → Scénario D (questions fréquentes)
│   │   └── fallback.ts       → Scénario E (incompréhensible)
│   ├── messages/
│   │   ├── buttons.ts        → Helpers envoi boutons Baileys
│   │   ├── list.ts           → Helpers envoi list picker
│   │   └── text.ts           → Helpers envoi texte simple
│   ├── db/
│   │   └── sqlite.ts         → Création et lecture leads (SQLite)
│   ├── notify/
│   │   └── prisca.ts         → Envoi notification WhatsApp à Prisca
│   └── utils/
│       ├── time.ts           → Vérification heures ouvrées
│       ├── intent.ts         → Détection intention (modèle, FAQ, choix)
│       └── models.ts         → Liste des 15 modèles Daquan
├── auth_info/                → Fichiers session Baileys (gitignore)
├── package.json
├── tsconfig.json
└── .env
```

---

## 5. Connexion Baileys

```typescript
// src/connection.ts
import makeWASocket, {
  DisconnectReason,
  useMultiFileAuthState,
} from '@itsliaaa/baileys'
import { Boom } from '@hapi/boom'
import { handler } from './handler'

export async function connectToWhatsApp() {
  const { state, saveCreds } = await useMultiFileAuthState('auth_info')

  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: true, // QR affiché dans le terminal
    browser: ['Modu Habitat Bot', 'Chrome', '1.0.0'],
  })

  sock.ev.on('creds.update', saveCreds)

  sock.ev.on('connection.update', ({ connection, lastDisconnect, qr }) => {
    if (qr) {
      console.log('📱 Scannez le QR code pour connecter WhatsApp')
    }
    if (connection === 'close') {
      const shouldReconnect =
        (lastDisconnect?.error as Boom)?.output?.statusCode !==
        DisconnectReason.loggedOut
      if (shouldReconnect) {
        console.log('🔄 Reconnexion...')
        connectToWhatsApp()
      }
    }
    if (connection === 'open') {
      console.log('✅ Bot connecté à WhatsApp')
    }
  })

  sock.ev.on('messages.upsert', async ({ messages }) => {
    for (const msg of messages) {
      if (!msg.key.fromMe && msg.message) {
        await handler(sock, msg)
      }
    }
  })

  return sock
}
```

---

## 6. Envoi de Messages avec Boutons

### 6.1 Boutons rapides (max 3)

Utilisés pour les choix simples : Usage, Délai, Menu principal

```typescript
// src/messages/buttons.ts
import { WASocket, proto } from '@itsliaaa/baileys'

export async function sendButtons(
  sock: WASocket,
  jid: string,
  text: string,
  footer: string,
  buttons: { id: string; text: string }[]
) {
  await sock.sendMessage(jid, {
    text,
    footer,
    buttons: buttons.map((b) => ({
      buttonId: b.id,
      buttonText: { displayText: b.text },
    })),
    headerType: 1,
  })
}

// Exemple d'utilisation :
// sendButtons(sock, jid,
//   "C'est pour quel usage ?",
//   "Modu Habitat International",
//   [
//     { id: 'usage_residence', text: '🏠 Résidence principale' },
//     { id: 'usage_bureau',    text: '🏢 Bureau / Commerce' },
//     { id: 'usage_location',  text: '🔑 Mise en location' },
//   ]
// )
```

### 6.2 List Picker (plus de 3 options)

Utilisé pour le catalogue modèles, sélection budget

```typescript
// src/messages/list.ts
import { WASocket } from '@itsliaaa/baileys'

export async function sendList(
  sock: WASocket,
  jid: string,
  text: string,
  buttonText: string,
  sections: {
    title: string
    rows: { id: string; title: string; description?: string }[]
  }[]
) {
  await sock.sendMessage(jid, {
    text,
    footer: 'Modu Habitat International',
    title: 'Faites votre choix',
    buttonText,
    sections,
  })
}

// Exemple — Sélection gamme catalogue :
// sendList(sock, jid,
//   "Quelle superficie vous intéresse ?",
//   "Choisir une gamme",
//   [{
//     title: "Plain-pied",
//     rows: [
//       { id: 'size_small',  title: 'Petit (< 80m²)',      description: 'DQ101 à DQ106' },
//       { id: 'size_medium', title: 'Moyen (80–150m²)',    description: 'DQ107 à DQ112' },
//       { id: 'size_large',  title: 'Grand (> 150m²)',     description: 'DQ113 à DQ115' },
//     ]
//   }, {
//     title: "Étage",
//     rows: [
//       { id: 'size_2floor_small',  title: 'Petit (< 140m²)',  description: 'DQ201 à DQ203' },
//       { id: 'size_2floor_medium', title: 'Moyen (140–200m²)', description: 'DQ204 à DQ205' },
//       { id: 'size_2floor_large',  title: 'Grand (> 200m²)',  description: 'DQ206 à DQ209' },
//     ]
//   }]
// )
```

### 6.3 Réception des réponses boutons

```typescript
// src/handler.ts — extraction du choix bouton

function getButtonReply(msg: proto.IWebMessageInfo): string | null {
  // Réponse bouton standard
  const btnReply = msg.message?.buttonsResponseMessage?.selectedButtonId
  if (btnReply) return btnReply

  // Réponse list picker
  const listReply = msg.message?.listResponseMessage?.singleSelectReply?.selectedRowId
  if (listReply) return listReply

  // Texte libre (fallback)
  const text = msg.message?.conversation ||
               msg.message?.extendedTextMessage?.text
  return text?.trim().toLowerCase() ?? null
}
```

---

## 7. Gestion des Sessions (Redis)

```typescript
// src/sessions/redis.ts
import { createClient } from 'redis'

const redis = createClient()
await redis.connect()

const TTL = 60 * 30 // 30 minutes

export type ConversationState = {
  step: 'IDLE' | 'USAGE' | 'ZONE' | 'DELAY' | 'BUDGET' | 'NAME' | 'DONE' | 'TRANSFER'
  model?: string       // ex: "DQ103"
  usage?: string
  zone?: string
  delay?: string
  budget?: string
  name?: string
  attempts: number     // tentatives incompréhensibles
}

export async function getSession(jid: string): Promise<ConversationState> {
  const raw = await redis.get(`session:${jid}`)
  if (raw) return JSON.parse(raw)
  return { step: 'IDLE', attempts: 0 }
}

export async function setSession(jid: string, state: ConversationState) {
  await redis.setEx(`session:${jid}`, TTL, JSON.stringify(state))
}

export async function clearSession(jid: string) {
  await redis.del(`session:${jid}`)
}
```

---

## 8. Détection d'Intention

```typescript
// src/utils/intent.ts

const MODEL_PATTERN = /DQ\d{3}/i
const FAQ_KEYWORDS = {
  prix:    ['prix', 'combien', 'coût', 'tarif', 'budget'],
  delai:   ['délai', 'delai', 'combien de temps', 'quand', 'durée'],
  adresse: ['adresse', 'où', 'bureau', 'localisation', 'situé'],
  qualite: ['solide', 'qualité', 'résistant', 'durable', 'acier'],
  livraison: ['livraison', 'installation', 'pose', 'monter'],
}

export function detectModel(text: string): string | null {
  const match = text.match(MODEL_PATTERN)
  return match ? match[0].toUpperCase() : null
}

export function detectFAQ(text: string): keyof typeof FAQ_KEYWORDS | null {
  const lower = text.toLowerCase()
  for (const [key, keywords] of Object.entries(FAQ_KEYWORDS)) {
    if (keywords.some((kw) => lower.includes(kw))) {
      return key as keyof typeof FAQ_KEYWORDS
    }
  }
  return null
}

export function isGreeting(text: string): boolean {
  const greetings = ['bonjour', 'bonsoir', 'salut', 'allô', 'allo', 'hi', 'hello', 'info', 'renseignement']
  return greetings.some((g) => text.toLowerCase().includes(g))
}
```

---

## 9. Scénarios Complets

### 9.1 Scénario A — Modèle connu (depuis site web)

```typescript
// src/scenarios/welcome.ts
export async function handleWelcome(sock, jid, model, session) {

  if (session.step === 'IDLE') {
    await sendText(sock, jid,
      `Bonjour ! 👋 Merci pour votre intérêt pour le *${model}*.\n` +
      `Je suis l'assistant de Modu Habitat International.\n` +
      `Quelques questions rapides pour mieux vous aider.`
    )
    await sendButtons(sock, jid,
      "C'est pour quel usage ?",
      "Modu Habitat International",
      [
        { id: 'usage_residence', text: '🏠 Résidence' },
        { id: 'usage_bureau',    text: '🏢 Bureau / Commerce' },
        { id: 'usage_location',  text: '🔑 Location' },
      ]
    )
    await setSession(jid, { ...session, step: 'USAGE', model })
    return
  }

  if (session.step === 'USAGE') {
    const usage = mapUsage(input) // mappe l'id bouton vers label lisible
    await sendText(sock, jid, "Dans quelle zone prévoyez-vous de construire ?")
    await setSession(jid, { ...session, step: 'ZONE', usage })
    return
  }

  if (session.step === 'ZONE') {
    await sendButtons(sock, jid,
      "Vous avez un délai en tête ?",
      "Modu Habitat International",
      [
        { id: 'delay_3m',  text: '📅 Moins de 3 mois' },
        { id: 'delay_6m',  text: '📅 3 à 6 mois' },
        { id: 'delay_plus', text: '📅 Plus de 6 mois' },
      ]
    )
    await setSession(jid, { ...session, step: 'DELAY', zone: input })
    return
  }

  if (session.step === 'DELAY') {
    await sendText(sock, jid, "Votre prénom pour qu'un conseiller vous contacte ?")
    await setSession(jid, { ...session, step: 'NAME', delay: input })
    return
  }

  if (session.step === 'NAME') {
    await createLead(session, input) // SQLite
    await notifyPrisca(sock, session, input) // WhatsApp
    await sendConfirmation(sock, jid, input) // Message final selon heure
    await clearSession(jid)
    return
  }
}
```

### 9.2 Scénario B — Contact direct (modèle inconnu)

```typescript
// src/scenarios/direct.ts
export async function handleDirect(sock, jid, session) {
  await sendButtons(sock, jid,
    "Bonjour ! 👋 Bienvenue chez *Modu Habitat International*.\n" +
    "Nous construisons des maisons modulaires livrées en *15 à 20 jours* à Ouagadougou.\n\n" +
    "Que puis-je faire pour vous ?",
    "Modu Habitat International",
    [
      { id: 'menu_catalogue', text: '🏘️ Voir le catalogue' },
      { id: 'menu_devis',     text: '📋 Demander un devis' },
      { id: 'menu_conseiller', text: '👤 Parler à un conseiller' },
    ]
  )
  await setSession(jid, { ...session, step: 'MENU' })
}
```

### 9.3 Message de confirmation final

```typescript
// src/utils/time.ts
export function isBusinessHours(): boolean {
  const now = new Date()
  const hour = now.getHours()
  const day = now.getDay() // 0=dim, 6=sam
  return day >= 1 && day <= 6 && hour >= 9 && hour < 18
}

// src/scenarios/welcome.ts
async function sendConfirmation(sock, jid, name) {
  if (isBusinessHours()) {
    await sendText(sock, jid,
      `Merci *${name}* ! 🙏\n` +
      `Un conseiller Modu Habitat va vous contacter très prochainement.\n` +
      `Bonne journée !`
    )
  } else {
    await sendText(sock, jid,
      `Merci *${name}* ! 🙏\n` +
      `Nos conseillers sont disponibles de 09h à 18h.\n` +
      `Vous serez contacté dès demain matin.\n` +
      `Bonne soirée !`
    )
  }
}
```

---

## 10. Notification à Prisca

```typescript
// src/notify/prisca.ts
const PRISCA_JID = process.env.PRISCA_NUMBER + '@s.whatsapp.net'

export async function notifyPrisca(sock, session, name) {
  const isUrgent = session.step === 'TRANSFER'
  const hours = isBusinessHours()

  if (isUrgent) {
    await sock.sendMessage(PRISCA_JID, {
      text:
        `🚨 *TRANSFERT DEMANDÉ*\n\n` +
        `*${name}* veut parler à un conseiller maintenant.\n\n` +
        `→ wa.me/${session.phone}`
    })
    return
  }

  const msg =
    `🔔 *Nouveau lead — Modu Habitat*\n\n` +
    `Nom     : ${name}\n` +
    `Modèle  : ${session.model ?? 'À qualifier'}\n` +
    `Usage   : ${session.usage ?? 'Non renseigné'}\n` +
    `Zone    : ${session.zone ?? 'Non renseignée'}\n` +
    `Délai   : ${session.delay ?? 'Non renseigné'}\n` +
    `Source  : ${session.model ? 'Site Web' : 'Direct WhatsApp'}\n\n` +
    (hours
      ? `→ Contacter maintenant`
      : `→ À contacter demain matin`)

  await sock.sendMessage(PRISCA_JID, { text: msg })
}
```

---

## 11. FAQ Automatique

```typescript
// src/scenarios/faq.ts
const FAQ_ANSWERS = {
  prix: 
    "Le prix dépend du modèle et des finitions choisis.\n" +
    "Un conseiller vous fera un *devis gratuit* personnalisé.\n" +
    "Vous voulez qu'on vous rappelle ? 😊",

  delai:
    "Nos maisons sont livrées en *15 à 20 jours* après confirmation.\n" +
    "C'est l'un de nos plus grands avantages vs la construction traditionnelle ! ⚡",

  adresse:
    "Nous sommes basés à *Ouagadougou*.\n" +
    "Nos conseillers se déplacent sur Ouaga et environs.\n" +
    "Dans quelle zone êtes-vous ?",

  qualite:
    "Nos structures ont :\n" +
    "• Durée de vie : *≥ 100 ans*\n" +
    "• Résistance sismique : *8.5 degrés*\n" +
    "• Résistance au vent : *150 km/h*\n" +
    "• Anti-feu : *≥ 4 heures*\n\n" +
    "On peut vous envoyer les certifications si vous voulez.",

  livraison:
    "Oui ! Nous livrons et assurons l'*installation complète*\n" +
    "sur votre terrain à Ouagadougou et environs. 🏗️",
}
```

---

## 12. Fallback & Timeout

```typescript
// src/scenarios/fallback.ts

// Après 2 incompréhensions
export async function handleFallback(sock, jid, session) {
  if (session.attempts >= 2) {
    await sendText(sock, jid,
      "Je vais vous mettre en contact avec un conseiller directement. 😊\n" +
      "Votre prénom ?"
    )
    await setSession(jid, { ...session, step: 'NAME', transfer: true })
    return
  }

  await sendButtons(sock, jid,
    "Je n'ai pas bien compris 😅\nVoici ce que je peux faire :",
    "Modu Habitat International",
    [
      { id: 'menu_catalogue',  text: '🏘️ Voir le catalogue' },
      { id: 'menu_devis',      text: '📋 Demander un devis' },
      { id: 'menu_conseiller', text: '👤 Parler à un conseiller' },
    ]
  )
  await setSession(jid, { ...session, attempts: session.attempts + 1 })
}

// Timeout 30 minutes — cron ou check à chaque message
export async function checkTimeout(sock, jid, session, lastActivity: Date) {
  const elapsed = Date.now() - lastActivity.getTime()
  if (elapsed > 30 * 60 * 1000 && session.step !== 'IDLE') {
    await sendText(sock, jid,
      "Toujours là ? 😊\nRépondez quand vous êtes prêt, je suis disponible 24h/24."
    )
    // Une seule relance — ensuite on ferme proprement
    await clearSession(jid)
  }
}
```

---

## 13. Variables d'Environnement

```bash
# .env
PRISCA_NUMBER=22666XXXXXX      # Numéro WhatsApp de Mme Prisca (sans +)
REDIS_URL=redis://localhost:6379
SQLITE_PATH=./db/leads.sqlite
PORT=3000
```

---

## 14. Installation & Lancement

```bash
# 1. Cloner et installer
npm install

# 2. Lancer Redis (local)
redis-server

# 3. Lancer le bot
npm run dev

# 4. Scanner le QR code affiché dans le terminal
# avec le numéro WhatsApp de démo

# 5. Tester en envoyant un message au numéro connecté
```

---

## 15. Migration vers Production (Meta API)

Quand Modu Habitat valide la démo, la migration vers Meta Cloud API ne touche que **2 fichiers** :

| Fichier | Démo (Baileys) | Prod (Meta API) |
|---------|---------------|-----------------|
| `connection.ts` | Socket Baileys | Webhook Express + Meta SDK |
| `messages/buttons.ts` | `sock.sendMessage()` Baileys | `axios.post()` Meta Graph API |
| Tout le reste | ✅ Identique | ✅ Identique |

Les scénarios, sessions Redis, base de données, notifications — **rien ne change**.

---

*Document confidentiel — Modu Habitat International × Azaël Sawadogo*
*GitHub : github.com/NICE-DEV226 | Portfolio : sawadogoazael.com*