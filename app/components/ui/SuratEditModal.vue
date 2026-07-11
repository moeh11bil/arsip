<template>
  <Transition name="modal">
    <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center p-4" tabindex="-1" @keydown.esc="$emit('update:modelValue', false)">
      <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="$emit('update:modelValue', false)" />

      <div class="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 class="text-lg font-bold text-gray-900">Edit Surat</h2>
          <button @click="$emit('update:modelValue', false)" class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
            <Icon name="heroicons:x-mark" class="w-5 h-5" />
          </button>
        </div>

        <form @submit.prevent="handleUpdate" class="p-6 space-y-5">
          <div v-if="surat.type === 'MASUK'" class="space-y-3">
            <label class="block text-sm font-semibold text-gray-900 mb-1.5">Pengirim *</label>
            <input v-model="form.pengirim" type="text" required
              class="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all" />
          </div>

          <div v-if="surat.type === 'KELUAR'" class="space-y-3">
            <label class="block text-sm font-semibold text-gray-900 mb-1.5">Tujuan *</label>
            <input v-model="form.tujuan" type="text" required
              class="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all" />
          </div>

          <div class="space-y-3">
            <label class="block text-sm font-semibold text-gray-900 mb-1.5">Nomor Surat *</label>
            <input v-model="form.nomorSurat" type="text" required
              class="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all" />
          </div>

          <div class="space-y-3">
            <label class="block text-sm font-semibold text-gray-900 mb-1.5">Tanggal Surat *</label>
            <input v-model="form.tanggalSurat" type="date" required
              class="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all" />
          </div>

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

          <div class="space-y-3">
            <label class="block text-sm font-semibold text-gray-900 mb-1.5">Prioritas *</label>
            <select v-model="form.priority" required
              class="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all">
              <option value="BIASA">Biasa</option>
              <option value="SEGERA">Segera</option>
              <option value="SANGAT_SEGERA">Sangat Segera</option>
            </select>
          </div>

          <div class="space-y-3">
            <label class="block text-sm font-semibold text-gray-900 mb-1.5">Perihal *</label>
            <input v-model="form.perihal" type="text" required
              class="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all" />
          </div>

          <div class="space-y-3">
            <label class="block text-sm font-semibold text-gray-900 mb-1.5">Catatan</label>
            <textarea v-model="form.catatan" rows="3"
              class="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all resize-none" />
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
const props = defineProps<{ modelValue: boolean; surat: any }>()
const emit = defineEmits(['update:modelValue', 'updated'])

const toast = useToast()
const isSaving = ref(false)

const form = reactive({
  pengirim: '',
  nomorSurat: '',
  tanggalSurat: '',
  tujuan: '',
  sifat: '',
  priority: 'BIASA',
  perihal: '',
  catatan: '',
})

watch(() => props.modelValue, (val) => {
  if (val && props.surat) {
    form.pengirim = props.surat.pengirim || ''
    form.nomorSurat = props.surat.nomorSurat || ''
    if (props.surat.tanggalSurat) {
      const d = new Date(props.surat.tanggalSurat)
      form.tanggalSurat = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
    } else {
      form.tanggalSurat = ''
    }
    form.tujuan = props.surat.tujuan || ''
    form.sifat = props.surat.sifat || ''
    form.priority = props.surat.priority || 'BIASA'
    form.perihal = props.surat.perihal || ''
    form.catatan = props.surat.catatan || ''
  }
})

const handleUpdate = async () => {
  if (!props.surat?.id) return
  isSaving.value = true
  try {
    await $fetch(`/api/surat/${props.surat.id}`, {
      method: 'PUT',
      body: form,
    })
    toast.success('Surat berhasil diperbarui!')
    emit('update:modelValue', false)
    emit('updated')
  } catch (error: any) {
    toast.error(error?.data?.message || 'Gagal memperbarui surat')
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
