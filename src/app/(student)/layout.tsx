import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { LogoutButton } from "@/components/shared/LogoutButton"

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session) {
    redirect("/login")
  }

  if (session.user.role !== "STUDENT") {
    redirect("/")
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="sticky top-0 z-40 w-full border-b bg-white/95 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="text-xl font-bold text-indigo-600">
              Institut Sened
            </Link>
            <nav className="hidden md:flex gap-4">
              <Link href="/dashboard" className="text-sm font-medium hover:text-indigo-600">
                Tableau de bord
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 hidden sm:inline">
              {session.user.name}
            </span>
            <LogoutButton />
          </div>
        </div>
      </header>
      <main className="container mx-auto py-8 px-4">
        {children}
      </main>
    </div>
  )
}
