import { z } from 'zod'
import { getPrisma } from '../../utils/prisma'
import { DocumentCategory, DocumentStatus, AccessLevel } from '@prisma/client'

const querySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  search: z.string().optional(),
  kategori: z.nativeEnum(DocumentCategory).optional(),
  status: z.nativeEnum(DocumentStatus).optional(),
  accessLevel: z.nativeEnum(AccessLevel).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  sortBy: z.enum(['createdAt', 'tanggalDokumen', 'judul']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
})

export default defineEventHandler(async (event) => {
  const user = event.context.user
  const query = await getValidatedQuery(event, querySchema.parse)
  const prisma = getPrisma()

  const where: any = {
    deletedAt: null,
  }

  if (user.role !== 'SUPER_ADMIN' && user.role !== 'ADMIN') {
    where.accessLevel = {
      in: user.role === 'KEPALA_SEKOLAH'
        ? ['PUBLIC', 'INTERNAL', 'RESTRICTED', 'CONFIDENTIAL', 'SECRET']
        : ['PUBLIC', 'INTERNAL']
    }
  }

  if (query.kategori) where.kategori = query.kategori
  if (query.status) where.status = query.status
  if (query.accessLevel && ['SUPER_ADMIN', 'ADMIN'].includes(user.role)) {
    where.accessLevel = query.accessLevel
  }

  if (query.startDate || query.endDate) {
    where.tanggalDokumen = {}
    if (query.startDate) where.tanggalDokumen.gte = new Date(query.startDate)
    if (query.endDate) where.tanggalDokumen.lte = new Date(query.endDate)
  }

  let documents
  let total

  if (query.search) {
    const searchFilter = {
      OR: [
        { judul: { contains: query.search } },
        { deskripsi: { contains: query.search } },
        { ocrText: { contains: query.search } },
        { perihal: { contains: query.search } },
      ],
    }
    const searchWhere = { ...where, ...searchFilter }
    ;[documents, total] = await Promise.all([
      prisma.document.findMany({
        where: searchWhere,
        include: {
          createdBy: { select: { id: true, namaLengkap: true, role: true } },
          tags: true,
        },
        orderBy: { [query.sortBy]: query.sortOrder },
        skip: (query.page - 1) * query.limit,
        take: query.limit,
      }),
      prisma.document.count({ where: searchWhere }),
    ])
  } else {
    [documents, total] = await Promise.all([
      prisma.document.findMany({
        where,
        include: {
          createdBy: { select: { id: true, namaLengkap: true, role: true } },
          tags: true,
        },
        orderBy: { [query.sortBy]: query.sortOrder },
        skip: (query.page - 1) * query.limit,
        take: query.limit,
      }),
      prisma.document.count({ where }),
    ])
  }

  return {
    data: documents,
    pagination: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages: Math.ceil(total / query.limit),
    },
  }
})
