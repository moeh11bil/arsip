<script setup lang="ts">
defineProps<{
  collapsed: boolean
  mobileOpen: boolean
}>()

defineEmits(['close'])

const route = useRoute()

const { data: userData } = await useFetch('/api/auth/me', {
  server: false,
  default: () => ({ data: null }),
})

const userInitials = computed(() => {
  const name = userData.value?.data?.namaLengkap || ''
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || '?'
})

const userName = computed(() => userData.value?.data?.namaLengkap || 'User')
const userRole = computed(() => {
  const role = userData.value?.data?.role || ''
  return role.replace(/_/g, ' ')
})

const isAdmin = computed(() => {
  const role = userData.value?.data?.role || ''
  return role === 'SUPER_ADMIN' || role === 'ADMIN'
})

const menuGroups = computed(() => [
  {
    label: 'Menu Utama',
    items: [
      { to: '/dashboard', label: 'Dashboard', icon: 'heroicons:square-3-stack-3d' },
      { to: '/documents', label: 'Arsip Dokumen', icon: 'heroicons:folder' },
    ],
  },
  {
    label: 'Persuratan',
    items: [
      { to: '/surat/masuk', label: 'Surat Masuk', icon: 'heroicons:envelope' },
      { to: '/surat/keluar', label: 'Surat Keluar', icon: 'heroicons:paper-airplane' },
    ],
  },
  {
    label: 'Lainnya',
    items: [
      { to: '/notifications', label: 'Notifikasi', icon: 'heroicons:bell' },
      ...(isAdmin.value
        ? [
            { to: '/users', label: 'Manajemen User', icon: 'heroicons:user-group' },
            { to: '/audit-logs', label: 'Audit Log', icon: 'heroicons:shield-check' },
          ]
        : []),
    ],
  },
])

const isActive = (path: string) => {
  if (path === '/dashboard') return route.path === '/dashboard'
  return route.path.startsWith(path)
}
</script>

<template>
  <!-- Mobile Overlay -->
  <Transition name="fade">
    <div v-if="mobileOpen" class="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40" @click="$emit('close')" />
  </Transition>

  <aside
    :class="[
      'flex flex-col bg-white/80 backdrop-blur-xl border-r border-gray-200/60 shadow-sm transition-all duration-300 z-50',
      'fixed lg:relative h-screen',
      mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
      collapsed ? 'w-20' : 'w-72'
    ]"
  >
    <!-- Logo -->
    <div class="flex items-center gap-3 px-6 h-16 border-b border-gray-100 flex-shrink-0">
      <div class="relative flex-shrink-0">
        <div class="absolute inset-0 bg-primary-600 blur-lg opacity-30" />
        <div class="relative w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30">
          <Icon name="heroicons:archive-box" class="w-6 h-6 text-white" />
        </div>
      </div>
      <div v-if="!collapsed" class="flex items-center gap-2">
        <span class="text-xl font-bold bg-gradient-to-r from-primary-700 to-primary-500 bg-clip-text text-transparent">EduArch</span>
        <span class="text-xs px-1.5 py-0.5 bg-primary-100 text-primary-700 rounded-full font-medium">v{{ $config.public.appVersion }}</span>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 overflow-y-auto py-6 px-3">
      <div v-for="(group, idx) in menuGroups" :key="idx" class="mb-6">
        <div v-if="!collapsed" class="px-3 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
          {{ group.label }}
        </div>
        <ul class="space-y-1">
          <li v-for="item in group.items" :key="item.to">
            <NuxtLink
              :to="item.to"
              @click="$emit('close')"
              class="group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
              :class="isActive(item.to)
                ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/30'
                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'"
            >
              <Icon :name="item.icon" class="w-5 h-5 flex-shrink-0" />
              <span v-if="!collapsed" class="flex-1">{{ item.label }}</span>
              <span v-if="!collapsed && item.badge"
                    class="px-2 py-0.5 text-xs font-semibold rounded-full"
                    :class="isActive(item.to) ? 'bg-white/20 text-white' : 'bg-primary-100 text-primary-700'">
                {{ item.badge }}
              </span>
            </NuxtLink>
          </li>
        </ul>
      </div>
    </nav>

    <!-- User Profile -->
    <div class="border-t border-gray-100 p-3 flex-shrink-0">
      <div v-if="!collapsed" class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
        <div class="w-10 h-10 bg-gradient-to-br from-primary-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
          {{ userInitials }}
        </div>
        <div class="flex-1 min-w-0">
          <div class="text-sm font-semibold text-gray-900 truncate">{{ userName }}</div>
          <div class="text-xs text-gray-500 truncate">{{ userRole }}</div>
        </div>
      </div>
      <div v-else class="flex justify-center">
        <div class="w-10 h-10 bg-gradient-to-br from-primary-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
          {{ userInitials }}
        </div>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
