import prisma from "@/lib/prisma"
import { Calendar, Plus, Clock, Video, FileText, ChevronRight } from "lucide-react"

export default async function AdminSessionsPage() {
  const sessions = await prisma.session.findMany({
    orderBy: { startTime: 'desc' },
    include: {
      level: { include: { module: true } },
      _count: { select: { resources: true } }
    }
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Planning & Cours</h1>
          <p className="text-gray-500 text-sm">Gérez les sessions en direct et les replays</p>
        </div>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-indigo-700 shadow-sm transition-colors">
          <Plus className="h-4 w-4" /> Nouvelle session
        </button>
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="p-6 border-b bg-gray-50/50 flex items-center gap-4">
          <Calendar className="h-5 w-5 text-indigo-600" />
          <h2 className="font-bold text-gray-900">Toutes les sessions</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {sessions.map((session) => (
            <div key={session.id} className="p-6 hover:bg-gray-50 transition-colors flex items-center justify-between group">
              <div className="flex gap-6 items-start">
                <div className="flex flex-col items-center justify-center min-w-[70px] py-2 px-3 bg-gray-100 rounded-lg text-gray-500 font-bold">
                   <span className="text-[10px] uppercase tracking-wider">{session.startTime.toLocaleDateString('fr-FR', { month: 'short' })}</span>
                   <span className="text-xl">{session.startTime.getDate()}</span>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{session.title}</h3>
                    <span className="text-[10px] bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded font-bold uppercase">
                      {session.level.module.name} - {session.level.name}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {session.startTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
                    {session.liveUrl && <span className="flex items-center gap-1 text-red-600"><Video className="h-3 w-3" /> Live configuré</span>}
                    {session.replayUrl && <span className="flex items-center gap-1 text-blue-600"><Video className="h-3 w-3" /> Replay disponible</span>}
                    <span className="flex items-center gap-1"><FileText className="h-3 w-3" /> {session._count.resources} ressource(s)</span>
                  </div>
                </div>
              </div>
              <button className="p-2 text-gray-300 group-hover:text-indigo-600 transition-colors">
                 <ChevronRight className="h-6 w-6" />
              </button>
            </div>
          ))}
          {sessions.length === 0 && (
            <div className="p-12 text-center text-gray-500 italic">Aucune session planifiée.</div>
          )}
        </div>
      </div>
    </div>
  )
}
