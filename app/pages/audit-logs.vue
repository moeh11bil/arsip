<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
  middleware: ['auth', 'role'],
  roles: ['SUPER_ADMIN', 'ADMIN'],
})

useHead({ title: 'Audit Log - EduArch' })

const search = ref('')
const action = ref('')
const page = ref(1)

const { data, pending, refresh } = await useAsyncData(
  'audit-logs',
  () => $fetch(`/api/audit-logs?page=${page.value}&search=${search.value}&action=${action.value}`),
  { watch: [page, search, action], server: false }
)

const actionIcons: Record<string, string> = {
  CREATE: 'heroicons:plus-circle',
  READ: 'heroicons:eye',
  UPDATE: 'heroicons:pencil-square',
  DELETE: 'heroicons:trash',
  DOWNLOAD: 'heroicons:arrow-down-tray',
  LOGIN: 'heroicons:arrow-right-on-rectangle',
  LOGOUT: 'heroicons:arrow-left-on-rectangle',
  DISPOSITION: 'heroicons:arrows-right-left',
}

const actionColors: Record<string, string> = {
  CREATE: 'bg-emerald-100 text-emerald-600',
  READ: 'bg-blue-100 text-blue-600',
  UPDATE: 'bg-amber-100 text-amber-600',
  DELETE: 'bg-red-100 text-red-600',
  DOWNLOAD: 'bg-purple-100 text-purple-600',
  LOGIN: 'bg-cyan-100 text-cyan-600',
  LOGOUT: 'bg-gray-100 text-gray-600',
  DISPOSITION: 'bg-indigo-100 text-indigo-600',
}

const actionLabels: Record<string, string> = {
  CREATE: 'Membuat',
  READ: 'Melihat',
  UPDATE: 'Mengubah',
  DELETE: 'Menghapus',
  DOWNLOAD: 'Mengunduh',
  LOGIN: 'Login',
  LOGOUT: 'Logout',
  DISPOSITION: 'Disposisi',
}

const actionOptions = [
  { value: '', label: 'Semua Aksi' },
  { value: 'CREATE', label: 'Membuat' },
  { value: 'READ', label: 'Melihat' },
  { value: 'UPDATE', label: 'Mengubah' },
  { value: 'DELETE', label: 'Menghapus' },
  { value: 'DOWNLOAD', label: 'Mengunduh' },
  { value: 'LOGIN', label: 'Login' },
  { value: 'LOGOUT', label: 'Logout' },
  { value: 'DISPOSITION', label: 'Disposisi' },
]

const visiblePages = computed(() => {
  if (!data.value?.pagination) return []
  const total = data.value.pagination.totalPages
  const current = page.value
  const pages: (number | string)[] = []
  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i)
  } else {
    pages.push(1)
    if (current > 3) pages.push('...')
    for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) pages.push(i)
    if (current < total - 2) pages.push('...')
    pages.push(total)
  }
  return pages
})

