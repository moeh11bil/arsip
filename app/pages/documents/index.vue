<script setup lang="ts">
import { categoryColors, getFileExtension } from '~/utils/format'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})

useHead({ title: 'Arsip Dokumen - EduArch' })

const { user, fetchUser, isAdmin, canCreateDoc } = useAuth()
await fetchUser()

const { list } = useDocuments()

const showUploadModal = ref(false)
const search = ref('')
const kategori = ref('')
const page = ref(1)
const limit = ref(20)

const { data, pending, refresh } = await useAsyncData(
  'documents',
  () => list({
    page: page.value,
    limit: limit.value,
    search: search.value,
    kategori: kategori.value || undefined,
  }),
  { watch: [page, kategori] }
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

const { data: catData } = await useFetch('/api/master/klasifikasi-arsip', {
  server: false,
  default: () => ({ data: [] }),
})

const categoryTree = computed(() => catData.value?.data || [])

const kategoriOptions = computed(() => [
  { value: '', label: 'Semua Kategori' },
  ...categoryTree.value.map((cat: any) => ({
    value: cat.kategori,
    label: cat.nama,
  })),
])

const getCategoryName = (kode: string) => {
  const cat = categoryTree.value.find((c: any) => c.kategori === kode)
  return cat?.nama || kode
}

const accessColors: Record<string, string> = {
  PUBLIC: 'bg-green-100 text-green-700',
  INTERNAL: 'bg-blue-100 text-blue-700',
  RESTRICTED: 'bg-amber-100 text-amber-700',
  CONFIDENTIAL: 'bg-red-100 text-red-700',
}

const toast = useToast()

const handleExport = async (format: string) => {
  const params = new URLSearchParams({ format })
  if (kategori.value) params.append('kategori', kategori.value)
  if (search.value) params.append('search', search.value)
  window.open(`/api/export/documents?${params.toString()}`, '_blank')
  const labels: Record<string, string> = { xlsx: 'Excel', pdf: 'PDF', html: 'HTML' }
  toast.success(`Export ${labels[format] || format} sedang diproses`)
}

const downloadDocument = async (id: string, title: string, mimeType?: string) => {
  try {
    const blob = await $fetch<Blob>(`/api/documents/${id}/download`, { responseType: 'blob' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${title}.${getFileExtension(mimeType)}`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Dokumen berhasil didownload!')
  } catch {
    toast.error('Gagal download dokumen')
  }
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
        <h1 class="text-2xl font-bold text-gray-900">Arsip Dokumen</h1>
        <p class="text-sm text-gray-500 mt-0.5">Kelola dan cari dokumen sekolah</p>
      </div>
      <div class="flex items-center gap-2">
        <button v-if="isAdmin" @click="handleExport('xlsx')"
          class="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors">
          <Icon name="heroicons:table-cells" class="w-4 h-4" />
          Export Excel
        </button>
        <button v-if="isAdmin" @click="handleExport('pdf')"
          class="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors">
          <Icon name="heroicons:document-arrow-down" class="w-4 h-4" />
          Export PDF
        </button>
        <button v-if="canCreateDoc"
          @click="showUploadModal = true"
          class="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white text-sm font-semibold rounded-xl shadow-lg shadow-primary-500/30 hover:shadow-xl hover:-translate-y-0.5 transition-all"
        >
          <Icon name="heroicons:plus" class="w-4 h-4" />
          Upload Dokumen
        </button>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/60 shadow-sm p-4">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="relative">
          <Icon name="heroicons:magnifying-glass" class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            v-model="search"
            type="text"
            placeholder="Cari judul, kode, atau isi dokumen..."
            class="w-full pl-12 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white transition-all"
          />
        </div>

        <select
          v-model="kategori"
          class="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
        >
          <option v-for="opt in kategoriOptions" :key="opt.value" :value="opt.value">
            {{ opt.label }}
          </option>
        </select>

        <div class="flex items-center text-sm text-gray-500">
          <Icon name="heroicons:document-text" class="w-4 h-4 mr-1.5" />
          <span v-if="data?.pagination">
            Total: <strong class="text-gray-900">{{ data.pagination.total }}</strong> dokumen
          </span>
          <span v-else>Memuat...</span>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="pending" class="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/60 shadow-sm p-12 text-center">
      <Icon name="heroicons:arrow-path" class="w-8 h-8 mx-auto text-primary-600 animate-spin" />
      <p class="mt-3 text-sm text-gray-500">Memuat dokumen...</p>
    </div>

    <!-- Document List -->
    <div v-else-if="data?.data?.length" class="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/60 shadow-sm overflow-hidden">
      <div class="divide-y divide-gray-100">
        <div
          v-for="doc in data.data"
          :key="doc.id"
          class="group flex items-center gap-4 p-4 sm:px-6 hover:bg-gray-50/50 transition-colors"
        >
          <!-- File Icon -->
          <div class="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-blue-50">
            <Icon name="heroicons:document-text" class="w-6 h-6 text-blue-600" />
          </div>

          <!-- Info -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2">
              <NuxtLink :to="`/documents/${doc.id}`" class="font-semibold text-gray-900 text-sm truncate group-hover:text-primary-600 transition-colors">
                {{ doc.judul }}
              </NuxtLink>
            </div>
            <div class="flex items-center gap-3 mt-1 text-xs text-gray-500">
              <span class="font-mono">{{ doc.kodeDokumen }}</span>
              <span>·</span>
              <span>{{ new Date(doc.tanggalDokumen).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) }}</span>
              <span v-if="doc.deskripsi" class="hidden sm:inline">·</span>
              <span v-if="doc.deskripsi" class="hidden sm:inline truncate max-w-xs">{{ doc.deskripsi }}</span>
            </div>
          </div>

          <!-- Badges -->
          <div class="hidden sm:flex items-center gap-2">
            <span class="px-2.5 py-1 text-xs font-medium rounded-lg" :class="categoryColors[doc.kategori] || 'bg-gray-100 text-gray-700'">
              {{ getCategoryName(doc.kategori) }}
            </span>
            <span v-if="doc.subKategori" class="px-2.5 py-1 text-xs font-medium rounded-lg bg-gray-100 text-gray-600">
              {{ doc.subKategori }}
            </span>
            <span class="px-2.5 py-1 text-xs font-medium rounded-lg" :class="accessColors[doc.accessLevel] || 'bg-gray-100 text-gray-700'">
              {{ doc.accessLevel }}
            </span>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-1">
            <NuxtLink :to="`/documents/${doc.id}`" class="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
              <Icon name="heroicons:eye" class="w-5 h-5" />
            </NuxtLink>
            <button @click="downloadDocument(doc.id, doc.judul, doc.mimeType)" class="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
              <Icon name="heroicons:arrow-down-tray" class="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/60 shadow-sm p-12 text-center">
      <Icon name="heroicons:document-text" class="w-16 h-16 mx-auto text-gray-300" />
      <h3 class="mt-4 text-lg font-semibold text-gray-900">Belum ada dokumen</h3>
      <p class="mt-1 text-sm text-gray-500">Mulai upload dokumen pertama Anda.</p>
      <button v-if="canCreateDoc" @click="showUploadModal = true" class="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white text-sm font-semibold rounded-xl shadow-lg shadow-primary-500/30 hover:shadow-xl hover:-translate-y-0.5 transition-all">
        <Icon name="heroicons:cloud-arrow-up" class="w-4 h-4" />
        Upload Sekarang
      </button>
    </div>

    <!-- Pagination -->
    <div v-if="data?.pagination && data.pagination.totalPages > 1" class="flex flex-col sm:flex-row items-center justify-between gap-4">
      <div class="text-sm text-gray-500">
        Halaman <strong class="text-gray-900">{{ data.pagination.page }}</strong> dari <strong class="text-gray-900">{{ data.pagination.totalPages }}</strong>
        · Total <strong class="text-gray-900">{{ data.pagination.total }}</strong> dokumen
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

    <!-- Upload Modal -->
    <UiUploadModal v-model="showUploadModal" @uploaded="refresh()" />
  </div>
</template>
