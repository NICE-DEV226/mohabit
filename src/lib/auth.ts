import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Mot de passe', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const adminEmail = process.env.ADMIN_EMAIL || ''
        // Hash bcrypt du mot de passe admin (recommandé — voir /api/auth/register).
        const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH || ''
        // Fallback en clair (dev uniquement) si aucun hash n'est configuré.
        const adminPasswordPlain = process.env.ADMIN_PASSWORD || ''

        if (credentials.email !== adminEmail) return null

        const passwordOk = adminPasswordHash
          ? bcrypt.compareSync(credentials.password, adminPasswordHash)
          : Boolean(adminPasswordPlain) && credentials.password === adminPasswordPlain

        if (!passwordOk) return null

        return {
          id: '1',
          name: 'Administrateur',
          email: adminEmail,
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60,
  },
  pages: {
    signIn: '/dashboard/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id
      return token
    },
    async session({ session, token }) {
      if (session.user) session.user.id = token.id as string
      return session
    },
  },
}
