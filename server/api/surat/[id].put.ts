import { getPrisma } from '~/server/utils/prisma'
import { logAudit } from '~/server/utils/audit'
import { z } from 'zod'

const updateSchema = z.object({
  type: z.enum(['MASUK', 'KELUAR']).optional(),
  priority: z.enum(['BIASA', 'SEGERA', 'SANGAT_SEGERA']).optional(),
  nomorSurat: z.string().min(1).optional(),
  perihal: z.string().min(1).optional(),
  tanggalSurat: z.string().optional(),
  tanggalTerima: z.string().optional(),
  pengirim: z.string().optional(),
  tujuan: z.string().optional(),
  sifat: z.string().optional(),
  catatan: z.string().optional(),
})

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  const user = event.context.user

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Surat ID tidak valid' })
  }

  const parsed = updateSchema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: parsed.error.errors[0].message })
  }

  const prisma = getPrisma()
  const userId = user?.id

  const oldSurat = await prisma.surat.findUnique({ where: { id } })

  if (!oldSurat) {
    throw createError({ statusCode: 404, statusMessage: 'Surat tidak ditemukan' })
  }

  if (!['SUPER_ADMIN', 'ADMIN', 'KEPALA_SEKOLAH', 'TU'].includes(user.role)) {
    if (oldSurat.createdById !== userId) {
      throw createError({ statusCode: 403, statusMessage: 'Tidak memiliki akses' })
    }
  }

  const isMasuk = parsed.data.type !== 'KELUAR'

  const surat = await prisma.surat.update({
    where: { id },
    data: {
      nomorSurat: parsed.data.nomorSurat,
      perihal: parsed.data.perihal,
      pengirim: isMasuk ? parsed.data.pengirim : null,
      tujuan: !isMasuk ? parsed.data.tujuan : null,
      tanggalSurat: parsed.data.tanggalSurat ? new Date(parsed.data.tanggalSurat) : undefined,
      tanggalTerima: isMasuk && parsed.data.tanggalTerima ? new Date(parsed.data.tanggalTerima) : null,
      type: parsed.data.type,
      priority: parsed.data.priority,
      sifat: parsed.data.sifat,
      catatan: parsed.data.catatan,
    },
  })

  await logAudit(prisma, {
    userId,
    action: 'UPDATE',
    entity: 'Surat',
    entityId: id,
    oldValue: oldSurat ? { nomorSurat: oldSurat.nomorSurat, perihal: oldSurat.perihal, priority: oldSurat.priority } : undefined,
    newValue: { nomorSurat: surat.nomorSurat, perihal: surat.perihal, priority: surat.priority },
    ipAddress: getRequestIP(event),
    userAgent: getRequestHeader(event, 'user-agent'),
  })

  return {
    success: true,
    data: surat,
    message: 'Surat berhasil diperbarui',
  }
})
