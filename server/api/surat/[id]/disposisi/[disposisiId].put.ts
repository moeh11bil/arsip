import { getPrisma } from '~/server/utils/prisma'
import { logAudit } from '~/server/utils/audit'
import { z } from 'zod'

const disposisiUpdateSchema = z.object({
  toUserId: z.string().optional(),
  instruksi: z.string().optional(),
  status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'REJECTED']).optional(),
  catatanRespon: z.string().optional(),
  respondedAt: z.string().optional(),
})

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const disposisiId = getRouterParam(event, 'disposisiId')
  const body = await readBody(event)
  const user = event.context.user
  const userId = user?.id

  if (!id || !disposisiId) {
    throw createError({ statusCode: 400, statusMessage: 'ID tidak valid' })
  }

  if (!['SUPER_ADMIN', 'ADMIN', 'KEPALA_SEKOLAH', 'TU'].includes(user.role)) {
    throw createError({ statusCode: 403, statusMessage: 'Tidak memiliki akses' })
  }

  const parsed = disposisiUpdateSchema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: parsed.error.errors[0].message })
  }

  const prisma = getPrisma()

  const existingDisposisi = await prisma.disposisi.findFirst({
    where: { id: disposisiId, suratId: id },
  })
  if (!existingDisposisi) {
    throw createError({ statusCode: 404, statusMessage: 'Disposisi tidak ditemukan untuk surat ini' })
  }

  const data: any = {}
  if (parsed.data.toUserId) data.toUserId = parsed.data.toUserId
  if (parsed.data.instruksi !== undefined) data.instruksi = parsed.data.instruksi
  if (parsed.data.status) data.status = parsed.data.status
  if (parsed.data.catatanRespon !== undefined) data.catatanRespon = parsed.data.catatanRespon
  if (parsed.data.respondedAt) data.respondedAt = new Date(parsed.data.respondedAt)

  const disposisi = await prisma.disposisi.update({
    where: { id: disposisiId },
    data,
  })

  await logAudit(prisma, {
    userId,
    action: 'DISPOSITION',
    entity: 'Disposisi',
    entityId: disposisiId,
    metadata: { suratId: id, status: disposisi.status },
    ipAddress: getRequestIP(event),
    userAgent: getRequestHeader(event, 'user-agent'),
  })

  return {
    success: true,
    data: disposisi,
    message: 'Disposisi berhasil diperbarui',
  }
})
