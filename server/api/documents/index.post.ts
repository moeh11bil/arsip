import { getPrisma } from '../../utils/prisma'
import { processOCR } from '../../utils/ocr'
import { saveFile } from '../../utils/storage'
import { logAudit } from '../../utils/audit'
import { z } from 'zod'
import { randomUUID } from 'crypto'
import { DocumentCategory, AccessLevel } from '@prisma/client'

const docSchema = z.object({
  judul: z.string().min(1, 'Judul wajib diisi'),
  kategori: z.nativeEnum(DocumentCategory),
  accessLevel: z.nativeEnum(AccessLevel).optional().default('INTERNAL'),
  deskripsi: z.string().optional(),
})

export default defineEventHandler(async (event) => {
  const user = event.context.user
  const prisma = getPrisma()

  const allowedCreateRoles = ['SUPER_ADMIN', 'ADMIN', 'KEPALA_SEKOLAH', 'TU', 'GURU']
  if (!allowedCreateRoles.includes(user.role)) {
    throw createError({ statusCode: 403, statusMessage: 'Tidak memiliki akses untuk membuat dokumen' })
  }

  const items = await readMultipartFormData(event)
  if (!items) throw createError({ statusCode: 400, statusMessage: 'No file uploaded' })

  const fileItems = items.filter(i => i.name === 'files[]')
  if (!fileItems.length) throw createError({ statusCode: 400, statusMessage: 'Minimal satu file required' })

  const maxSize = useRuntimeConfig().public.maxUploadSize
  for (const fi of fileItems) {
    if (fi.data.length > maxSize) {
      throw createError({ statusCode: 400, statusMessage: `File ${fi.filename} too large. Max ${maxSize / 1024 / 1024}MB` })
    }
  }

  const getFieldValue = (name: string) => items.find(i => i.name === name)?.data.toString()

  const metadata = {
    judul: getFieldValue('judul'),
    deskripsi: getFieldValue('deskripsi'),
    kategori: getFieldValue('kategori'),
    subKategori: getFieldValue('subKategori'),
    accessLevel: getFieldValue('accessLevel') || 'INTERNAL',
    nomorSurat: getFieldValue('nomorSurat'),
    tanggalSurat: getFieldValue('tanggalSurat'),
    pengirim: getFieldValue('pengirim'),
    perihal: getFieldValue('perihal'),
    tanggalDokumen: getFieldValue('tanggalDokumen'),
    tags: getFieldValue('tags')?.split(',').map(t => t.trim()).filter(Boolean) || [],
  }

  const parsed = docSchema.safeParse({ judul: metadata.judul, kategori: metadata.kategori, accessLevel: metadata.accessLevel, deskripsi: metadata.deskripsi })
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: parsed.error.issues[0].message })
  }

  const uploadsData = await Promise.all(
    fileItems.map(async (fi) => {
      const fileName = `${randomUUID()}-${fi.filename}`
      const filePath = await saveFile(fileName, fi.data, fi.type)
      return {
        fileName: fi.filename,
        filePath,
        fileSize: fi.data.length,
        mimeType: fi.type,
        uploadedById: user.id,
      }
    })
  )

  // Use first file for document-level metadata
  const firstFile = fileItems[0]
  const firstUpload = uploadsData[0]

  const maxAccessLevel: Record<string, number> = {
    GURU: 1,
    TU: 3,
    KEPALA_SEKOLAH: 4,
    ADMIN: 4,
    SUPER_ADMIN: 4,
  }
  const accessLevels = ['PUBLIC', 'INTERNAL', 'RESTRICTED', 'CONFIDENTIAL', 'SECRET']
  const requestedLevel = accessLevels.indexOf(metadata.accessLevel || 'PUBLIC')
  const allowedLevel = maxAccessLevel[user.role] ?? 0
  if (requestedLevel > allowedLevel) {
    throw createError({ statusCode: 403, statusMessage: `Tidak dapat mengatur akses ${metadata.accessLevel}` })
  }

  let ocrText = ''
  let isOcrProcessed = false
  try {
    ocrText = await processOCR(firstFile.data, firstFile.type)
    isOcrProcessed = true
  } catch (error) {
    console.error('OCR failed:', error)
  }

  let kodeDokumen = ''
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      kodeDokumen = await generateKodeDokumen(prisma, metadata.kategori)
      break
    } catch (err: any) {
      if (err?.code !== 'P2002' || attempt === 2) throw err
    }
  }

  let masaRetensiThn = 5
  if (metadata.subKategori) {
    const klasifikasi = await prisma.klasifikasiArsip.findFirst({
      where: { nama: metadata.subKategori, kategori: metadata.kategori },
    })
    if (klasifikasi) masaRetensiThn = klasifikasi.retensiThn
  }
  const tanggalDok = new Date(metadata.tanggalDokumen || Date.now())
  const expiredAt = new Date(tanggalDok)
  expiredAt.setFullYear(expiredAt.getFullYear() + masaRetensiThn)

  const document = await prisma.document.create({
    data: {
      kodeDokumen,
      judul: metadata.judul,
      deskripsi: metadata.deskripsi,
      kategori: metadata.kategori,
      subKategori: metadata.subKategori,
      accessLevel: metadata.accessLevel,
      nomorSurat: metadata.nomorSurat,
      tanggalSurat: metadata.tanggalSurat ? new Date(metadata.tanggalSurat) : null,
      pengirim: metadata.pengirim,
      perihal: metadata.perihal,
      tanggalDokumen: tanggalDok,
      masaRetensiThn,
      expiredAt,
      fileSize: firstFile.data.length,
      mimeType: firstFile.type,
      ocrText,
      isOcrProcessed,
      createdById: user.id,
      uploads: {
        create: uploadsData,
      },
      tags: {
        create: metadata.tags.map(tag => ({ tag })),
      },
    },
    include: {
      createdBy: { select: { id: true, namaLengkap: true } },
      uploads: true,
      tags: true,
    },
  })

  await logAudit(prisma, {
    userId: user.id,
    action: 'CREATE',
    entity: 'Document',
    entityId: document.id,
    metadata: {
      fileCount: fileItems.length,
      files: fileItems.map(f => ({ fileName: f.filename, fileSize: f.data.length })),
    },
    ipAddress: getRequestIP(event),
    userAgent: getRequestHeader(event, 'user-agent'),
  })

  return { success: true, data: document }
})

async function generateKodeDokumen(prisma: any, kategori: string) {
  const prefix = {
    AKADEMIK: 'AKD',
    KESISWAAN: 'KSW',
    KEPEGAWAIAN: 'KEP',
    ADMINISTRATIF: 'ADM',
    KEUANGAN: 'KEU',
    LEGALITAS: 'LEG',
    MEDIA: 'MED',
    LAINNYA: 'LAIN',
  }[kategori] || 'DOC'

  const year = new Date().getFullYear()
  const count = await prisma.document.count({
    where: {
      kodeDokumen: { startsWith: `${prefix}/${year}` },
    },
  })

  return `${prefix}/${year}/${String(count + 1).padStart(4, '0')}`
}
