<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})

useHead({ title: 'Pengaturan - EduArch' })

const toast = useToast()

const { data: userData, refresh } = await useFetch('/api/auth/me', {
  server: false,
  default: () => ({ data: null }),
})

const form = reactive({
  namaLengkap: '',
  email: '',
})

let formInitialized = false
watch(userData, (val) => {
  if (val?.data && !formInitialized) {
    form.namaLengkap = val.data.namaLengkap || ''
    form.email = val.data.email || ''
    formInitialized = true
  }
}, { immediate: true })

const saving = ref(false)

const saveProfile = async () => {
  saving.value = true
  try {
    await $fetch('/api/auth/profile', { method: 'PUT', body: form })
    toast.success('Profil berhasil diperbarui')
    refresh()
  } catch {
    toast.error('Gagal memperbarui profil')
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="max-w-2xl mx-auto space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-gray-900">Pengaturan</h1>
      <p class="text-sm text-gray-500 mt-0.5">Kelola profil dan preferensi akun</p>
    </div>

    <div class="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/60 shadow-sm p-6 space-y-5">
      <h2 class="text-lg font-semibold text-gray-900">Profil</h2>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1.5">Nama Lengkap</label>
        <input v-model="form.namaLengkap" type="text"
          class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white transition-all" />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
        <input v-model="form.email" type="email"
          class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white transition-all" />
      </div>

      <div class="flex justify-end pt-2">
        <button @click="saveProfile" :disabled="saving"
          class="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white text-sm font-semibold rounded-xl shadow-lg shadow-primary-500/30 hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
          <Icon name="heroicons:check" class="w-4 h-4" />
          {{ saving ? 'Menyimpan...' : 'Simpan' }}
        </button>
      </div>
    </div>

    <div class="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/60 shadow-sm p-6 space-y-4">
      <h2 class="text-lg font-semibold text-gray-900">Akun</h2>
      <div class="text-sm text-gray-500 space-y-1">
        <p>Role: <span class="font-medium text-gray-900">{{ userData?.data?.role }}</span></p>
      </div>
    </div>
  </div>
</template>
