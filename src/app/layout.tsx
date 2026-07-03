import type { Metadata, Viewport } from 'next'
import { siteConfig } from '@/config/site'
import './globals.css'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  title: {
    default: siteConfig.seo.titleDefault,
    template: siteConfig.seo.titleTemplate,
  },
  description: siteConfig.brand.pitch,
  keywords: [...siteConfig.seo.keywords],
  icons: {
    icon: siteConfig.brand.logo,
  },
  openGraph: {
    title: siteConfig.seo.ogTitle,
    description: siteConfig.brand.pitch,
    type: 'website',
    locale: siteConfig.seo.ogLocale,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang={siteConfig.seo.lang}>
      <body>{children}</body>
    </html>
  )
}
