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
  })

  if (!surat) {
    throw createError({ statusCode: 404, statusMessage: 'Surat tidak ditemukan' })
  }

  if (!['SUPER_ADMIN', 'ADMIN', 'KEPALA_SEKOLAH', 'TU'].includes(user.role)) {
    if (surat.createdById !== user.id) {
      throw createError({ statusCode: 403, statusMessage: 'Tidak memiliki akses' })
    }
  }

  const disposisi = await prisma.disposisi.findMany({
    where: { suratId: id },
    orderBy: { createdAt: 'asc' },
  })

  return { data: disposisi }
})
