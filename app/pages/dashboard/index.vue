<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})

useHead({ title: 'Dashboard - EduArch' })

const { user, fetchUser, canCreateDoc } = useAuth()
await fetchUser()

const { data: userData } = await useFetch('/api/auth/me', {
  server: false,
  default: () => ({ data: null }),
})

const userName = computed(() => userData.value?.data?.namaLengkap || 'User')

const { data: docsData } = await useFetch('/api/documents?limit=5&sortBy=createdAt&sortOrder=desc', {
  server: false,
  default: () => ({ data: [], pagination: { total: 0 } }),
})

const { data: suratMasukData } = await useFetch('/api/surat?type=MASUK&limit=1', {
  server: false,
  default: () => ({ pagination: { total: 0 } }),
})

const { data: suratKeluarData } = await useFetch('/api/surat?type=KELUAR&limit=1', {
  server: false,
  default: () => ({ pagination: { total: 0 } }),
})

const { data: usersData } = await useFetch('/api/users?limit=1', {
  server: false,
  default: () => ({ pagination: { total: 0 } }),
})

const stats = computed(() => [
  { label: 'Total Dokumen', value: docsData.value?.pagination?.total || 0, icon: 'heroicons:document-text', bg: 'bg-gradient-to-br from-blue-400 to-blue-600' },
  { label: 'Surat Masuk', value: suratMasukData.value?.pagination?.total || 0, icon: 'heroicons:envelope', bg: 'bg-gradient-to-br from-emerald-400 to-emerald-600' },
  { label: 'Surat Keluar', value: suratKeluarData.value?.pagination?.total || 0, icon: 'heroicons:paper-airplane', bg: 'bg-gradient-to-br from-purple-400 to-purple-600' },
  { label: 'Pengguna', value: usersData.value?.pagination?.total || 0, icon: 'heroicons:user-group', bg: 'bg-gradient-to-br from-amber-400 to-orange-600' },
])

const categoryConfig: Record<string, { icon: string; bg: string; color: string; badge: string }> = {
  AKADEMIK: { icon: 'heroicons:academic-cap', bg: 'bg-blue-50', color: 'text-blue-600', badge: 'bg-blue-100 text-blue-700' },
  KESISWAAN: { icon: 'heroicons:user-group', bg: 'bg-purple-50', color: 'text-purple-600', badge: 'bg-purple-100 text-purple-700' },
  KEPEGAWAIAN: { icon: 'heroicons:briefcase', bg: 'bg-emerald-50', color: 'text-emerald-600', badge: 'bg-emerald-100 text-emerald-700' },
  ADMINISTRATIF: { icon: 'heroicons:clipboard-document-list', bg: 'bg-amber-50', color: 'text-amber-600', badge: 'bg-amber-100 text-amber-700' },
  KEUANGAN: { icon: 'heroicons:currency-dollar', bg: 'bg-rose-50', color: 'text-rose-600', badge: 'bg-rose-100 text-rose-700' },
  LEGALITAS: { icon: 'heroicons:shield-check', bg: 'bg-cyan-50', color: 'text-cyan-600', badge: 'bg-cyan-100 text-cyan-700' },
  MEDIA: { icon: 'heroicons:photo', bg: 'bg-pink-50', color: 'text-pink-600', badge: 'bg-pink-100 text-pink-700' },
  LAINNYA: { icon: 'heroicons:folder', bg: 'bg-gray-50', color: 'text-gray-600', badge: 'bg-gray-100 text-gray-700' },
}

const categoryNames: Record<string, string> = {
  AKADEMIK: 'Akademik',
  KESISWAAN: 'Kesiswaan',
  KEPEGAWAIAN: 'Kepegawaian',
  ADMINISTRATIF: 'Administratif',
  KEUANGAN: 'Keuangan',
  LEGALITAS: 'Legalitas',
  MEDIA: 'Media',
  LAINNYA: 'Lainnya',
}

function relativeTime(dateStr: string) {
  const now = Date.now()
  const diff = now - new Date(dateStr).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return 'Baru saja'
  if (minutes < 60) return `${minutes} menit lalu`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} jam lalu`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days} hari lalu`
  return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
}

const recentDocs = computed(() => {
  return (docsData.value?.data || []).map((doc: any) => {
    const cfg = categoryConfig[doc.kategori] || categoryConfig.LAINNYA
    return {
      id: doc.id,
      title: doc.judul,
      time: relativeTime(doc.createdAt),
      icon: cfg.icon,
      bg: cfg.bg,
      color: cfg.color,
      badge: cfg.badge,
      category: categoryNames[doc.kategori] || doc.kategori,
    }
  })
})

