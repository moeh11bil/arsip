<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})

import { formatSize, categoryColors, getFileExtension } from '~/utils/format'

const { user, fetchUser, isAdmin, canManage } = useAuth()
await fetchUser()

const router = useRouter()
const route = useRoute()
const toast = useToast()
const { getById, createDisposisi, updateDisposisi } = useSurat()

const { data, pending, refresh } = await useAsyncData(
  `surat-${route.params.id}`,
  () => getById(route.params.id as string),
)

const surat = computed(() => (data.value as any)?.data)
const doc = computed(() => surat.value?.document)

const showEditModal = ref(false)
const showDeleteConfirm = ref(false)

// Disposisi form
const showDisposisiForm = ref(false)
const disposisiUser = ref('')
const disposisiInstruksi = ref('')
const disposisiCatatan = ref('')
const submittingDisposisi = ref(false)

const { data: usersData } = await useFetch('/api/users?limit=100', {
  server: false,
  default: () => ({ data: [] }),
})

const userOptions = computed(() => {
  const users = (usersData.value as any)?.data || []
  return users.filter((u: any) => u.id !== surat.value?.createdById)
})

const handleCreateDisposisi = async () => {
  if (!disposisiUser.value || !disposisiInstruksi.value) {
    toast.warning('Pilih user tujuan dan tulis instruksi')
    return
  }
  submittingDisposisi.value = true
  try {
    await createDisposisi(route.params.id as string, {
      toUserId: disposisiUser.value,
      instruksi: disposisiInstruksi.value,
      catatanRespon: disposisiCatatan.value || undefined,
    })
    toast.success('Disposisi berhasil dikirim')
    showDisposisiForm.value = false
    disposisiUser.value = ''
    disposisiInstruksi.value = ''
    disposisiCatatan.value = ''
    refresh()
  } catch (e: any) {
    toast.error(e?.data?.message || 'Gagal membuat disposisi')
  } finally {
    submittingDisposisi.value = false
  }
}

const handleUpdateDisposisiStatus = async (disposisiId: string, status: string) => {
  try {
    await updateDisposisi(route.params.id as string, disposisiId, {
      status: status as any,
      respondedAt: new Date().toISOString(),
    })
    toast.success('Status disposisi diperbarui')
    refresh()
  } catch {
    toast.error('Gagal memperbarui status')
  }
}

useHead({ title: computed(() => surat.value ? `${surat.value.nomorSurat} - EduArch` : 'Surat - EduArch') })

const typeColors: Record<string, string> = {
  MASUK: 'bg-blue-100 text-blue-700',
  KELUAR: 'bg-purple-100 text-purple-700',
}

const priorityColors: Record<string, string> = {
  BIASA: 'bg-gray-100 text-gray-700',
  SEGERA: 'bg-orange-100 text-orange-700',
  SANGAT_SEGERA: 'bg-red-100 text-red-700',
}

const accessColors: Record<string, string> = {
  PUBLIC: 'bg-green-100 text-green-700',
  INTERNAL: 'bg-blue-100 text-blue-700',
  RESTRICTED: 'bg-amber-100 text-amber-700',
  CONFIDENTIAL: 'bg-red-100 text-red-700',
}

