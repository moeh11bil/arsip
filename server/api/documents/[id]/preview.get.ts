import { getPrisma } from '../../../utils/prisma'
import { join, resolve } from 'path'
import { existsSync } from 'fs'
import { readFile } from 'node:fs/promises'
import { ACCESS_ROLE_MAP } from '../../../utils/access'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const prisma = getPrisma()
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

  const upload = document.uploads[0]
  if (!upload) {
    throw createError({ statusCode: 404, statusMessage: 'File tidak ditemukan' })
  }

  const storagePath = resolve(useRuntimeConfig().storagePath || join(process.cwd(), 'storage'))
  const filePath = join(storagePath, upload.filePath)
  if (!existsSync(filePath)) {
    throw createError({ statusCode: 404, statusMessage: 'File fisik tidak ditemukan' })
  }

  const fileBuffer = await readFile(filePath)

  setResponseHeader(event, 'Content-Type', upload.mimeType)
  setResponseHeader(event, 'Content-Length', String(fileBuffer.length))

  if (upload.mimeType.startsWith('image/')) {
    setResponseHeader(event, 'Cache-Control', 'public, max-age=86400')
  }

  return fileBuffer
})
