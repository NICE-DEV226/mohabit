'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Badge from '@/components/ui/Badge'
import type { Lead, Note } from '@/types'

const statusOptions = [
  { value: 'new', label: 'Nouveau' },
  { value: 'ongoing', label: 'En cours' },
  { value: 'devis-sent', label: 'Devis envoyé' },
  { value: 'signed', label: 'Signé' },
  { value: 'lost', label: 'Perdu' },
]

export default function LeadDetailClient({ lead: initialLead }: { lead: Lead }) {
  const router = useRouter()
  const [lead, setLead] = useState(initialLead)
  const [saving, setSaving] = useState(false)
  const [noteText, setNoteText] = useState('')
  const [lostReason, setLostReason] = useState(lead.lostReason || '')
  const [showDelete, setShowDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)

  async function updateStatus(status: string) {
    if (status === 'lost' && !lostReason.trim()) {
      alert('Veuillez indiquer la raison avant de marquer comme Perdu.')
      return
    }
    setSaving(true)
    const body: Record<string, unknown> = { status }
    if (status === 'lost') body.lostReason = lostReason.trim()
    await fetch(`/api/leads/${lead._id?.toString()}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    setLead({ ...lead, status: status as Lead['status'], lostReason: status === 'lost' ? lostReason.trim() : undefined })
    setSaving(false)
    router.refresh()
  }

  async function addNote() {
    if (!noteText.trim()) return
    const res = await fetch(`/api/leads/${lead._id?.toString()}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        notes: [...(lead.notes || []), { content: noteText, author: 'Admin', date: new Date().toISOString() }],
      }),
    })
    if (res.ok) {
      setLead({
        ...lead,
        notes: [...(lead.notes || []), { content: noteText, author: 'Admin', date: new Date() }],
      })
      setNoteText('')
    }
  }

  async function deleteLead() {
    setDeleting(true)
    const res = await fetch(`/api/leads/${lead._id?.toString()}`, { method: 'DELETE' })
    if (res.ok) {
      router.push('/dashboard/leads')
    } else {
      alert('Erreur lors de la suppression')
      setDeleting(false)
    }
  }

  const projectTypeLabel =
    lead.projectType === 'maison-acier' ? 'Maison en Acier'
    : lead.projectType === 'conteneur' ? 'Conteneur de Vie'
    : lead.projectType === 'modulaire' ? 'Construction Modulaire'
    : lead.projectType

  const sourceLabel =
    lead.source === 'site-web' ? 'Site Web'
    : lead.source === 'whatsapp' ? 'WhatsApp'
    : lead.source === 'appel' ? 'Appel direct'
    : lead.source === 'reference' ? 'Référence'
    : '—'

  return (
    <>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
        <button
          onClick={() => router.push('/dashboard')}
          className="text-sm text-grey-text hover:text-white transition-colors flex items-center gap-1 self-start"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Retour
        </button>
        <h1 className="font-display text-2xl sm:text-3xl text-white">{lead.fullName.toUpperCase()}</h1>
        <Badge variant={lead.status}>{lead.status}</Badge>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main */}
        <div className="lg:col-span-2 space-y-6">
          {/* Infos */}
          <div className="bg-grey-dark rounded-xl p-4 sm:p-6 space-y-4">
            <h2 className="font-display text-lg text-white tracking-wide">INFORMATIONS</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoRow label="Téléphone" value={lead.phone} />
              <InfoRow label="Email" value={lead.email || '—'} />
              <InfoRow label="Type de projet" value={projectTypeLabel} />
              <InfoRow label="Budget" value={lead.budget || '—'} />
              <InfoRow label="Dimensions" value={lead.dimensions || '—'} />
              <InfoRow label="Source" value={sourceLabel} />
              <InfoRow label="Date de contact" value={new Date(lead.createdAt).toLocaleDateString('fr-FR', {
                day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
              })} />
            </div>
            {lead.description && (
              <div>
                <label className="text-xs text-grey-text uppercase tracking-wide">Message initial</label>
                <p className="text-white mt-1 text-sm leading-relaxed">{lead.description}</p>
              </div>
            )}
            {lead.status === 'lost' && lead.lostReason && (
              <div className="bg-red-900/20 rounded-lg p-4">
                <label className="text-xs text-red-400 uppercase tracking-wide">Raison perdu</label>
                <p className="text-red-300 mt-1 text-sm">{lead.lostReason}</p>
              </div>
            )}
          </div>

          {/* Statut */}
          <div className="bg-grey-dark rounded-xl p-4 sm:p-6">
            <h2 className="font-display text-lg text-white tracking-wide mb-4">MODIFIER LE STATUT</h2>
            <div className="flex flex-wrap gap-2 mb-4">
              {statusOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => updateStatus(opt.value)}
                  disabled={saving || lead.status === opt.value}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    lead.status === opt.value
                      ? 'bg-gold text-black'
                      : 'bg-black/50 text-grey-text hover:text-white hover:bg-black'
                  } disabled:opacity-50`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            {lead.status === 'lost' && (
              <div>
                <label className="text-xs text-grey-text uppercase tracking-wide mb-1 block">Raison (perdu)</label>
                <textarea
                  value={lostReason}
                  onChange={(e) => setLostReason(e.target.value)}
                  placeholder="Pourquoi ce lead est perdu ?"
                  rows={2}
                  className="w-full px-4 py-2.5 rounded-lg border border-grey-mid bg-black text-white placeholder:text-grey-text outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors text-sm"
                />
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="bg-grey-dark rounded-xl p-4 sm:p-6">
            <h2 className="font-display text-lg text-white tracking-wide mb-4">NOTES ÉQUIPE</h2>
            <div className="space-y-3 mb-4">
              {(lead.notes || []).length === 0 && (
                <p className="text-grey-text text-sm">Aucune note pour le moment.</p>
              )}
              {(lead.notes || []).map((note: Note, i: number) => (
                <div key={i} className="bg-black/50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gold font-medium">{note.author}</span>
                    <span className="text-xs text-grey-text">{new Date(note.date).toLocaleDateString('fr-FR')}</span>
                  </div>
                  <p className="text-sm text-grey-text">{note.content}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Ajouter une note..."
                className="flex-1 px-4 py-3 rounded-lg border border-grey-mid bg-black text-white placeholder:text-grey-text outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors text-sm"
                onKeyDown={(e) => e.key === 'Enter' && addNote()}
              />
              <button
                onClick={addNote}
                className="px-5 py-3 bg-gold text-black font-semibold rounded-lg hover:bg-gold-600 transition-colors text-sm whitespace-nowrap"
              >
                Ajouter
              </button>
            </div>
          </div>
        </div>

        {/* Actions sidebar */}
        <div className="space-y-4">
          <div className="bg-grey-dark rounded-xl p-6">
            <h2 className="font-display text-lg text-white tracking-wide mb-4">ACTIONS</h2>
            <div className="space-y-3">
              <a
                href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors text-sm"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Ouvrir WhatsApp
              </a>
              <a
                href={`tel:${lead.phone}`}
                className="flex items-center justify-center gap-2 w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors text-sm"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Appeler
              </a>
              <button
                onClick={() => setShowDelete(true)}
                className="flex items-center justify-center gap-2 w-full py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors text-sm"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Supprimer le lead
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation modale */}
      {showDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4">
          <div className="bg-grey-dark rounded-xl p-6 max-w-sm w-full">
            <h3 className="font-display text-lg text-white mb-2">SUPPRIMER LE LEAD</h3>
            <p className="text-grey-text text-sm mb-6">
              Êtes-vous sûr de vouloir supprimer le lead de <strong className="text-white">{lead.fullName}</strong> ? Cette action est irréversible.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDelete(false)}
                className="px-5 py-2.5 bg-black text-grey-text font-medium rounded-lg hover:text-white transition-colors text-sm"
              >
                Annuler
              </button>
              <button
                onClick={deleteLead}
                disabled={deleting}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors text-sm disabled:opacity-50"
              >
                {deleting ? 'Suppression...' : 'Supprimer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <label className="text-xs text-grey-text uppercase tracking-wide">{label}</label>
      <p className="text-white mt-0.5 text-sm font-medium">{value}</p>
    </div>
  )
}
