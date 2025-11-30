<script setup lang="ts">
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { SOCIAL_PLATFORMS } from '@/shared/config'
import Button from './Button.vue'
import Input from './Input.vue'
import type { Link, LinkUpdate } from '@/shared/types'
import { useLinks } from '@/composables/useLinks'
import { ref, watch } from 'vue'
import { useRegle } from '@regle/core'
import { required, url, withMessage } from '@regle/rules'

interface Props {
  show: boolean
  selectedButton: Link
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'close'): void
}>()

const { updateLink, isUpdating } = useLinks()

// Create a local copy for editing
const button = ref({ ...props.selectedButton })

// Initialize Regle validation
const { r$ } = useRegle(button, {
  url: {
    required: withMessage(required, 'URL is required'),
    url: withMessage(url, 'Please enter a valid URL'),
  },
})

// Watch for prop changes to update local copy
watch(
  () => props.selectedButton,
  (newButton) => {
    button.value = { ...newButton }
    r$.$reset({ toState: { ...newButton } })
  },
  { immediate: true },
)

const handleClose = () => {
  // Reset to original values
  button.value = { ...props.selectedButton }
  r$.$reset({ toState: { ...props.selectedButton } })
  emit('close')
}

const editButton = async () => {
  try {
    // Validate form
    await r$.$validate()

    // Only proceed if validation passes and not already updating
    if (!r$.$invalid && !isUpdating.value) {
      await updateLink(button.value.id, button.value)
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
                Edit Button
              </DialogTitle>

              <form @submit.prevent="editButton" novalidate>
                <div class="mt-4 space-y-4">
                  <!-- Platform Display -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Platform
                    </label>
                    <div v-if="button.social_platform" class="flex items-center gap-2 mt-2">
                      <component
                        :is="SOCIAL_PLATFORMS[button.social_platform]?.icon"
                        class="w-5 h-5 text-emerald-500"
                        aria-hidden="true"
                      />
                      <span class="text-gray-900 dark:text-gray-100 font-medium">
                        {{
                          SOCIAL_PLATFORMS[button.social_platform]?.name || button.social_platform
                        }}
                      </span>
                    </div>
                  </div>

                  <!-- URL Input -->
                  <Input
                    id="edit-link-url"
                    name="url"
                    type="url"
                    label="Link"
                    v-model="button.url"
                    :placeholder="
                      button.social_platform
                        ? SOCIAL_PLATFORMS[button.social_platform]?.placeholder
                        : 'https://...'
                    "
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
                        v-model="button.is_active"
                        aria-label="Set link as active"
                      />
                      <div
                        class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-emerald-500 rounded-full peer dark:bg-gray-700 peer-checked:bg-emerald-500 peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"
                      ></div>
                    </label>
                  </div>
                </div>

                <!-- Footer Buttons -->
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
                    :disabled="r$.$invalid"
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
