import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import Link from "next/link"
import { Calendar, BookOpen, Clock, ExternalLink } from "lucide-react"

export default async function DashboardPage() {
  const session = await auth()
  const userId = session?.user.id as string
  const userName = session?.user.name?.split(" ")[0] || "Étudiant"

  // Récupérer les inscriptions de l'utilisateur avec les modules et niveaux
  const enrollments = await prisma.enrollment.findMany({
    where: { userId },
    include: {
      level: {
        include: {
          module: true,
          _count: { select: { sessions: true } }
        }
      }
    }
  })

  // Récupérer les sessions à venir (aujourd'hui ou futur)
  const now = new Date()
  const upcomingSessions = await prisma.session.findMany({
    where: {
      levelId: { in: enrollments.map(e => e.levelId) },
      endTime: { gte: now }
    },
    orderBy: { startTime: 'asc' },
    take: 3,
    include: { level: { include: { module: true } } }
  })

  // Vérifier s'il y a un live maintenant
  const liveSession = upcomingSessions.find(s => {
    const startMargin = new Date(s.startTime.getTime() - 15 * 60000) // 15 min avant
    return now >= startMargin && now <= s.endTime
  })

  // Calculer l'avancement moyen par module (simulation)
  const modulesWithProgress = await Promise.all(enrollments.map(async (e) => {
    const totalSessions = e.level._count.sessions
    const completedSessions = await prisma.progress.count({
      where: { userId, session: { levelId: e.levelId } }
    })
    const progress = totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0
    return { ...e, progress }
  }))

  return (
    <div className="space-y-8">
      {/* Header Accueil */}
      <section className="bg-white p-6 rounded-xl border shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">
          Assalamoualikoum wa rahmatullah, {userName}
        </h1>
        <p className="text-gray-600 mt-1">Heureux de vous revoir sur votre espace étudiant.</p>
      </section>

      {/* Banner Live Dynamique */}
      {liveSession && (
        <section className="bg-red-50 border-2 border-red-500 p-6 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-red-500 h-3 w-3 rounded-full animate-ping" />
            <div>
              <p className="text-red-700 font-bold text-sm uppercase tracking-wide">🔴 En direct maintenant</p>
              <h3 className="text-red-900 font-bold text-xl">{liveSession.level.module.name} : {liveSession.title}</h3>
            </div>
          </div>
          <a
            href={liveSession.liveUrl || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-red-600 text-white px-8 py-3 rounded-lg font-bold flex items-center gap-2 hover:bg-red-700 transition-colors shadow-lg"
          >
            Rejoindre le cours <ExternalLink className="h-4 w-4" />
          </a>
        </section>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-indigo-600" /> Mes modules
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {modulesWithProgress.map((enrollment) => (
              <Link
                key={enrollment.id}
                href={`/module/${enrollment.levelId}`}
                className="bg-white p-5 rounded-xl border shadow-sm hover:border-indigo-500 transition-all group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg group-hover:text-indigo-600 transition-colors">
                      {enrollment.level.module.name}
                    </h3>
                    <p className="text-sm text-gray-500">{enrollment.level.name}</p>
                  </div>
                  <span className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded text-xs font-bold">
                    {enrollment.progress}%
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${enrollment.progress}%` }}
                  />
                </div>
                <div className="mt-4 flex justify-between items-center text-xs text-gray-500">
                   <span>{enrollment.level._count.sessions} sessions</span>
                   <span className="text-indigo-600 font-medium">Accéder au cours →</span>
                </div>
              </Link>
            ))}
            {enrollments.length === 0 && (
              <p className="text-gray-500 col-span-2">Vous n&apos;êtes inscrit à aucun module pour le moment.</p>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Calendar className="h-5 w-5 text-indigo-600" /> Prochainement
          </h2>
          <div className="space-y-4">
            {upcomingSessions.map((session) => (
              <div key={session.id} className="bg-white p-4 rounded-xl border shadow-sm flex gap-4">
                <div className="bg-indigo-50 text-indigo-700 p-2 rounded-lg flex flex-col items-center justify-center min-w-[60px] h-fit">
                  <span className="text-xs font-bold uppercase">{session.startTime.toLocaleDateString('fr-FR', { weekday: 'short' })}</span>
                  <span className="text-xl font-bold">{session.startTime.getDate()}</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 leading-tight">{session.title}</h4>
                  <p className="text-xs text-indigo-600 font-medium mt-1 uppercase tracking-tight">
                    {session.level.module.name}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                    <Clock className="h-3 w-3" />
                    {session.startTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
            {upcomingSessions.length === 0 && (
              <p className="text-gray-500 text-sm italic text-center py-8">Aucune session planifiée.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
