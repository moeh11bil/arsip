import { getPrisma } from '~/server/utils/prisma'
import { logAudit } from '~/server/utils/audit'
import bcrypt from 'bcryptjs'

const VALID_ROLES = ['SUPER_ADMIN', 'ADMIN', 'KEPALA_SEKOLAH', 'TU', 'GURU', 'SISWA', 'AUDITOR']

export default defineEventHandler(async (event) => {
  const currentUser = event.context.user
  if (!currentUser || !['SUPER_ADMIN', 'ADMIN'].includes(currentUser.role)) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }

  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'ID diperlukan' })

  const body = await readBody(event)
  const prisma = getPrisma()

  const existing = await prisma.user.findUnique({ where: { id } })
  if (!existing) throw createError({ statusCode: 404, statusMessage: 'User tidak ditemukan' })

  if (body.email && body.email !== existing.email) {
    const emailTaken = await prisma.user.findUnique({ where: { email: body.email } })
    if (emailTaken) throw createError({ statusCode: 409, statusMessage: 'Email sudah digunakan' })
  }

  if (body.role && !VALID_ROLES.includes(body.role)) {
    throw createError({ statusCode: 400, statusMessage: `Role tidak valid. Pilihan: ${VALID_ROLES.join(', ')}` })
  }

  if (body.role === 'SUPER_ADMIN' && currentUser.role !== 'SUPER_ADMIN') {
    throw createError({ statusCode: 403, statusMessage: 'Hanya SUPER_ADMIN yang dapat menetapkan role SUPER_ADMIN' })
  }

  if (body.password && body.password.length < 8) {
    throw createError({ statusCode: 400, statusMessage: 'Password minimal 8 karakter' })
  }

  const updateData: any = {}
  if (body.email) updateData.email = body.email
  if (body.namaLengkap) updateData.namaLengkap = body.namaLengkap
  if (body.role) updateData.role = body.role
  if (body.nip !== undefined) updateData.nip = body.nip
  if (body.nis !== undefined) updateData.nis = body.nis
  if (body.isActive !== undefined) updateData.isActive = body.isActive
  if (body.password) {
    updateData.passwordHash = await bcrypt.hash(body.password, 12)
  }

  const updated = await prisma.user.update({
    where: { id },
    data: updateData,
    select: {
      id: true,
      email: true,
      namaLengkap: true,
      role: true,
      nip: true,
      nis: true,
      isActive: true,
    },
  })

  await logAudit(prisma, {
    userId: currentUser.id,
    action: 'UPDATE',
    entity: 'User',
    entityId: id,
    oldValue: { email: existing.email, role: existing.role, isActive: existing.isActive },
    newValue: { email: updated.email, role: updated.role, isActive: updated.isActive },
    ipAddress: getRequestIP(event),
    userAgent: getRequestHeader(event, 'user-agent'),
  })

  return { success: true, data: updated }
})
