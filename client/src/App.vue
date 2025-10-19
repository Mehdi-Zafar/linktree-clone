<script setup lang="ts">
import { RouterView } from 'vue-router'
import { Toaster } from 'vue-sonner'
import { useTheme } from './composables/useTheme'

const { isDark } = useTheme()
</script>

<template>
  <div class="">
    <RouterView />
  </div>
  <Toaster position="top-right" :theme="isDark ? 'dark' : 'light'" />
</template>
