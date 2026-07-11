import { getPrisma } from '~/server/utils/prisma'
import { logAudit } from '~/server/utils/audit'
import bcrypt from 'bcryptjs'

const VALID_ROLES = ['SUPER_ADMIN', 'ADMIN', 'KEPALA_SEKOLAH', 'TU', 'GURU', 'SISWA', 'AUDITOR']

export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user || !['SUPER_ADMIN', 'ADMIN'].includes(user.role)) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }

  const body = await readBody(event)
  const { email, namaLengkap, password, role, nip, nis } = body

  if (!email || !namaLengkap || !password || !role) {
    throw createError({ statusCode: 400, statusMessage: 'Email, nama, password, dan role wajib diisi' })
  }

  if (!VALID_ROLES.includes(role)) {
    throw createError({ statusCode: 400, statusMessage: `Role tidak valid. Pilihan: ${VALID_ROLES.join(', ')}` })
  }

  if (role === 'SUPER_ADMIN' && user.role !== 'SUPER_ADMIN') {
    throw createError({ statusCode: 403, statusMessage: 'Hanya SUPER_ADMIN yang dapat membuat akun SUPER_ADMIN' })
  }

  if (password.length < 8) {
    throw createError({ statusCode: 400, statusMessage: 'Password minimal 8 karakter' })
  }

  const prisma = getPrisma()

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    throw createError({ statusCode: 409, statusMessage: 'Email sudah terdaftar' })
  }

  const passwordHash = await bcrypt.hash(password, 12)

  const newUser = await prisma.user.create({
    data: {
      email,
      namaLengkap,
      passwordHash,
      role,
      nip,
      nis,
    },
    select: {
      id: true,
      email: true,
      namaLengkap: true,
      role: true,
      nip: true,
      nis: true,
      isActive: true,
      createdAt: true,
    },
  })

  await logAudit(prisma, {
    userId: user.id,
    action: 'CREATE',
    entity: 'User',
    entityId: newUser.id,
    metadata: { email: newUser.email, role: newUser.role },
    ipAddress: getRequestIP(event),
    userAgent: getRequestHeader(event, 'user-agent'),
  })

  return { success: true, data: newUser }
})
