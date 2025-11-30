<script setup lang="ts">
import { computed } from 'vue'
import { twMerge } from 'tailwind-merge'

interface Props {
  src?: string | null
  alt?: string
  name?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  className?: string
  rounded?: 'full' | 'lg' | 'md' | 'sm' | 'none'
  initialsClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  src: null,
  alt: '',
  name: '',
  size: 'md',
  className: '',
  rounded: 'full',
  initialsClass: '',
})

// Extract initials from name
const initials = computed(() => {
  if (!props.name) return '?'

  const words = props.name
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0)

  // No valid words
  if (words.length === 0) return '?'

  // Single word: take first two characters
  if (words.length === 1) {
    const word = words[0]
    if (word?.length === 1) return word.toUpperCase()
    return word?.substring(0, 2).toUpperCase()
  }

  // Multiple words: take first letter of first two words
  const firstInitial = words[0]?.[0] || ''
  const secondInitial = words[1]?.[0] || ''

  return (firstInitial + secondInitial).toUpperCase()
})

// Generate a consistent background color based on name
const backgroundColor = computed(() => {
  if (!props.name) return 'bg-gray-500'

  // Hash the name to get a consistent number
  let hash = 0
  for (let i = 0; i < props.name.length; i++) {
    hash = props.name.charCodeAt(i) + ((hash << 5) - hash)
  }

  // Array of nice Tailwind colors
  const colors = [
    'bg-red-500',
    'bg-orange-500',
    'bg-amber-500',
    'bg-yellow-500',
    'bg-lime-500',
    'bg-green-500',
    'bg-emerald-500',
    'bg-teal-500',
    'bg-cyan-500',
    'bg-sky-500',
    'bg-blue-500',
    'bg-indigo-500',
    'bg-violet-500',
    'bg-purple-500',
    'bg-fuchsia-500',
    'bg-pink-500',
    'bg-rose-500',
  ]

  return colors[Math.abs(hash) % colors.length]
})

// Size classes
const sizeClasses = computed(() => {
  const sizes = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl',
    '2xl': 'w-20 h-20 text-2xl',
  }
  return sizes[props.size]
})

// Rounded classes
const roundedClasses = computed(() => {
  const rounded = {
    full: 'rounded-full',
    lg: 'rounded-lg',
    md: 'rounded-md',
    sm: 'rounded-sm',
    none: 'rounded-none',
  }
  return rounded[props.rounded]
})

// Check if image is loaded
const imageLoaded = computed(() => !!props.src)

// Get alt text
const altText = computed(() => props.alt || props.name || 'User avatar')
</script>

<template>
  <div
    :class="
      twMerge(
        'relative inline-flex items-center justify-center flex-shrink-0 overflow-hidden',
        sizeClasses,
        roundedClasses,
        !imageLoaded ? backgroundColor : 'bg-gray-200 dark:bg-gray-700',
        className,
      )
    "
    :aria-label="altText"
  >
    <!-- Image if available -->
    <img
      v-if="imageLoaded"
      :src="src!"
      :alt="altText"
      class="w-full h-full object-cover"
      @error="($event.target as HTMLImageElement).style.display = 'none'"
    />

    <!-- Initials fallback -->
    <span
      v-else
      :class="[
        'font-semibold text-white select-none',
        size === 'xs' ? 'text-[10px]' : '',
        size === 'sm' ? 'text-xs' : '',
        initialsClass,
      ]"
      aria-hidden="true"
    >
      {{ initials }}
    </span>
  </div>
</template>
