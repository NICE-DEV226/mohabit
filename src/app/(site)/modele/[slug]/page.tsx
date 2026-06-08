import Link from 'next/link'
import { notFound } from 'next/navigation'
import { models, getModel, plainPiedModels, etageModels } from '@/data/models'
import ModelDetailClient from './ModelDetailClient'

export function generateStaticParams() {
  return models.map((m) => ({ slug: m.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const model = getModel(params.slug)
  if (!model) return { title: 'Modèle non trouvé' }
  return {
    title: `${model.ref} — ${model.name} | Modu Habitat`,
    description: model.description,
  }
}

export default function ModelPage({ params }: { params: { slug: string } }) {
  const model = getModel(params.slug)
  if (!model) notFound()

  const sameType = (model.type === 'plain-pied' ? plainPiedModels : etageModels)
    .filter((m) => m.ref !== model.ref)
    .slice(0, 3)

  return (
    <>
      {/* Hero */}
      <section className="pt-28 pb-8 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/catalogue"
            className="inline-flex items-center gap-1 text-sm text-grey-text hover:text-white transition-colors mb-6"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Retour au catalogue
          </Link>
        </div>
      </section>

      <ModelDetailClient model={model} />

      {/* Modèles similaires */}
      {sameType.length > 0 && (
        <section className="py-16 bg-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-display text-3xl sm:text-4xl text-white mb-10 tracking-tight">
              AUTRES MODÈLES SIMILAIRES
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sameType.map((m) => (
                <Link
                  key={m.ref}
                  href={`/modele/${m.slug}`}
                  className="group bg-grey-dark rounded-xl overflow-hidden hover:bg-grey-mid transition-all duration-200 hover:-translate-y-1"
                >
                  <div className="h-40 bg-gradient-to-br from-gold/10 to-black flex items-center justify-center">
                    <svg className="w-12 h-12 text-gold/30 group-hover:text-gold/50 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    <span className="absolute top-3 left-3 bg-gold text-black text-xs font-bold px-2.5 py-1 rounded-md">
                      {m.ref}
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-display text-lg text-white tracking-wide">{m.name}</h3>
                    <div className="flex items-center gap-4 mt-2 text-xs text-grey-text">
                      <span>{m.area}m²</span>
                      <span>{m.bedrooms} ch.</span>
                      <span>{m.bathrooms} sdb</span>
                    </div>
                    <span className="inline-flex items-center gap-1 mt-3 text-sm text-gold font-medium">
                      Voir <span aria-hidden="true">&rarr;</span>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16 bg-gold">
        <div className="max-w-3xl mx-auto text-center px-4">
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-black leading-none mb-6 tracking-tight">
            VOUS AVEZ UN PROJET ?
          </h2>
          <p className="text-lg text-black/70 mb-8 font-sans">
            Devis gratuit sous 24h. Réponse sous 1h sur WhatsApp.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/contact?model=${model.slug}`}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-black text-white font-semibold rounded-lg hover:bg-grey-dark transition-colors text-lg"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Demander un devis
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
