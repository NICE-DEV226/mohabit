'use client'

import type { Model } from '@/data/models'
import Button from '@/components/ui/Button'

export default function ModelDetailClient({ model }: { model: Model }) {
  const waMessage = `Bonjour, je suis intéressé par le modèle ${model.ref} (${model.area}m² - ${model.bedrooms} chambres). Pouvez-vous me donner plus d'informations ?`

  const specs: [string, string][] = [
    ['Superficie', `${model.area} m²`],
    ['Chambres', `${model.bedrooms}`],
    ['Salles de bain', `${model.bathrooms}`],
    ['Étages', `${model.floors}`],
    ['Délai de livraison', '15–20 jours'],
    ['Durée de vie', '≥ 100 ans'],
    ['Résistance sismique', model.specs.sismic],
    ['Résistance au feu', model.specs.fire],
    ['Résistance au vent', model.specs.wind],
    ['Isolation thermique', model.specs.isolation],
    ['Isolation phonique', model.specs.sound],
  ]

  return (
    <section className="pb-16 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10">
          {/* Galerie placeholder */}
          <div>
            <div className="aspect-[4/3] bg-grey-dark rounded-xl flex items-center justify-center">
              <svg className="w-20 h-20 text-grey-text/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="flex gap-3 mt-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex-1 aspect-[4/3] bg-grey-dark rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-grey-text/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              ))}
            </div>
          </div>

          {/* Infos */}
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-gold text-black text-sm font-bold px-3 py-1 rounded-md">{model.ref}</span>
              <span className="text-xs text-grey-text uppercase tracking-wider">{model.type === 'etage' ? 'Étage' : 'Plain-pied'}</span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl text-white tracking-tight mb-4">{model.name}</h1>
            <p className="text-grey-text leading-relaxed mb-8">{model.description}</p>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-3 mb-10">
              <Button
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP || '22670000000'}?text=${encodeURIComponent(waMessage)}`}
                external
                className="bg-green-600 hover:bg-green-700 text-white font-semibold border-0"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Je suis intéressé par ce modèle
              </Button>
              <Button href={`/contact?model=${model.slug}`} variant="outline">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Demander un devis
              </Button>
            </div>

            {/* Spécifications */}
            <div className="bg-grey-dark rounded-xl p-6">
              <h2 className="font-display text-lg text-white tracking-wide mb-4">CARACTÉRISTIQUES TECHNIQUES</h2>
              <div className="space-y-0">
                {specs.map(([label, value]) => (
                  <div key={label} className="flex justify-between py-2.5 border-b border-white/5 last:border-0">
                    <span className="text-sm text-grey-text">{label}</span>
                    <span className="text-sm text-white font-medium text-right">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