const allQuickActions = [
  { label: 'Upload Dokumen', icon: 'heroicons:cloud-arrow-up', bg: 'bg-gradient-to-br from-blue-500 to-blue-700', to: '/documents', requireCreate: true },
  { label: 'Surat Masuk', icon: 'heroicons:envelope', bg: 'bg-gradient-to-br from-emerald-500 to-emerald-700', to: '/surat/masuk' },
  { label: 'Surat Keluar', icon: 'heroicons:paper-airplane', bg: 'bg-gradient-to-br from-purple-500 to-purple-700', to: '/surat/keluar' },
  { label: 'Cari Dokumen', icon: 'heroicons:magnifying-glass', bg: 'bg-gradient-to-br from-pink-500 to-pink-700', to: '/documents' },
]

const quickActions = computed(() =>
  allQuickActions.filter(a => !a.requireCreate || canCreateDoc.value)
)
</script>

<template>
  <div class="space-y-8">
    <!-- Hero -->
    <div class="relative bg-gradient-to-br from-primary-600 via-primary-700 to-purple-800 rounded-3xl p-8 md:p-10 overflow-hidden shadow-xl shadow-primary-500/20">
      <div class="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
      <div class="absolute bottom-0 left-1/3 w-64 h-64 bg-purple-400/20 rounded-full blur-3xl" />

      <div class="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div class="text-white">
          <h1 class="text-3xl md:text-4xl font-bold mb-2">
            Selamat Datang, <span class="bg-gradient-to-r from-cyan-300 to-pink-300 bg-clip-text text-transparent">{{ userName }}</span>
          </h1>
          <p class="text-primary-100 text-lg">Kelola arsip sekolah dengan mudah dan efisien.</p>
        </div>
        <div class="flex gap-3">
          <NuxtLink to="/documents" class="inline-flex items-center gap-2 px-5 py-3 bg-white text-primary-700 font-semibold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">
            <Icon name="heroicons:cloud-arrow-up" class="w-5 h-5" />
            <span>Upload Dokumen</span>
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div v-for="stat in stats" :key="stat.label"
           class="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all">
        <div class="w-12 h-12 rounded-xl flex items-center justify-center mb-4" :class="stat.bg">
          <Icon :name="stat.icon" class="w-6 h-6 text-white" />
        </div>
        <div class="text-3xl font-bold text-gray-900 mb-1">{{ typeof stat.value === 'number' ? stat.value.toLocaleString('id-ID') : stat.value }}</div>
        <div class="text-sm text-gray-600">{{ stat.label }}</div>
      </div>
    </div>

    <!-- Recent & Quick Actions -->
    <div class="grid lg:grid-cols-3 gap-6">
      <!-- Recent Documents -->
      <div class="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div class="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 class="text-lg font-bold text-gray-900">Dokumen Terbaru</h2>
          <NuxtLink to="/documents" class="text-sm font-semibold text-primary-600 hover:text-primary-700">Lihat Semua</NuxtLink>
        </div>
        <div v-if="recentDocs.length" class="divide-y divide-gray-100">
          <NuxtLink v-for="doc in recentDocs" :key="doc.id" :to="`/documents/${doc.id}`"
               class="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors">
            <div class="w-12 h-12 rounded-xl flex items-center justify-center" :class="doc.bg">
              <Icon :name="doc.icon" class="w-6 h-6" :class="doc.color" />
            </div>
            <div class="flex-1 min-w-0">
              <div class="font-semibold text-gray-900 truncate text-sm">{{ doc.title }}</div>
              <div class="text-xs text-gray-500 mt-0.5">{{ doc.time }}</div>
            </div>
            <span class="px-2.5 py-1 text-xs font-medium rounded-lg" :class="doc.badge">{{ doc.category }}</span>
          </NuxtLink>
        </div>
        <div v-else class="p-8 text-center">
          <Icon name="heroicons:document-text" class="w-10 h-10 mx-auto text-gray-300" />
          <p class="mt-2 text-sm text-gray-500">Belum ada dokumen</p>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 class="text-lg font-bold text-gray-900 mb-4">Aksi Cepat</h2>
        <div class="space-y-3">
          <NuxtLink v-for="action in quickActions" :key="action.label" :to="action.to"
                    class="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
            <div class="w-10 h-10 rounded-lg flex items-center justify-center" :class="action.bg">
              <Icon :name="action.icon" class="w-5 h-5 text-white" />
            </div>
            <span class="text-sm font-medium text-gray-700">{{ action.label }}</span>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
