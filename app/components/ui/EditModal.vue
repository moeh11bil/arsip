<template>
  <Transition name="modal">
    <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="$emit('update:modelValue', false)" />

      <div class="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 class="text-lg font-bold text-gray-900">Edit Dokumen</h2>
          <button @click="$emit('update:modelValue', false)" class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
            <Icon name="heroicons:x-mark" class="w-5 h-5" />
          </button>
        </div>

        <form @submit.prevent="handleUpdate" class="p-6 space-y-5">
          <div class="grid grid-cols-2 gap-4">
            <div class="col-span-2">
              <label class="block text-sm font-semibold text-gray-900 mb-1.5">Judul *</label>
              <input v-model="form.judul" type="text" required
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
            <div>
              <label class="block text-sm font-semibold text-gray-900 mb-1.5">Status</label>
              <select v-model="form.status"
                class="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all">
                <option value="DRAFT">Draft</option>
                <option value="ACTIVE">Active</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-900 mb-1.5">Tanggal *</label>
              <input v-model="form.tanggalDokumen" type="date" required
                class="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all" />
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-900 mb-1.5">Level Akses</label>
              <select v-model="form.accessLevel"
                class="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all">
                <option value="PUBLIC">Public</option>
                <option value="INTERNAL">Internal</option>
                <option value="RESTRICTED">Restricted</option>
                <option value="CONFIDENTIAL">Confidential</option>
              </select>
            </div>
            <div class="col-span-2">
              <label class="block text-sm font-semibold text-gray-900 mb-1.5">Deskripsi</label>
              <textarea v-model="form.deskripsi" rows="3"
                class="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all resize-none" />
            </div>
          </div>

          <div class="flex items-center justify-end gap-3 pt-2">
            <button type="button" @click="$emit('update:modelValue', false)"
              class="px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-xl transition-colors">
              Batal
            </button>
            <button type="submit" :disabled="isSaving"
              class="px-5 py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white text-sm font-semibold rounded-xl shadow-lg shadow-primary-500/30 hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 transition-all">
              <Icon v-if="isSaving" name="heroicons:arrow-path" class="w-4 h-4 animate-spin inline mr-1.5" />
              {{ isSaving ? 'Menyimpan...' : 'Simpan Perubahan' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
const props = defineProps<{ modelValue: boolean; document: any }>()
const emit = defineEmits(['update:modelValue', 'updated'])

const toast = useToast()
const isSaving = ref(false)

const { data: catData } = await useFetch('/api/master/klasifikasi-arsip', {
  server: false,
  default: () => ({ data: [] }),
})

const categoryTree = computed(() => catData.value?.data || [])

const filteredChildren = computed(() => {
  const parent = categoryTree.value.find(c => c.kategori === form.kategori)
  return parent?.children || []
})

const form = reactive({
  judul: '',
  deskripsi: '',
  kategori: '',
  subKategori: '',
  status: 'ACTIVE',
  tanggalDokumen: '',
  accessLevel: 'INTERNAL',
})

watch(() => props.modelValue, (val) => {
  if (val && props.document) {
    form.judul = props.document.judul || ''
    form.deskripsi = props.document.deskripsi || ''
    form.kategori = props.document.kategori || ''
    form.subKategori = props.document.subKategori || ''
    form.status = props.document.status || 'ACTIVE'
    form.tanggalDokumen = props.document.tanggalDokumen ? new Date(props.document.tanggalDokumen).toISOString().split('T')[0] : ''
    form.accessLevel = props.document.accessLevel || 'INTERNAL'
  }
})

const handleUpdate = async () => {
  if (!props.document?.id) return
  isSaving.value = true
  try {
    await $fetch(`/api/documents/${props.document.id}`, {
      method: 'PUT',
      body: form,
    })
    toast.success('Dokumen berhasil diperbarui!')
    emit('update:modelValue', false)
    emit('updated')
  } catch (error: any) {
    toast.error(error?.data?.message || 'Gagal memperbarui dokumen')
  } finally {
    isSaving.value = false
  }
}
</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: all 0.25s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-from .relative, .modal-leave-to .relative { transform: scale(0.95) translateY(10px); }
</style>
