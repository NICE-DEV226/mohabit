import type { Metadata, Viewport } from 'next'
import './globals.css'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  title: {
    default: 'Modu Habitat | Construction Modulaire Ouagadougou',
    template: '%s | Modu Habitat',
  },
  description:
    'Maisons en acier, conteneurs de vie et construction modulaire à Ouagadougou. Construire autrement au Burkina Faso.',
  keywords: ['construction modulaire', 'Ouagadougou', 'Burkina Faso', 'maison acier', 'conteneur de vie', 'modu habitat'],
  icons: {
    icon: '/logo.jpeg',
  },
  openGraph: {
    title: 'Modu Habitat — Construire autrement.',
    description: 'Maisons en acier, conteneurs de vie et construction modulaire à Ouagadougou.',
    type: 'website',
    locale: 'fr_BF',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}
