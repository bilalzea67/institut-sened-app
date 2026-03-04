import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import { notFound, redirect } from "next/navigation"
import { FileText, PlayCircle, CheckCircle2, Info, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default async function ModulePage({ params }: { params: { id: string } }) {
  const session = await auth()
  const userId = session?.user.id as string

  // Vérifier l'inscription
  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_levelId: { userId, levelId: params.id }
    },
    include: {
      level: {
        include: {
          module: true,
          sessions: {
            orderBy: { startTime: 'desc' },
            include: { resources: true }
          },
          resources: {
            where: { isAnnualPack: true }
          }
        }
      }
    }
  })

  if (!enrollment) {
    const levelExists = await prisma.level.findUnique({ where: { id: params.id } })
    if (levelExists) redirect("/dashboard")
    notFound()
  }

  const level = enrollment.level
  const completedSessionIds = (await prisma.progress.findMany({
    where: { userId, session: { levelId: params.id } },
    select: { sessionId: true }
  })).map(p => p.sessionId)

  return (
    <div className="space-y-6">
      <Link href="/dashboard" className="flex items-center gap-2 text-sm text-gray-500 hover:text-indigo-600 transition-colors">
        <ArrowLeft className="h-4 w-4" /> Retour au tableau de bord
      </Link>

      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{level.module.name}</h1>
          <p className="text-gray-500">{level.name}</p>
        </div>
        {level.resources.length > 0 && (
          <a
            href={level.resources[0].url}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-indigo-700"
          >
            <FileText className="h-4 w-4" /> Télécharger le pack annuel
          </a>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold">Sessions & Replays</h2>
          <div className="space-y-3">
            {level.sessions.map((s) => {
              const isCompleted = completedSessionIds.includes(s.id)
              return (
                <div key={s.id} className={`bg-white p-4 rounded-xl border shadow-sm flex items-center justify-between gap-4 ${isCompleted ? 'border-green-100 bg-green-50/10' : ''}`}>
                  <div className="flex items-center gap-4">
                    <div className={`${isCompleted ? 'text-green-500' : 'text-gray-300'}`}>
                      <CheckCircle2 className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{s.title}</h4>
                      <div className="flex gap-3 mt-1">
                        {s.replayUrl && (
                          <a href={s.replayUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-600 flex items-center gap-1 hover:underline">
                            <PlayCircle className="h-3 w-3" /> Replay
                          </a>
                        )}
                        {s.resources.map(res => (
                          <a key={res.id} href={res.url} target="_blank" rel="noopener noreferrer" className="text-xs text-gray-500 flex items-center gap-1 hover:underline">
                            <FileText className="h-3 w-3" /> {res.title}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400">
                      {s.startTime.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
                    </p>
                  </div>
                </div>
              )
            })}
            {level.sessions.length === 0 && (
              <p className="text-gray-500 italic">Aucune session disponible pour le moment.</p>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border shadow-sm">
            <h3 className="font-bold flex items-center gap-2 mb-4 text-indigo-600">
              <Info className="h-5 w-5" /> Informations
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Livres obligatoires</p>
                <p className="text-sm text-gray-700 mt-1">{level.requiredBooks || "Aucun livre requis répertorié."}</p>
              </div>
              <div className="pt-4 border-t">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Votre progression</p>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex-1 bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${level.sessions.length > 0 ? Math.round((completedSessionIds.length / level.sessions.length) * 100) : 0}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold text-gray-700">
                    {completedSessionIds.length}/{level.sessions.length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
