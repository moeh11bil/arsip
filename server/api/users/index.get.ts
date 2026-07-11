import { getPrisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user || !['SUPER_ADMIN', 'ADMIN'].includes(user.role)) {
    throw createError({ statusCode: 403, statusMessage: 'Hanya admin yang dapat melihat daftar user' })
  }

  const query = getQuery(event)
  const page = Math.max(1, parseInt(query.page as string) || 1)
  const limit = Math.min(50, Math.max(1, parseInt(query.limit as string) || 20))
  const search = (query.search as string) || ''

  const prisma = getPrisma()

  const where: any = {
    ...(search && {
      OR: [
        { namaLengkap: { contains: search } },
        { email: { contains: search } },
        { nip: { contains: search } },
      ],
    }),
  }

  const [data, total] = await Promise.all([
    prisma.user.findMany({
      where,
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
        createdAt: true,
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.user.count({ where }),
  ])

  return {
    success: true,
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  }
})
