import { getPrisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const userId = event.context.user?.id
  const prisma = getPrisma()

  const unreadCount = await prisma.notification.count({
    where: { userId, isRead: false },
  })

  return { success: true, unreadCount }
})
