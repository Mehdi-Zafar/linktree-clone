<script setup>
import { useTheme } from '@/composables/useTheme';
import { SunIcon, MoonIcon } from '@heroicons/vue/24/outline'

const { isDark, toggleDark } = useTheme()
</script>

<template>
  <button
    @click="toggleDark()"
    class="py-1.5 px-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer border-2 border-emerald-500"
  >
    <SunIcon v-if="isDark" class="w-6 h-6 text-emerald-500" />
    <MoonIcon v-else class="w-6 h-6 text-emerald-500" />
  </button>
</template>
