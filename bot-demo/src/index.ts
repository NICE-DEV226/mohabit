import 'dotenv/config'
import { startBot } from './connection'

console.log('=== Modu Habitat Bot ===')
console.log('[Bot] Démarrage...')

startBot().catch((err) => {
  console.error('[Bot] Erreur fatale:', err)
  process.exit(1)
})
