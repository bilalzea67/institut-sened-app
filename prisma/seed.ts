import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const passwordHash = await bcrypt.hash('password123', 10)

  // Create Admin
  const admin = await prisma.user.upsert({
    where: { email: 'admin@institut.fr' },
    update: {},
    create: {
      email: 'admin@institut.fr',
      passwordHash,
      role: 'ADMIN',
      firstName: 'Admin',
      lastName: 'Sened',
    },
  })

  // Create Student
  const student = await prisma.user.upsert({
    where: { email: 'student@institut.fr' },
    update: {},
    create: {
      email: 'student@institut.fr',
      passwordHash,
      role: 'STUDENT',
      firstName: 'Bilal',
      lastName: 'Student',
    },
  })

  // Create a Module and Level
  const fiqhModule = await prisma.module.upsert({
    where: { id: 'fiqh-id' },
    update: {},
    create: {
      id: 'fiqh-id',
      name: 'Fiqh',
      description: 'Module de Fiqh',
      levels: {
        create: {
          id: 'fiqh-level-1',
          name: 'Année 1',
          requiredBooks: "L'essentiel de la religion",
        }
      }
    }
  })

  // Enroll Student in Fiqh Level 1
  await prisma.enrollment.upsert({
    where: {
      userId_levelId: {
        userId: student.id,
        levelId: 'fiqh-level-1'
      }
    },
    update: {},
    create: {
      userId: student.id,
      levelId: 'fiqh-level-1'
    }
  })

  console.log('Seed completed successfully.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
