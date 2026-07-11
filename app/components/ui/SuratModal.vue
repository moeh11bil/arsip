<template>
  <Transition name="modal">
    <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center p-4" tabindex="-1" @keydown.esc="$emit('update:modelValue', false)">
      <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="$emit('update:modelValue', false)" />

      <div class="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        <!-- Header -->
        <div class="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 class="text-lg font-bold text-gray-900">
            {{ type === 'MASUK' ? 'Buat Surat Masuk' : 'Buat Surat Keluar' }}
          </h2>
          <button @click="$emit('update:modelValue', false)" class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
            <Icon name="heroicons:x-mark" class="w-5 h-5" />
          </button>
        </div>

        <!-- Body -->
        <form @submit.prevent="handleSubmit" class="p-6 space-y-5">
          <!-- Pengirim (Surat Masuk) / Tujuan (Surat Keluar) -->
          <div v-if="type === 'MASUK'" class="space-y-3">
            <label class="block text-sm font-semibold text-gray-900 mb-1.5">Pengirim *</label>
            <input v-model="form.pengirim" type="text" required placeholder="Nama pengirim surat"
              class="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all" />
          </div>
          <div v-if="type === 'KELUAR'" class="space-y-3">
            <label class="block text-sm font-semibold text-gray-900 mb-1.5">Tujuan *</label>
            <input v-model="form.tujuan" type="text" required placeholder="Nama tujuan surat"
              class="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all" />
          </div>

          <!-- Nomor Surat -->
          <div class="space-y-3">
            <label class="block text-sm font-semibold text-gray-900 mb-1.5">Nomor Surat *</label>
            <input v-model="form.nomorSurat" type="text" required placeholder="Contoh: 001/SK/2026"
              class="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all" />
          </div>

          <!-- Tanggal Surat -->
          <div class="space-y-3">
            <label class="block text-sm font-semibold text-gray-900 mb-1.5">Tanggal Surat *</label>
            <input v-model="form.tanggalSurat" type="date" required
              class="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all" />
          </div>

          <!-- Sifat -->
          <div class="space-y-3">
            <label class="block text-sm font-semibold text-gray-900 mb-1.5">Sifat</label>
            <select v-model="form.sifat"
              class="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all">
              <option value="">Pilih sifat</option>
              <option value="BIASA">Biasa</option>
              <option value="PENTING">Penting</option>
              <option value="RAHASIA">Rahasia</option>
            </select>
          </div>

          <!-- Prioritas -->
          <div class="space-y-3">
            <label class="block text-sm font-semibold text-gray-900 mb-1.5">Prioritas *</label>
            <select v-model="form.priority" required
              class="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all">
              <option value="BIASA">Biasa</option>
              <option value="SEGERA">Segera</option>
              <option value="SANGAT_SEGERA">Sangat Segera</option>
            </select>
          </div>

          <!-- Perihal -->
          <div class="space-y-3">
            <label class="block text-sm font-semibold text-gray-900 mb-1.5">Perihal *</label>
            <input v-model="form.perihal" type="text" required placeholder="Perihal surat"
              class="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all" />
          </div>

          <!-- Catatan -->
          <div class="space-y-3">
            <label class="block text-sm font-semibold text-gray-900 mb-1.5">Catatan</label>
            <textarea v-model="form.catatan" rows="3" placeholder="Catatan tambahan (opsional)"
              class="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all resize-none" />
          </div>

          <!-- File Upload -->
          <div class="space-y-3">
            <label class="block text-sm font-semibold text-gray-900 mb-1.5">Upload File Scan Surat *</label>
            <div
              class="border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all"
              :class="isDragging ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'"
              @dragover.prevent="isDragging = true"
              @dragleave="isDragging = false"
              @drop.prevent="handleDrop"
              @click="fileInput?.click()"
            >
              <input type="file" ref="fileInput" class="hidden" accept=".pdf,.jpg,.jpeg,.png" @change="handleFileSelect" />

              <template v-if="!selectedFile">
                <Icon name="heroicons:cloud-arrow-up" class="w-8 h-8 mx-auto text-gray-400 mb-2" />
                <p class="text-sm font-medium text-gray-700">Klik atau drag file scan surat</p>
                <p class="text-xs text-gray-400 mt-1">PDF, JPG, PNG (maks 50MB)</p>
              </template>

              <template v-else>
                <div class="flex items-center gap-3 text-left">
                  <div class="w-9 h-9 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon name="heroicons:document-text" class="w-4 h-4 text-primary-600" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="text-sm font-medium text-gray-900 truncate">{{ selectedFile.name }}</div>
                    <div class="text-xs text-gray-500">{{ formatSize(selectedFile.size) }}</div>
                  </div>
                  <button type="button" @click.stop="selectedFile = null" class="p-1 text-gray-400 hover:text-red-500 rounded">
                    <Icon name="heroicons:x-mark" class="w-4 h-4" />
                  </button>
                </div>
              </template>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center justify-end gap-3 pt-2">
            <button type="button" @click="$emit('update:modelValue', false)" class="px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-xl transition-colors">
              Batal
            </button>
            <button type="submit" :disabled="isSubmitting"
              class="px-5 py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white text-sm font-semibold rounded-xl shadow-lg shadow-primary-500/30 hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 transition-all">
              <Icon v-if="isSubmitting" name="heroicons:arrow-path" class="w-4 h-4 animate-spin inline mr-1.5" />
              {{ isSubmitting ? 'Membuat...' : 'Buat Surat' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { formatSize } from '~/utils/format'

const props = defineProps<{
  modelValue: boolean
  type: 'MASUK' | 'KELUAR'
}>()
const emit = defineEmits(['update:modelValue', 'created'])

const toast = useToast()
const isSubmitting = ref(false)
const isDragging = ref(false)
const selectedFile = ref<File | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)

const form = reactive({
  pengirim: '',
  nomorSurat: '',
  tanggalSurat: (() => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}` })(),
  tujuan: '',
  sifat: '',
  priority: 'BIASA',
  perihal: '',
  catatan: '',
})

const handleFileSelect = (e: Event) => {
  const input = e.target as HTMLInputElement
  if (input.files?.length) {
    const file = input.files[0]
    if (file.size > 50 * 1024 * 1024) {
      toast.warning('Ukuran file melebihi batas 50MB')
      return
    }
    selectedFile.value = file
  }
}

const handleDrop = (e: DragEvent) => {
  isDragging.value = false
  if (e.dataTransfer?.files.length) {
    const file = e.dataTransfer.files[0]
    if (file.size > 50 * 1024 * 1024) {
      toast.warning('Ukuran file melebihi batas 50MB')
      return
    }
    selectedFile.value = file
  }
}

watch(() => props.modelValue, (val) => {
  if (!val) {
    form.pengirim = ''
    form.nomorSurat = ''
    form.tanggalSurat = (() => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}` })()
    form.tujuan = ''
    form.sifat = ''
    form.priority = 'BIASA'
    form.perihal = ''
    form.catatan = ''
    selectedFile.value = null
  }
})

