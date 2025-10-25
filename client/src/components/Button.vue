<script setup lang="ts">
import { twMerge } from 'tailwind-merge'
import LoadingSpinner from './LoadingSpinner.vue'

defineProps<{
  label: string
  type?: string
  disabled?: boolean
  btnClass?: string
  onClick?: () => void
  loading?: boolean
  outline?:boolean
}>()
</script>

<template>
  <button
    type="submit"
    :class="
      twMerge(
        'flex w-full justify-center items-center gap-2 cursor-pointer rounded-md px-3 py-1.5 text-sm/6 font-semibold text-lightText bg-emerald-500 hover:bg-emerald-600 transition-colors duration-200',
        outline ? 'border text-emerald-500 bg-transparent hover:bg-transparent hover:opacity-80':'',
        btnClass,
      )
    "
    @click="onClick ? onClick() : null"
    :disabled="disabled || loading"
  >
    {{ label }}
    <LoadingSpinner v-if="loading" :size="15" className="fill-emerald-500" />
  </button>
</template>
