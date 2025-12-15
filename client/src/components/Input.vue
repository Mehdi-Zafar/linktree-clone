<!-- Input.vue -->
<script setup lang="ts">
import { computed, ref, type VNode } from 'vue'
import { twMerge } from 'tailwind-merge'
import { useSlots } from 'vue'
import { EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/outline'

const slots = useSlots()

const hasIconSlot = !!slots.leftIcon
const showPassword = ref(false)

const props = defineProps<{
  modelValue?: string
  type?: string
  id?: string
  name?: string
  disabled?: boolean
  label?: string
  inputClass?: string
  labelClass?: string
  containerClass?: string
  iconClass?: string
  icon?: VNode | null // e.g. component or slot
  placeholder?: string
  // For validation / error display
  errorMessage?: string | null
  touched?: boolean
}>()

// Emit update for v-model
const emit = defineEmits<{
  (e: 'update:modelValue', val: string): void
  (e: 'blur'): void
}>()

// Computed proxy so input can v-model to it
const internalValue = computed({
  get() {
    return props.modelValue ?? ''
  },
  set(val: string) {
    emit('update:modelValue', val)
  },
})

const isPassword = props.type === 'password'

function onBlur() {
  emit('blur')
}

function toggleShowPassword() {
  showPassword.value = !showPassword.value
}
</script>

<template>
  <div :class="twMerge('space-y-0.5', containerClass)">
    <label v-if="!!label" :for="id" :class="twMerge('inputLabel', labelClass)">{{ label }}</label>
    <div class="relative">
      <slot name="leftIcon"></slot>

      <slot name="rightIcon"></slot>
      <template v-if="isPassword">
        <EyeIcon
          v-if="!showPassword"
          class="absolute w-5 top-1/2 right-3 -translate-y-1/2 opacity-70 cursor-pointer"
          @click="toggleShowPassword"
        />
        <EyeSlashIcon
          v-else
          class="absolute w-5 top-1/2 right-3 -translate-y-1/2 opacity-70 cursor-pointer"
          @click="toggleShowPassword"
        />
      </template>
      <input
        :type="isPassword && showPassword ? 'text' : type"
        :name="name"
        :id="id"
        :placeholder="placeholder"
        :disabled="disabled"
        v-model="internalValue"
        @blur="onBlur"
        :class="
          twMerge(
            'block w-full rounded-md px-3 py-1.5 text-base bg-white dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 placeholder:text-gray-400 dark:placeholder:text-gray-500 outline-none sm:text-sm/6',
            inputClass,
            hasIconSlot ? '!pl-10' : '',
          )
        "
      />
    </div>
    <!-- show error only if touched & there is error -->
    <p v-if="touched && errorMessage" class="text-red-500 text-sm mt-1">
      {{ errorMessage }}
    </p>
  </div>
</template>
