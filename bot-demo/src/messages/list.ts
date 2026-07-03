import { WASocket } from '../types'

export async function sendList(
  sock: WASocket,
  jid: string,
  text: string,
  buttonText: string,
  sections: { title: string; rows: { id: string; title: string; description?: string }[] }[]
) {
  await sock.sendMessage(jid, {
    text,
    footer: 'Modu Habitat International',
    title: 'Faites votre choix',
    buttonText,
    sections,
  } as any)
}
