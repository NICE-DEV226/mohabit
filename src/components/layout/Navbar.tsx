'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Button from '@/components/ui/Button'

const products = [
  { href: '/catalogue', label: 'Voir tout le catalogue' },
  { href: '/catalogue?type=plain-pied', label: 'Modèles plain-pied' },
  { href: '/catalogue?type=etage', label: 'Modèles à étage' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLLIElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <img src="/logo.jpeg" alt="Modu Habitat" className="h-9 w-auto" />
            <span className="font-display text-xl tracking-wider text-white">
              MODU HABITAT
            </span>
          </Link>

          {/* Desktop nav */}
          <ul className="hidden md:flex items-center gap-1">
            <li>
              <Link href="/" className="px-4 py-2 text-sm text-grey-text hover:text-white transition-colors rounded-lg hover:bg-white/5">
                Accueil
              </Link>
            </li>
            <li ref={dropdownRef} className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                onMouseEnter={() => setDropdownOpen(true)}
                className="flex items-center gap-1 px-4 py-2 text-sm text-grey-text hover:text-white transition-colors rounded-lg hover:bg-white/5"
              >
                Catalogue
                <svg className={`w-3 h-3 mt-0.5 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {dropdownOpen && (
                <div
                  onMouseLeave={() => setDropdownOpen(false)}
                  className="absolute top-full left-0 mt-1 w-56 bg-grey-dark border border-white/10 rounded-xl shadow-xl overflow-hidden"
                >
                  {products.map((p) => (
                    <Link
                      key={p.href}
                      href={p.href}
                      onClick={() => setDropdownOpen(false)}
                      className="block px-5 py-3 text-sm text-grey-text hover:text-white hover:bg-white/5 transition-colors border-b border-white/5 last:border-0"
                    >
                      {p.label}
                    </Link>
                  ))}
                </div>
              )}
            </li>
            <li>
              <Link href="/realisations" className="px-4 py-2 text-sm text-grey-text hover:text-white transition-colors rounded-lg hover:bg-white/5">
                Réalisations
              </Link>
            </li>
            <li>
              <Link href="/contact" className="px-4 py-2 text-sm text-grey-text hover:text-white transition-colors rounded-lg hover:bg-white/5">
                Contact
              </Link>
            </li>
            <li className="ml-4">
              <Button href="/contact" size="sm">
                Demander un devis
              </Button>
            </li>
          </ul>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-white p-2"
            aria-label="Menu"
          >
            {menuOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-black border-t border-white/10 px-4 py-5 space-y-1">
          <MobileLink href="/" label="Accueil" onClick={() => setMenuOpen(false)} />
          <div className="pt-3 pb-1">
            <p className="px-4 text-xs text-grey-text uppercase tracking-wider font-medium">Catalogue</p>
          </div>
          {products.map((p) => (
            <MobileLink key={p.href} href={p.href} label={p.label} onClick={() => setMenuOpen(false)} indent />
          ))}
          <div className="pt-3">
            <MobileLink href="/realisations" label="Réalisations" onClick={() => setMenuOpen(false)} />
            <MobileLink href="/contact" label="Contact" onClick={() => setMenuOpen(false)} />
          </div>
          <div className="pt-4">
            <Button href="/contact" size="md" className="w-full justify-center" onClick={() => setMenuOpen(false)}>
              Demander un devis
            </Button>
          </div>
        </div>
      )}
    </nav>
  )
}

function MobileLink({ href, label, onClick, indent }: { href: string; label: string; onClick: () => void; indent?: boolean }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`block py-2.5 text-sm text-grey-text hover:text-white transition-colors rounded-lg hover:bg-white/5 ${indent ? 'px-6' : 'px-4'}`}
    >
      {label}
    </Link>
  )
}
