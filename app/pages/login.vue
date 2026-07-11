<template>
  <div class="min-h-screen bg-slate-50 flex">
    <div class="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div class="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-primary-400/20 to-purple-400/20 rounded-full blur-3xl animate-blob" />
      <div class="absolute bottom-0 -left-40 w-96 h-96 bg-gradient-to-tr from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
    </div>

    <div class="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-purple-800">
      <div class="absolute top-20 right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
      <div class="absolute bottom-20 left-10 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl" />
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full" />
      <div class="absolute inset-0 opacity-10" style="background-image: radial-gradient(circle, white 1px, transparent 1px); background-size: 30px 30px;" />

      <div class="relative z-10 flex flex-col justify-between p-12 w-full">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30">
            <Icon name="heroicons:archive-box" class="w-7 h-7 text-white" />
          </div>
          <div>
            <span class="text-2xl font-bold text-white">EduArch</span>
            <span class="ml-2 text-xs px-2 py-0.5 bg-white/20 text-white rounded-full">v2.0</span>
          </div>
        </div>

        <div class="space-y-8">
          <div>
            <h1 class="text-5xl font-bold text-white leading-tight">
              Selamat Datang
              <br />
              <span class="bg-gradient-to-r from-cyan-300 to-pink-300 bg-clip-text text-transparent">Kembali!</span>
            </h1>
            <p class="mt-4 text-lg text-primary-100 max-w-md">
              Kelola arsip sekolah Anda dengan lebih cerdas, cepat, dan aman dalam satu platform terpadu.
            </p>
          </div>

          <div class="space-y-4">
            <div v-for="feature in features" :key="feature.text"
                 class="flex items-center gap-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 hover:bg-white/15 transition-colors">
              <div class="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon :name="feature.icon" class="w-5 h-5 text-white" />
              </div>
              <div>
                <div class="text-white font-semibold">{{ feature.title }}</div>
                <div class="text-sm text-primary-100">{{ feature.text }}</div>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
          <div class="flex gap-1 mb-3">
            <Icon v-for="i in 5" :key="i" name="heroicons:star-solid" class="w-5 h-5 text-yellow-300" />
          </div>
          <p class="text-white italic mb-4">
            "EduArch mengubah cara kami mengelola arsip. Pencarian dokumen yang dulu memakan waktu berjam-jam, sekarang hanya hitungan detik!"
          </p>
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-gradient-to-br from-pink-400 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
              M
            </div>
            <div>
              <div class="text-white font-semibold text-sm">Moeh</div>
              <div class="text-xs text-primary-200">Developer</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="flex-1 flex items-center justify-center p-6 sm:p-8 lg:p-12">
      <div class="w-full max-w-md">
        <div class="lg:hidden flex items-center justify-center gap-3 mb-8">
          <div class="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/30">
            <Icon name="heroicons:archive-box" class="w-7 h-7 text-white" />
          </div>
          <span class="text-2xl font-bold bg-gradient-to-r from-primary-700 to-primary-500 bg-clip-text text-transparent">EduArch</span>
        </div>

        <div class="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-primary-500/5 border border-white/60 p-8">
          <div class="text-center mb-8">
            <h2 class="text-3xl font-bold text-gray-900">Masuk ke Akun Anda</h2>
            <p class="mt-2 text-gray-600">Silakan masuk untuk melanjutkan ke dashboard</p>
          </div>

          <Transition name="fade-slide">
            <div v-if="errorMessage" class="mb-6 flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
              <Icon name="heroicons:exclamation-circle" class="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div class="flex-1 text-sm">
                <div class="font-semibold text-red-900">Login Gagal</div>
                <div class="text-red-700">{{ errorMessage }}</div>
              </div>
              <button @click="errorMessage = ''" class="text-red-600 hover:text-red-800">
                <Icon name="heroicons:x-mark" class="w-5 h-5" />
              </button>
            </div>
          </Transition>

          <form @submit.prevent="handleLogin" class="space-y-5">
            <div>
              <label for="email" class="block text-sm font-semibold text-gray-900 mb-2">Email</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Icon name="heroicons:envelope" class="w-5 h-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  v-model="form.email"
                  type="email"
                  autocomplete="email"
                  required
                  placeholder="admin@sekolah.sch.id"
                  class="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white transition-all"
                  :class="{ 'border-red-300 focus:ring-red-500': errors.email }"
                />
              </div>
              <p v-if="errors.email" class="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                <Icon name="heroicons:exclamation-circle" class="w-4 h-4" />
                {{ errors.email }}
              </p>
            </div>

            <div>
              <div class="flex items-center justify-between mb-2">
                <label for="password" class="block text-sm font-semibold text-gray-900">Password</label>
              </div>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Icon name="heroicons:lock-closed" class="w-5 h-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  v-model="form.password"
                  :type="showPassword ? 'text' : 'password'"
                  autocomplete="current-password"
                  required
                  placeholder="Masukkan password"
                  class="w-full pl-12 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white transition-all"
                  :class="{ 'border-red-300 focus:ring-red-500': errors.password }"
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                >
                  <Icon :name="showPassword ? 'heroicons:eye-slash' : 'heroicons:eye'" class="w-5 h-5" />
                </button>
              </div>
              <p v-if="errors.password" class="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                <Icon name="heroicons:exclamation-circle" class="w-4 h-4" />
                {{ errors.password }}
              </p>
            </div>

            <button
              type="submit"
              :disabled="isLoading"
              class="group relative w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-xl shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 transition-all"
            >
              <template v-if="isLoading">
                <Icon name="heroicons:arrow-path" class="w-5 h-5 animate-spin" />
                <span>Memproses...</span>
              </template>
              <template v-else>
                <span>Masuk</span>
                <Icon name="heroicons:arrow-right" class="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </template>
            </button>
          </form>
        </div>

        <div class="mt-4 text-center">
          <NuxtLink to="/" class="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
            <Icon name="heroicons:arrow-left" class="w-4 h-4" />
            <span>Kembali ke beranda</span>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false, middleware: 'guest' })

