import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import { ArrowLeft, User, ClipboardList, Award } from "lucide-react"
import Link from "next/link"

export default async function QuranPage() {
  const session = await auth()
  const userId = session?.user.id as string

  // Récupérer le suivi Coran
  const tracking = await prisma.quranTracking.findMany({
    where: { userId },
    orderBy: { date: 'desc' }
  })

  // Récupérer les bulletins
  const reports = await prisma.quranReport.findMany({
    where: { userId },
    orderBy: { term: 'desc' }
  })

  return (
    <div className="space-y-6">
      <Link href="/dashboard" className="flex items-center gap-2 text-sm text-gray-500 hover:text-indigo-600 transition-colors">
        <ArrowLeft className="h-4 w-4" /> Retour au tableau de bord
      </Link>

      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Suivi Coran</h1>
        <div className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full flex items-center gap-2 text-sm font-bold">
          <User className="h-4 w-4" /> {session?.user.name}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-indigo-600" /> Fiche de suivi
          </h2>
          <div className="space-y-4">
            {tracking.map((item) => (
              <div key={item.id} className="bg-white p-5 rounded-xl border shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-sm font-bold text-gray-400">
                    {item.date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                    item.status === 'EXCELLENT' ? 'bg-green-100 text-green-700' :
                    item.status === 'BIEN' ? 'bg-blue-100 text-blue-700' :
                    'bg-orange-100 text-orange-700'
                  }`}>
                    {item.status || 'NON DÉFINI'}
                  </span>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    <span className="font-bold text-gray-900">Devoirs :</span> {item.homework || "Aucun devoir spécifié."}
                  </p>
                  <p className="text-sm text-gray-600 italic border-l-2 border-gray-100 pl-3">
                    &quot;{item.remarks || "Pas de remarques particulières."}&quot;
                  </p>
                </div>
              </div>
            ))}
            {tracking.length === 0 && (
              <p className="text-gray-500 italic bg-white p-8 text-center rounded-xl border">
                Aucun suivi enregistré pour le moment.
              </p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Award className="h-5 w-5 text-indigo-600" /> Bulletin
          </h2>
          <div className="space-y-4">
            {reports.map((report) => {
              const checklist = JSON.parse(report.checklist as string)
              return (
                <div key={report.id} className="bg-white p-6 rounded-xl border-2 border-indigo-50 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-indigo-600 text-white px-3 py-1 text-xs font-bold rounded-bl-lg">
                    {report.term}
                  </div>
                  <h3 className="font-bold text-lg mb-4">Compétences acquises</h3>
                  <div className="space-y-3">
                    {Object.entries(checklist).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between text-sm">
                        <span className="text-gray-700 font-medium">{key}</span>
                        <div className={`h-6 w-6 rounded-full flex items-center justify-center ${value ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-300'}`}>
                          {value ? '✓' : ''}
                        </div>
                      </div>
                    ))}
                  </div>
                  {report.notes && (
                    <div className="mt-6 pt-4 border-t italic text-sm text-gray-500">
                      Note de l&apos;administration : {report.notes}
                    </div>
                  )}
                </div>
              )
            })}
            {reports.length === 0 && (
              <p className="text-gray-500 italic bg-white p-8 text-center rounded-xl border">
                Les bulletins ne sont pas encore disponibles.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
