import { getPrisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const userId = event.context.user?.id
  if (!userId) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const body = await readBody(event)
  const { namaLengkap, email } = body

  if (!namaLengkap || !email) {
    throw createError({ statusCode: 400, statusMessage: 'Nama lengkap dan email wajib diisi' })
  }

  const prisma = getPrisma()

  const existing = await prisma.user.findFirst({
    where: { email, NOT: { id: userId } },
  })
  if (existing) {
    throw createError({ statusCode: 409, statusMessage: 'Email sudah digunakan' })
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: { namaLengkap, email },
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

  return { success: true, data: user }
})