const formatMetadata = (log: any) => {
  if (log.entity === 'Surat' && log.metadata?.nomorSurat) {
    return log.metadata.nomorSurat
  }
  if (log.entity === 'Document' && log.metadata?.fileName) {
    return log.metadata.fileName
  }
  if (log.entity === 'User' && log.metadata?.email) {
    return log.metadata.email
  }
  return log.entityId || '-'
}
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-gray-900">Audit Log</h1>
      <p class="text-sm text-gray-500 mt-0.5">Catatan aktivitas pengguna dalam sistem</p>
    </div>

    <div class="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/60 shadow-sm p-4">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="relative">
          <Icon name="heroicons:magnifying-glass" class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            v-model="search"
            type="text"
            placeholder="Cari aktivitas..."
            class="w-full pl-12 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white transition-all"
          />
        </div>
        <select
          v-model="action"
          class="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
        >
          <option v-for="opt in actionOptions" :key="opt.value" :value="opt.value">
            {{ opt.label }}
          </option>
        </select>
        <div class="flex items-center text-sm text-gray-500">
          <Icon name="heroicons:clipboard-document-list" class="w-4 h-4 mr-1.5" />
          <span v-if="data?.pagination">
            Total: <strong class="text-gray-900">{{ data.pagination.total }}</strong> aktivitas
          </span>
          <span v-else>Memuat...</span>
        </div>
      </div>
    </div>

    <div v-if="pending" class="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/60 shadow-sm p-12 text-center">
      <Icon name="heroicons:arrow-path" class="w-8 h-8 mx-auto text-primary-600 animate-spin" />
      <p class="mt-3 text-sm text-gray-500">Memuat log...</p>
    </div>

    <div v-else-if="data?.data?.length" class="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/60 shadow-sm overflow-hidden">
      <div class="divide-y divide-gray-100">
        <div v-for="log in data.data" :key="log.id" class="flex items-start gap-4 p-4 sm:px-6 hover:bg-gray-50/50 transition-colors">
          <div class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" :class="actionColors[log.action] || 'bg-gray-100 text-gray-500'">
            <Icon :name="actionIcons[log.action] || 'heroicons:clipboard-document-list'" class="w-5 h-5" />
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2">
              <span class="text-sm font-semibold text-gray-900">{{ actionLabels[log.action] || log.action }}</span>
              <span class="text-xs text-gray-400">·</span>
              <span class="text-xs font-medium text-gray-600">{{ log.entity }}</span>
              <span v-if="log.entityId" class="text-xs text-gray-400">·</span>
              <span v-if="log.entityId" class="text-xs text-gray-500 font-mono truncate max-w-[200px]">{{ formatMetadata(log) }}</span>
            </div>
            <div class="flex items-center gap-2 mt-1 text-xs text-gray-500">
              <span v-if="log.user" class="font-medium">{{ log.user.namaLengkap }}</span>
              <span v-else class="text-gray-400">Sistem</span>
              <span class="text-gray-300">·</span>
              <span>{{ new Date(log.createdAt).toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) }}</span>
              <span v-if="log.ipAddress" class="text-gray-300 hidden sm:inline">·</span>
              <span v-if="log.ipAddress" class="text-gray-400 hidden sm:inline font-mono">{{ log.ipAddress }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/60 shadow-sm p-12 text-center">
      <Icon name="heroicons:shield-check" class="w-16 h-16 mx-auto text-gray-300" />
      <h3 class="mt-4 text-lg font-semibold text-gray-900">Belum ada aktivitas</h3>
      <p class="mt-1 text-sm text-gray-500">Log aktivitas akan muncul di sini.</p>
    </div>

    <!-- Pagination -->
    <div v-if="data?.pagination && data.pagination.totalPages > 1" class="flex flex-col sm:flex-row items-center justify-between gap-4">
      <div class="text-sm text-gray-500">
        Halaman <strong class="text-gray-900">{{ data.pagination.page }}</strong> dari <strong class="text-gray-900">{{ data.pagination.totalPages }}</strong>
        · Total <strong class="text-gray-900">{{ data.pagination.total }}</strong> aktivitas
      </div>
      <nav class="inline-flex items-center gap-1 bg-white/80 backdrop-blur-sm rounded-xl border border-white/60 shadow-sm p-1">
        <button @click="page = page - 1" :disabled="page <= 1" class="w-10 h-10 flex items-center justify-center text-sm font-medium rounded-lg transition-all text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent">
          <Icon name="heroicons:chevron-left" class="w-4 h-4" />
        </button>
        <template v-for="p in visiblePages" :key="p">
          <span v-if="p === '...'" class="w-10 h-10 flex items-center justify-center text-sm text-gray-400">…</span>
          <button v-else @click="page = p" :class="['w-10 h-10 flex items-center justify-center text-sm font-medium rounded-lg transition-all', page === p ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg shadow-primary-500/30' : 'text-gray-600 hover:bg-gray-100']">
            {{ p }}
          </button>
        </template>
        <button @click="page = page + 1" :disabled="page >= data.pagination.totalPages" class="w-10 h-10 flex items-center justify-center text-sm font-medium rounded-lg transition-all text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent">
          <Icon name="heroicons:chevron-right" class="w-4 h-4" />
        </button>
      </nav>
    </div>
  </div>
</template>
