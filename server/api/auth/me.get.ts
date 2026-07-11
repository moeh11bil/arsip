import { getPrisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const userId = event.context.user?.id
  if (!userId) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const prisma = getPrisma()
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      nip: true,
      nis: true,
      email: true,
      namaLengkap: true,
      role: true,
      avatar: true,
      isActive: true,
      lastLoginAt: true,
    },
  })

  if (!user) {
    throw createError({ statusCode: 404, statusMessage: 'User tidak ditemukan' })
  }

  return { success: true, data: user }
})
