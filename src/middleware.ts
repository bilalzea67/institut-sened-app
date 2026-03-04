import NextAuth from "next-auth"
import { authConfig } from "./auth.config"

export default NextAuth(authConfig).auth

export const config = {
  // Ignorer les fichiers statiques et l'API
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
