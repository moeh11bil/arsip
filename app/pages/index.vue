<template>
  <div class="min-h-screen bg-slate-50 overflow-hidden">
    <!-- Decorative Background Blobs -->
    <div class="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div class="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-primary-400/20 to-purple-400/20 rounded-full blur-3xl animate-blob" />
      <div class="absolute top-1/2 -left-40 w-96 h-96 bg-gradient-to-tr from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
      <div class="absolute bottom-0 right-1/3 w-96 h-96 bg-gradient-to-tl from-pink-400/10 to-amber-400/10 rounded-full blur-3xl animate-blob animation-delay-4000" />
    </div>

    <!-- Navbar -->
    <header class="sticky top-0 z-50 backdrop-blur-xl bg-white/70 border-b border-white/20 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center gap-3">
            <div class="relative">
              <div class="absolute inset-0 bg-primary-600 blur-lg opacity-40" />
              <div class="relative w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30">
                <Icon name="heroicons:archive-box" class="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <span class="text-xl font-bold bg-gradient-to-r from-primary-700 to-primary-500 bg-clip-text text-transparent">EduArch</span>
              <span class="hidden sm:inline ml-2 text-xs px-2 py-0.5 bg-primary-100 text-primary-700 rounded-full font-medium">v2.0</span>
            </div>
          </div>

          <nav class="hidden md:flex items-center gap-1">
            <a href="#features" class="px-4 py-2 text-sm text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all">Fitur</a>
            <a href="#how-it-works" class="px-4 py-2 text-sm text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all">Cara Kerja</a>
            <a href="#categories" class="px-4 py-2 text-sm text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all">Kategori</a>
          </nav>

          <div class="flex items-center gap-3">
            <NuxtLink to="/login" class="hidden sm:inline-flex text-sm font-medium text-gray-700 hover:text-primary-600 transition">
              Masuk
            </NuxtLink>
            <a href="#features" class="group relative inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white text-sm font-semibold rounded-xl shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 hover:-translate-y-0.5 transition-all">
              <span>Lihat Fitur</span>
              <Icon name="heroicons:arrow-right" class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </div>
    </header>

    <!-- Hero Section -->
    <section class="relative">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 lg:pt-24 lg:pb-32">
        <div class="grid lg:grid-cols-2 gap-12 items-center">
          <!-- Left Content -->
          <div class="space-y-8">


            <h1 class="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight">
              <span class="text-gray-900">Arsip Sekolah</span>
              <br />
              <span class="relative inline-block">
                <span class="bg-gradient-to-r from-primary-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Lebih Cerdas
                </span>
                <svg class="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
                  <path d="M2 10C50 4 150 2 298 6" stroke="url(#hero-grad)" stroke-width="3" stroke-linecap="round" />
                  <defs>
                    <linearGradient id="hero-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stop-color="#2563eb" />
                      <stop offset="100%" stop-color="#ec4899" />
                    </linearGradient>
                  </defs>
                </svg>
              </span>
            </h1>

            <p class="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-xl">
              Digitalisasi, kelola, dan temukan dokumen sekolah dalam hitungan detik. 
              Dilengkapi <span class="font-semibold text-gray-900">OCR otomatis</span> dan 
              <span class="font-semibold text-gray-900">pencarian full-text</span>.
            </p>

            <div class="flex flex-col sm:flex-row gap-4">
              <NuxtLink to="/dashboard" class="group relative inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-2xl shadow-xl shadow-primary-500/30 hover:shadow-2xl hover:shadow-primary-500/40 hover:-translate-y-1 transition-all">
                <Icon name="heroicons:rocket-launch" class="w-5 h-5" />
                <span>Mulai Kelola Arsip</span>
                <Icon name="heroicons:arrow-right" class="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </NuxtLink>
              <NuxtLink to="/login" class="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/80 backdrop-blur-sm border-2 border-gray-200 text-gray-900 font-semibold rounded-2xl hover:border-primary-300 hover:bg-white transition-all">
                <div class="w-8 h-8 bg-gradient-to-br from-primary-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                  <Icon name="heroicons:arrow-right-on-rectangle" class="w-4 h-4 text-white ml-0.5" />
                </div>
                <span>Masuk</span>
              </NuxtLink>
            </div>


          </div>

          <!-- Right Visual - Mockup Preview -->
          <div class="relative lg:pl-8">
            <!-- Main Card -->
            <div class="relative bg-white rounded-3xl shadow-2xl shadow-primary-500/10 border border-white/60 overflow-hidden">
              <!-- Window Header -->
              <div class="flex items-center gap-2 px-6 py-4 bg-gradient-to-r from-slate-50 to-white border-b border-gray-100">
                <div class="flex gap-1.5">
                  <div class="w-3 h-3 rounded-full bg-red-400" />
                  <div class="w-3 h-3 rounded-full bg-yellow-400" />
                  <div class="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div class="flex-1 mx-4">
                  <div class="mx-auto max-w-md h-7 bg-gray-100 rounded-lg flex items-center px-3">
                    <Icon name="heroicons:lock-closed" class="w-3 h-3 text-gray-400 mr-2" />
                    <span class="text-xs text-gray-500">arsip.sekolah.sch.id</span>
                  </div>
                </div>
              </div>

              <!-- App Preview -->
              <div class="p-6 space-y-4">
                <!-- Search Bar -->
                <div class="relative">
                  <Icon name="heroicons:magnifying-glass" class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <div class="w-full h-12 bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl pl-12 pr-4 flex items-center">
                    <span class="text-sm text-gray-400">Cari "Rapor Kelas XII IPA"... </span>
                    <div class="ml-auto flex items-center gap-2">
                      <kbd class="px-2 py-1 text-xs bg-gray-100 border border-gray-200 rounded">⌘</kbd>
                      <kbd class="px-2 py-1 text-xs bg-gray-100 border border-gray-200 rounded">K</kbd>
                    </div>
                  </div>
                </div>

                <!-- Document Cards -->
                <div class="space-y-3">
                  <div v-for="(doc, idx) in mockDocs" :key="idx" 
                       class="group flex items-center gap-4 p-4 bg-gradient-to-r from-white to-gray-50 border border-gray-100 rounded-xl hover:border-primary-200 hover:shadow-md transition-all cursor-pointer">
                    <div class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" :class="doc.bg">
                      <Icon :name="doc.icon" class="w-5 h-5" :class="doc.color" />
                    </div>
                    <div class="flex-1 min-w-0">
                      <div class="font-medium text-gray-900 text-sm truncate">{{ doc.title }}</div>
                      <div class="text-xs text-gray-500 mt-0.5">{{ doc.meta }}</div>
                    </div>
                    <div class="flex items-center gap-2">
                      <span class="px-2 py-1 text-xs font-medium rounded-md" :class="doc.badge">{{ doc.badgeText }}</span>
                      <Icon name="heroicons:chevron-right" class="w-4 h-4 text-gray-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Floating Cards -->
            <div class="absolute -top-6 -right-6 bg-white rounded-2xl shadow-xl p-4 border border-white/60 animate-float">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl flex items-center justify-center">
                  <Icon name="heroicons:check-circle" class="w-6 h-6 text-white" />
                </div>
                <div>
                  <div class="text-xs text-gray-500">OCR Selesai</div>
                  <div class="text-sm font-semibold text-gray-900">23 Dokumen</div>
                </div>
              </div>
            </div>

            <div class="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-4 border border-white/60 animate-float animation-delay-2000">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-600 rounded-xl flex items-center justify-center">
                  <Icon name="heroicons:bolt" class="w-6 h-6 text-white" />
                </div>
                <div>
                  <div class="text-xs text-gray-500">Kecepatan</div>
                  <div class="text-sm font-semibold text-gray-900">0.8 detik</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>



    <!-- Features Section -->
    <section id="features" class="py-24">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center max-w-3xl mx-auto mb-16">
          <h2 class="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            <span class="bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">Fitur</span>
          </h2>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="(feature, idx) in features" :key="feature.title" 
               class="group relative bg-white rounded-2xl p-8 border border-gray-100 hover:border-transparent hover:shadow-2xl hover:shadow-primary-500/10 hover:-translate-y-2 transition-all duration-300 overflow-hidden">
            <!-- Gradient Background on Hover -->
            <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" :class="feature.gradient" />
            
            <div class="relative">
              <div class="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-lg transition-transform group-hover:scale-110 group-hover:rotate-3" :class="feature.bg">
                <Icon :name="feature.icon" class="w-7 h-7" :class="feature.iconColor" />
              </div>
      <h3 class="text-xl font-bold text-gray-900 mb-3">{{ feature.title }}</h3>
               <p class="text-gray-600 leading-relaxed">{{ feature.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works -->
    <section id="how-it-works" class="py-24 bg-gradient-to-b from-white to-slate-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center max-w-3xl mx-auto mb-16">
          <h2 class="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Cara <span class="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Penggunaan</span>
          </h2>
        </div>

        <div class="grid md:grid-cols-3 gap-8 relative">
          <!-- Connecting Line -->
          <div class="hidden md:block absolute top-16 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-primary-300 via-purple-300 to-pink-300" />
          
          <div v-for="(step, idx) in steps" :key="idx" class="relative">
            <div class="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <!-- Step Number -->
              <div class="relative mb-6">
                <div class="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center text-2xl font-bold text-white shadow-xl" :class="step.bg">
                  {{ idx + 1 }}
                </div>
              </div>
              
              <h3 class="text-xl font-bold text-gray-900 text-center mb-3">{{ step.title }}</h3>
              <p class="text-gray-600 text-center">{{ step.desc }}</p>
              
              <div class="mt-6 flex justify-center">
                <div class="w-12 h-12 rounded-xl flex items-center justify-center" :class="step.iconBg">
                  <Icon :name="step.icon" class="w-6 h-6" :class="step.iconColor" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Categories Section -->
    <section id="categories" class="py-24">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center max-w-3xl mx-auto mb-16">
          <h2 class="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            <span class="bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">Kategori Arsip</span>
          </h2>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div v-for="cat in categories" :key="cat.name" 
               class="group relative bg-white rounded-2xl p-6 border border-gray-100 hover:border-primary-200 hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer overflow-hidden">
            <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity" :class="cat.gradient" />
            
            <div class="relative">
              <div class="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110" :class="cat.bg">
                <Icon :name="cat.icon" class="w-6 h-6" :class="cat.color" />
              </div>
              <h3 class="font-semibold text-gray-900 mb-1">{{ cat.name }}</h3>
              <p class="text-xs text-gray-500">{{ cat.count }} dokumen</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-24">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="relative bg-gradient-to-br from-primary-600 via-primary-700 to-purple-800 rounded-3xl p-12 md:p-16 overflow-hidden shadow-2xl">
          <div class="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div class="absolute bottom-0 left-0 w-64 h-64 bg-purple-400/20 rounded-full blur-3xl" />
          <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full" />
          
          <div class="relative text-center text-white">
            <h2 class="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Kelola Arsip Sekolah Lebih Mudah
            </h2>
            
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
              <NuxtLink to="/login" class="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-primary-700 font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all">
                <Icon name="heroicons:rocket-launch" class="w-5 h-5" />
                <span>Masuk</span>
                <Icon name="heroicons:arrow-right" class="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-slate-900 text-slate-400">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="flex flex-col md:flex-row justify-between items-center gap-4">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center">
              <Icon name="heroicons:archive-box" class="w-5 h-5 text-white" />
            </div>
            <span class="text-lg font-bold text-white">EduArch</span>
          </div>
          <p class="text-sm">
            &copy; {{ new Date().getFullYear() }} EduArch
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false, middleware: 'guest' })

