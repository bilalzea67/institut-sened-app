"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const SessionSchema = z.object({
  levelId: z.string(),
  title: z.string().min(2),
  startTime: z.string(),
  endTime: z.string(),
  liveUrl: z.string().url().optional().or(z.literal("")),
  replayUrl: z.string().url().optional().or(z.literal("")),
})

export async function createSession(formData: FormData) {
  const validatedFields = SessionSchema.safeParse({
    levelId: formData.get("levelId"),
    title: formData.get("title"),
    startTime: formData.get("startTime"),
    endTime: formData.get("endTime"),
    liveUrl: formData.get("liveUrl"),
    replayUrl: formData.get("replayUrl"),
  })

  if (!validatedFields.success) {
    return { error: "Données invalides." }
  }

  const { levelId, title, startTime, endTime, liveUrl, replayUrl } = validatedFields.data

  try {
    await prisma.session.create({
      data: {
        levelId,
        title,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        liveUrl: liveUrl || null,
        replayUrl: replayUrl || null,
      },
    })
    revalidatePath("/admin/sessions")
    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    return { error: "Erreur lors de la création de la session." }
  }
}

export async function addResource(formData: FormData) {
  const title = formData.get("title") as string
  const url = formData.get("url") as string
  const levelId = formData.get("levelId") as string
  const sessionId = formData.get("sessionId") as string | null
  const isAnnualPack = formData.get("isAnnualPack") === "true"

  try {
    await prisma.resource.create({
      data: { title, url, levelId, sessionId: sessionId || null, isAnnualPack },
    })
    revalidatePath("/admin/sessions")
    revalidatePath(`/module/${levelId}`)
    return { success: true }
  } catch (error) {
    return { error: "Erreur lors de l'ajout de la ressource." }
  }
}
