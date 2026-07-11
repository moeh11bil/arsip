import { getPrisma } from '../../utils/prisma'
import { ACCESS_ROLE_MAP } from '../../utils/access'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const prisma = getPrisma()
  const userRole = event.context.user?.role

  const document = await prisma.document.findUnique({
    where: { id, deletedAt: null },
    include: {
      createdBy: { select: { id: true, namaLengkap: true, role: true } },
      uploads: true,
      tags: true,
      versions: {
        include: {
          createdBy: { select: { id: true, namaLengkap: true } },
        },
        orderBy: { version: 'desc' },
        take: 10,
      },
    },
  })

  if (!document) {
    throw createError({ statusCode: 404, statusMessage: 'Dokumen tidak ditemukan' })
  }

  const allowedRoles = ACCESS_ROLE_MAP[document.accessLevel] || ACCESS_ROLE_MAP.INTERNAL
  if (!allowedRoles.includes(userRole)) {
    throw createError({ statusCode: 403, statusMessage: 'Tidak memiliki akses ke dokumen ini' })
  }

  const updated = await prisma.$transaction([
    prisma.document.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    }),
    prisma.document.findUnique({
      where: { id },
      include: {
        createdBy: { select: { id: true, namaLengkap: true, role: true } },
        uploads: true,
        tags: true,
        versions: {
          include: {
            createdBy: { select: { id: true, namaLengkap: true } },
          },
          orderBy: { version: 'desc' },
          take: 10,
        },
      },
    }),
  ])

  return { data: updated[1] }
})