const handleSubmit = async () => {
  if (props.type === 'MASUK' && !form.pengirim) {
    toast.warning('Pengirim wajib diisi untuk surat masuk')
    return
  }
  if (props.type === 'KELUAR' && !form.tujuan) {
    toast.warning('Tujuan wajib diisi untuk surat keluar')
    return
  }
  if (!form.nomorSurat || !form.tanggalSurat || !form.perihal) {
    toast.warning('Nomor surat, tanggal, dan perihal wajib diisi')
    return
  }

  if (!selectedFile.value) {
    toast.warning('File scan surat wajib diupload')
    return
  }

  isSubmitting.value = true

  try {
    const formData = new FormData()
    formData.append('file', selectedFile.value)
    formData.append('type', props.type)
    formData.append('pengirim', form.pengirim || '')
    formData.append('nomorSurat', form.nomorSurat)
    formData.append('tanggalSurat', form.tanggalSurat)
    formData.append('tujuan', form.tujuan || '')
    formData.append('sifat', form.sifat || '')
    formData.append('priority', form.priority)
    formData.append('perihal', form.perihal)
    formData.append('catatan', form.catatan || '')

    await $fetch('/api/surat', { method: 'POST', body: formData })
    toast.success('Surat berhasil dibuat!')
    emit('created')
    emit('update:modelValue', false)
  } catch (error: any) {
    toast.error(error?.data?.message || 'Gagal membuat surat')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: all 0.25s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-from .relative, .modal-leave-to .relative { transform: scale(0.95) translateY(10px); }
</style>
