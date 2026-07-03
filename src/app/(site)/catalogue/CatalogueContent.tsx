'use client'

import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { models, bedroomCounts, areaRanges } from '@/data/models'
import { getModelImages } from '@/data/images'

export default function CatalogueContent() {
  const searchParams = useSearchParams()
  const [typeFilter, setTypeFilter] = useState<string>('')
  const [bedroomFilter, setBedroomFilter] = useState<number | null>(null)
  const [areaFilter, setAreaFilter] = useState<string>('')

  useEffect(() => {
    const type = searchParams.get('type')
    if (type === 'plain-pied' || type === 'etage') setTypeFilter(type)
  }, [searchParams])

  const filtered = useMemo(() => {
    return models.filter((m) => {
      if (typeFilter === 'plain-pied' && m.type !== 'plain-pied') return false
      if (typeFilter === 'etage' && m.type !== 'etage') return false
      if (bedroomFilter !== null && m.bedrooms !== bedroomFilter) return false
      if (areaFilter) {
        const range = areaRanges.find((r) => r.label === areaFilter)
        if (range && (m.area < range.min || m.area >= range.max)) return false
      }
      return true
    })
  }, [typeFilter, bedroomFilter, areaFilter])

  return (
    <>
      {/* Hero */}
      <section className="pt-28 pb-12 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl text-white tracking-tight">
            CATALOGUE
          </h1>
          <p className="mt-4 text-base sm:text-lg text-grey-text max-w-2xl">
            {models.length} modèles de maisons modulaires — du studio compact à la villa prestige.
            Construites en acier, livrées en 15 à 20 jours à Ouagadougou.
          </p>
        </div>
      </section>

      {/* Filtres */}
      <section className="pb-8 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-3">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2.5 rounded-lg border border-grey-mid bg-grey-dark text-white outline-none focus:border-gold transition-colors text-sm"
            >
              <option value="">Tous types</option>
              <option value="plain-pied">Plain-pied</option>
              <option value="etage">Étage</option>
            </select>
            <select
              value={areaFilter}
              onChange={(e) => setAreaFilter(e.target.value)}
              className="px-4 py-2.5 rounded-lg border border-grey-mid bg-grey-dark text-white outline-none focus:border-gold transition-colors text-sm"
            >
              <option value="">Toutes surfaces</option>
              {areaRanges.map((r) => (
                <option key={r.label} value={r.label}>{r.label}</option>
              ))}
            </select>
            <select
              value={bedroomFilter ?? ''}
              onChange={(e) => setBedroomFilter(e.target.value ? Number(e.target.value) : null)}
              className="px-4 py-2.5 rounded-lg border border-grey-mid bg-grey-dark text-white outline-none focus:border-gold transition-colors text-sm"
            >
              <option value="">Toutes chambres</option>
              {bedroomCounts.map((n) => (
                <option key={n} value={n}>{n} chambre{n > 1 ? 's' : ''}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Grille */}
      <section className="pb-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((m) => {
              const cover = getModelImages(m)[0]
              return (
              <Link
                key={m.ref}
                href={`/modele/${m.slug}`}
                className="group bg-grey-dark rounded-xl overflow-hidden hover:bg-grey-mid transition-all duration-200 hover:-translate-y-1"
              >
                <div className="h-48 bg-gradient-to-br from-gold/10 to-black flex items-center justify-center relative overflow-hidden">
                  {cover ? (
                    <img
                      src={cover}
                      alt={m.name}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <svg className="w-16 h-16 text-gold/30 group-hover:text-gold/50 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  )}
                  <span className="absolute top-3 left-3 z-10 bg-gold text-black text-xs font-bold px-2.5 py-1 rounded-md">
                    {m.ref}
                  </span>
                  <span className="absolute top-3 right-3 z-10 bg-black/60 text-white text-xs px-2.5 py-1 rounded-md">
                    {m.type === 'etage' ? 'Étage' : 'Plain-pied'}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="font-display text-xl text-white tracking-wide">{m.name}</h3>
                  <p className="mt-2 text-xs text-grey-text leading-relaxed line-clamp-2">{m.description}</p>
                  <div className="flex items-center gap-4 mt-4 text-xs text-grey-text">
                    <span className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                      </svg>
                      {m.area}m²
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      {m.bedrooms} ch.
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {m.bathrooms} sdb
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1 mt-4 text-sm text-gold font-medium">
                    Voir ce modèle <span aria-hidden="true">&rarr;</span>
                  </span>
                </div>
              </Link>
              )
            })}
          </div>
          {filtered.length === 0 && (
            <p className="text-center text-grey-text py-12">Aucun modèle ne correspond à ces critères.</p>
          )}
        </div>
      </section>
    </>
  )
}
