import { getPrisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'ID diperlukan' })

  const currentUser = event.context.user
  if (!currentUser) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  if (!['SUPER_ADMIN', 'ADMIN'].includes(currentUser.role) && currentUser.id !== id) {
    throw createError({ statusCode: 403, statusMessage: 'Tidak memiliki akses ke data user ini' })
  }

  const prisma = getPrisma()

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      nip: true,
      nis: true,
      email: true,
      namaLengkap: true,
      role: true,
      avatar: true,
      isActive: true,
      emailVerified: true,
      lastLoginAt: true,
      createdAt: true,
      updatedAt: true,
    },
  })

  if (!user) throw createError({ statusCode: 404, statusMessage: 'User tidak ditemukan' })

  return { success: true, data: user }
})
