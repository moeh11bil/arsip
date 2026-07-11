<template>
  <header class="sticky top-0 z-30 bg-white/70 backdrop-blur-xl border-b border-gray-200/60 shadow-sm">
    <div class="flex items-center gap-4 px-4 sm:px-6 lg:px-8 h-16">
      <button @click="$emit('toggle-sidebar')" class="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
        <Icon name="heroicons:bars-3" class="w-6 h-6" />
      </button>

      <div class="flex-1 max-w-2xl">
        <div class="relative">
          <Icon name="heroicons:magnifying-glass" class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Cari dokumen, surat, atau pengguna..."
            class="w-full pl-12 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white transition-all"
          />
        </div>
      </div>

      <div class="flex items-center gap-2 ml-auto">
        <!-- Notifications -->
        <div class="relative" ref="notifRef">
          <button @click="notifOpen = !notifOpen" class="relative p-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
            <Icon name="heroicons:bell" class="w-6 h-6" />
            <span v-if="unreadCount > 0" class="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 rounded-full ring-2 ring-white text-white text-[10px] font-bold flex items-center justify-center">
              {{ unreadCount > 9 ? '9+' : unreadCount }}
            </span>
          </button>

          <Transition name="dropdown">
            <div v-if="notifOpen" class="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
              <div class="flex items-center justify-between p-4 border-b border-gray-100">
                <h3 class="text-sm font-bold text-gray-900">Notifikasi</h3>
                <NuxtLink @click="notifOpen = false" to="/notifications" class="text-xs font-medium text-primary-600 hover:text-primary-700">
                  Lihat Semua
                </NuxtLink>
              </div>
              <div class="max-h-80 overflow-y-auto">
                <div v-if="notifications.length === 0" class="p-6 text-center text-sm text-gray-500">
                  Belum ada notifikasi
                </div>
                <div v-for="notif in notifications" :key="notif.id"
                  class="flex items-start gap-3 p-3 hover:bg-gray-50 transition-colors cursor-pointer"
                  :class="{ 'bg-primary-50/50': !notif.isRead }"
                  @click="handleNotifClick(notif)">
                  <div class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    :class="notifTypeColors[notif.type] || 'bg-blue-100 text-blue-600'">
                    <Icon :name="notifTypeIcons[notif.type] || 'heroicons:bell'" class="w-4 h-4" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="text-sm font-medium text-gray-900 truncate">{{ notif.title }}</div>
                    <div class="text-xs text-gray-500 truncate">{{ notif.message }}</div>
                    <div class="text-[10px] text-gray-400 mt-0.5">{{ timeAgo(notif.createdAt) }}</div>
                  </div>
                  <div v-if="!notif.isRead" class="w-2 h-2 rounded-full bg-primary-500 flex-shrink-0 mt-1.5" />
                </div>
              </div>
            </div>
          </Transition>
        </div>

        <div class="w-px h-8 bg-gray-200 mx-1" />

        <!-- User Dropdown -->
        <div class="relative" ref="dropdownRef">
          <button
            @click="dropdownOpen = !dropdownOpen"
            class="flex items-center gap-2 p-1.5 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <div class="w-8 h-8 bg-gradient-to-br from-primary-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
              {{ userInitials }}
            </div>
            <Icon name="heroicons:chevron-down" class="w-4 h-4 text-gray-500 hidden sm:block" />
          </button>

          <Transition name="dropdown">
            <div v-if="dropdownOpen" class="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
              <div class="p-4 bg-gradient-to-br from-primary-50 to-purple-50 border-b border-gray-100">
                <div class="font-semibold text-gray-900 text-sm">{{ userName }}</div>
                <div class="text-xs text-gray-500 truncate">{{ userEmail }}</div>
              </div>
              <div class="py-2">
                <NuxtLink to="/dashboard" @click="dropdownOpen = false" class="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                  <Icon name="heroicons:square-3-stack-3d" class="w-5 h-5 text-gray-400" />
                  <span>Dashboard</span>
                </NuxtLink>
                <NuxtLink to="/notifications" @click="dropdownOpen = false" class="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                  <Icon name="heroicons:bell" class="w-5 h-5 text-gray-400" />
                  <span>Notifikasi</span>
                  <span v-if="unreadCount > 0" class="ml-auto px-1.5 py-0.5 text-xs font-bold bg-primary-100 text-primary-700 rounded-full">{{ unreadCount }}</span>
                </NuxtLink>
                <NuxtLink to="/settings" @click="dropdownOpen = false" class="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                  <Icon name="heroicons:cog-6-tooth" class="w-5 h-5 text-gray-400" />
                  <span>Pengaturan</span>
                </NuxtLink>
              </div>
              <div class="border-t border-gray-100 py-2">
                <button @click="showLogoutConfirm = true; dropdownOpen = false" class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50">
                  <Icon name="heroicons:arrow-right-on-rectangle" class="w-5 h-5" />
                  <span>Keluar</span>
                </button>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </div>
  </header>

  <UiConfirmModal v-model="showLogoutConfirm" @confirm="handleLogout" />
