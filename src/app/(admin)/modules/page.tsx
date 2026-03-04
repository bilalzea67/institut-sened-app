import prisma from "@/lib/prisma"
import { GraduationCap, Plus, FolderOpen, MoreVertical, Edit, Trash2 } from "lucide-react"

export default async function AdminModulesPage() {
  const modules = await prisma.module.findMany({
    include: {
      levels: {
        include: { _count: { select: { enrollments: true, sessions: true } } }
      }
    }
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Modules & Niveaux</h1>
          <p className="text-gray-500 text-sm">Organisez les matières et les années d&apos;étude</p>
        </div>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-indigo-700 shadow-sm transition-colors">
          <Plus className="h-4 w-4" /> Nouveau module
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {modules.map((module) => (
          <div key={module.id} className="bg-white rounded-xl border shadow-sm overflow-hidden">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50/50">
              <div className="flex items-center gap-3">
                <div className="bg-indigo-100 p-2 rounded-lg text-indigo-700">
                  <FolderOpen className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900">{module.name}</h3>
                  <p className="text-sm text-gray-500">{module.description || "Aucune description"}</p>
                </div>
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                <MoreVertical className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {module.levels.map((level) => (
                  <div key={level.id} className="p-4 rounded-lg border border-gray-100 bg-white hover:border-indigo-200 transition-colors group relative">
                    <div className="flex justify-between items-start mb-4">
                      <div className="h-10 w-10 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600 font-bold">
                        {level.name[0]}
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button className="p-1 text-gray-400 hover:text-indigo-600"><Edit className="h-4 w-4" /></button>
                         <button className="p-1 text-gray-400 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </div>
                    <h4 className="font-bold text-gray-900">{level.name}</h4>
                    <div className="mt-4 flex flex-wrap gap-4 text-xs text-gray-500 font-medium">
                      <span className="flex items-center gap-1">
                         <GraduationCap className="h-3 w-3" /> {level._count.enrollments} élèves
                      </span>
                      <span className="flex items-center gap-1">
                         <FolderOpen className="h-3 w-3" /> {level._count.sessions} sessions
                      </span>
                    </div>
                  </div>
                ))}
                <button className="p-4 rounded-lg border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-indigo-600 hover:border-indigo-200 transition-all">
                  <Plus className="h-5 w-5" />
                  <span className="text-xs font-bold uppercase">Ajouter un niveau</span>
                </button>
              </div>
            </div>
          </div>
        ))}

        {modules.length === 0 && (
          <div className="bg-white p-12 text-center rounded-xl border border-dashed border-gray-300">
            <p className="text-gray-500 italic">Aucun module configuré. Commencez par en créer un.</p>
          </div>
        )}
      </div>
    </div>
  )
}
