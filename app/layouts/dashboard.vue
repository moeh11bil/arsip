<template>
  <div class="min-h-screen bg-slate-50 relative overflow-hidden">
    <div class="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div class="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-primary-400/10 to-purple-400/10 rounded-full blur-3xl animate-blob" />
      <div class="absolute bottom-0 -left-40 w-96 h-96 bg-gradient-to-tr from-cyan-400/10 to-blue-400/10 rounded-full blur-3xl animate-blob animation-delay-2000" />
    </div>

    <div class="flex h-screen">
      <LayoutSidebar
        :collapsed="sidebarCollapsed"
        :mobile-open="mobileOpen"
        @close="mobileOpen = false"
      />

      <div class="flex-1 flex flex-col overflow-hidden">
        <LayoutTopbar @toggle-sidebar="mobileOpen = !mobileOpen" />

        <main class="flex-1 overflow-y-auto">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <slot />
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const sidebarCollapsed = ref(false)
const mobileOpen = ref(false)
</script>


