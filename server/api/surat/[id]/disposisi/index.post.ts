import { getPrisma } from '~/server/utils/prisma'
import { logAudit } from '~/server/utils/audit'
import { createNotifikasi } from '~/server/utils/notifikasi'

export default defineEventHandler(async (event) => {
  const suratId = getRouterParam(event, 'id')
  const body = await readBody(event)
  const user = event.context.user
  const userId = user?.id

  if (!suratId || !body.toUserId || !body.instruksi) {
    throw createError({
      statusCode: 400,
      statusMessage: 'toUserId dan instruksi wajib diisi',
    })
  }

  const prisma = getPrisma()

  const surat = await prisma.surat.findUnique({
    where: { id: suratId },
    include: { document: true },
  })
  if (!surat) {
    throw createError({ statusCode: 404, statusMessage: 'Surat tidak ditemukan' })
  }

  if (!['SUPER_ADMIN', 'ADMIN', 'KEPALA_SEKOLAH', 'TU'].includes(user.role)) {
    if (surat.createdById !== userId) {
      throw createError({ statusCode: 403, statusMessage: 'Tidak memiliki akses' })
    }
  }

  const toUser = await prisma.user.findUnique({ where: { id: body.toUserId } })
  if (!toUser) {
    throw createError({ statusCode: 404, statusMessage: 'User tujuan tidak ditemukan' })
  }

  const disposisi = await prisma.disposisi.create({
    data: {
      suratId,
      fromUserId: userId,
      toUserId: body.toUserId,
      instruksi: body.instruksi,
      catatanRespon: body.catatanRespon || null,
    },
    include: {
      fromUser: { select: { id: true, namaLengkap: true } },
      toUser: { select: { id: true, namaLengkap: true } },
    },
  })

  await logAudit(prisma, {
    userId,
    action: 'DISPOSITION',
    entity: 'Disposisi',
    entityId: disposisi.id,
    metadata: {
      suratId,
      fromUserId: userId,
      toUserId: body.toUserId,
      instruksi: body.instruksi,
    },
    ipAddress: getRequestIP(event),
    userAgent: getRequestHeader(event, 'user-agent'),
  })

  await createNotifikasi(prisma, {
    userId: body.toUserId,
    title: 'Disposisi Surat Baru',
    message: `Anda mendapat disposisi surat "${surat.document.judul}" dari ${disposisi.fromUser.namaLengkap}`,
    type: 'disposition',
    link: `/surat/${suratId}`,
  })

  return { success: true, data: disposisi, message: 'Disposisi berhasil dibuat' }
})
