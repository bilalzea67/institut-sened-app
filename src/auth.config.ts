import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"

export const authConfig = {
  providers: [
    Credentials({
      async authorize(credentials) {
        // La logique réelle restera dans auth.ts pour ne pas polluer le middleware
        return null
      },
    }),
  ],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isDashboard = nextUrl.pathname.startsWith('/dashboard') || 
                          nextUrl.pathname.startsWith('/module') || 
                          nextUrl.pathname.startsWith('/quran');
      const isAdmin = nextUrl.pathname.startsWith('/admin');

      if (isDashboard || isAdmin) {
        if (isLoggedIn) return true;
        return false; // Redirige vers login
      }
      return true;
    },
  },
} satisfies NextAuthConfig
