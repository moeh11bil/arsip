<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
  middleware: ['auth', 'role'],
  roles: ['SUPER_ADMIN', 'ADMIN'],
})

useHead({ title: 'Manajemen User - EduArch' })

const toast = useToast()
const search = ref('')
const page = ref(1)
const showModal = ref(false)
const editingUser = ref<any>(null)
const deletingUser = ref<any>(null)
const saving = ref(false)
const isDeleting = ref(false)

const { data, pending, refresh } = await useAsyncData(
  'users',
  () => $fetch(`/api/users?page=${page.value}&search=${search.value}`),
  { watch: [page, search], server: false }
)

const roleColors: Record<string, string> = {
  SUPER_ADMIN: 'bg-rose-100 text-rose-700',
  ADMIN: 'bg-purple-100 text-purple-700',
  KEPALA_SEKOLAH: 'bg-blue-100 text-blue-700',
  TU: 'bg-emerald-100 text-emerald-700',
  GURU: 'bg-amber-100 text-amber-700',
  SISWA: 'bg-cyan-100 text-cyan-700',
  AUDITOR: 'bg-gray-100 text-gray-700',
}

const form = ref({
  email: '',
  namaLengkap: '',
  password: '',
  role: 'TU',
  nip: '',
  nis: '',
})

const openCreate = () => {
  editingUser.value = null
  form.value = { email: '', namaLengkap: '', password: '', role: 'TU', nip: '', nis: '' }
  showModal.value = true
}

const openEdit = (user: any) => {
  editingUser.value = user
  form.value = {
    email: user.email,
    namaLengkap: user.namaLengkap,
    password: '',
    role: user.role,
    nip: user.nip || '',
    nis: user.nis || '',
  }
  showModal.value = true
}

const save = async () => {
  saving.value = true
  try {
    if (editingUser.value) {
      const payload: any = { ...form.value }
      if (!payload.password) delete payload.password
      await $fetch(`/api/users/${editingUser.value.id}`, { method: 'PUT', body: payload })
      toast.success('User berhasil diperbarui!')
    } else {
      await $fetch('/api/users', { method: 'POST', body: form.value })
      toast.success('User berhasil ditambahkan!')
    }
    showModal.value = false
    refresh()
  } catch (err: any) {
    toast.error(err.data?.statusMessage || err.message || 'Gagal menyimpan user')
  } finally {
    saving.value = false
  }
}

const confirmDelete = async () => {
  if (!deletingUser.value) return
  isDeleting.value = true
  try {
    await $fetch(`/api/users/${deletingUser.value.id}`, { method: 'DELETE' })
    toast.success('User berhasil dihapus!')
    deletingUser.value = null
    refresh()
  } catch (err: any) {
    toast.error(err.data?.statusMessage || err.message || 'Gagal menghapus user')
  } finally {
    isDeleting.value = false
  }
}

