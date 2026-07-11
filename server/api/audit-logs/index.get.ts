import { getPrisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user || !['SUPER_ADMIN', 'ADMIN'].includes(user.role)) {
    throw createError({ statusCode: 403, statusMessage: 'Hanya admin yang dapat melihat audit log' })
  }

  const query = getQuery(event)
  const page = Math.max(1, parseInt(query.page as string) || 1)
  const limit = Math.min(50, Math.max(1, parseInt(query.limit as string) || 20))
  const search = (query.search as string) || ''
  const action = query.action as string || ''

  const prisma = getPrisma()

  const where: any = {
    ...(action && { action }),
    ...(search && {
      OR: [
        { entity: { contains: search } },
        { entityId: { contains: search } },
        { user: { namaLengkap: { contains: search } } },
      ],
    }),
  }

  const [data, total] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      include: {
        user: { select: { id: true, namaLengkap: true, email: true, role: true } },
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.auditLog.count({ where }),
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
