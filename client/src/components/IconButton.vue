<script setup lang="ts">
import { twMerge } from 'tailwind-merge'
import type { VNode } from 'vue'

defineProps<{
  disabled?: boolean
  btnClass?: string
  onClick?: () => void
}>()
</script>

<template>
  <button
    :class="
      twMerge(
        'flex w-full justify-center items-center gap-2 cursor-pointer rounded-md px-2 py-1.5 text-sm/6 font-semibold text-lightText bg-emerald-500 hover:bg-emerald-600 transition-colors duration-200',
        btnClass,
      )
    "
    @click="onClick ? onClick() : null"
    :disabled="disabled"
  >
    <slot name="icon"></slot>
  </button>
</template>