useHead({
  title: 'EduArch - Sistem Arsip Digital Sekolah',
  meta: [
    { name: 'description', content: 'Digitalisasi, kelola, dan temukan dokumen sekolah dalam hitungan detik. Dilengkapi OCR otomatis dan pencarian full-text.' },
    { property: 'og:title', content: 'EduArch - Sistem Arsip Digital Sekolah' },
    { property: 'og:description', content: 'Sistem arsip digital untuk sekolah dengan OCR otomatis dan pencarian full-text.' },
    { property: 'og:type', content: 'website' },
  ],
})

const mockDocs = [
  {
    title: 'Rapor Kelas XII IPA - Semester 1',
    meta: 'Diupload 2 jam lalu • 2.3 MB',
    icon: 'heroicons:document-text',
    bg: 'bg-blue-50',
    color: 'text-blue-600',
    badge: 'bg-blue-100 text-blue-700',
    badgeText: 'Akademik',
  },
  {
    title: 'SK Pengangkatan Guru Tetap 2026',
    meta: 'Diupload kemarin • 1.8 MB',
    icon: 'heroicons:briefcase',
    bg: 'bg-purple-50',
    color: 'text-purple-600',
    badge: 'bg-purple-100 text-purple-700',
    badgeText: 'Kepegawaian',
  },
  {
    title: 'Laporan BOS Triwulan II',
    meta: 'Diupload 3 hari lalu • 4.1 MB',
    icon: 'heroicons:currency-dollar',
    bg: 'bg-emerald-50',
    color: 'text-emerald-600',
    badge: 'bg-emerald-100 text-emerald-700',
    badgeText: 'Keuangan',
  },
]

