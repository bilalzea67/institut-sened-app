import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { LogoutButton } from "@/components/shared/LogoutButton"
import { Users, LayoutDashboard, GraduationCap, Calendar } from "lucide-react"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session) {
    redirect("/login")
  }

  if (session.user?.role !== "ADMIN") {
    redirect("/")
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Admin */}
      <aside className="w-64 bg-white border-r hidden lg:flex flex-col sticky top-0 h-screen">
        <div className="p-6 border-b">
          <Link href="/admin" className="text-xl font-bold text-indigo-600">
            Admin Sened
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg">
            <LayoutDashboard className="h-5 w-5" /> Dashboard
          </Link>
          <Link href="/admin/users" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg">
            <Users className="h-5 w-5" /> Élèves
          </Link>
          <Link href="/admin/modules" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg">
            <GraduationCap className="h-5 w-5" /> Modules & Niveaux
          </Link>
          <Link href="/admin/sessions" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg">
            <Calendar className="h-5 w-5" /> Planning & Cours
          </Link>
        </nav>
        <div className="p-4 border-t">
          <LogoutButton />
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b flex items-center justify-between px-8 lg:hidden">
          <Link href="/admin" className="text-xl font-bold text-indigo-600">
            Admin Sened
          </Link>
          <LogoutButton />
        </header>
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
