export interface Lead {
  _id?: string
  fullName: string
  email?: string
  phone: string
  projectType: 'maison-acier' | 'conteneur' | 'modulaire' | 'autre'
  source?: 'site-web' | 'whatsapp' | 'appel' | 'reference'
  budget?: string
  dimensions?: string
  description?: string
  message?: string
  status: 'new' | 'ongoing' | 'devis-sent' | 'signed' | 'lost'
  lostReason?: string
  notes?: Note[]
  createdAt: Date
  updatedAt: Date
}

export interface Note {
  author: string
  content: string
  date: Date
}

export interface ProjectModel {
  _id?: string
  title: string
  slug: string
  category: 'maison-acier' | 'conteneur' | 'modulaire'
  description: string
  features: string[]
  specifications: Record<string, string>
  startingPrice: number
  images: string[]
  published: boolean
  createdAt: Date
  updatedAt: Date
}

export interface DashboardStats {
  totalLeads: number
  newLeads: number
  ongoingLeads: number
  signedLeads: number
  toRelance: number
}
