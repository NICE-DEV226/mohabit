'use client'

import Link from 'next/link'
import Badge from '@/components/ui/Badge'
import type { Lead } from '@/types'

interface Stats {
  totalLeads: number
  newLeads: number
  ongoingLeads: number
  signedLeads: number
  leads: Lead[]
  weeklyData: { week: string; count: number }[]
  toProcess: Lead[]
}

export default function DashboardClient({ stats }: { stats: Stats }) {
  const maxWeekly = Math.max(...stats.weeklyData.map((w) => w.count), 1)

  return (
    <div className="space-y-8">
      <h1 className="font-display text-4xl text-white">TABLEAU DE BORD</h1>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Leads ce mois', value: stats.totalLeads, color: 'text-blue-400', bg: 'bg-blue-500/10' },
          { label: 'En cours', value: stats.ongoingLeads, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
          { label: 'Signés', value: stats.signedLeads, color: 'text-green-400', bg: 'bg-green-500/10' },
          { label: 'À relancer', value: stats.totalLeads - stats.signedLeads, color: 'text-red-400', bg: 'bg-red-500/10' },
        ].map((stat) => (
          <div key={stat.label} className="bg-grey-dark rounded-xl border border-white/5 p-5 flex flex-col gap-1.5">
            <span className="text-xs text-grey-text font-medium uppercase tracking-wider">{stat.label}</span>
            <div className="flex items-center gap-3">
              <span className={`font-mono text-3xl font-bold ${stat.color}`}>{stat.value}</span>
              <div className={`w-8 h-8 rounded-lg ${stat.bg} flex items-center justify-center`}>
                <div className={`w-2 h-2 rounded-full ${stat.color.replace('text', 'bg')}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Graphique + À traiter */}
      <div className="grid lg:grid-cols-5 gap-6">
        {/* Bar chart */}
        <div className="lg:col-span-3 bg-grey-dark rounded-xl border border-white/5 p-6">
          <h2 className="font-semibold text-white mb-6 text-sm uppercase tracking-wider">Leads par semaine</h2>
          <div className="flex items-end gap-2 sm:gap-3 h-44">
            {stats.weeklyData.map((w) => (
              <div key={w.week} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                <span className="text-xs text-grey-text font-mono">{w.count || ''}</span>
                <div
                  className="w-full bg-gradient-to-t from-gold/80 to-gold rounded-sm transition-all duration-300"
                  style={{ height: `${Math.max((w.count / maxWeekly) * 100, 4)}%` }}
                />
                <span className="text-[10px] text-grey-text/60 font-medium">{w.week}</span>
              </div>
            ))}
          </div>
        </div>

        {/* À traiter */}
        <div className="lg:col-span-2 bg-grey-dark rounded-xl border border-white/5 p-6">
          <h2 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">À traiter aujourd&apos;hui</h2>
          {stats.toProcess.length === 0 ? (
            <p className="text-grey-text text-sm py-8 text-center">Aucun lead en attente.</p>
          ) : (
            <div className="space-y-3">
              {stats.toProcess.slice(0, 5).map((lead) => (
                <div key={lead._id?.toString()} className="bg-black/50 rounded-lg p-3 border border-white/5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-white font-medium truncate">{lead.fullName}</p>
                      <p className="text-xs text-grey-text">{lead.phone}</p>
                    </div>
                    <div className="flex gap-1.5 shrink-0">
                      <a
                        href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                        title="WhatsApp"
                      >
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                        </svg>
                      </a>
                      <Link
                        href={`/dashboard/leads/${lead._id?.toString()}`}
                        className="p-2 bg-gold/20 hover:bg-gold/30 rounded-lg transition-colors"
                        title="Voir"
                      >
                        <svg className="w-4 h-4 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                  <p className="text-xs text-grey-text/60 mt-2">
                    Dernière activité : {new Date(lead.updatedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              ))}
              {stats.toProcess.length > 5 && (
                <Link
                  href="/dashboard/leads"
                  className="block text-center text-xs text-gold hover:text-gold-600 pt-1 font-medium"
                >
                  +{stats.toProcess.length - 5} autres à traiter
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Tous les leads */}
      <div className="bg-grey-dark rounded-xl border border-white/5 overflow-hidden">
        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
          <h2 className="font-semibold text-white text-sm uppercase tracking-wider">Tous les leads</h2>
          <Link href="/dashboard/leads" className="text-xs text-gold hover:text-gold-600 font-medium">
            Voir tout →
          </Link>
        </div>
        {stats.leads.length === 0 ? (
          <p className="text-grey-text text-sm py-12 text-center">Aucun lead pour le moment</p>
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
                {stats.leads.slice(0, 10).map((lead) => (
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
