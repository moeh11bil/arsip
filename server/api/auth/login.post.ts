import { getPrisma } from '../../utils/prisma'
import { signToken } from '../../utils/auth'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email('Format email tidak valid'),
  password: z.string().min(8, 'Password minimal 8 karakter'),
})

const loginAttempts = new Map<string, { count: number; resetAt: number }>()

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const parsed = loginSchema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: parsed.error.errors[0].message })
  }

  const { email, password } = parsed.data

  const ip = getRequestIP(event) || 'unknown'
  const now = Date.now()
  const attempt = loginAttempts.get(ip)

  if (attempt && attempt.resetAt > now && attempt.count >= 5) {
    throw createError({ statusCode: 429, statusMessage: 'Terlalu banyak percobaan. Coba lagi dalam 1 menit.' })
  }

  const prisma = getPrisma()

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    if (!attempt || attempt.resetAt <= now) {
      loginAttempts.set(ip, { count: 1, resetAt: now + 60 * 1000 })
    } else {
      loginAttempts.set(ip, { count: attempt.count + 1, resetAt: attempt.resetAt })
    }
    throw createError({ statusCode: 401, statusMessage: 'Email atau password salah' })
  }

  if (!user.isActive) {
    throw createError({ statusCode: 403, statusMessage: 'Akun tidak aktif' })
  }

  const valid = await bcrypt.compare(password, user.passwordHash)
  if (!valid) {
    if (!attempt || attempt.resetAt <= now) {
      loginAttempts.set(ip, { count: 1, resetAt: now + 60 * 1000 })
    } else {
      loginAttempts.set(ip, { count: attempt.count + 1, resetAt: attempt.resetAt })
    }
    throw createError({ statusCode: 401, statusMessage: 'Email atau password salah' })
  }

  loginAttempts.delete(ip)

  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  })

  const token = await signToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  })

  await prisma.session.create({
    data: {
      userId: user.id,
      token,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      ipAddress: getRequestIP(event),
      userAgent: getRequestHeader(event, 'user-agent'),
    },
  })

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      namaLengkap: user.namaLengkap,
      role: user.role,
    },
  }
})
