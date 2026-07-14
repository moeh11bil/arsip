<template>
  <Transition name="modal">
    <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center p-4" tabindex="-1" @keydown.esc="$emit('update:modelValue', false)">
      <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="$emit('update:modelValue', false)" />

      <div class="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        <!-- Header -->
        <div class="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 class="text-lg font-bold text-gray-900">Upload Dokumen</h2>
          <button @click="$emit('update:modelValue', false)" class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
            <Icon name="heroicons:x-mark" class="w-5 h-5" />
          </button>
        </div>

        <!-- Body -->
        <form @submit.prevent="handleUpload" class="p-6 space-y-5">
          <!-- Dropzone -->
          <div
            class="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all"
            :class="isDragging ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'"
            @dragover.prevent="isDragging = true"
            @dragleave="isDragging = false"
            @drop.prevent="handleDrop"
            @click="fileInput?.click()"
            v-if="modelValue"
          >
            <input type="file" ref="fileInput" class="hidden" multiple accept=".pdf,.jpg,.jpeg,.png,.docx,.xlsx" @change="handleFileSelect" />

            <template v-if="!selectedFiles.length">
              <Icon name="heroicons:cloud-arrow-up" class="w-10 h-10 mx-auto text-gray-400 mb-3" />
              <p class="text-sm font-medium text-gray-700">Drag & drop file atau klik untuk memilih</p>
              <p class="text-xs text-gray-400 mt-1">PDF, JPG, PNG, DOCX, XLSX (maks 50MB total)</p>
            </template>

            <template v-else>
              <div class="space-y-2 text-left">
                <div v-for="(file, idx) in selectedFiles" :key="idx" class="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                  <div class="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon name="heroicons:document-text" class="w-4 h-4 text-primary-600" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="text-sm font-medium text-gray-900 truncate">{{ file.name }}</div>
                    <div class="text-xs text-gray-500">{{ formatSize(file.size) }}</div>
                  </div>
                  <button type="button" @click.stop="removeFile(idx)" class="p-1 text-gray-400 hover:text-red-500 rounded">
                    <Icon name="heroicons:x-mark" class="w-4 h-4" />
                  </button>
                </div>
              </div>
              <button type="button" @click.stop="fileInput?.click()" class="mt-3 text-sm font-medium text-primary-600 hover:text-primary-700">
                + Tambah file lagi
              </button>
            </template>
          </div>

          <!-- Fields -->
          <div class="grid grid-cols-2 gap-4">
            <div class="col-span-2">
              <label class="block text-sm font-semibold text-gray-900 mb-1.5">Judul *</label>
              <input v-model="form.judul" type="text" required placeholder="Judul dokumen"
                class="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all" />
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-900 mb-1.5">Kategori *</label>
              <select v-model="form.kategori" required @change="form.subKategori = ''"
                class="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all">
                <option value="">Pilih kategori</option>
                <option v-for="cat in categoryTree" :key="cat.kode" :value="cat.kategori">{{ cat.nama }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-900 mb-1.5">Sub Kategori</label>
              <select v-model="form.subKategori"
                class="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all">
                <option value="">Pilih sub kategori</option>
                <option v-for="child in filteredChildren" :key="child.id" :value="child.nama">{{ child.nama }}</option>
              </select>
            </div>
            <div class="col-span-2">
              <label class="block text-sm font-semibold text-gray-900 mb-1.5">Deskripsi</label>
              <textarea v-model="form.deskripsi" rows="2" placeholder="Deskripsi singkat"
                class="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all resize-none" />
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-900 mb-1.5">Tanggal *</label>
              <input v-model="form.tanggalDokumen" type="date" required
                class="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all" />
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center justify-end gap-3 pt-2">
            <button type="button" @click="$emit('update:modelValue', false)" class="px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-xl transition-colors">
              Batal
            </button>
            <button type="submit" :disabled="!selectedFiles.length || isUploading || !form.judul || !form.kategori"
              class="px-5 py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white text-sm font-semibold rounded-xl shadow-lg shadow-primary-500/30 hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 transition-all">
              <Icon v-if="isUploading" name="heroicons:arrow-path" class="w-4 h-4 animate-spin inline mr-1.5" />
              {{ isUploading ? 'Mengupload...' : `Upload${selectedFiles.length > 1 ? ` (${selectedFiles.length} file)` : ''}` }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { formatSize } from '~/utils/format'

const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits(['update:modelValue', 'uploaded'])

const fileInput = ref<HTMLInputElement>()
const selectedFiles = ref<File[]>([])
const isDragging = ref(false)
const isUploading = ref(false)

const toast = useToast()

const { data: catData } = await useFetch('/api/master/klasifikasi-arsip', {
  server: false,
  default: () => ({ data: [] }),
})

const categoryTree = computed(() => catData.value?.data || [])

const filteredChildren = computed(() => {
  const parent = categoryTree.value.find((c: any) => c.kategori === form.kategori)
  return parent?.children || []
})

const form = reactive({
  judul: '',
  deskripsi: '',
  kategori: '',
  subKategori: '',
  tanggalDokumen: (() => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}` })(),
})

const handleDrop = (e: DragEvent) => {
  isDragging.value = false
  const files = Array.from(e.dataTransfer?.files || [])
  if (files.length) {
    for (const file of files) {
      if (file.size > 50 * 1024 * 1024) {
        toast.warning(`File "${file.name}" melebihi batas 50MB`)
        continue
      }
      if (!selectedFiles.value.find(f => f.name === file.name && f.size === file.size)) {
        selectedFiles.value.push(file)
      }
    }
    if (!form.judul && files[0]) {
      form.judul = files[0].name.replace(/\.[^/.]+$/, '')
    }
  }
}

const handleFileSelect = (e: Event) => {
  const input = e.target as HTMLInputElement
  if (input.files?.length) {
    for (const file of Array.from(input.files)) {
      if (file.size > 50 * 1024 * 1024) {
        toast.warning(`File "${file.name}" melebihi batas 50MB`)
        continue
      }
      if (!selectedFiles.value.find(f => f.name === file.name && f.size === file.size)) {
        selectedFiles.value.push(file)
      }
    }
    if (!form.judul && input.files[0]) {
      form.judul = input.files[0].name.replace(/\.[^/.]+$/, '')
    }
  }
  input.value = ''
}

const removeFile = (idx: number) => {
  selectedFiles.value.splice(idx, 1)
}

const resetForm = () => {
  selectedFiles.value = []
  form.judul = ''
  form.deskripsi = ''
  form.kategori = ''
  form.subKategori = ''
  const d = new Date()
  form.tanggalDokumen = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}

const handleUpload = async () => {
  if (!selectedFiles.value.length) return
  if (!form.judul) {
    toast.warning('Judul wajib diisi')
    return
  }
  isUploading.value = true

  try {
    const formData = new FormData()
    for (const file of selectedFiles.value) {
      formData.append('files[]', file)
    }
    formData.append('judul', form.judul)
    formData.append('deskripsi', form.deskripsi)
    formData.append('kategori', form.kategori)
    formData.append('subKategori', form.subKategori)
    formData.append('tanggalDokumen', form.tanggalDokumen)
    formData.append('accessLevel', 'INTERNAL')

    await $fetch('/api/documents', { method: 'POST', body: formData })
    toast.success(`${selectedFiles.value.length} file berhasil diupload!`)
    resetForm()
    emit('update:modelValue', false)
    emit('uploaded')
  } catch (error: any) {
    toast.error(error?.data?.statusMessage || error?.data?.message || error?.message || 'Gagal upload dokumen')
  } finally {
    isUploading.value = false
  }
}
</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: all 0.25s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-from .relative, .modal-leave-to .relative { transform: scale(0.95) translateY(10px); }
</style>
