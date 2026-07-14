import { getPrisma } from '../../../utils/prisma'
import { join, resolve } from 'path'
import { existsSync } from 'fs'
import { readFile } from 'node:fs/promises'
import { logAudit } from '../../../utils/audit'
import { ACCESS_ROLE_MAP } from '../../../utils/access'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const query = getQuery(event)
  const uploadId = query.uploadId as string | undefined
  const prisma = getPrisma()
  const userId = event.context.user?.id
  const userRole = event.context.user?.role

  const document = await prisma.document.findUnique({
    where: { id, deletedAt: null },
    include: { uploads: true },
  })

  if (!document) {
    throw createError({ statusCode: 404, statusMessage: 'Dokumen tidak ditemukan' })
  }

  const allowedRoles = ACCESS_ROLE_MAP[document.accessLevel] || ACCESS_ROLE_MAP.INTERNAL
  if (!allowedRoles.includes(userRole)) {
    throw createError({ statusCode: 403, statusMessage: 'Tidak memiliki akses ke dokumen ini' })
  }

  let upload
  if (uploadId) {
    upload = document.uploads.find(u => u.id === uploadId)
  } else {
    upload = document.uploads[0]
  }

  if (!upload) {
    throw createError({ statusCode: 404, statusMessage: 'File tidak ditemukan' })
  }

  const storagePath = resolve(useRuntimeConfig().storagePath || join(process.cwd(), 'storage'))
  const filePath = join(storagePath, upload.filePath)
  if (!existsSync(filePath)) {
    throw createError({ statusCode: 404, statusMessage: 'File fisik tidak ditemukan' })
  }

  await prisma.document.update({
    where: { id },
    data: { downloadCount: { increment: 1 } },
  })

  await logAudit(prisma, {
    userId,
    action: 'DOWNLOAD',
    entity: 'Document',
    entityId: id,
    metadata: { fileName: upload.fileName, fileSize: upload.fileSize },
    ipAddress: getRequestIP(event),
    userAgent: getRequestHeader(event, 'user-agent'),
  })

  const fileBuffer = await readFile(filePath)

  const safeFileName = upload.fileName.replace(/[\r\n]/g, '')
  setResponseHeader(event, 'Content-Type', upload.mimeType)
  setResponseHeader(event, 'Content-Disposition', `attachment; filename="${safeFileName}"`)

  return fileBuffer
})
