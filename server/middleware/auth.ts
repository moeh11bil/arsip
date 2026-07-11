import { verifyToken } from '../utils/auth'

export default defineEventHandler(async (event) => {
  const protectedPaths = ['/api/documents', '/api/surat', '/api/admin', '/api/users', '/api/audit-logs', '/api/auth/me', '/api/master', '/api/notifications', '/api/export']
  const path = getRequestURL(event).pathname

  if (!protectedPaths.some(p => path.startsWith(p))) return
  if (path === '/api/auth/login') return

  const token = getCookie(event, 'auth_token')
    || getHeader(event, 'authorization')?.replace('Bearer ', '')

  if (!token) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  try {
    const payload = await verifyToken(token)
    event.context.user = {
      id: payload.userId,
      email: payload.email,
      role: payload.role,
    }
  } catch (error) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid token' })
  }
})
