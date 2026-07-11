<template>
  <div class="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
    <TransitionGroup name="toast">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl border backdrop-blur-xl max-w-sm"
        :class="classes[toast.type]"
      >
        <Icon :name="icons[toast.type]" class="w-5 h-5 flex-shrink-0" />
        <span class="text-sm font-medium flex-1">{{ toast.message }}</span>
        <button @click="remove(toast.id)" aria-label="Tutup" class="p-0.5 hover:opacity-70 transition-opacity">
          <Icon name="heroicons:x-mark" class="w-4 h-4" />
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
const { toasts, remove } = useToast()

const icons: Record<string, string> = {
  success: 'heroicons:check-circle-solid',
  error: 'heroicons:x-circle-solid',
  warning: 'heroicons:exclamation-triangle-solid',
  info: 'heroicons:information-circle-solid',
}

const classes: Record<string, string> = {
  success: 'bg-green-50/90 border-green-200 text-green-800',
  error: 'bg-red-50/90 border-red-200 text-red-800',
  warning: 'bg-amber-50/90 border-amber-200 text-amber-800',
  info: 'bg-blue-50/90 border-blue-200 text-blue-800',
}
</script>

<style scoped>
.toast-enter-active { transition: all 0.3s cubic-bezier(0.21, 1.02, 0.73, 1); }
.toast-leave-active { transition: all 0.25s ease; }
.toast-enter-from { opacity: 0; transform: translateX(40px) scale(0.95); }
.toast-leave-to { opacity: 0; transform: translateX(40px) scale(0.95); }
</style>