const disposisiStatusColors: Record<string, string> = {
  PENDING: 'bg-amber-100 text-amber-700',
  IN_PROGRESS: 'bg-blue-100 text-blue-700',
  COMPLETED: 'bg-emerald-100 text-emerald-700',
  REJECTED: 'bg-red-100 text-red-700',
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
  if (!surat.value?.documentId) return
  try {
    const blob = await $fetch<Blob>(`/api/documents/${surat.value.documentId}/download`, { responseType: 'blob' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    const docData = surat.value.document
    a.download = `${surat.value.nomorSurat}.${getFileExtension(docData?.mimeType)}`
    a.click()
    URL.revokeObjectURL(url)
  } catch {
    toast.error('Gagal download dokumen')
  }
}

const handleDelete = async () => {
  try {
    const type = surat.value?.type === 'KELUAR' ? 'keluar' : 'masuk'
    await $fetch(`/api/surat/${route.params.id}`, { method: 'DELETE' })
    toast.success('Surat berhasil dihapus!')
    await router.push(`/surat/${type}`)
  } catch {
    toast.error('Gagal menghapus surat')
  }
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center gap-4">
      <NuxtLink :to="surat?.type === 'KELUAR' ? '/surat/keluar' : '/surat/masuk'" class="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
        <Icon name="heroicons:arrow-left" class="w-5 h-5" />
      </NuxtLink>
      <div class="flex-1">
        <h1 class="text-2xl font-bold text-gray-900">{{ surat?.nomorSurat || 'Memuat...' }}</h1>
        <p class="text-sm text-gray-500 mt-0.5">{{ surat?.perihal }}</p>
      </div>
      <template v-if="surat">
        <div class="flex items-center gap-2">
          <button v-if="isAdmin || surat.createdById === user?.id" @click="showEditModal = true" class="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors">
            <Icon name="heroicons:pencil-square" class="w-4 h-4" />
            Edit
          </button>
          <button v-if="isAdmin || surat.createdById === user?.id" @click="showDeleteConfirm = true" class="inline-flex items-center gap-2 px-4 py-2 bg-white border border-red-200 text-red-600 text-sm font-semibold rounded-xl hover:bg-red-50 transition-colors">
            <Icon name="heroicons:trash" class="w-4 h-4" />
            Hapus
          </button>
          <a :href="`/api/documents/${surat.documentId}/download`"
             class="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white text-sm font-semibold rounded-xl shadow-lg shadow-primary-500/30 hover:shadow-xl hover:-translate-y-0.5 transition-all">
            <Icon name="heroicons:arrow-down-tray" class="w-4 h-4" />
            Download
          </a>
        </div>
      </template>
    </div>

    <div v-if="pending" class="bg-white rounded-2xl border border-gray-200 shadow-sm p-12 text-center">
      <Icon name="heroicons:arrow-path" class="w-8 h-8 mx-auto text-primary-600 animate-spin" />
      <p class="mt-3 text-sm text-gray-500">Memuat surat...</p>
    </div>

    <template v-else-if="surat">
      <div class="grid lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 space-y-6">
          <!-- Surat Info -->
          <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <h2 class="text-lg font-bold text-gray-900 mb-4">Informasi Surat</h2>
            <div class="flex items-center gap-3 mb-4">
              <span class="px-3 py-1 text-sm font-medium rounded-lg" :class="typeColors[surat.type]">
                {{ surat.type === 'MASUK' ? 'Surat Masuk' : 'Surat Keluar' }}
              </span>
              <span class="px-3 py-1 text-sm font-medium rounded-lg" :class="priorityColors[surat.priority]">
                {{ surat.priority }}
              </span>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <div class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Nomor Surat</div>
                <div class="text-sm text-gray-900 font-medium">{{ surat.nomorSurat }}</div>
              </div>
              <div>
                <div class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Nomor Agenda</div>
                <div class="text-sm text-gray-900">{{ surat.nomorAgenda }}</div>
              </div>
              <div>
                <div class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Perihal</div>
                <div class="text-sm text-gray-900">{{ surat.perihal }}</div>
              </div>
              <div>
                <div class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Tanggal Surat</div>
                <div class="text-sm text-gray-900">{{ new Date(surat.tanggalSurat).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) }}</div>
              </div>
              <div v-if="surat.pengirim">
                <div class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Pengirim</div>
                <div class="text-sm text-gray-900">{{ surat.pengirim }}</div>
              </div>
              <div v-if="surat.tujuan">
                <div class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Tujuan</div>
                <div class="text-sm text-gray-900">{{ surat.tujuan }}</div>
              </div>
              <div v-if="surat.tanggalTerima">
                <div class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Tanggal Terima</div>
                <div class="text-sm text-gray-900">{{ new Date(surat.tanggalTerima).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) }}</div>
              </div>
              <div v-if="surat.sifat">
                <div class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Sifat</div>
                <div class="text-sm text-gray-900">{{ surat.sifat }}</div>
              </div>
              <div v-if="surat.catatan" class="col-span-2">
                <div class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Catatan</div>
                <div class="text-sm text-gray-700">{{ surat.catatan }}</div>
              </div>
            </div>
          </div>

          <!-- Document Info -->
          <div v-if="doc" class="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <h2 class="text-lg font-bold text-gray-900 mb-4">Informasi Dokumen</h2>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <div class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Kode Dokumen</div>
                <div class="text-sm text-gray-900 font-mono">{{ doc.kodeDokumen }}</div>
              </div>
              <div>
                <div class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Kategori</div>
                <span class="inline-flex px-2.5 py-1 text-xs font-medium rounded-lg" :class="categoryColors[doc.kategori] || 'bg-gray-100 text-gray-700'">
                  {{ doc.kategori }}
                </span>
              </div>
              <div>
                <div class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Status</div>
                <span class="inline-flex px-2.5 py-1 text-xs font-medium rounded-lg bg-green-100 text-green-700">
                  {{ doc.status }}
                </span>
              </div>
              <div>
                <div class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Level Akses</div>
                <span class="inline-flex px-2.5 py-1 text-xs font-medium rounded-lg" :class="accessColors[doc.accessLevel] || 'bg-gray-100 text-gray-700'">
                  {{ doc.accessLevel }}
                </span>
              </div>
            </div>
          </div>

          <!-- File Preview -->
          <div v-if="doc" class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
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
                :alt="surat.nomorSurat"
                class="max-w-full mx-auto rounded-xl border border-gray-200"
              />
              <div v-else class="flex flex-col items-center justify-center py-12 text-center">
                <div class="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" :class="fileTypeStyle.bg">
                  <Icon :name="fileTypeStyle.icon" class="w-8 h-8" :class="fileTypeStyle.iconColor" />
                </div>
                <p class="text-sm font-medium text-gray-900 mb-1">{{ fileTypeStyle.label }}</p>
                <p class="text-xs text-gray-500 mb-4">Preview tidak tersedia untuk tipe file ini</p>
                <a :href="`/api/documents/${doc.id}/download`"
                   class="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white text-sm font-semibold rounded-xl hover:bg-primary-700 transition-colors">
                  <Icon name="heroicons:arrow-down-tray" class="w-4 h-4" />
                  Download untuk melihat
                </a>
              </div>
            </div>
          </div>

          <!-- OCR Text -->
          <div v-if="doc?.ocrText" class="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <h2 class="text-lg font-bold text-gray-900 mb-4">Teks OCR</h2>
            <p class="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{{ doc.ocrText }}</p>
          </div>

          <!-- Disposisi -->
          <div class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 class="text-lg font-semibold text-gray-900">Disposisi</h2>
              <button v-if="canManage" @click="showDisposisiForm = !showDisposisiForm"
                class="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                <Icon name="heroicons:plus" class="w-4 h-4" />
                Buat Disposisi
              </button>
            </div>
            <div class="p-6">
              <!-- Create Disposisi Form -->
              <div v-if="showDisposisiForm" class="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <h3 class="text-sm font-semibold text-gray-900 mb-3">Disposisi Baru</h3>
                <div class="space-y-3">
                  <div>
                    <label class="block text-xs font-medium text-gray-600 mb-1">Tujuan *</label>
                    <select v-model="disposisiUser" required
                      class="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                      <option value="">Pilih user tujuan</option>
                      <option v-for="u in userOptions" :key="u.id" :value="u.id">
                        {{ u.namaLengkap }} ({{ u.role }})
                      </option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-600 mb-1">Instruksi *</label>
                    <textarea v-model="disposisiInstruksi" rows="3" placeholder="Tulis instruksi disposisi..."
                      class="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"></textarea>
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-600 mb-1">Catatan (opsional)</label>
                    <textarea v-model="disposisiCatatan" rows="2" placeholder="Catatan tambahan..."
                      class="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"></textarea>
                  </div>
                  <div class="flex items-center gap-2 pt-1">
                    <button @click="handleCreateDisposisi" :disabled="submittingDisposisi"
                      class="px-4 py-2 bg-primary-600 text-white text-sm font-semibold rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors">
                      <Icon v-if="submittingDisposisi" name="heroicons:arrow-path" class="w-4 h-4 animate-spin inline mr-1" />
                      {{ submittingDisposisi ? 'Mengirim...' : 'Kirim Disposisi' }}
                    </button>
                    <button @click="showDisposisiForm = false" class="px-4 py-2 text-sm text-gray-600 hover:bg-gray-200 rounded-lg transition-colors">
                      Batal
                    </button>
                  </div>
                </div>
              </div>

              <!-- Disposisi List -->
              <div v-if="surat.disposisi && surat.disposisi.length > 0" class="space-y-3">
                <div v-for="d in surat.disposisi" :key="d.id" class="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                  <div class="flex-1">
                    <div class="flex items-center justify-between">
                      <p class="text-sm font-medium text-gray-900">{{ d.instruksi }}</p>
                      <div class="flex items-center gap-1">
                        <span class="px-2 py-0.5 text-xs font-medium rounded-lg" :class="disposisiStatusColors[d.status]">
                          {{ d.status }}
                        </span>
                        <div v-if="d.status === 'PENDING' && (isAdmin || d.toUserId === user?.id)" class="relative" :ref="'status-' + d.id">
                          <button @click="handleUpdateDisposisiStatus(d.id, 'IN_PROGRESS')"
                            class="p-1 text-gray-400 hover:text-blue-600 rounded transition-colors" title="Tandai Diproses">
                            <Icon name="heroicons:play" class="w-4 h-4" />
                          </button>
                          <button @click="handleUpdateDisposisiStatus(d.id, 'COMPLETED')"
                            class="p-1 text-gray-400 hover:text-green-600 rounded transition-colors" title="Tandai Selesai">
                            <Icon name="heroicons:check" class="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <p class="text-xs text-gray-500 mt-1">Tujuan: {{ d.toUser?.namaLengkap || d.toUserId }}</p>
                    <p v-if="d.catatanRespon" class="text-xs text-gray-600 mt-1 italic">{{ d.catatanRespon }}</p>
                  </div>
                </div>
              </div>
              <p v-else class="text-sm text-gray-500">Belum ada disposisi</p>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <div v-if="doc" class="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <h3 class="text-sm font-bold text-gray-900 mb-4">File</h3>
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-500">Ukuran</span>
                <span class="text-sm font-medium text-gray-900">{{ formatSize(doc.fileSize) }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-500">Tipe</span>
                <span class="text-sm font-medium text-gray-900">{{ doc.mimeType }}</span>
              </div>
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

          <div v-if="doc" class="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
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

          <div v-if="doc?.tags?.length" class="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <h3 class="text-sm font-bold text-gray-900 mb-4">Tag</h3>
            <div class="flex flex-wrap gap-2">
              <span v-for="tag in doc.tags" :key="tag.id" class="px-2.5 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-lg">
                {{ tag.tag }}
              </span>
            </div>
          </div>

          <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <h3 class="text-sm font-bold text-gray-900 mb-4">Metadata</h3>
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-500">Dibuat Oleh</span>
                <span class="text-sm font-medium text-gray-900">{{ doc?.createdBy?.namaLengkap || '-' }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-500">Dibuat Pada</span>
                <span class="text-sm font-medium text-gray-900">{{ new Date(surat.createdAt).toLocaleDateString('id-ID') }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-500">Terakhir Diubah</span>
                <span class="text-sm font-medium text-gray-900">{{ new Date(surat.updatedAt).toLocaleDateString('id-ID') }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <div v-else class="bg-white rounded-2xl border border-gray-200 shadow-sm p-12 text-center text-gray-500">
      Surat tidak ditemukan
    </div>

    <UiSuratEditModal v-model="showEditModal" :surat="surat" @updated="refresh()" />
    <UiConfirmModal v-model="showDeleteConfirm"
      title="Hapus Surat?"
      message="Surat akan dihapus secara permanen. Tindakan ini tidak dapat dibatalkan."
      confirm-text="Hapus"
      @confirm="handleDelete" />
  </div>
</template>
