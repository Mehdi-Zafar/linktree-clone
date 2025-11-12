<script setup lang="ts">
import { RouterView } from 'vue-router'
import { Toaster } from 'vue-sonner'
import { useTheme } from './composables/useTheme'
import ConfirmationModal from './components/ConfirmationModal.vue'
import { provide, ref } from 'vue'

const { isDark } = useTheme()
const globalConfirmModal = ref<InstanceType<typeof ConfirmationModal>>()

// Provide globally
provide('confirmModal', globalConfirmModal)
</script>

<template>
  <div class="">
    <RouterView />
  </div>
  <Toaster position="top-right" :theme="isDark ? 'dark' : 'light'" />
  <ConfirmationModal ref="globalConfirmModal" />
</template>
