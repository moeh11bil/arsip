import { getPrisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const prisma = getPrisma()

  const all = await prisma.klasifikasiArsip.findMany({
    where: { isActive: true },
    orderBy: { kode: 'asc' },
  })

  const tree = all
    .filter(item => !item.parentId)
    .map(parent => ({
      ...parent,
      children: all.filter(child => child.parentId === parent.id),
    }))

  return {
    success: true,
    data: tree,
  }
})
