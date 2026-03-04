"use server"

import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { Role } from "@prisma/client"

const UserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  role: z.enum(["STUDENT", "ADMIN"]).default("STUDENT"),
})

export async function createUser(formData: FormData) {
  const validatedFields = UserSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    role: formData.get("role"),
  })

  if (!validatedFields.success) {
    return { error: "Données invalides." }
  }

  const { email, password, firstName, lastName, role } = validatedFields.data
  const passwordHash = await bcrypt.hash(password, 10)

  try {
    await prisma.user.create({
      data: { 
        email, 
        passwordHash, 
        firstName, 
        lastName, 
        role: role as Role 
      },
    })
    revalidatePath("/admin/users")
    return { success: true }
  } catch (error) {
    return { error: "Cet email est déjà utilisé." }
  }
}

export async function deleteUser(userId: string) {
  try {
    await prisma.user.delete({ where: { id: userId } })
    revalidatePath("/admin/users")
    return { success: true }
  } catch (error) {
    return { error: "Erreur lors de la suppression." }
  }
}

export async function enrollUser(userId: string, levelId: string) {
  try {
    await prisma.enrollment.create({
      data: { userId, levelId },
    })
    revalidatePath("/admin/users")
    return { success: true }
  } catch (error) {
    return { error: "L'élève est déjà inscrit à ce niveau." }
  }
}
