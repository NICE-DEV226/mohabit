'use client'

import { useState, FormEvent, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Textarea from '@/components/ui/Textarea'
import Button from '@/components/ui/Button'
import { waLink } from '@/lib/whatsapp'
import { models } from '@/data/models'
import { siteConfig } from '@/config/site'

const modelOptions = models.map((m) => ({
  value: m.ref,
  label: `${m.ref} — ${m.name} (${m.area}m², ${m.bedrooms} ch.)`,
}))

const projectTypes = [
  ...modelOptions,
  { value: 'maison-acier', label: 'Maison en Acier (hors catalogue)' },
  { value: 'conteneur', label: 'Conteneur de Vie' },
  { value: 'modulaire', label: 'Construction Modulaire (sur mesure)' },
  { value: 'autre', label: 'Autre' },
]

const budgetRanges = [
  { value: '1-3', label: '1 000 000 – 3 000 000 XOF' },
  { value: '3-6', label: '3 000 000 – 6 000 000 XOF' },
  { value: '6-10', label: '6 000 000 – 10 000 000 XOF' },
  { value: '10+', label: '10 000 000+ XOF' },
  { value: 'undecided', label: 'Je ne sais pas encore' },
]

function ContactForm() {
  const searchParams = useSearchParams()
  const [sent, setSent] = useState(false)
  const [projectType, setProjectType] = useState('')

  useEffect(() => {
    const type = searchParams.get('type') || searchParams.get('model')
    if (type) setProjectType(type)
  }, [searchParams])

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const data = {
      fullName: form.get('fullName'),
      phone: form.get('phone'),
      email: form.get('email'),
      projectType: form.get('projectType'),
      budget: form.get('budget'),
      dimensions: form.get('dimensions'),
      message: form.get('message'),
    }

    await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    setSent(true)
  }

  if (sent) {
    return (
      <div className="min-h-screen bg-black pt-24 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="font-display text-5xl text-white mb-4">MERCI !</h1>
          <p className="text-grey-text mb-6">Votre demande a bien été reçue. Nous vous répondons sous 24h.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="/" className="text-gold hover:text-gold-600 underline text-sm">Retour à l&apos;accueil</a>
            <a href="/realisations" className="text-grey-text hover:text-white underline text-sm">Voir nos réalisations</a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="font-display text-6xl md:text-7xl text-white mb-4">
            {projectType ? 'DEMANDE DE DEVIS' : 'CONTACT'}
          </h1>
          <p className="text-grey-text max-w-xl">
            {projectType
              ? 'Parlez-nous de votre projet. Devis gratuit sous 24h.'
              : 'Une question ? Un projet ? Notre équipe est là pour vous répondre.'}
          </p>
        </div>

        <div className="grid md:grid-cols-5 gap-8">
          <div className="md:col-span-3">
            <form onSubmit={handleSubmit} className="bg-grey-dark rounded-xl p-8 space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <Input id="fullName" name="fullName" label="Nom complet *" placeholder="Votre nom" required />
                <Input id="phone" name="phone" type="tel" label="Téléphone *" placeholder="+226 XX XX XX XX" required />
              </div>

              <Input id="email" name="email" type="email" label="Email" placeholder="votre@email.com" />

              <div className="grid sm:grid-cols-2 gap-5">
                <Select
                  id="projectType"
                  name="projectType"
                  label="Type de projet *"
                  placeholder="Sélectionnez..."
                  options={projectTypes}
                  value={projectType}
                  onChange={(e) => setProjectType(e.target.value)}
                  required
                />
                <Select
                  id="budget"
                  name="budget"
                  label="Budget estimé *"
                  placeholder="Sélectionnez..."
                  options={budgetRanges}
                  required
                />
              </div>

              <Input id="dimensions" name="dimensions" label="Dimensions souhaitées" placeholder="Ex: 80 m², 3 pièces" />

              <Textarea id="message" name="message" label="Message *" rows={4} required placeholder="Décrivez votre projet : nombre de pièces, usage, contraintes, délais..." />

              <Button type="submit" size="lg" className="w-full">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Envoyer ma demande
              </Button>
            </form>
          </div>

          <div className="md:col-span-2 space-y-6">
            <Button href={waLink(siteConfig.whatsapp.quoteMessage)} external variant="secondary" size="lg" className="w-full justify-center bg-green-600 hover:bg-green-700">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Nous écrire sur WhatsApp
            </Button>

            <div className="bg-grey-dark rounded-xl p-6 space-y-4">
              <ContactInfo icon="location" label="Adresse" value={siteConfig.contact.address} href={siteConfig.contact.mapsLink} />
              <ContactInfo icon="phone" label="Téléphone" value={siteConfig.contact.phoneDisplay} />
              <ContactInfo icon="email" label="Email" value={siteConfig.contact.email} />
            </div>

            <div className="bg-grey-dark rounded-xl p-6">
              <h3 className="font-display text-lg text-white tracking-wide mb-4">HORAIRES</h3>
              <div className="space-y-2">
                {siteConfig.contact.hours.map((h) => (
                  <div key={h.day} className="flex justify-between text-sm">
                    <span className="text-grey-text">{h.day}</span>
                    <span className="text-white font-mono text-xs">{h.hours}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Carte */}
            <div className="rounded-xl overflow-hidden h-48 sm:h-56 bg-grey-mid">
              <iframe
                src={siteConfig.contact.mapsEmbed}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`${siteConfig.brand.name} - ${siteConfig.contact.city}`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ContactInfo({ icon, label, value, href }: { icon: 'location' | 'phone' | 'email'; label: string; value: string; href?: string }) {
  const paths = {
    location: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z',
    phone: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z',
    email: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  }
  const content = (
    <div className="flex items-start gap-3">
      <svg className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={paths[icon]} />
      </svg>
      <div>
        <p className="text-white text-sm font-medium">{label}</p>
        <p className="text-grey-text text-sm">{value}</p>
      </div>
    </div>
  )
  if (href) {
    return <a href={href} target="_blank" rel="noopener noreferrer" className="block hover:bg-white/5 -m-3 p-3 rounded-lg transition-colors">{content}</a>
  }
  return content
}

export default function ContactPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black pt-24 flex items-center justify-center"><p className="text-grey-text">Chargement...</p></div>}>
      <ContactForm />
    </Suspense>
  )
}
