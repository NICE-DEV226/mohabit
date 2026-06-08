import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import clientPromise from '@/lib/mongodb'
import type { Lead } from '@/types'
import DashboardClient from './DashboardClient'

function getWeekId(date: Date): string {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  const monday = new Date(d.setDate(diff))
  return monday.toISOString().slice(0, 10)
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/dashboard/login')

  const client = await clientPromise
  const db = client.db()
  const allLeads = await db.collection<Lead>('leads').find({}).sort({ createdAt: -1 }).toArray()

  const totalLeads = allLeads.length
  const newLeads = allLeads.filter((l) => l.status === 'new').length
  const ongoingLeads = allLeads.filter((l) => l.status === 'ongoing').length
  const signedLeads = allLeads.filter((l) => l.status === 'signed').length

  // Weekly data (last 8 weeks)
  const now = new Date()
  const weeklyData: { week: string; count: number }[] = []
  for (let i = 7; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i * 7)
    const weekId = getWeekId(d)
    const count = allLeads.filter((l) => getWeekId(new Date(l.createdAt)) === weekId).length
    const label = weekId.slice(5)
    weeklyData.push({ week: label, count })
  }

  // À traiter : leads inactifs > 48h (statut new/ongoing/devis-sent)
  const twoDaysAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000)
  const toProcess = allLeads.filter(
    (l) =>
      ['new', 'ongoing', 'devis-sent'].includes(l.status) &&
      new Date(l.updatedAt) < twoDaysAgo
  )

  const serializedLeads = allLeads.map((lead) => ({
    ...lead,
    _id: lead._id?.toString(),
    createdAt: lead.createdAt.toISOString(),
    updatedAt: lead.updatedAt.toISOString(),
  }))

  const serializedToProcess = toProcess.map((lead) => ({
    ...lead,
    _id: lead._id?.toString(),
    createdAt: lead.createdAt.toISOString(),
    updatedAt: lead.updatedAt.toISOString(),
  }))

  return (
    <DashboardClient
      stats={{
        totalLeads,
        newLeads,
        ongoingLeads,
        signedLeads,
        leads: serializedLeads as unknown as Lead[],
        weeklyData,
        toProcess: serializedToProcess as unknown as Lead[],
      }}
    />
  )
}
