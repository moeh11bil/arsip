<template>
  <Transition name="spinner">
    <div v-if="loading" class="fixed inset-0 z-[90] flex items-center justify-center bg-white/60 backdrop-blur-sm" role="status" aria-live="polite" :aria-label="message || 'Memuat...'">
      <div class="flex flex-col items-center gap-4">
        <div class="relative w-16 h-16">
          <div class="absolute inset-0 rounded-full border-4 border-primary-200" />
          <div class="absolute inset-0 rounded-full border-4 border-primary-600 border-t-transparent animate-spin" />
        </div>
        <p v-if="message" class="text-sm font-medium text-gray-600">{{ message }}</p>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
defineProps<{
  loading: boolean
  message?: string
}>()
</script>

<style scoped>
.spinner-enter-active, .spinner-leave-active { transition: opacity 0.2s ease; }
.spinner-enter-from, .spinner-leave-to { opacity: 0; }
</style>
