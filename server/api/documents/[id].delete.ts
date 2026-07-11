import { getPrisma } from '../../utils/prisma'
import { logAudit } from '../../utils/audit'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const prisma = getPrisma()
  const user = event.context.user

  const existing = await prisma.document.findUnique({ where: { id } })
  if (!existing) {
    throw createError({ statusCode: 404, statusMessage: 'Dokumen tidak ditemukan' })
  }

  if (!['SUPER_ADMIN', 'ADMIN'].includes(user?.role) && existing.createdById !== user?.id) {
    throw createError({ statusCode: 403, statusMessage: 'Tidak memiliki hak untuk menghapus dokumen ini' })
  }

  await prisma.document.update({
    where: { id },
    data: { deletedAt: new Date() },
  })

  await logAudit(prisma, {
    userId: user?.id,
    action: 'DELETE',
    entity: 'Document',
    entityId: id,
    oldValue: { judul: existing.judul, kategori: existing.kategori, kodeDokumen: existing.kodeDokumen },
    ipAddress: getRequestIP(event),
    userAgent: getRequestHeader(event, 'user-agent'),
  })

  return { success: true }
})