const features = [
  {
    title: 'Upload & OCR',
    desc: 'Upload dokumen dengan drag-and-drop. Teks otomatis diekstrak dengan OCR. Mendukung PDF, gambar, dan dokumen Office.',
    icon: 'heroicons:cloud-arrow-up',
    bg: 'bg-gradient-to-br from-blue-400 to-blue-600',
    iconColor: 'text-white',
    gradient: 'bg-gradient-to-br from-blue-50 to-cyan-50',
  },
  {
    title: 'Pencarian Full-Text',
    desc: 'Temukan dokumen berdasarkan isi, metadata, atau tag. Mendukung full-text search dengan ranking relevansi.',
    icon: 'heroicons:magnifying-glass',
    bg: 'bg-gradient-to-br from-emerald-400 to-emerald-600',
    iconColor: 'text-white',
    gradient: 'bg-gradient-to-br from-emerald-50 to-teal-50',
  },
  {
    title: 'Kontrol Akses',
    desc: 'Atur akses dokumen berdasarkan peran pengguna. Dilengkapi audit trail untuk setiap aktivitas.',
    icon: 'heroicons:shield-check',
    bg: 'bg-gradient-to-br from-amber-400 to-orange-600',
    iconColor: 'text-white',
    gradient: 'bg-gradient-to-br from-amber-50 to-orange-50',
  },
  {
    title: 'Disposisi Digital',
    desc: 'Kelola surat masuk/keluar dengan workflow disposisi digital. Notifikasi real-time dan tracking status.',
    icon: 'heroicons:paper-airplane',
    bg: 'bg-gradient-to-br from-purple-400 to-purple-600',
    iconColor: 'text-white',
    gradient: 'bg-gradient-to-br from-purple-50 to-pink-50',
  },
  {
    title: 'Retensi Otomatis',
    desc: 'Atur masa retensi per kategori. Sistem otomatis memberi notifikasi dan mengelola pemusnahan arsip.',
    icon: 'heroicons:clock',
    bg: 'bg-gradient-to-br from-pink-400 to-rose-600',
    iconColor: 'text-white',
    gradient: 'bg-gradient-to-br from-pink-50 to-rose-50',
  },
  {
    title: 'Dashboard',
    desc: 'Pantau statistik arsip dan tren penggunaan melalui dashboard.',
    icon: 'heroicons:chart-bar',
    bg: 'bg-gradient-to-br from-cyan-400 to-blue-600',
    iconColor: 'text-white',
    gradient: 'bg-gradient-to-br from-cyan-50 to-blue-50',
  },
]

