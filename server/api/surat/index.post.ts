import { getPrisma } from '~/server/utils/prisma'
import { saveFile } from '~/server/utils/storage'
import { logAudit } from '~/server/utils/audit'
import { createNotifikasiBulk } from '~/server/utils/notifikasi'
import { randomUUID } from 'uncrypto'
import { z } from 'zod'

const suratCreateSchema = z.object({
  type: z.enum(['MASUK', 'KELUAR']),
  priority: z.enum(['BIASA', 'SEGERA', 'SANGAT_SEGERA']),
  nomorSurat: z.string().min(1, 'Nomor surat wajib diisi'),
  perihal: z.string().min(1, 'Perihal wajib diisi'),
  tanggalSurat: z.string().refine((v) => !isNaN(Date.parse(v)), 'Tanggal tidak valid'),
  tanggalTerima: z.string().optional(),
  nomorAgenda: z.string().optional(),
  pengirim: z.string().optional(),
  tujuan: z.string().optional(),
  sifat: z.string().optional(),
  catatan: z.string().optional(),
})

export default defineEventHandler(async (event) => {
  const user = event.context.user
  const userId = user?.id

  if (!userId) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  const allowedSuratRoles = ['SUPER_ADMIN', 'ADMIN', 'KEPALA_SEKOLAH', 'TU', 'GURU']
  if (!allowedSuratRoles.includes(user.role)) {
    throw createError({ statusCode: 403, statusMessage: 'Tidak memiliki akses untuk membuat surat' })
  }

  const body = await readMultipartFormData(event)
  if (!body) {
    throw createError({ statusCode: 400, message: 'Data tidak valid' })
  }

  const fileItem = body.find((b) => b.name === 'file')
  if (!fileItem || !fileItem.filename) {
    throw createError({ statusCode: 400, message: 'File scan surat wajib diupload' })
  }

  const prisma = getPrisma()

  const fields: Record<string, string> = {}
  for (const item of body) {
    if (item.name && item.name !== 'file') {
      fields[item.name] = item.data.toString('utf-8')
    }
  }

  const parsed = suratCreateSchema.safeParse(fields)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: parsed.error.errors[0].message })
  }

  const { type, priority, nomorSurat, perihal, tanggalSurat, tanggalTerima, nomorAgenda, pengirim, tujuan, sifat, catatan } = parsed.data
  const isMasuk = type === 'MASUK'

  const fileName = `${randomUUID()}-${fileItem.filename}`
  const filePath = await saveFile(fileName, fileItem.data, fileItem.type || 'application/octet-stream')

  const kodeDokumen = `SRT/${new Date().getFullYear()}/${Date.now().toString(36).toUpperCase()}`

  const document = await prisma.document.create({
    data: {
      kodeDokumen,
      judul: perihal || 'Surat',
      kategori: 'ADMINISTRATIF',
      tanggalDokumen: new Date(tanggalSurat),
      fileSize: fileItem.data.length,
      mimeType: fileItem.type || 'application/octet-stream',
      createdById: userId,
      uploads: {
        create: {
          fileName: fileItem.filename,
          filePath,
          fileSize: fileItem.data.length,
          mimeType: fileItem.type || 'application/octet-stream',
          uploadedById: userId,
        },
      },
    },
  })

  const surat = await prisma.surat.create({
    data: {
      documentId: document.id,
      type,
      nomorAgenda: nomorAgenda || `${type}/${Date.now()}`,
      nomorSurat,
      tanggalSurat: new Date(tanggalSurat),
      tanggalTerima: isMasuk && tanggalTerima ? new Date(tanggalTerima) : null,
      pengirim: isMasuk ? (pengirim || null) : null,
      tujuan: !isMasuk ? (tujuan || null) : null,
      perihal,
      priority,
      sifat: sifat || null,
      catatan: catatan || null,
      createdById: userId,
    },
    include: {
      document: {
        include: { uploads: true },
      },
      disposisi: true,
    },
  })

  await logAudit(prisma, {
    userId,
    action: 'CREATE',
    entity: 'Surat',
    entityId: surat.id,
    metadata: { type, nomorSurat: surat.nomorSurat, perihal: surat.perihal, fileName: fileItem.filename },
    ipAddress: getRequestIP(event),
    userAgent: getRequestHeader(event, 'user-agent'),
  })

  const notifTargets = await prisma.user.findMany({
    where: {
      role: { in: ['KEPALA_SEKOLAH', 'TU', 'ADMIN', 'SUPER_ADMIN'] },
      id: { not: userId },
    },
    select: { id: true },
  })

  if (notifTargets.length > 0) {
    const label = isMasuk ? 'Surat Masuk Baru' : 'Surat Keluar Baru'
    await createNotifikasiBulk(
      prisma,
      notifTargets.map(u => ({
        userId: u.id,
        title: label,
        message: `${surat.nomorSurat} - ${surat.perihal}`,
        type: 'surat',
        link: `/surat/${surat.id}`,
      })),
    )
  }

  return {
    success: true,
    data: surat,
    message: 'Surat berhasil dibuat',
  }
})
