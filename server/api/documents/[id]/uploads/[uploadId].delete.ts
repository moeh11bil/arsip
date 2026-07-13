import { getPrisma } from '../../../../utils/prisma'
import { deleteFile } from '../../../../utils/storage'
import { logAudit } from '../../../../utils/audit'

export default defineEventHandler(async (event) => {
  const user = event.context.user
  const id = getRouterParam(event, 'id')
  const uploadId = getRouterParam(event, 'uploadId')
  const prisma = getPrisma()

  const allowedRoles = ['SUPER_ADMIN', 'ADMIN', 'KEPALA_SEKOLAH', 'TU', 'GURU']
  if (!allowedRoles.includes(user.role)) {
    throw createError({ statusCode: 403, statusMessage: 'Tidak memiliki akses' })
  }

  const document = await prisma.document.findUnique({ where: { id } })
  if (!document || document.deletedAt) {
    throw createError({ statusCode: 404, statusMessage: 'Dokumen tidak ditemukan' })
  }

  if (document.createdById !== user.id && !['SUPER_ADMIN', 'ADMIN'].includes(user.role)) {
    throw createError({ statusCode: 403, statusMessage: 'Tidak memiliki akses' })
  }

  const upload = await prisma.documentUpload.findFirst({
    where: { id: uploadId, documentId: id },
  })
  if (!upload) {
    throw createError({ statusCode: 404, statusMessage: 'File tidak ditemukan' })
  }

  const uploadCount = await prisma.documentUpload.count({ where: { documentId: id } })
  if (uploadCount <= 1) {
    throw createError({ statusCode: 400, statusMessage: 'Tidak dapat menghapus file terakhir. Hapus dokumen secara keseluruhan.' })
  }

  await deleteFile(upload.filePath)
  await prisma.documentUpload.delete({ where: { id: uploadId } })

  if (upload.mimeType === document.mimeType && upload.fileSize === document.fileSize) {
    const remaining = await prisma.documentUpload.findFirst({
      where: { documentId: id },
      orderBy: { createdAt: 'asc' },
    })
    if (remaining) {
      await prisma.document.update({
        where: { id },
        data: { fileSize: remaining.fileSize, mimeType: remaining.mimeType },
      })
    }
  }

  await logAudit(prisma, {
    userId: user.id,
    action: 'DELETE_UPLOAD',
    entity: 'Document',
    entityId: id,
    metadata: { uploadId, fileName: upload.fileName, fileSize: upload.fileSize },
    ipAddress: getRequestIP(event),
    userAgent: getRequestHeader(event, 'user-agent'),
  })

  return { success: true, message: 'File berhasil dihapus' }
})
