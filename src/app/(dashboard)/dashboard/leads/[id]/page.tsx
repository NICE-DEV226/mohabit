import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { ObjectId } from 'mongodb'
import { authOptions } from '@/lib/auth'
import clientPromise from '@/lib/mongodb'
import type { Lead } from '@/types'
import LeadDetailClient from './LeadDetailClient'

export default async function LeadDetailPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/dashboard/login')

  const client = await clientPromise
  const db = client.db()

  let lead: Lead | null = null
  try {
    lead = await db.collection<Lead>('leads').findOne({ _id: new ObjectId(params.id) as any })
  } catch {
    redirect('/dashboard')
  }

  if (!lead) redirect('/dashboard')

  return <LeadDetailClient lead={lead} />
}
