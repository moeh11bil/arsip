<template>
  <Transition name="modal">
    <div v-if="modelValue" class="fixed inset-0 z-[60] flex items-center justify-center p-4" tabindex="-1" @keydown.esc="$emit('update:modelValue', false)">
      <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="$emit('update:modelValue', false)" />

      <div class="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6">
        <div class="flex flex-col items-center text-center">
          <div class="w-14 h-14 rounded-full flex items-center justify-center mb-4" :class="iconBg">
            <Icon :name="icon" class="w-7 h-7" :class="iconColor" />
          </div>
          <h3 class="text-lg font-bold text-gray-900 mb-1">{{ title }}</h3>
          <p class="text-sm text-gray-500">{{ message }}</p>
        </div>

        <div class="flex gap-3 mt-6">
          <button
            @click="$emit('update:modelValue', false)"
            class="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
          >
            Batal
          </button>
          <button
            @click="$emit('confirm')"
            class="flex-1 px-4 py-2.5 text-sm font-semibold text-white rounded-xl shadow-lg hover:shadow-xl transition-all"
            :class="confirmClass"
          >
            {{ confirmText }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  modelValue: boolean
  title?: string
  message?: string
  icon?: string
  iconBg?: string
  iconColor?: string
  confirmText?: string
  confirmClass?: string
}>(), {
  title: 'Yakin?',
  message: 'Tindakan ini tidak dapat dibatalkan.',
  icon: 'heroicons:exclamation-triangle',
  iconBg: 'bg-red-100',
  iconColor: 'text-red-600',
  confirmText: 'Ya',
  confirmClass: 'bg-red-600 hover:bg-red-700',
})

defineEmits(['update:modelValue', 'confirm'])
</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: all 0.25s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-from .relative, .modal-leave-to .relative { transform: scale(0.95) translateY(10px); }
</style>
