import { getPrisma } from '~/server/utils/prisma'
import { logAudit } from '~/server/utils/audit'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const userId = event.context.user?.id
  const user = event.context.user

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Surat ID tidak valid' })
  }

  const prisma = getPrisma()

  const surat = await prisma.surat.findUnique({ where: { id } })
  if (!surat) {
    throw createError({ statusCode: 404, statusMessage: 'Surat tidak ditemukan' })
  }

  if (!['SUPER_ADMIN', 'ADMIN', 'KEPALA_SEKOLAH', 'TU'].includes(user.role)) {
    if (surat.createdById !== userId) {
      throw createError({ statusCode: 403, statusMessage: 'Tidak memiliki akses' })
    }
  }

  await prisma.$transaction([
    prisma.document.update({
      where: { id: surat.documentId },
      data: { deletedAt: new Date() },
    }),
    prisma.surat.delete({ where: { id } }),
  ])

  await logAudit(prisma, {
    userId,
    action: 'DELETE',
    entity: 'Surat',
    entityId: id,
    oldValue: { nomorSurat: surat.nomorSurat, perihal: surat.perihal, type: surat.type },
    ipAddress: getRequestIP(event),
    userAgent: getRequestHeader(event, 'user-agent'),
  })

  return {
    success: true,
    message: 'Surat berhasil dihapus',
  }
})
