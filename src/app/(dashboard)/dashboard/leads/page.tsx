import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import clientPromise from '@/lib/mongodb'
import type { Lead } from '@/types'
import LeadsListClient from './LeadsListClient'

export default async function LeadsPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/dashboard/login')

  const client = await clientPromise
  const db = client.db()
  const leads = await db
    .collection<Lead>('leads')
    .find({})
    .sort({ createdAt: -1 })
    .toArray()

  const serializedLeads = leads.map((lead) => ({
    ...lead,
    _id: lead._id?.toString(),
    createdAt: lead.createdAt.toISOString(),
    updatedAt: lead.updatedAt.toISOString(),
  }))

  return <LeadsListClient leads={serializedLeads as unknown as Lead[]} />
}