useHead({ title: 'Masuk - EduArch' })

const form = reactive({ email: '', password: '' })
const errors = reactive({ email: '', password: '' })
const errorMessage = ref('')
const showPassword = ref(false)
const isLoading = ref(false)

const toast = useToast()

const features = [
  { title: 'Akses Cepat', text: 'Login aman dengan enkripsi end-to-end', icon: 'heroicons:bolt' },
  { title: 'Multi-Device', text: 'Akses dari mana saja, kapan saja', icon: 'heroicons:device-phone-mobile' },
  { title: 'Data Aman', text: 'Sesuai standar UU PDP & ANRI', icon: 'heroicons:shield-check' },
]

const validate = () => {
  errors.email = ''
  errors.password = ''
  let isValid = true

  if (!form.email) {
    errors.email = 'Email wajib diisi'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Format email tidak valid'
    isValid = false
  }

  if (!form.password) {
    errors.password = 'Password wajib diisi'
    isValid = false
  } else if (form.password.length < 6) {
    errors.password = 'Password minimal 6 karakter'
    isValid = false
  }

  return isValid
}

const handleLogin = async () => {
  errorMessage.value = ''
  if (!validate()) return

  isLoading.value = true

  try {
    const response = await $fetch<{ token: string; user: any }>('/api/auth/login', {
      method: 'POST',
      body: { email: form.email, password: form.password },
    })

    const token = useCookie('auth_token', { maxAge: 86400, sameSite: 'lax', path: '/' })
    token.value = response.token

    toast.success('Login berhasil! Selamat datang.')
    await navigateTo('/dashboard')
  } catch (error: any) {
    errorMessage.value = error?.data?.message || 'Email atau password salah.'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
@keyframes blob {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
}
.animate-blob { animation: blob 7s infinite; }
.animation-delay-2000 { animation-delay: 2s; }
.fade-slide-enter-active, .fade-slide-leave-active { transition: all 0.3s ease; }
.fade-slide-enter-from, .fade-slide-leave-to { opacity: 0; transform: translateY(-10px); }
</style>
