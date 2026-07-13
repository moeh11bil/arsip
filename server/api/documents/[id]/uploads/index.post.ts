import { getPrisma } from '../../../utils/prisma'
import { saveFile } from '../../../utils/storage'
import { logAudit } from '../../../utils/audit'
import { randomUUID } from 'crypto'

export default defineEventHandler(async (event) => {
  const user = event.context.user
  const id = getRouterParam(event, 'id')
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

  const items = await readMultipartFormData(event)
  if (!items) throw createError({ statusCode: 400, statusMessage: 'Tidak ada file' })

  const fileItems = items.filter(i => i.name === 'files[]')
  if (!fileItems.length) throw createError({ statusCode: 400, statusMessage: 'Minimal satu file' })

  const maxSize = useRuntimeConfig().public.maxUploadSize
  for (const fi of fileItems) {
    if (fi.data.length > maxSize) {
      throw createError({ statusCode: 400, statusMessage: `File ${fi.filename} terlalu besar. Max ${maxSize / 1024 / 1024}MB` })
    }
  }

  const existingCount = await prisma.documentUpload.count({ where: { documentId: id } })

  const uploadsData = await Promise.all(
    fileItems.map(async (fi, idx) => {
      const fileName = `${randomUUID()}-${fi.filename}`
      const filePath = await saveFile(fileName, fi.data, fi.type)
      return {
        documentId: id,
        fileName: fi.filename,
        filePath,
        fileSize: fi.data.length,
        mimeType: fi.type,
        version: existingCount + idx + 1,
        uploadedById: user.id,
      }
    })
  )

  const created = await prisma.documentUpload.createMany({ data: uploadsData })

  await logAudit(prisma, {
    userId: user.id,
    action: 'ADD_UPLOAD',
    entity: 'Document',
    entityId: id,
    metadata: { files: fileItems.map(f => ({ fileName: f.filename, fileSize: f.data.length })) },
    ipAddress: getRequestIP(event),
    userAgent: getRequestHeader(event, 'user-agent'),
  })

  return {
    success: true,
    message: `${fileItems.length} file berhasil ditambahkan`,
  }
})
