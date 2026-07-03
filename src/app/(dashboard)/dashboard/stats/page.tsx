import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import clientPromise from '@/lib/mongodb'
import type { Lead } from '@/types'

export default async function StatsPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/dashboard/login')

  const client = await clientPromise
  const db = client.db()
  const leads = await db.collection<Lead>('leads').find({}).toArray()

  const totalLeads = leads.length
  const newLeads = leads.filter((l) => l.status === 'new').length
  const ongoing = leads.filter((l) => l.status === 'ongoing').length
  const devisSent = leads.filter((l) => l.status === 'devis-sent').length
  const signed = leads.filter((l) => l.status === 'signed').length
  const lost = leads.filter((l) => l.status === 'lost').length

  return (
    <div className="space-y-8">
      <h1 className="font-display text-4xl text-white">STATISTIQUES</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {[
          { label: 'Total leads', value: totalLeads, color: 'text-blue-400', bg: 'bg-blue-500/10' },
          { label: 'Nouveaux', value: newLeads, color: 'text-blue-400', bg: 'bg-blue-500/10' },
          { label: 'En cours', value: ongoing, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
          { label: 'Devis envoyé', value: devisSent, color: 'text-orange-400', bg: 'bg-orange-500/10' },
          { label: 'Signés', value: signed, color: 'text-green-400', bg: 'bg-green-500/10' },
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

      {totalLeads > 0 && (
        <div className="bg-grey-dark rounded-xl border border-white/5 p-6">
          <h2 className="font-semibold text-white mb-6 text-sm uppercase tracking-wider">Répartition par statut</h2>
          <div className="grid grid-cols-5 gap-3 mb-6">
            {[
              { label: 'Nouveau', value: newLeads, color: 'text-blue-400', bar: 'bg-blue-500' },
              { label: 'En cours', value: ongoing, color: 'text-yellow-400', bar: 'bg-yellow-500' },
              { label: 'Devis envoyé', value: devisSent, color: 'text-orange-400', bar: 'bg-orange-500' },
              { label: 'Signé', value: signed, color: 'text-green-400', bar: 'bg-green-500' },
              { label: 'Perdu', value: lost, color: 'text-red-400', bar: 'bg-red-500' },
            ].map((item) => (
              <div key={item.label} className="bg-black/50 rounded-lg p-4 text-center">
                <p className={`font-mono text-2xl font-bold ${item.color}`}>{item.value}</p>
                <p className="text-xs text-grey-text mt-1">{item.label}</p>
              </div>
            ))}
          </div>
          <div className="space-y-3">
            {[
              { label: 'Nouveau', value: newLeads, bar: 'bg-blue-500' },
              { label: 'En cours', value: ongoing, bar: 'bg-yellow-500' },
              { label: 'Devis envoyé', value: devisSent, bar: 'bg-orange-500' },
              { label: 'Signé', value: signed, bar: 'bg-green-500' },
              { label: 'Perdu', value: lost, bar: 'bg-red-500' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-4">
                <span className="text-sm text-grey-text w-24 shrink-0">{item.label}</span>
                <div className="flex-1 bg-black rounded-full h-5 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${item.bar} transition-all duration-500`}
                    style={{ width: `${(item.value / totalLeads) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-mono text-grey-text w-12 text-right shrink-0">
                  {Math.round((item.value / totalLeads) * 100)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
