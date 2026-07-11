import { getPrisma } from '~/server/utils/prisma'
import { z } from 'zod'

const querySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  type: z.enum(['MASUK', 'KELUAR']).optional(),
  priority: z.enum(['BIASA', 'SEGERA', 'SANGAT_SEGERA']).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  search: z.string().optional(),
})

export default defineEventHandler(async (event) => {
  const query = getQuery(event)

  const parsed = querySchema.safeParse(query)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: parsed.error.errors[0].message })
  }

  const { page, limit, type, priority, startDate, endDate, search } = parsed.data

  const prisma = getPrisma()

  const where: any = {}

  if (type) where.type = type
  if (priority) where.priority = priority
  if (startDate || endDate) where.tanggalSurat = {}
  if (startDate) where.tanggalSurat.gte = new Date(startDate)
  if (endDate) where.tanggalSurat.lte = new Date(endDate)
  if (search) {
    where.OR = [
      { nomorSurat: { contains: search } },
      { perihal: { contains: search } },
      { pengirim: { contains: search } },
    ]
  }

  const [data, total] = await Promise.all([
    prisma.surat.findMany({
      where,
      orderBy: { tanggalSurat: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        disposisi: true,
      },
    }),
    prisma.surat.count({ where }),
  ])

  const totalPages = Math.ceil(total / limit)

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
    },
  }
})