const visiblePages = computed(() => {
  if (!data.value?.pagination) return []
  const total = data.value.pagination.totalPages
  const current = page.value
  const pages: (number | string)[] = []
  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i)
  } else {
    pages.push(1)
    if (current > 3) pages.push('...')
    for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) pages.push(i)
    if (current < total - 2) pages.push('...')
    pages.push(total)
  }
  return pages
})
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Manajemen User</h1>
        <p class="text-sm text-gray-500 mt-0.5">Kelola pengguna sistem arsip digital</p>
      </div>
      <button @click="openCreate" class="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white text-sm font-semibold rounded-xl shadow-lg shadow-primary-500/30 hover:shadow-xl hover:-translate-y-0.5 transition-all">
        <Icon name="heroicons:plus" class="w-4 h-4" />
        Tambah User
      </button>
    </div>

    <div class="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/60 shadow-sm p-4">
      <div class="relative">
        <Icon name="heroicons:magnifying-glass" class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          v-model="search"
          type="text"
          placeholder="Cari nama, email, atau NIP..."
          class="w-full pl-12 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white transition-all"
        />
      </div>
    </div>

    <div v-if="pending" class="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/60 shadow-sm p-12 text-center">
      <Icon name="heroicons:arrow-path" class="w-8 h-8 mx-auto text-primary-600 animate-spin" />
      <p class="mt-3 text-sm text-gray-500">Memuat data user...</p>
    </div>

    <div v-else-if="data?.data?.length" class="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/60 shadow-sm overflow-hidden">
      <table class="w-full">
        <thead>
          <tr class="border-b border-gray-100 bg-gray-50/50">
            <th class="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
            <th class="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
            <th class="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
            <th class="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Terakhir Login</th>
            <th class="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Aksi</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="user in data.data" :key="user.id" class="hover:bg-gray-50/50 transition-colors">
            <td class="px-6 py-4">
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 bg-gradient-to-br from-primary-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {{ (user.namaLengkap || '?').charAt(0).toUpperCase() }}
                </div>
                <div>
                  <div class="text-sm font-medium text-gray-900">{{ user.namaLengkap }}</div>
                  <div class="text-xs text-gray-500">{{ user.email }}</div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4">
              <span class="px-2.5 py-1 text-xs font-medium rounded-lg" :class="roleColors[user.role] || 'bg-gray-100 text-gray-700'">
                {{ user.role.replace(/_/g, ' ') }}
              </span>
            </td>
            <td class="px-6 py-4">
              <span class="px-2.5 py-1 text-xs font-medium rounded-lg" :class="user.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'">
                {{ user.isActive ? 'Aktif' : 'Nonaktif' }}
              </span>
            </td>
            <td class="px-6 py-4 text-sm text-gray-500 hidden md:table-cell">
              {{ user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-' }}
            </td>
            <td class="px-6 py-4 text-right">
              <div class="flex items-center justify-end gap-1">
                <button @click="openEdit(user)" class="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                  <Icon name="heroicons:pencil-square" class="w-5 h-5" />
                </button>
                <button @click="deletingUser = user" class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                  <Icon name="heroicons:trash" class="w-5 h-5" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else class="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/60 shadow-sm p-12 text-center">
      <Icon name="heroicons:user-group" class="w-16 h-16 mx-auto text-gray-300" />
      <h3 class="mt-4 text-lg font-semibold text-gray-900">Belum ada user</h3>
      <p class="mt-1 text-sm text-gray-500">Tambahkan user pertama Anda.</p>
      <button @click="openCreate" class="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white text-sm font-semibold rounded-xl shadow-lg shadow-primary-500/30 hover:shadow-xl hover:-translate-y-0.5 transition-all">
        Tambah User Sekarang
      </button>
    </div>

    <!-- Pagination -->
    <div v-if="data?.pagination && data.pagination.totalPages > 1" class="flex flex-col sm:flex-row items-center justify-between gap-4">
      <div class="text-sm text-gray-500">
        Halaman <strong class="text-gray-900">{{ data.pagination.page }}</strong> dari <strong class="text-gray-900">{{ data.pagination.totalPages }}</strong>
        · Total <strong class="text-gray-900">{{ data.pagination.total }}</strong> user
      </div>
      <nav class="inline-flex items-center gap-1 bg-white/80 backdrop-blur-sm rounded-xl border border-white/60 shadow-sm p-1">
        <button @click="page = page - 1" :disabled="page <= 1" class="w-10 h-10 flex items-center justify-center text-sm font-medium rounded-lg transition-all text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent">
          <Icon name="heroicons:chevron-left" class="w-4 h-4" />
        </button>
        <template v-for="p in visiblePages" :key="p">
          <span v-if="p === '...'" class="w-10 h-10 flex items-center justify-center text-sm text-gray-400">…</span>
          <button v-else @click="page = p" :class="['w-10 h-10 flex items-center justify-center text-sm font-medium rounded-lg transition-all', page === p ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg shadow-primary-500/30' : 'text-gray-600 hover:bg-gray-100']">
            {{ p }}
          </button>
        </template>
        <button @click="page = page + 1" :disabled="page >= data.pagination.totalPages" class="w-10 h-10 flex items-center justify-center text-sm font-medium rounded-lg transition-all text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent">
          <Icon name="heroicons:chevron-right" class="w-4 h-4" />
        </button>
      </nav>
    </div>

    <!-- Create/Edit Modal -->
    <Transition name="fade">
      <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4" tabindex="-1" @keydown.esc="showModal = false" @click.self="showModal = false">
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" />
        <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
          <div class="flex items-center justify-between p-6 border-b border-gray-100">
            <h3 class="text-lg font-bold text-gray-900">{{ editingUser ? 'Edit User' : 'Tambah User' }}</h3>
            <button @click="showModal = false" class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all">
              <Icon name="heroicons:x-mark" class="w-5 h-5" />
            </button>
          </div>
          <form @submit.prevent="save" class="p-6 space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input v-model="form.email" type="email" required class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all" placeholder="user@sekolah.sch.id" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
              <input v-model="form.namaLengkap" required class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all" placeholder="Nama lengkap user" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Password
                <span v-if="editingUser" class="text-gray-400 font-normal"> (kosongkan jika tidak diubah)</span>
              </label>
              <input v-model="form.password" :required="!editingUser" type="password" minlength="6" class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all" placeholder="Minimal 6 karakter" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select v-model="form.role" required class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all">
                <option value="SUPER_ADMIN">Super Admin</option>
                <option value="ADMIN">Admin</option>
                <option value="KEPALA_SEKOLAH">Kepala Sekolah</option>
                <option value="TU">Tata Usaha</option>
                <option value="GURU">Guru</option>
                <option value="SISWA">Siswa</option>
                <option value="AUDITOR">Auditor</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">NIP</label>
              <input v-model="form.nip" class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all" placeholder="Nomor Induk Pegawai (opsional)" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">NIS</label>
              <input v-model="form.nis" class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all" placeholder="Nomor Induk Siswa (opsional)" />
            </div>
            <div class="flex items-center justify-end gap-3 pt-2">
              <button type="button" @click="showModal = false" class="px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all">
                Batal
              </button>
              <button type="submit" :disabled="saving" class="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl shadow-lg shadow-primary-500/30 hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                <Icon v-if="saving" name="heroicons:arrow-path" class="w-4 h-4 inline animate-spin mr-1" />
                {{ editingUser ? 'Simpan' : 'Tambah' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>

    <!-- Delete Confirmation -->
    <Transition name="fade">
      <div v-if="deletingUser" class="fixed inset-0 z-50 flex items-center justify-center p-4" tabindex="-1" @keydown.esc="deletingUser = null" @click.self="deletingUser = null">
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" />
        <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
          <div class="text-center">
            <div class="w-14 h-14 mx-auto bg-red-100 rounded-full flex items-center justify-center">
              <Icon name="heroicons:exclamation-triangle" class="w-7 h-7 text-red-600" />
            </div>
            <h3 class="mt-4 text-lg font-bold text-gray-900">Hapus User</h3>
            <p class="mt-2 text-sm text-gray-500">
              Yakin ingin menghapus <strong>{{ deletingUser.namaLengkap }}</strong>? Tindakan ini tidak dapat dibatalkan.
            </p>
          </div>
          <div class="flex items-center justify-end gap-3 mt-6">
            <button @click="deletingUser = null" class="px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all">
              Batal
            </button>
            <button @click="confirmDelete" :disabled="isDeleting" class="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-red-600 to-red-700 rounded-xl shadow-lg shadow-red-500/30 hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50">
              <Icon v-if="isDeleting" name="heroicons:arrow-path" class="w-4 h-4 inline animate-spin mr-1" />
              Hapus
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
