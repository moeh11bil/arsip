<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center gap-4">
      <NuxtLink to="/documents" class="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
        <Icon name="heroicons:arrow-left" class="w-5 h-5" />
      </NuxtLink>
      <div class="flex-1">
        <h1 class="text-2xl font-bold text-gray-900">{{ doc?.judul || 'Memuat...' }}</h1>
        <p class="text-sm text-gray-500 mt-0.5">{{ doc?.kodeDokumen }}</p>
      </div>
      <div v-if="doc" class="flex items-center gap-2">
        <button v-if="isAdmin || doc.createdBy?.id === user?.id" @click="showEditModal = true" class="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors">
          <Icon name="heroicons:pencil-square" class="w-4 h-4" />
          Edit
        </button>
        <button v-if="isAdmin || doc.createdBy?.id === user?.id" @click="showDeleteConfirm = true" class="inline-flex items-center gap-2 px-4 py-2 bg-white border border-red-200 text-red-600 text-sm font-semibold rounded-xl hover:bg-red-50 transition-colors">
          <Icon name="heroicons:trash" class="w-4 h-4" />
          Hapus
        </button>
        <button @click="handleDownload" class="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white text-sm font-semibold rounded-xl shadow-lg shadow-primary-500/30 hover:shadow-xl hover:-translate-y-0.5 transition-all">
          <Icon name="heroicons:arrow-down-tray" class="w-4 h-4" />
          Download
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="pending" class="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/60 shadow-sm p-12 text-center">
      <Icon name="heroicons:arrow-path" class="w-8 h-8 mx-auto text-primary-600 animate-spin" />
      <p class="mt-3 text-sm text-gray-500">Memuat dokumen...</p>
    </div>

    <template v-else-if="doc">
      <div class="grid lg:grid-cols-3 gap-6">
        <!-- Main Info -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Document Card -->
          <div class="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/60 shadow-sm p-6">
            <h2 class="text-lg font-bold text-gray-900 mb-4">Informasi Dokumen</h2>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <div class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Judul</div>
                <div class="text-sm text-gray-900">{{ doc.judul }}</div>
              </div>
              <div>
                <div class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Kode</div>
                <div class="text-sm text-gray-900 font-mono">{{ doc.kodeDokumen }}</div>
              </div>
              <div>
                <div class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Kategori</div>
                <div class="flex flex-wrap items-center gap-1.5">
                  <span class="inline-flex px-2.5 py-1 text-xs font-medium rounded-lg" :class="categoryColors[doc.kategori] || 'bg-gray-100 text-gray-700'">
                    {{ getCategoryName(doc.kategori) }}
                  </span>
                  <span v-if="doc.subKategori" class="inline-flex px-2.5 py-1 text-xs font-medium rounded-lg bg-gray-100 text-gray-600">
                    {{ doc.subKategori }}
                  </span>
                </div>
              </div>
              <div>
                <div class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Status</div>
                <span class="inline-flex px-2.5 py-1 text-xs font-medium rounded-lg" :class="statusColors[doc.status] || 'bg-gray-100 text-gray-700'">
                  {{ doc.status }}
                </span>
              </div>
              <div>
                <div class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Tanggal Dokumen</div>
                <div class="text-sm text-gray-900">{{ new Date(doc.tanggalDokumen).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) }}</div>
              </div>
              <div>
                <div class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Level Akses</div>
                <span class="inline-flex px-2.5 py-1 text-xs font-medium rounded-lg" :class="accessColors[doc.accessLevel] || 'bg-gray-100 text-gray-700'">
                  {{ doc.accessLevel }}
                </span>
              </div>
              <div v-if="doc.deskripsi" class="col-span-2">
                <div class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Deskripsi</div>
                <div class="text-sm text-gray-700">{{ doc.deskripsi }}</div>
              </div>
            </div>
          </div>

          <!-- File Preview -->
          <div class="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/60 shadow-sm overflow-hidden">
            <div class="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 class="text-lg font-bold text-gray-900">Preview</h2>
              <a :href="`/api/documents/${doc.id}/preview`" target="_blank" class="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1">
                Buka di tab baru
                <Icon name="heroicons:arrow-top-right-on-square" class="w-4 h-4" />
              </a>
            </div>
            <div class="p-4">
              <iframe
                v-if="doc.mimeType === 'application/pdf'"
                :src="`/api/documents/${doc.id}/preview`"
                sandbox="allow-same-origin"
                class="w-full h-[600px] rounded-xl border border-gray-200"
              />
              <img
                v-else-if="doc.mimeType?.startsWith('image/')"
                :src="`/api/documents/${doc.id}/preview`"
                :alt="doc.judul"
                class="max-w-full mx-auto rounded-xl border border-gray-200"
              />
              <div v-else class="flex flex-col items-center justify-center py-12 text-center">
                <div class="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" :class="fileTypeStyle.bg">
                  <Icon :name="fileTypeStyle.icon" class="w-8 h-8" :class="fileTypeStyle.iconColor" />
                </div>
                <p class="text-sm font-medium text-gray-900 mb-1">{{ fileTypeStyle.label }}</p>
                <p class="text-xs text-gray-500 mb-4">Preview tidak tersedia untuk tipe file ini</p>
                <button @click="handleDownload" class="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white text-sm font-semibold rounded-xl hover:bg-primary-700 transition-colors">
                  <Icon name="heroicons:arrow-down-tray" class="w-4 h-4" />
                  Download untuk melihat
                </button>
              </div>
            </div>
          </div>

          <!-- OCR Text -->
          <div v-if="doc.ocrText" class="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/60 shadow-sm p-6">
            <h2 class="text-lg font-bold text-gray-900 mb-4">Teks OCR</h2>
            <p class="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{{ doc.ocrText }}</p>
          </div>
        </div>

        <!-- Sidebar Info -->
        <div class="space-y-6">
          <!-- File Info -->
          <div class="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/60 shadow-sm p-6">
            <h3 class="text-sm font-bold text-gray-900 mb-4">File ({{ doc.uploads?.length || 1 }})</h3>
            <div v-if="doc.uploads?.length" class="space-y-2">
              <div v-for="upload in doc.uploads" :key="upload.id" class="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                <div class="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon name="heroicons:document-text" class="w-4 h-4 text-primary-600" />
                </div>
                <div class="flex-1 min-w-0">
                  <div class="text-sm font-medium text-gray-900 truncate">{{ upload.fileName }}</div>
                  <div class="text-xs text-gray-500">{{ formatSize(upload.fileSize) }}</div>
                </div>
                <a :href="`/api/documents/${doc.id}/download?uploadId=${upload.id}`" class="p-1.5 text-gray-400 hover:text-primary-600 rounded-lg transition-colors">
                  <Icon name="heroicons:arrow-down-tray" class="w-4 h-4" />
                </a>
              </div>
            </div>
            <div v-else class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-500">Ukuran</span>
                <span class="text-sm font-medium text-gray-900">{{ formatSize(doc.fileSize) }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-500">Tipe</span>
                <span class="text-sm font-medium text-gray-900">{{ doc.mimeType }}</span>
              </div>
            </div>
            <div class="mt-3 pt-3 border-t border-gray-100 space-y-2">
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-500">Dilihat</span>
                <span class="text-sm font-medium text-gray-900">{{ doc.viewCount }} kali</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-500">Didownload</span>
                <span class="text-sm font-medium text-gray-900">{{ doc.downloadCount }} kali</span>
              </div>
            </div>
          </div>

          <!-- Version History -->
          <div class="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/60 shadow-sm p-6">
            <h3 class="text-sm font-bold text-gray-900 mb-4">Riwayat Versi</h3>
            <div v-if="doc.versions?.length" class="space-y-2">
              <div v-for="v in doc.versions" :key="v.id" class="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50">
                <div class="w-7 h-7 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon name="heroicons:clock" class="w-3.5 h-3.5 text-gray-500" />
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-1.5">
                    <span class="text-xs font-semibold text-gray-900">v{{ v.version }}</span>
                    <span class="text-[10px] text-gray-500">{{ new Date(v.createdAt).toLocaleDateString('id-ID') }}</span>
                  </div>
                  <div class="text-[11px] text-gray-500 truncate">{{ v.changeNote || v.fileName }}</div>
                </div>
                <button @click="handleRestoreVersion(v)" class="p-1 text-gray-400 hover:text-primary-600 rounded transition-colors" title="Kembalikan ke versi ini">
                  <Icon name="heroicons:arrow-uturn-left" class="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <p v-else class="text-xs text-gray-500">Belum ada riwayat versi</p>
          </div>

          <!-- Retention -->
          <div class="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/60 shadow-sm p-6">
            <h3 class="text-sm font-bold text-gray-900 mb-4">Retensi</h3>
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-500">Masa Retensi</span>
                <span class="text-sm font-medium text-gray-900">{{ doc.masaRetensiThn }} tahun</span>
              </div>
              <div v-if="doc.expiredAt" class="flex items-center justify-between">
                <span class="text-sm text-gray-500">Berlaku Hingga</span>
                <span class="text-sm font-medium text-gray-900">{{ new Date(doc.expiredAt).toLocaleDateString('id-ID') }}</span>
              </div>
            </div>
          </div>

          <!-- Tags -->
          <div v-if="doc.tags?.length" class="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/60 shadow-sm p-6">
            <h3 class="text-sm font-bold text-gray-900 mb-4">Tag</h3>
            <div class="flex flex-wrap gap-2">
              <span v-for="tag in doc.tags" :key="tag.id" class="px-2.5 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-lg">
                {{ tag.tag }}
              </span>
            </div>
          </div>

          <!-- Metadata -->
          <div class="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/60 shadow-sm p-6">
            <h3 class="text-sm font-bold text-gray-900 mb-4">Metadata</h3>
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-500">Dibuat Oleh</span>
                <span class="text-sm font-medium text-gray-900">{{ doc.createdBy?.namaLengkap }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-500">Dibuat Pada</span>
                <span class="text-sm font-medium text-gray-900">{{ new Date(doc.createdAt).toLocaleDateString('id-ID') }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-500">Terakhir Diubah</span>
                <span class="text-sm font-medium text-gray-900">{{ new Date(doc.updatedAt).toLocaleDateString('id-ID') }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <div v-else-if="!pending" class="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/60 shadow-sm p-12 text-center text-gray-500">
      Dokumen tidak ditemukan
    </div>
  </div>

  <!-- Edit Modal -->
  <UiEditModal v-model="showEditModal" :document="doc" @updated="refreshDoc()" />

  <!-- Delete Confirm -->
  <UiConfirmModal v-model="showDeleteConfirm" title="Hapus Dokumen?" message="Dokumen akan dihapus secara permanen. Tindakan ini tidak dapat dibatalkan." confirm-text="Hapus" @confirm="handleDelete" />
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})

import { formatSize, categoryColors, getFileExtension } from '~/utils/format'

const { user, fetchUser, isAdmin } = useAuth()
await fetchUser()

const route = useRoute()
const toast = useToast()

const showEditModal = ref(false)
const showDeleteConfirm = ref(false)

const { data: doc, pending, refresh: refreshDoc } = await useAsyncData(`doc-${route.params.id}`, () =>
  $fetch<{ data: any }>(`/api/documents/${route.params.id}`).then(r => r.data)
)

useHead({ title: computed(() => doc.value ? `${doc.value.judul} - EduArch` : 'Dokumen - EduArch') })

const { data: catData } = await useFetch('/api/master/klasifikasi-arsip', {
  server: false,
  default: () => ({ data: [] }),
})

const categoryTree = computed(() => catData.value?.data || [])

const getCategoryName = (kode: string) => {
  const cat = categoryTree.value.find((c: any) => c.kategori === kode)
  return cat?.nama || kode
}

const statusColors: Record<string, string> = {
  ACTIVE: 'bg-green-100 text-green-700',
  ARCHIVED: 'bg-blue-100 text-blue-700',
  PENDING: 'bg-amber-100 text-amber-700',
  INACTIVE: 'bg-red-100 text-red-700',
}

const accessColors: Record<string, string> = {
  PUBLIC: 'bg-green-100 text-green-700',
  INTERNAL: 'bg-blue-100 text-blue-700',
  RESTRICTED: 'bg-amber-100 text-amber-700',
  CONFIDENTIAL: 'bg-red-100 text-red-700',
}

const fileTypeStyle = computed(() => {
  const mime = doc.value?.mimeType || ''
  if (mime.includes('word') || mime.includes('document')) {
    return { bg: 'bg-blue-100', icon: 'heroicons:document-text', iconColor: 'text-blue-600', label: 'Microsoft Word' }
  }
  if (mime.includes('sheet') || mime.includes('excel')) {
    return { bg: 'bg-green-100', icon: 'heroicons:table-cells', iconColor: 'text-green-600', label: 'Microsoft Excel' }
  }
  if (mime.includes('presentation') || mime.includes('powerpoint')) {
    return { bg: 'bg-orange-100', icon: 'heroicons:presentation-chart-bar', iconColor: 'text-orange-600', label: 'Microsoft PowerPoint' }
  }
  return { bg: 'bg-gray-100', icon: 'heroicons:document', iconColor: 'text-gray-600', label: 'Dokumen' }
})

const handleDownload = async () => {
  if (!doc.value) return
  try {
    const blob = await $fetch<Blob>(`/api/documents/${doc.value.id}/download`, { responseType: 'blob' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${doc.value.judul}.${getFileExtension(doc.value.mimeType)}`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Dokumen berhasil didownload!')
  } catch {
    toast.error('Gagal download dokumen')
  }
}

const handleDelete = async () => {
  if (!doc.value) return
  try {
    await $fetch(`/api/documents/${doc.value.id}`, { method: 'DELETE' })
    toast.success('Dokumen berhasil dihapus!')
    await navigateTo('/documents')
  } catch {
    toast.error('Gagal menghapus dokumen')
  }
}

const handleRestoreVersion = async (version: any) => {
  try {
    await $fetch(`/api/documents/${doc.value.id}/versions/${version.id}/restore`, { method: 'POST' })
    toast.success(`Dokumen dikembalikan ke versi ${version.version}`)
    refreshDoc()
  } catch {
    toast.error('Gagal mengembalikan versi')
  }
}
</script>
