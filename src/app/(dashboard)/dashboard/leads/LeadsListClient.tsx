'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Badge from '@/components/ui/Badge'
import type { Lead } from '@/types'

const statusOptions = [
  { value: '', label: 'Tous les statuts' },
  { value: 'new', label: 'Nouveau' },
  { value: 'ongoing', label: 'En cours' },
  { value: 'devis-sent', label: 'Devis envoyé' },
  { value: 'signed', label: 'Signé' },
  { value: 'lost', label: 'Perdu' },
]

const projectOptions = [
  { value: '', label: 'Tous les projets' },
  { value: 'maison-acier', label: 'Maison Acier' },
  { value: 'conteneur', label: 'Conteneur de Vie' },
  { value: 'modulaire', label: 'Construction Modulaire' },
  { value: 'autre', label: 'Autre' },
]

const periodOptions = [
  { value: '', label: 'Toute période' },
  { value: 'week', label: 'Cette semaine' },
  { value: 'month', label: 'Ce mois-ci' },
]

function inPeriod(date: Date, period: string): boolean {
  const now = new Date()
  if (period === 'week') {
    const day = now.getDay()
    const diff = now.getDate() - day + (day === 0 ? -6 : 1)
    const monday = new Date(now.setDate(diff))
    return date >= monday
  }
  if (period === 'month') {
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
  }
  return true
}

export default function LeadsListClient({ leads }: { leads: Lead[] }) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [projectFilter, setProjectFilter] = useState('')
  const [periodFilter, setPeriodFilter] = useState('')

  const filtered = useMemo(() => {
    return leads.filter((lead) => {
      const q = search.toLowerCase()
      if (q && !lead.fullName.toLowerCase().includes(q) && !lead.phone.toLowerCase().includes(q) && !(lead.email || '').toLowerCase().includes(q)) return false
      if (statusFilter && lead.status !== statusFilter) return false
      if (projectFilter && lead.projectType !== projectFilter) return false
      if (periodFilter && !inPeriod(new Date(lead.createdAt), periodFilter)) return false
      return true
    })
  }, [leads, search, statusFilter, projectFilter, periodFilter])

  function exportCSV() {
    const headers = ['Nom', 'Téléphone', 'Email', 'Type projet', 'Budget', 'Dimensions', 'Source', 'Statut', 'Date']
    const rows = filtered.map((l) => [
      l.fullName,
      l.phone,
      l.email || '',
      l.projectType,
      l.budget || '',
      l.dimensions || '',
      l.source || '',
      l.status,
      new Date(l.createdAt).toLocaleDateString('fr-FR'),
    ])
    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `leads-modu-habitat-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="font-display text-4xl text-white">LEADS</h1>
        <button
          onClick={exportCSV}
          className="px-4 py-2.5 bg-gold text-black font-semibold rounded-lg hover:bg-gold-600 transition-colors text-sm flex items-center gap-2 self-start"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Exporter CSV
        </button>
      </div>

      <div className="bg-grey-dark rounded-xl border border-white/5 p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher nom, téléphone, email..."
            className="px-4 py-2.5 rounded-lg border border-grey-mid bg-black text-white placeholder:text-grey-text outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors text-sm"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 rounded-lg border border-grey-mid bg-black text-white outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors text-sm"
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <select
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
            className="px-4 py-2.5 rounded-lg border border-grey-mid bg-black text-white outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors text-sm"
          >
            {projectOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <select
            value={periodFilter}
            onChange={(e) => setPeriodFilter(e.target.value)}
            className="px-4 py-2.5 rounded-lg border border-grey-mid bg-black text-white outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors text-sm"
          >
            {periodOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-grey-dark rounded-xl border border-white/5 overflow-hidden">
        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
          <h2 className="font-semibold text-white text-sm uppercase tracking-wider">
            {filtered.length === leads.length
              ? `Tous les leads (${leads.length})`
              : `${filtered.length} résultats sur ${leads.length}`}
          </h2>
        </div>

        {filtered.length === 0 ? (
          <p className="text-grey-text text-sm py-12 text-center">Aucun lead trouvé</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-black/50 text-left">
                <tr>
                  <th className="px-6 py-3 font-medium text-grey-text text-xs uppercase tracking-wider">Nom</th>
                  <th className="px-6 py-3 font-medium text-grey-text text-xs uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 font-medium text-grey-text text-xs uppercase tracking-wider">Projet</th>
                  <th className="px-6 py-3 font-medium text-grey-text text-xs uppercase tracking-wider">Budget</th>
                  <th className="px-6 py-3 font-medium text-grey-text text-xs uppercase tracking-wider">Statut</th>
                  <th className="px-6 py-3 font-medium text-grey-text text-xs uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((lead) => (
                  <tr key={lead._id?.toString()} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-medium text-white">{lead.fullName}</td>
                    <td className="px-6 py-4">
                      <div className="text-grey-text">{lead.email || lead.phone}</div>
                      <div className="text-grey-text/50 text-xs">{lead.phone}</div>
                    </td>
                    <td className="px-6 py-4 text-grey-text capitalize">
                      {lead.projectType === 'maison-acier' ? 'Maison Acier' : lead.projectType === 'conteneur' ? 'Conteneur' : lead.projectType === 'modulaire' ? 'Modulaire' : lead.projectType}
                    </td>
                    <td className="px-6 py-4 text-grey-text">{lead.budget || '—'}</td>
                    <td className="px-6 py-4">
                      <Badge variant={lead.status as Lead['status']}>{lead.status}</Badge>
                    </td>
                    <td className="px-6 py-4 text-grey-text/50 text-xs">
                      {new Date(lead.createdAt).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/dashboard/leads/${lead._id?.toString()}`}
                        className="text-gold hover:text-gold-600 text-xs font-medium"
                      >
                        Voir
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
