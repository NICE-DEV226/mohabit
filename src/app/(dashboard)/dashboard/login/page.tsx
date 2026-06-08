'use client'

import { useState, FormEvent } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const form = new FormData(e.currentTarget)
    const result = await signIn('credentials', {
      email: form.get('email'),
      password: form.get('password'),
      redirect: false,
    })

    if (result?.ok) {
      router.push('/dashboard')
    } else {
      setError('Email ou mot de passe incorrect')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <img src="/logo.jpeg" alt="Modu Habitat" className="h-12 mx-auto mb-4" />
          <h1 className="font-display text-3xl text-white tracking-wide">MODU HABITAT</h1>
          <p className="text-grey-text text-sm mt-1">Espace administration</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-grey-dark rounded-xl p-8 space-y-5">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg px-4 py-3">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-grey-text mb-1">Email</label>
            <input id="email" name="email" type="email" required
              className="w-full px-4 py-3 rounded-lg border border-grey-mid bg-black text-white placeholder:text-grey-text outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors"
              placeholder="admin@moduhabitat.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-grey-text mb-1">Mot de passe</label>
            <input id="password" name="password" type="password" required
              className="w-full px-4 py-3 rounded-lg border border-grey-mid bg-black text-white placeholder:text-grey-text outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gold text-black font-semibold rounded-lg hover:bg-gold-600 transition-colors disabled:opacity-50"
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  )
}
