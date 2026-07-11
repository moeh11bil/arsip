import { getPrisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const userId = event.context.user?.id
  const query = getQuery(event)
  const page = Math.max(1, parseInt(query.page as string) || 1)
  const limit = Math.min(50, Math.max(1, parseInt(query.limit as string) || 20))
  const unreadOnly = query.unreadOnly === 'true'

  const prisma = getPrisma()

  const where: any = { userId }

  if (unreadOnly) {
    where.isRead = false
  }

  const [data, total, unreadCount] = await Promise.all([
    prisma.notification.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.notification.count({ where }),
    prisma.notification.count({ where: { userId, isRead: false } }),
  ])

  return {
    success: true,
    data,
    unreadCount,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  }
})
