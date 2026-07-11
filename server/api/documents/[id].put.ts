import { getPrisma } from '../../utils/prisma'
import { logAudit } from '../../utils/audit'
import { z } from 'zod'

const updateDocumentSchema = z.object({
  judul: z.string().min(1, 'Judul wajib diisi'),
  deskripsi: z.string().optional(),
  kategori: z.enum(['AKADEMIK', 'KESISWAAN', 'KEPEGAWAIAN', 'ADMINISTRATIF', 'KEUANGAN', 'LEGALITAS', 'MEDIA', 'LAINNYA']).optional(),
  subKategori: z.string().optional().nullable(),
  status: z.enum(['DRAFT', 'ACTIVE', 'ARCHIVED', 'EXPIRED', 'DESTROYED']).optional(),
  accessLevel: z.enum(['PUBLIC', 'INTERNAL', 'RESTRICTED', 'CONFIDENTIAL', 'SECRET']).optional(),
  tanggalDokumen: z.string().optional(),
  changeNote: z.string().optional(),
})

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  const prisma = getPrisma()
  const user = event.context.user
  const userId = user?.id

  const parsed = updateDocumentSchema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: parsed.error.errors[0].message })
  }

  const existing = await prisma.document.findUnique({
    where: { id, deletedAt: null },
    include: { uploads: { orderBy: { createdAt: 'desc' }, take: 1 } },
  })
  if (!existing) {
    throw createError({ statusCode: 404, statusMessage: 'Dokumen tidak ditemukan' })
  }

  if (!['SUPER_ADMIN', 'ADMIN'].includes(user.role) && existing.createdById !== userId) {
    throw createError({ statusCode: 403, statusMessage: 'Tidak dapat mengedit dokumen orang lain' })
  }

  if (body.accessLevel && !['SUPER_ADMIN', 'ADMIN', 'KEPALA_SEKOLAH'].includes(user.role)) {
    throw createError({ statusCode: 403, statusMessage: 'Tidak dapat mengubah level akses' })
  }

  const latestUpload = existing.uploads[0]
  const currentVersion = await prisma.documentVersion.count({
    where: { documentId: id },
  })

  await prisma.documentVersion.create({
    data: {
      documentId: id,
      version: currentVersion + 1,
      fileName: latestUpload?.fileName || existing.judul,
      filePath: latestUpload?.filePath || '',
      fileSize: latestUpload?.fileSize || existing.fileSize,
      changeNote: parsed.data.changeNote || `Update metadata oleh ${event.context.user?.email || 'system'}`,
      createdById: userId,
    },
  })

  const document = await prisma.document.update({
    where: { id },
    data: {
      judul: parsed.data.judul,
      deskripsi: parsed.data.deskripsi,
      kategori: parsed.data.kategori,
      subKategori: parsed.data.subKategori,
      status: parsed.data.status,
      accessLevel: parsed.data.accessLevel,
      tanggalDokumen: parsed.data.tanggalDokumen ? new Date(parsed.data.tanggalDokumen) : undefined,
      updatedById: userId,
    },
    include: {
      createdBy: { select: { id: true, namaLengkap: true } },
      tags: true,
    },
  })

  await logAudit(prisma, {
    userId,
    action: 'UPDATE',
    entity: 'Document',
    entityId: id,
    oldValue: { judul: existing.judul, kategori: existing.kategori, status: existing.status },
    newValue: { judul: document.judul, kategori: document.kategori, status: document.status },
    ipAddress: getRequestIP(event),
    userAgent: getRequestHeader(event, 'user-agent'),
  })

  return { data: document }
})