</template>

<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'

defineEmits(['toggle-sidebar'])

const dropdownOpen = ref(false)
const dropdownRef = ref<HTMLElement>()
const showLogoutConfirm = ref(false)

const notifOpen = ref(false)
const notifRef = ref<HTMLElement>()

const toast = useToast()

const { data: userData } = await useFetch('/api/auth/me', {
  server: false,
  default: () => ({ data: null }),
})

// Shares cache key with Sidebar via useAsyncData key
const { data: notifData, refresh: refreshNotif } = await useAsyncData('notif-topbar', () =>
  $fetch('/api/notifications?limit=5&unreadOnly=true'),
  { server: false, default: () => ({ data: [], unreadCount: 0 }) },
)

const notifications = computed(() => (notifData.value as any)?.data || [])
const unreadCount = computed(() => (notifData.value as any)?.unreadCount || 0)

const userInitials = computed(() => {
  const name = userData.value?.data?.namaLengkap || ''
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || '?'
})

const userName = computed(() => userData.value?.data?.namaLengkap || 'User')
const userEmail = computed(() => userData.value?.data?.email || '')

const notifTypeColors: Record<string, string> = {
  info: 'bg-blue-100 text-blue-600',
  warning: 'bg-amber-100 text-amber-600',
  success: 'bg-green-100 text-green-600',
  disposition: 'bg-purple-100 text-purple-600',
  document: 'bg-primary-100 text-primary-600',
  surat: 'bg-cyan-100 text-cyan-600',
}

const notifTypeIcons: Record<string, string> = {
  info: 'heroicons:information-circle',
  warning: 'heroicons:exclamation-triangle',
  success: 'heroicons:check-circle',
  disposition: 'heroicons:arrow-right-circle',
  document: 'heroicons:document',
  surat: 'heroicons:envelope',
}

const timeAgo = (date: string) => {
  const diff = Date.now() - new Date(date).getTime()
  if (diff < 0) return 'baru saja'
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'baru saja'
  if (mins < 60) return `${mins} menit lalu`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} jam lalu`
  const days = Math.floor(hours / 24)
  return `${days} hari lalu`
}

const handleNotifClick = async (notif: any) => {
  try {
    if (!notif.isRead) {
      await $fetch('/api/notifications/read', { method: 'POST', body: { id: notif.id } })
      refreshNotif()
    }
    notifOpen.value = false
    if (notif.link) {
      await navigateTo(notif.link)
    }
  } catch {
    notifOpen.value = false
  }
}

onClickOutside(dropdownRef, () => {
  dropdownOpen.value = false
})

onClickOutside(notifRef, () => {
  notifOpen.value = false
})

const handleLogout = async () => {
  const token = useCookie('auth_token')
  token.value = null
  toast.info('Anda telah keluar.')
  await navigateTo('/login')
}
</script>

<style scoped>
.dropdown-enter-active, .dropdown-leave-active {
  transition: all 0.2s ease;
}
.dropdown-enter-from, .dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}
</style>
