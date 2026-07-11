export default defineNuxtRouteMiddleware((to) => {
  const token = useCookie('auth_token')
  if (!token.value) {
    return navigateTo('/login')
  }

  // JWT parsing on client is for UX hinting only; server middleware enforces
  const allowedRoles: string[] = to.meta?.roles as string[] || []
  if (!allowedRoles.length) return

  try {
    const payload = JSON.parse(atob(token.value.split('.')[1]))
    const role = payload.role

    if (!allowedRoles.includes(role)) {
      return navigateTo('/dashboard')
    }
  } catch {
    return navigateTo('/login')
  }
})