const steps = [
  {
    title: 'Upload Dokumen',
    desc: 'Drag & drop dokumen atau scan langsung dari perangkat. OCR otomatis mengekstrak teks.',
    icon: 'heroicons:cloud-arrow-up',
    bg: 'bg-gradient-to-br from-primary-500 to-primary-700',
    iconBg: 'bg-primary-50',
    iconColor: 'text-primary-600',
  },
  {
    title: 'Klasifikasi & Tag',
    desc: 'Sistem otomatis mengkategorikan dokumen. Tambahkan tag untuk pencarian lebih mudah.',
    icon: 'heroicons:tag',
    bg: 'bg-gradient-to-br from-purple-500 to-purple-700',
    iconBg: 'bg-purple-50',
    iconColor: 'text-purple-600',
  },
  {
    title: 'Cari & Kelola',
    desc: 'Temukan dokumen dalam hitungan detik. Kelola akses, disposisi, dan retensi dengan mudah.',
    icon: 'heroicons:magnifying-glass',
    bg: 'bg-gradient-to-br from-pink-500 to-pink-700',
    iconBg: 'bg-pink-50',
    iconColor: 'text-pink-600',
  },
]

const categories = [
  { name: 'Akademik', count: '2,450', icon: 'heroicons:academic-cap', bg: 'bg-blue-50', color: 'text-blue-600', gradient: 'from-blue-400 to-blue-600' },
  { name: 'Kesiswaan', count: '1,820', icon: 'heroicons:user-group', bg: 'bg-purple-50', color: 'text-purple-600', gradient: 'from-purple-400 to-purple-600' },
  { name: 'Kepegawaian', count: '980', icon: 'heroicons:briefcase', bg: 'bg-emerald-50', color: 'text-emerald-600', gradient: 'from-emerald-400 to-emerald-600' },
  { name: 'Administratif', count: '3,200', icon: 'heroicons:document-text', bg: 'bg-amber-50', color: 'text-amber-600', gradient: 'from-amber-400 to-amber-600' },
  { name: 'Keuangan', count: '1,540', icon: 'heroicons:currency-dollar', bg: 'bg-pink-50', color: 'text-pink-600', gradient: 'from-pink-400 to-pink-600' },
  { name: 'Legalitas', count: '420', icon: 'heroicons:scale', bg: 'bg-cyan-50', color: 'text-cyan-600', gradient: 'from-cyan-400 to-cyan-600' },
  { name: 'Surat Masuk', count: '5,670', icon: 'heroicons:envelope', bg: 'bg-rose-50', color: 'text-rose-600', gradient: 'from-rose-400 to-rose-600' },
  { name: 'Surat Keluar', count: '4,890', icon: 'heroicons:paper-airplane', bg: 'bg-indigo-50', color: 'text-indigo-600', gradient: 'from-indigo-400 to-indigo-600' },
]

</script>

<style scoped>
@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.animation-delay-4000 {
  animation-delay: 4s;
}
</style>