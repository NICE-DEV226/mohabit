import Link from 'next/link'
import Button from '@/components/ui/Button'
import { waLink } from '@/lib/whatsapp'
import { siteConfig } from '@/config/site'

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden pt-20">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-black/60" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gold/5 via-transparent to-transparent" />

        <div className="relative text-center px-4 max-w-4xl mx-auto">
          <h1 className="font-display text-5xl sm:text-7xl md:text-8xl lg:text-[96px] text-white leading-none mb-6 tracking-tight">
            CONSTRUIRE
            <span className="block text-gold">AUTREMENT.</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-grey-text max-w-2xl mx-auto mb-10 leading-relaxed font-sans">
            Maisons modulaires en acier livrées en 15 à 20 jours à Ouagadougou.
            Des solutions durables, rapides et adaptées au climat burkinabè.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button href="/catalogue" size="lg">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              Voir le catalogue
            </Button>
            <Button href="/contact" variant="outline" size="lg">
              Nous contacter
            </Button>
          </div>
        </div>
      </section>

      {/* Chiffres */}
      <section className="py-16 bg-black border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            {[
              { value: '24', label: 'Modèles disponibles' },
              { value: '15–20 j.', label: 'Délai livraison' },
              { value: '≥ 100 ans', label: 'Durée de vie' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="font-mono text-3xl md:text-4xl text-gold font-bold">{stat.value}</div>
                <div className="mt-2 text-xs md:text-sm text-grey-text">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Offres */}
      <section className="py-12 sm:py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl text-white text-center mb-12 sm:mb-16 tracking-tight">
            NOS MODÈLES
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Link href="/catalogue?type=plain-pied" className="group bg-grey-dark rounded-xl overflow-hidden hover:bg-grey-mid transition-all duration-200 hover:-translate-y-1">
              <div className="h-48 bg-gradient-to-br from-grey-mid to-black flex items-center justify-center">
                <svg className="w-16 h-16 text-gold/30 group-hover:text-gold/50 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <div className="p-6">
                <h3 className="font-display text-2xl text-white tracking-wide">MAISONS PLAIN-PIED</h3>
                <p className="mt-2 text-sm text-grey-text leading-relaxed">
                  15 modèles de 24 à 268 m² — du studio compact à la villa de standing.
                </p>
                <span className="inline-flex items-center gap-1 mt-4 text-sm text-gold font-medium">
                  Découvrir <span aria-hidden="true">&rarr;</span>
                </span>
              </div>
            </Link>

            <Link href="/catalogue?type=etage" className="group bg-grey-dark rounded-xl overflow-hidden hover:bg-grey-mid transition-all duration-200 hover:-translate-y-1">
              <div className="h-48 bg-gradient-to-br from-grey-mid to-black flex items-center justify-center">
                <svg className="w-16 h-16 text-gold/30 group-hover:text-gold/50 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div className="p-6">
                <h3 className="font-display text-2xl text-white tracking-wide">MAISONS À ÉTAGE</h3>
                <p className="mt-2 text-sm text-grey-text leading-relaxed">
                  9 modèles duplex de 85 à 356 m² — des espaces sur deux niveaux.
                </p>
                <span className="inline-flex items-center gap-1 mt-4 text-sm text-gold font-medium">
                  Découvrir <span aria-hidden="true">&rarr;</span>
                </span>
              </div>
            </Link>

            <Link href="/catalogue" className="group bg-grey-dark rounded-xl overflow-hidden hover:bg-grey-mid transition-all duration-200 hover:-translate-y-1">
              <div className="h-48 bg-gradient-to-br from-grey-mid to-black flex items-center justify-center">
                <svg className="w-16 h-16 text-gold/30 group-hover:text-gold/50 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
              </div>
              <div className="p-6">
                <h3 className="font-display text-2xl text-white tracking-wide">TOUT LE CATALOGUE</h3>
                <p className="mt-2 text-sm text-grey-text leading-relaxed">
                  Explorez l'intégralité de notre catalogue : 24 modèles du DQ101 au DQ209.
                </p>
                <span className="inline-flex items-center gap-1 mt-4 text-sm text-gold font-medium">
                  Découvrir <span aria-hidden="true">&rarr;</span>
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Pourquoi Modu */}
      <section className="py-12 sm:py-20 bg-grey-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl text-white text-center mb-12 sm:mb-16 tracking-tight">
            POURQUOI MODU ?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
                title: 'Livraison rapide',
                desc: '2 à 4 semaines contre 6–12 mois en construction traditionnelle.',
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                ),
                title: 'Qualité acier',
                desc: 'Structure certifiée, résistante aux conditions climatiques africaines.',
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: 'Coût maîtrisé',
                desc: 'Pas de mauvaises surprises. Devis fixe respecté de A à Z.',
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                ),
                title: 'Basé à Ouaga',
                desc: 'Équipe locale, disponible. Vous suivez votre chantier pas à pas.',
              },
            ].map((item) => (
              <div key={item.title} className="bg-black rounded-xl p-6">
                <div className="text-gold mb-4">{item.icon}</div>
                <h3 className="font-display text-xl text-white tracking-wide mb-2">{item.title.toUpperCase()}</h3>
                <p className="text-sm text-grey-text leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Réalisations aperçu */}
      <section className="py-12 sm:py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl text-white text-center mb-12 sm:mb-16 tracking-tight">
            RÉALISATIONS
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="aspect-[4/3] bg-grey-dark rounded-xl flex items-center justify-center">
                <svg className="w-12 h-12 text-grey-text/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              href="/realisations"
              className="inline-flex items-center gap-2 text-gold hover:text-gold-600 font-medium transition-colors"
            >
              Voir toutes nos réalisations <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-12 sm:py-20 bg-gold">
        <div className="max-w-3xl mx-auto text-center px-4">
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-black leading-none mb-6 tracking-tight">
            VOTRE PROJET COMMENCE PAR UNE CONVERSATION.
          </h2>
          <p className="text-lg text-black/70 mb-10 font-sans">
            Décrivez-nous ce que vous voulez. Devis gratuit sous 24h.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button href="/contact" size="lg" className="bg-black text-white hover:bg-grey-dark border-0">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Envoyer une demande
            </Button>
            <Button
              href={waLink(siteConfig.whatsapp.quoteMessage)}
              external
              size="lg"
              className="border-2 border-black/20 text-black hover:border-black/40 bg-transparent"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              WhatsApp
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
