const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

export async function syncLeadToMongo(data: {
  name: string
  phone: string
  model?: string
  usage?: string
  zone?: string
  budget?: string
  source: string
}) {
  try {
    const body = {
      fullName: data.name,
      phone: data.phone,
      projectType: 'modulaire',
      budget: data.budget || '',
      description: [
        data.model && `Modèle: ${data.model}`,
        data.usage && `Usage: ${data.usage}`,
        data.zone && `Zone: ${data.zone}`,
      ].filter(Boolean).join(' | '),
      source: data.source === 'Site Web' ? 'site-web' : 'whatsapp',
    }

    const res = await fetch(`${API_BASE}/api/leads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (res.ok) {
      const json = await res.json() as { id?: string }
      console.log(`[Sync] Lead MongoDB: ${json.id}`)
    } else {
      console.error(`[Sync] Erreur HTTP ${res.status}`)
    }
  } catch (err) {
    console.error('[Sync] Erreur requête:', err)
  }
}
