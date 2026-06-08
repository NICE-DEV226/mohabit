import Button from '@/components/ui/Button'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Conteneur de Vie',
  description: 'Transformation de conteneurs maritimes en espaces de vie modernes et confortables.',
}

export default function ConteneurPage() {
  return (
    <div className="pt-24 pb-16 bg-black">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <section className="mb-16">
          <div className="h-64 md:h-96 bg-grey-dark rounded-xl flex items-center justify-center mb-8">
            <svg className="w-24 h-24 text-gold/20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h1 className="font-display text-6xl md:text-7xl text-white mb-4">CONTENEUR DE VIE</h1>
          <p className="text-lg text-grey-text max-w-2xl">
            Transformation de conteneurs maritimes en espaces de vie modernes et confortables.
            Une solution économique, rapide et écologique.
          </p>
        </section>

        <section className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-grey-dark rounded-xl p-8">
            <h2 className="font-display text-2xl text-white mb-6">CARACTÉRISTIQUES</h2>
            <ul className="space-y-4">
              {[
                'Conteneur maritime recyclé certifié',
                'Isolation thermique et phonique',
                'Installation en 1 à 2 semaines',
                'Climatisation intégrée',
                'Possibilité d\'empilage (R+1)',
                'Idéal logement étudiant, bureau, studio',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-grey-text">
                  <svg className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-grey-dark rounded-xl p-8">
            <h2 className="font-display text-2xl text-white mb-6">SPECIFICATIONS</h2>
            <div className="space-y-4">
              {[
                { label: 'Superficie', value: '15 – 60 m²' },
                { label: 'Délai', value: '1 à 2 semaines' },
                { label: 'Garantie', value: '3 ans' },
                { label: 'Budget indicatif', value: 'à partir de 1 500 000 XOF' },
                { label: 'Hauteur sous plafond', value: '2.50 m' },
              ].map((spec) => (
                <div key={spec.label} className="flex justify-between items-center py-2 border-b border-white/5">
                  <span className="text-grey-text text-sm">{spec.label}</span>
                  <span className="text-white font-medium font-mono text-sm">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="font-display text-3xl text-white mb-8">QUESTIONS FRÉQUENTES</h2>
          <div className="space-y-4">
            {[
              { q: 'Un conteneur n\'est-il pas trop petit ?', a: 'Un conteneur standard (30m²) offre tout le confort nécessaire : studio avec coin cuisine, salle de bain, espace nuit/salon.' },
              { q: 'Est-ce vraiment habitable au Burkina ?', a: 'Oui, avec une isolation adaptée et une climatisation, le conteneur reste frais en journée et confortable la nuit.' },
              { q: 'Puis-je en acheter pour un usage commercial ?', a: 'Parfaitement. Nos conteneurs sont utilisés pour des boutiques, bureaux, stands, etc.' },
            ].map((faq) => (
              <details key={faq.q} className="bg-grey-dark rounded-xl group">
                <summary className="px-6 py-4 text-white font-medium cursor-pointer list-none flex items-center justify-between">
                  {faq.q}
                  <svg className="w-4 h-4 text-gold group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-6 pb-4 text-grey-text text-sm leading-relaxed">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </section>

        <section className="text-center bg-grey-dark rounded-xl p-10">
          <h2 className="font-display text-4xl text-white mb-4">INTÉRESSÉ PAR UN CONTENEUR DE VIE ?</h2>
          <p className="text-grey-text mb-8">Devis gratuit et personnalisé sous 24h.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button href="/contact?type=conteneur" size="lg">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Demander un devis
            </Button>
            <Button
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP || '22670000000'}?text=${encodeURIComponent('Bonjour, je suis intéressé par le Conteneur de Vie. Puis-je avoir un devis ?')}`}
              external
              variant="outline"
              size="lg"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              WhatsApp
            </Button>
          </div>
        </section>
      </div>
    </div>
  )
}
