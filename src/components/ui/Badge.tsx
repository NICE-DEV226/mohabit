type BadgeVariant = 'new' | 'ongoing' | 'devis-sent' | 'signed' | 'lost'

interface BadgeProps {
  variant: BadgeVariant
  children: string
}

const badgeStyles: Record<BadgeVariant, string> = {
  'new': 'bg-blue-500/20 text-blue-400',
  'ongoing': 'bg-yellow-500/20 text-yellow-400',
  'devis-sent': 'bg-orange-500/20 text-orange-400',
  'signed': 'bg-green-500/20 text-green-400',
  'lost': 'bg-red-500/20 text-red-400',
}

const labels: Record<BadgeVariant, string> = {
  'new': 'Nouveau',
  'ongoing': 'En cours',
  'devis-sent': 'Devis envoyé',
  'signed': 'Signé',
  'lost': 'Perdu',
}

export default function Badge({ variant }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeStyles[variant]}`}>
      {labels[variant]}
    </span>
  )
}
