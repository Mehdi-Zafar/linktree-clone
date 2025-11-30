<script setup lang="ts">
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import Button from './Button.vue'
import Input from './Input.vue'
import { useLinks } from '@/composables/useLinks'
import type { Link, LinkUpdate } from '@/shared/types'
import { ref, watch } from 'vue'
import { useRegle } from '@regle/core'
import { required, url, withMessage } from '@regle/rules'

interface Props {
  show: boolean
  selectedLink: Link
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'close'): void
}>()

const { updateLink, isUpdating } = useLinks()

// Create a local copy for editing
const link = ref({ ...props.selectedLink })

// Initialize Regle validation
const { r$ } = useRegle(link, {
  title: {
    required: withMessage(required, 'Title is required'),
  },
  url: {
    required: withMessage(required, 'URL is required'),
    url: withMessage(url, 'Please enter a valid URL'),
  },
})

// Watch for prop changes to update local copy
watch(
  () => props.selectedLink,
  (newLink) => {
    link.value = { ...newLink }
    r$.$reset({ toState: { ...newLink } })
  },
  { immediate: true },
)

const handleClose = () => {
  // Reset to original values
  link.value = { ...props.selectedLink }
  r$.$reset({ toState: { ...props.selectedLink } })
  emit('close')
}

const editLink = async () => {
  try {
    // Validate form
    await r$.$validate()

    // Only proceed if validation passes and not already updating
    if (!r$.$invalid && !isUpdating.value) {
      await updateLink(link.value.id, link.value)
      emit('close')
    }
  } catch (error) {
    console.error('Error updating link:', error)
  }
}
</script>

<template>
  <TransitionRoot as="template" :show="props.show">
    <Dialog as="div" class="relative z-50" @close="handleClose">
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/30" aria-hidden="true" />
      </TransitionChild>

      <div class="fixed inset-0 z-50 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel
              class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-900 p-6 text-left align-middle shadow-xl transition-all"
            >
              <DialogTitle
                as="h3"
                class="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100"
              >
                Edit Link
              </DialogTitle>

              <form @submit.prevent="editLink" novalidate>
                <div class="mt-4 space-y-4">
                  <!-- Title -->
                  <Input
                    id="edit-link-title"
                    name="title"
                    type="text"
                    label="Title"
                    v-model="link.title"
                    placeholder="Enter link title"
                    autocomplete="off"
                    @blur="r$.title.$touch()"
                    :errorMessage="r$.title.$error ? r$.title.$errors[0] : null"
                    :touched="r$.title.$dirty"
                    input-class="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  />

                  <!-- Description -->
                  <div>
                    <label
                      for="edit-link-description"
                      class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Description
                    </label>
                    <textarea
                      id="edit-link-description"
                      name="description"
                      v-model="link.description"
                      rows="3"
                      placeholder="Enter link description (optional)"
                      class="mt-1 w-full rounded-md bg-white dark:bg-gray-800 py-2 px-3 text-sm text-gray-900 dark:text-gray-100 shadow-sm outline-none border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                    />
                  </div>

                  <!-- URL -->
                  <Input
                    id="edit-link-url"
                    name="url"
                    type="url"
                    label="Link"
                    v-model="link.url"
                    placeholder="https://..."
                    autocomplete="url"
                    @blur="r$.url.$touch()"
                    :errorMessage="r$.url.$error ? r$.url.$errors[0] : null"
                    :touched="r$.url.$dirty"
                    input-class="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  />

                  <!-- Active toggle -->
                  <div class="flex items-center justify-between">
                    <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Active</span>
                    <label class="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        class="sr-only peer"
                        v-model="link.is_active"
                        aria-label="Set link as active"
                      />
                      <div
                        class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-emerald-500 rounded-full peer dark:bg-gray-700 peer-checked:bg-emerald-500 peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"
                      ></div>
                    </label>
                  </div>
                </div>

                <!-- Footer -->
                <div class="mt-6 flex justify-end gap-3">
                  <Button
                    type="button"
                    :onClick="handleClose"
                    label="Cancel"
                    :outline="true"
                    :disabled="isUpdating"
                  />
                  <Button
                    type="submit"
                    label="Save"
                    :loading="isUpdating"
                  />
                </div>
              </form>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
