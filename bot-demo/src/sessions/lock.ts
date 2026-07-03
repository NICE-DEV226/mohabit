/**
 * Verrou asynchrone par clé (par JID).
 *
 * Sérialise le traitement des messages d'un même client : deux messages
 * envoyés coup sur coup sont traités l'un après l'autre (read-modify-write
 * du contexte atomique côté application), ce qui évite les pertes de
 * contexte et les réponses entrelacées. Les clients différents restent
 * traités en parallèle — un client lent n'en bloque pas un autre.
 */

const chains = new Map<string, Promise<unknown>>()

export function withLock<T>(key: string, fn: () => Promise<T>): Promise<T> {
  const prev = chains.get(key) ?? Promise.resolve()

  // On enchaîne quoi qu'il arrive (même si le précédent a échoué) pour ne
  // jamais bloquer définitivement la file d'un client.
  const run = prev.then(fn, fn) as Promise<T>

  // Piste "settled" (ne rejette jamais) qui sert de maillon suivant.
  const tail = run.then(
    () => undefined,
    () => undefined
  )
  chains.set(key, tail)

  // Nettoyage : si personne ne s'est enchaîné après nous, on libère la clé.
  tail.then(() => {
    if (chains.get(key) === tail) chains.delete(key)
  })

  return run
}

/** Nombre de files actives — utile pour le monitoring/health. */
export function activeLocks(): number {
  return chains.size
}
