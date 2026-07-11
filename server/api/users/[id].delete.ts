import { getPrisma } from '~/server/utils/prisma'
import { logAudit } from '~/server/utils/audit'

export default defineEventHandler(async (event) => {
  const currentUser = event.context.user
  if (!currentUser || !['SUPER_ADMIN', 'ADMIN'].includes(currentUser.role)) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }

  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'ID diperlukan' })

  if (id === currentUser.id) {
    throw createError({ statusCode: 400, statusMessage: 'Tidak dapat menghapus akun sendiri' })
  }

  const prisma = getPrisma()

  const existing = await prisma.user.findUnique({ where: { id } })
  if (!existing) throw createError({ statusCode: 404, statusMessage: 'User tidak ditemukan' })

  if (existing.role === 'SUPER_ADMIN' && currentUser.role !== 'SUPER_ADMIN') {
    throw createError({ statusCode: 403, statusMessage: 'Tidak dapat menghapus akun SUPER_ADMIN' })
  }

  await prisma.user.update({
    where: { id },
    data: { isActive: false },
  })

  await logAudit(prisma, {
    userId: currentUser.id,
    action: 'DELETE',
    entity: 'User',
    entityId: id,
    oldValue: { email: existing.email, role: existing.role },
    ipAddress: getRequestIP(event),
    userAgent: getRequestHeader(event, 'user-agent'),
  })

  return { success: true, message: 'User berhasil dihapus' }
})
