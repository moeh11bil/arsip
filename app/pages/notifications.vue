<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})

const { data, refresh } = await useAsyncData('notifications', () =>
  $fetch('/api/notifications?limit=50')
)

const notifications = computed(() => (data.value as any)?.data || [])
const unreadCount = computed(() => (data.value as any)?.unreadCount || 0)

const typeIcons: Record<string, string> = {
  info: 'heroicons:information-circle',
  warning: 'heroicons:exclamation-triangle',
  success: 'heroicons:check-circle',
  disposition: 'heroicons:arrow-right-circle',
  document: 'heroicons:document',
  surat: 'heroicons:envelope',
  system: 'heroicons:cog-6-tooth',
}

const typeColors: Record<string, string> = {
  info: 'bg-blue-100 text-blue-600',
  warning: 'bg-amber-100 text-amber-600',
  success: 'bg-green-100 text-green-600',
  disposition: 'bg-purple-100 text-purple-600',
  document: 'bg-primary-100 text-primary-600',
  surat: 'bg-cyan-100 text-cyan-600',
  system: 'bg-gray-100 text-gray-600',
}

const pendingAction = ref(false)

const markAsRead = async (id: string) => {
  try {
    pendingAction.value = true
    await $fetch('/api/notifications/read', { method: 'POST', body: { id } })
    refresh()
  } catch {
    // silent
  } finally {
    pendingAction.value = false
  }
}

const markAllRead = async () => {
  try {
    pendingAction.value = true
    await $fetch('/api/notifications/read', { method: 'POST', body: { all: true } })
    refresh()
  } catch {
    // silent
  } finally {
    pendingAction.value = false
  }
}

useHead({ title: 'Notifikasi - EduArch' })
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Notifikasi</h1>
        <p v-if="unreadCount > 0" class="text-sm text-gray-500 mt-1">{{ unreadCount }} belum dibaca</p>
      </div>
      <button v-if="unreadCount > 0" @click="markAllRead" :disabled="pendingAction"
        class="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50">
        <Icon v-if="pendingAction" name="heroicons:arrow-path" class="w-4 h-4 animate-spin" />
        <Icon v-else name="heroicons:check" class="w-4 h-4" />
        Tandai Semua Dibaca
      </button>
    </div>

    <div v-if="notifications.length === 0" class="bg-white rounded-2xl border border-gray-200 shadow-sm p-12 text-center">
      <Icon name="heroicons:bell" class="w-10 h-10 mx-auto text-gray-300" />
      <p class="mt-3 text-sm text-gray-500">Belum ada notifikasi</p>
    </div>

    <div v-else class="space-y-2">
      <div v-for="notif in notifications" :key="notif.id"
        class="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 transition-all hover:shadow-md"
        :class="{ 'border-l-4 border-l-primary-500': !notif.isRead }">
        <div class="flex items-start gap-3">
          <div class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            :class="typeColors[notif.type] || typeColors.info">
            <Icon :name="typeIcons[notif.type] || typeIcons.info" class="w-5 h-5" />
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between">
              <h3 class="text-sm font-semibold text-gray-900">{{ notif.title }}</h3>
              <div class="flex items-center gap-2">
                <span class="text-xs text-gray-400">{{ new Date(notif.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) }}</span>
                <button v-if="!notif.isRead" @click="markAsRead(notif.id)" class="p-1 text-gray-400 hover:text-primary-600 rounded transition-colors">
                  <Icon name="heroicons:check" class="w-4 h-4" />
                </button>
              </div>
            </div>
            <p class="text-sm text-gray-600 mt-0.5">{{ notif.message }}</p>
            <NuxtLink v-if="notif.link" :to="notif.link"
              class="inline-flex items-center gap-1 text-xs font-medium text-primary-600 hover:text-primary-700 mt-2">
              Lihat Detail
              <Icon name="heroicons:arrow-right" class="w-3 h-3" />
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
