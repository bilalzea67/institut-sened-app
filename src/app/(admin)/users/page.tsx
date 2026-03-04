import prisma from "@/lib/prisma"
import { UserPlus, Mail, Shield, Trash2, Edit } from "lucide-react"

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { enrollments: true } } }
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des élèves</h1>
          <p className="text-gray-500 text-sm">Liste et administration des comptes utilisateurs</p>
        </div>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-indigo-700 shadow-sm transition-colors">
          <UserPlus className="h-4 w-4" /> Ajouter un élève
        </button>
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Nom / Email</th>
              <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Rôle</th>
              <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Inscriptions</th>
              <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-gray-900">{user.firstName} {user.lastName}</span>
                    <span className="text-xs text-gray-500 flex items-center gap-1"><Mail className="h-3 w-3" /> {user.email}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                    user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'
                  }`}>
                    <Shield className="h-3 w-3 inline mr-1" /> {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user._count.enrollments} module(s)
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                  <button className="text-indigo-600 hover:text-indigo-900"><Edit className="h-4 w-4" /></button>
                  {user.role !== 'ADMIN' && (
                    <button className="text-red-600 hover:text-red-900"><Trash2 className="h-4 w-4" /></button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && (
          <div className="p-8 text-center text-gray-500">Aucun utilisateur trouvé.</div>
        )}
      </div>
    </div>
  )
}
