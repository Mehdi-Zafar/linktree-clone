<script setup lang="ts">
import { ref } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { ExclamationTriangleIcon } from '@heroicons/vue/24/outline'
import Button from './Button.vue'

export interface ConfirmationOptions {
  title?: string
  message?: string
  confirmText?: string
  cancelText?: string
  loadingText?: string
  variant?: 'danger' | 'warning' | 'info'
  onConfirm?: () => void | Promise<void>
}

// Internal state
const isOpen = ref(false)
const isLoading = ref(false)
const currentTitle = ref('Are you sure?')
const currentMessage = ref('This action cannot be undone.')
const currentConfirmText = ref('Confirm')
const currentCancelText = ref('Cancel')
const currentLoadingText = ref('Processing...')
const currentVariant = ref<'danger' | 'warning' | 'info'>('danger')
const onConfirmCallback = ref<(() => void | Promise<void>) | null>(null)

// Expose open method to parent
const open = (options: ConfirmationOptions = {}) => {
  currentTitle.value = options.title || 'Are you sure?'
  currentMessage.value = options.message || 'This action cannot be undone.'
  currentConfirmText.value = options.confirmText || 'Confirm'
  currentCancelText.value = options.cancelText || 'Cancel'
  currentLoadingText.value = options.loadingText || 'Processing...'
  currentVariant.value = options.variant || 'danger'
  onConfirmCallback.value = options.onConfirm || null
  isOpen.value = true
  isLoading.value = false
}

// Expose close method
const close = () => {
  isOpen.value = false
  isLoading.value = false
  onConfirmCallback.value = null
}

// Handle confirm
const handleConfirm = async () => {
  if (onConfirmCallback.value) {
    isLoading.value = true
    try {
      await onConfirmCallback.value()
      close()
    } catch (error) {
      console.error('Confirmation callback error:', error)
      isLoading.value = false
    }
  } else {
    close()
  }
}

// Handle cancel
const handleCancel = () => {
  close()
}

// Expose methods to parent
defineExpose({
  open,
  close,
})
</script>
<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" @close="handleCancel" class="relative z-50">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/50" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel
              class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-900 p-6 text-left align-middle shadow-xl transition-all"
            >
              <!-- Icon -->
              <div
                class="mx-auto flex h-12 w-12 bg-red-100 items-center justify-center rounded-full"
              >
                <component
                  :is="ExclamationTriangleIcon"
                  class="h-6 w-6 text-red-600"
                  aria-hidden="true"
                />
              </div>

              <!-- Title -->
              <DialogTitle
                as="h3"
                class="mt-4 text-center text-lg font-semibold leading-6 text-darkText dark:text-lightText"
              >
                {{ currentTitle }}
              </DialogTitle>

              <!-- Description -->
              <div class="mt-2">
                <p class="text-center text-sm text-gray-500">
                  {{ currentMessage }}
                </p>
              </div>

              <!-- Actions -->
              <div class="mt-6 flex gap-3">
                <Button
                  type="button"
                  :onClick="handleCancel"
                  label="Cancel"
                  outline
                  :disabled="isLoading"
                />
                <Button
                  type="button"
                  :onClick="handleConfirm"
                  label="Delete"
                  :loading="isLoading"
                />
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
