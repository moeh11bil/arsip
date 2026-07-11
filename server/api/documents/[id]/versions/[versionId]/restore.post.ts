import { getPrisma } from '~/server/utils/prisma'
import { logAudit } from '~/server/utils/audit'

export default defineEventHandler(async (event) => {
  const documentId = getRouterParam(event, 'id')
  const versionId = getRouterParam(event, 'versionId')
  const userId = event.context.user?.id
  const prisma = getPrisma()

  const version = await prisma.documentVersion.findFirst({
    where: { id: versionId, documentId },
  })
  if (!version) {
    throw createError({ statusCode: 404, statusMessage: 'Versi tidak ditemukan' })
  }

  const upload = await prisma.documentUpload.findFirst({
    where: { documentId, filePath: version.filePath },
  })

  await prisma.document.update({
    where: { id: documentId },
    data: {
      fileSize: version.fileSize,
    },
  })

  await logAudit(prisma, {
    userId,
    action: 'UPDATE',
    entity: 'Document',
    entityId: documentId,
    metadata: { restoredFromVersion: version.version, versionId },
    ipAddress: getRequestIP(event),
    userAgent: getRequestHeader(event, 'user-agent'),
  })

  return { success: true, data: version, message: `Dokumen dikembalikan ke versi ${version.version}` }
})
