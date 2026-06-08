'use client'

import { useState } from 'react'

const projects = [
  { title: 'Villa Résidentielle Kadiogo', type: 'maison-acier', location: 'Ouagadougou', year: '2025', desc: 'Villa de 90m² livrée clé en main. Isolation optimisée pour le climat sahélien.' },
  { title: 'Espace Commercial Zongo', type: 'modulaire', location: 'Ouagadougou', year: '2025', desc: 'Complexe de 3 modules pour centre d\'affaires. Façade vitée et climatisation centrale.' },
  { title: 'Bureaux Administratifs', type: 'modulaire', location: 'Ouagadougou', year: '2024', desc: 'Ensemble de 5 modules pour ONG internationale. Livré en 6 semaines.' },
  { title: 'Studio Conteneur Pissy', type: 'conteneur', location: 'Pissy, Ouaga', year: '2025', desc: 'Studio 30m² avec mezzanine. Aménagement complet.' },
  { title: 'Logement Ouvrier', type: 'conteneur', location: 'Kaya', year: '2024', desc: 'Cité de 10 conteneurs logements pour chantier minier.' },
  { title: 'Villa F3 Modulaire', type: 'maison-acier', location: 'Bobo-Dioulasso', year: '2024', desc: 'Maison 3 pièces + salon. Structure acier galvanisé.' },
  { title: 'Boutique Conteneur', type: 'conteneur', location: 'Ouagadougou', year: '2025', desc: 'Boutique commerciale 20m² avec vitrine et étagères.' },
  { title: 'Campement Modulaire', type: 'modulaire', location: 'Ziniaré', year: '2024', desc: '8 modules pour campement touristique. Chaque module est une chambre avec sdb.' },
]

const filters = [
  { value: 'all', label: 'Tous' },
  { value: 'maison-acier', label: 'Maison Acier' },
  { value: 'conteneur', label: 'Conteneur' },
  { value: 'modulaire', label: 'Modulaire' },
]

export default function RealisationsPage() {
  const [activeFilter, setActiveFilter] = useState('all')

  const filtered = activeFilter === 'all'
    ? projects
    : projects.filter((p) => p.type === activeFilter)

  return (
    <div className="min-h-screen bg-black pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="font-display text-6xl md:text-7xl text-white mb-4">RÉALISATIONS</h1>
          <p className="text-grey-text max-w-xl">
            Des projets livrés à travers le Burkina Faso.
          </p>
        </div>

        {/* Filtres */}
        <div className="flex flex-wrap gap-2 mb-10">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setActiveFilter(f.value)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeFilter === f.value
                  ? 'bg-gold text-black'
                  : 'bg-grey-dark text-grey-text hover:text-white'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Grille */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          {filtered.map((project) => (
            <div
              key={project.title}
              className="break-inside-avoid bg-grey-dark rounded-xl overflow-hidden hover:bg-grey-mid transition-colors group"
            >
              <div className="aspect-[4/3] bg-gradient-to-br from-grey-mid to-black flex items-center justify-center">
                <svg className="w-12 h-12 text-grey-text/20 group-hover:text-gold/30 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-gold font-mono">{project.year}</span>
                  <span className="text-xs text-grey-text">{project.location}</span>
                </div>
                <h3 className="font-display text-xl text-white tracking-wide">{project.title}</h3>
                <p className="mt-1 text-sm text-grey-text">{project.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-grey-text py-20">Aucune réalisation trouvée.</p>
        )}
      </div>
    </div>
  )
}
