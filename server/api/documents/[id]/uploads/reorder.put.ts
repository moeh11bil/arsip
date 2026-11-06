import { getPrisma } from '../../../../utils/prisma'
import { logAudit } from '../../../../utils/audit'
import { z } from 'zod'

const reorderSchema = z.object({
  uploadIds: z.array(z.string().min(1)).min(1, 'Daftar file wajib diisi'),
})

export default defineEventHandler(async (event) => {
  const user = event.context.user
  const id = getRouterParam(event, 'id')
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

  const body = await readBody(event)
  const parsed = reorderSchema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: parsed.error.issues[0]?.message || 'Data tidak valid' })
  }

  const uploads = await prisma.documentUpload.findMany({
    where: { documentId: id! },
    select: { id: true },
  })
  const existingIds = new Set(uploads.map(u => u.id))

  if (parsed.data.uploadIds.length !== existingIds.size) {
    throw createError({ statusCode: 400, statusMessage: 'Daftar file tidak lengkap' })
  }
  for (const uid of parsed.data.uploadIds) {
    if (!existingIds.has(uid)) {
      throw createError({ statusCode: 400, statusMessage: 'File tidak valid' })
    }
  }

  await prisma.$transaction(
    parsed.data.uploadIds.map((uid, idx) =>
      prisma.documentUpload.update({
        where: { id: uid },
        data: { version: idx + 1 },
      })
    )
  )

  await logAudit(prisma, {
    userId: user.id,
    action: 'UPDATE',
    entity: 'Document',
    entityId: id,
    metadata: { uploadIds: parsed.data.uploadIds },
    ipAddress: getRequestIP(event),
    userAgent: getRequestHeader(event, 'user-agent'),
  })

  return { success: true, message: 'Urutan file berhasil diubah' }
})