import { withAuth } from 'next-auth/middleware'

export default withAuth({
  pages: {
    signIn: '/dashboard/login',
  },
})

export const config = {
  matcher: ['/dashboard/:path*'],
}
