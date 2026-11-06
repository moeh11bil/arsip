import { getPrisma } from '../../../../utils/prisma'
import { logAudit } from '../../../../utils/audit'
import { z } from 'zod'

const renameSchema = z.object({
  fileName: z
    .string()
    .trim()
    .min(1, 'Nama file wajib diisi')
    .max(255, 'Nama file maksimal 255 karakter')
    .regex(/^[^\\/:*?"<>|]+$/, 'Nama file mengandung karakter tidak valid'),
})

export default defineEventHandler(async (event) => {
  const user = event.context.user
  const id = getRouterParam(event, 'id')
  const uploadId = getRouterParam(event, 'uploadId')
  const prisma = getPrisma()

  const allowedRoles = ['SUPER_ADMIN', 'ADMIN', 'KEPALA_SEKOLAH', 'TU', 'GURU']
  if (!allowedRoles.includes(user.role)) {
    throw createError({ statusCode: 403, statusMessage: 'Tidak memiliki akses' })
  }

  const document = await prisma.document.findUnique({ where: { id: id! } })
  if (!document || document.deletedAt) {
    throw createError({ statusCode: 404, statusMessage: 'Dokumen tidak ditemukan' })
  }

  if (document.createdById !== user.id && !['SUPER_ADMIN', 'ADMIN'].includes(user.role)) {
    throw createError({ statusCode: 403, statusMessage: 'Tidak memiliki akses' })
  }

  const upload = await prisma.documentUpload.findFirst({
    where: { id: uploadId!, documentId: id! },
  })
  if (!upload) {
    throw createError({ statusCode: 404, statusMessage: 'File tidak ditemukan' })
  }

  const body = await readBody(event)
  const parsed = renameSchema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: parsed.error.issues[0]?.message || 'Data tidak valid' })
  }

  const duplicate = await prisma.documentUpload.findFirst({
    where: {
      documentId: id,
      fileName: parsed.data.fileName,
      id: { not: uploadId },
    },
  })
  if (duplicate) {
    throw createError({ statusCode: 400, statusMessage: 'Nama file sudah digunakan' })
  }

  const updated = await prisma.documentUpload.update({
    where: { id: uploadId! },
    data: { fileName: parsed.data.fileName },
  })

  await logAudit(prisma, {
    userId: user.id,
    action: 'UPDATE',
    entity: 'Document',
    entityId: id,
    metadata: { uploadId, oldFileName: upload.fileName, newFileName: parsed.data.fileName },
    ipAddress: getRequestIP(event),
    userAgent: getRequestHeader(event, 'user-agent'),
  })

  return { success: true, data: updated, message: 'Nama file berhasil diubah' }
})