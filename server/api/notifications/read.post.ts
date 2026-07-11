import { getPrisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const userId = event.context.user?.id
  const body = await readBody(event)
  const prisma = getPrisma()

  if (body.all === true) {
    await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    })
    return { success: true, message: 'Semua notifikasi ditandai sudah dibaca' }
  }

  if (body.id) {
    await prisma.notification.updateMany({
      where: { id: body.id, userId, isRead: false },
      data: { isRead: true },
    })
  }

  return { success: true }
})
