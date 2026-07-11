export const useAuth = () => {
  const user = useState<Record<string, any> | null>('auth-user', () => null)
  
  const fetchUser = async () => {
    try {
      const data = await $fetch('/api/auth/me')
      user.value = data.data || data
    } catch {
      user.value = null
    }
  }
  
  const hasRole = (...roles: string[]) => {
    return roles.includes(user.value?.role || '')
  }
  
  const isAdmin = computed(() => hasRole('SUPER_ADMIN', 'ADMIN'))
  const canManage = computed(() => hasRole('SUPER_ADMIN', 'ADMIN', 'KEPALA_SEKOLAH', 'TU'))
  const canCreateDoc = computed(() => hasRole('SUPER_ADMIN', 'ADMIN', 'KEPALA_SEKOLAH', 'TU', 'GURU'))
  
  return { user, fetchUser, hasRole, isAdmin, canManage, canCreateDoc }
}
