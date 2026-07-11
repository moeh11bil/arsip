import { getPrisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const documentId = getRouterParam(event, 'id')
  const prisma = getPrisma()

  const document = await prisma.document.findUnique({ where: { id: documentId } })
  if (!document) {
    throw createError({ statusCode: 404, statusMessage: 'Dokumen tidak ditemukan' })
  }

  const versions = await prisma.documentVersion.findMany({
    where: { documentId },
    include: {
      createdBy: { select: { id: true, namaLengkap: true, role: true } },
    },
    orderBy: { version: 'desc' },
  })

  return { success: true, data: versions }
})
