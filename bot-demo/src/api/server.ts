import { WASocket } from '../types'
import * as http from 'http'

let server: http.Server | null = null

export async function startApi(sock: WASocket) {
  if (server) return

  const express = require('express')
  const app = express()
  app.use(express.json())

  app.post('/api/send', async (req: any, res: any) => {
    const { to, message } = req.body
    if (!to || !message) return res.status(400).json({ error: 'to and message required' })
    try {
      await sock.sendMessage(to.includes('@s.whatsapp.net') ? to : to + '@s.whatsapp.net', { text: message })
      res.json({ ok: true })
    } catch (err: any) {
      res.status(500).json({ error: err.message })
    }
  })

  app.get('/api/status', (_req: any, res: any) => {
    res.json({ connected: !!sock.user, jid: sock.user?.id || null })
  })

  app.get('/api/leads', (_req: any, res: any) => {
    const { getLeads } = require('../db/sqlite')
    res.json(getLeads())
  })

  const PORT = parseInt(process.env.API_PORT || '3001', 10)
  server = app.listen(PORT, () => console.log(`[API] http://localhost:${PORT}`))
  server!.on('error', (err: any) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`[API] Port ${PORT} deja utilise (ignore)`)
    } else {
      console.error('[API] Erreur:', err)
    }
  })
}
