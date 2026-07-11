<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})

useHead({ title: 'Surat Keluar - EduArch' })

const { fetchUser, canCreateDoc } = useAuth()
await fetchUser()

const { list } = useSurat()

const showCreateModal = ref(false)
const search = ref('')
const type = ref<SuratType>('KELUAR')
const priority = ref<SuratPriority>('BIASA')
const page = ref(1)
const limit = ref(20)

const { data, pending, refresh } = await useAsyncData(
  'surat-keluar',
  () => list({
    page: page.value,
    limit: limit.value,
    type: type.value,
    priority: priority.value,
    search: search.value,
  }),
  { watch: [page, type, priority] }
)

let searchTimeout: ReturnType<typeof setTimeout>
watch(search, () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    page.value = 1
    refresh()
  }, 300)
})

onUnmounted(() => {
  clearTimeout(searchTimeout)
})

const priorityOptions = [
  { value: 'BIASA', label: 'Biasa' },
  { value: 'SEGERA', label: 'Segera' },
  { value: 'SANGAT_SEGERA', label: 'Sangat Segera' },
]

const priorityColors: Record<SuratPriority, string> = {
  BIASA: 'bg-gray-100 text-gray-700',
  SEGERA: 'bg-orange-100 text-orange-700',
  SANGAT_SEGERA: 'bg-red-100 text-red-700',
}

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
    for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
      pages.push(i)
    }
    if (current < total - 2) pages.push('...')
    pages.push(total)
  }

  return pages
})
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Surat Keluar</h1>
        <p class="text-sm text-gray-500 mt-0.5">Kelola surat keluar sekolah</p>
      </div>
      <button v-if="canCreateDoc"
        @click="showCreateModal = true"
        class="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white text-sm font-semibold rounded-xl shadow-lg shadow-primary-500/30 hover:shadow-xl hover:-translate-y-0.5 transition-all"
      >
        <Icon name="heroicons:plus" class="w-4 h-4" />
        Buat Surat
      </button>
    </div>

    <!-- Filters -->
    <div class="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/60 shadow-sm p-4">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="relative">
          <Icon name="heroicons:magnifying-glass" class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            v-model="search"
            type="text"
            placeholder="Cari nomor surat, perihal, tujuan..."
            class="w-full pl-12 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white transition-all"
          />
        </div>

        <select
          v-model="priority"
          class="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
        >
          <option v-for="opt in priorityOptions" :key="opt.value" :value="opt.value">
            {{ opt.label }}
          </option>
        </select>

        <div class="flex items-center text-sm text-gray-500">
          <Icon name="heroicons:document-text" class="w-4 h-4 mr-1.5" />
          <span v-if="data?.pagination">
            Total: <strong class="text-gray-900">{{ data.pagination.total }}</strong> surat
          </span>
          <span v-else>Memuat...</span>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="pending" class="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/60 shadow-sm p-12 text-center">
      <Icon name="heroicons:arrow-path" class="w-8 h-8 mx-auto text-primary-600 animate-spin" />
      <p class="mt-3 text-sm text-gray-500">Memuat surat...</p>
    </div>

    <!-- Surat List -->
    <div v-else-if="data?.data?.length" class="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/60 shadow-sm overflow-hidden">
      <div class="divide-y divide-gray-100">
        <div
          v-for="surat in data.data"
          :key="surat.id"
          class="group flex items-center gap-4 p-4 sm:px-6 hover:bg-gray-50/50 transition-colors"
        >
          <!-- File Icon -->
          <div class="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" :class="surat.priority === 'SANGAT_SEGERA' ? 'bg-red-50' : surat.priority === 'SEGERA' ? 'bg-orange-50' : 'bg-blue-50'">
            <Icon name="heroicons:document-text" class="w-6 h-6" :class="surat.priority === 'SANGAT_SEGERA' ? 'text-red-600' : surat.priority === 'SEGERA' ? 'text-orange-600' : 'text-blue-600'" />
          </div>

          <!-- Info -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2">
              <NuxtLink :to="`/surat/${surat.id}`" class="font-semibold text-gray-900 text-sm truncate group-hover:text-primary-600 transition-colors">
                {{ surat.perihal }}
              </NuxtLink>
            </div>
            <div class="flex items-center gap-3 mt-1 text-xs text-gray-500">
              <span class="font-mono">{{ surat.nomorSurat }}</span>
              <span>·</span>
              <span>{{ new Date(surat.tanggalSurat).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) }}</span>
              <span v-if="surat.tujuan" class="hidden sm:inline">·</span>
              <span v-if="surat.tujuan" class="hidden sm:inline truncate max-w-xs">{{ surat.tujuan }}</span>
            </div>
          </div>

          <!-- Badges -->
          <div class="hidden sm:flex items-center gap-2">
            <span class="px-2.5 py-1 text-xs font-medium rounded-lg" :class="priorityColors[surat.priority]">
              {{ surat.priority }}
            </span>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-1">
            <NuxtLink :to="`/surat/${surat.id}`" class="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
              <Icon name="heroicons:eye" class="w-5 h-5" />
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/60 shadow-sm p-12 text-center">
      <Icon name="heroicons:paper-airplane" class="w-16 h-16 mx-auto text-gray-300" />
      <h3 class="mt-4 text-lg font-semibold text-gray-900">Belum ada surat keluar</h3>
      <p class="mt-1 text-sm text-gray-500">Mulai dengan membuat surat keluar pertama.</p>
      <button @click="showCreateModal = true" class="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white text-sm font-semibold rounded-xl shadow-lg shadow-primary-500/30 hover:shadow-xl hover:-translate-y-0.5 transition-all">
        <Icon name="heroicons:cloud-arrow-up" class="w-4 h-4" />
        Buat Surat Sekarang
      </button>
    </div>

    <!-- Pagination -->
    <div v-if="data?.pagination && data.pagination.totalPages > 1" class="flex flex-col sm:flex-row items-center justify-between gap-4">
      <div class="text-sm text-gray-500">
        Halaman <strong class="text-gray-900">{{ data.pagination.page }}</strong> dari <strong class="text-gray-900">{{ data.pagination.totalPages }}</strong>
        · Total <strong class="text-gray-900">{{ data.pagination.total }}</strong> surat
      </div>
      <nav class="inline-flex items-center gap-1 bg-white/80 backdrop-blur-sm rounded-xl border border-white/60 shadow-sm p-1">
        <button
          @click="page = page - 1"
          :disabled="page <= 1"
          class="w-10 h-10 flex items-center justify-center text-sm font-medium rounded-lg transition-all text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
        >
          <Icon name="heroicons:chevron-left" class="w-4 h-4" />
        </button>

        <template v-for="p in visiblePages" :key="p">
          <span v-if="p === '...'" class="w-10 h-10 flex items-center justify-center text-sm text-gray-400">…</span>
          <button
            v-else
            @click="page = p"
            :class="[
              'w-10 h-10 flex items-center justify-center text-sm font-medium rounded-lg transition-all',
              page === p
                ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg shadow-primary-500/30'
                : 'text-gray-600 hover:bg-gray-100'
            ]"
          >
            {{ p }}
          </button>
        </template>

        <button
          @click="page = page + 1"
          :disabled="page >= data.pagination.totalPages"
          class="w-10 h-10 flex items-center justify-center text-sm font-medium rounded-lg transition-all text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
        >
          <Icon name="heroicons:chevron-right" class="w-4 h-4" />
        </button>
      </nav>
    </div>

    <!-- Create Modal -->
    <UiSuratModal v-model="showCreateModal" type="KELUAR" @created="refresh()" />
  </div>
</template>
