import prisma from "@/lib/prisma"
import { Users as UsersIcon, GraduationCap as GraduationIcon, Video as VideoIcon, CheckCircle as CheckIcon } from "lucide-react"
import Link from "next/link"

export default async function AdminDashboard() {
  const stats = [
    { 
      label: "Élèves inscrits", 
      value: await prisma.user.count({ where: { role: 'STUDENT' } }), 
      icon: UsersIcon, 
      color: "text-blue-600", 
      bg: "bg-blue-50" 
    },
    { 
      label: "Modules actifs", 
      value: await prisma.module.count(), 
      icon: GraduationIcon, 
      color: "text-indigo-600", 
      bg: "bg-indigo-50" 
    },
    { 
      label: "Sessions prévues", 
      value: await prisma.session.count({ where: { startTime: { gte: new Date() } } }), 
      icon: VideoIcon, 
      color: "text-red-600", 
      bg: "bg-red-50" 
    },
    { 
      label: "Cours terminés", 
      value: await prisma.session.count({ where: { endTime: { lte: new Date() } } }), 
      icon: CheckIcon, 
      color: "text-green-600", 
      bg: "bg-green-50" 
    },
  ]

  const recentUsers = await prisma.user.findMany({
    where: { role: 'STUDENT' },
    orderBy: { createdAt: 'desc' },
    take: 5
  })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Vue d&apos;ensemble</h1>
        <p className="text-gray-500 text-sm">Statistiques générales de l&apos;institut</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-xl border shadow-sm flex items-center gap-4">
            <div className={`${stat.bg} ${stat.color} p-3 rounded-lg`}>
              <stat.icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-bold text-gray-900">Derniers inscrits</h2>
            <Link href="/admin/users" className="text-sm text-indigo-600 hover:underline">Voir tout</Link>
          </div>
          <div className="space-y-4">
            {recentUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between py-2 border-b last:border-0">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center text-xs font-bold text-gray-600">
                    {user.firstName[0]}{user.lastName[0]}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{user.firstName} {user.lastName}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </div>
                <span className="text-xs text-gray-400">
                  {user.createdAt.toLocaleDateString('fr-FR')}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border shadow-sm flex flex-col justify-center items-center text-center space-y-4">
          <div className="bg-red-50 p-4 rounded-full">
            <VideoIcon className="h-8 w-8 text-red-600" />
          </div>
          <div>
            <h2 className="font-bold text-gray-900">Gestion des cours</h2>
            <p className="text-sm text-gray-500 mt-1 max-w-[250px]">
              Planifiez de nouvelles sessions, ajoutez des liens YouTube et gérez les ressources PDF.
            </p>
          </div>
          <Link 
            href="/admin/sessions" 
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-indigo-700 transition-colors"
          >
            Aller au planning
          </Link>
        </div>
      </div>
    </div>
  )
}
