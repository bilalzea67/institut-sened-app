"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function updateQuranTracking(userId: string, data: { homework?: string, remarks?: string, status?: string }) {
  try {
    await prisma.quranTracking.create({
      data: {
        userId,
        homework: data.homework,
        remarks: data.remarks,
        status: data.status,
      },
    })
    revalidatePath("/quran")
    return { success: true }
  } catch (error) {
    return { error: "Erreur lors de la mise à jour du suivi." }
  }
}

export async function createQuranReport(userId: string, term: string, checklist: Record<string, boolean>, notes?: string) {
  try {
    await prisma.quranReport.create({
      data: {
        userId,
        term,
        checklist: JSON.stringify(checklist),
        notes,
      },
    })
    revalidatePath("/quran")
    return { success: true }
  } catch (error) {
    return { error: "Erreur lors de la création du bulletin." }
  }
}

export async function markAsCompleted(userId: string, sessionId: string) {
  try {
    await prisma.progress.upsert({
      where: {
        userId_sessionId: { userId, sessionId }
      },
      update: { completedAt: new Date() },
      create: { userId, sessionId }
    })
    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    return { error: "Erreur lors de la validation." }
  }
}
