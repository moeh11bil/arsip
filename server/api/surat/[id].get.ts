import { getPrisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const user = event.context.user

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Surat ID tidak valid' })
  }

  const prisma = getPrisma()

  const surat = await prisma.surat.findUnique({
    where: { id },
    include: {
      disposisi: true,
      document: {
        include: {
          uploads: true,
          tags: true,
          createdBy: true,
        },
      },
    },
  })

  if (!surat) {
    throw createError({ statusCode: 404, statusMessage: 'Surat tidak ditemukan' })
  }

  if (!['SUPER_ADMIN', 'ADMIN', 'KEPALA_SEKOLAH', 'TU'].includes(user.role)) {
    if (surat.createdById !== user.id && surat.document?.createdById !== user.id) {
      throw createError({ statusCode: 403, statusMessage: 'Tidak memiliki akses' })
    }
  }

  return { data: surat }
})
