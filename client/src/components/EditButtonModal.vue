<script setup lang="ts">
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { SOCIAL_PLATFORMS } from '@/shared/config'
import Button from './Button.vue'
import type { Link, LinkUpdate } from '@/shared/types'
import { useLinks } from '@/composables/useLinks'
import { ref, watch } from 'vue'

interface Props {
  show: boolean
  onClose: () => void
  selectedButton: Link
}

const props = defineProps<Props>()
const { updateLink, isUpdating } = useLinks()
// Create a local copy for editing
const button = ref({ ...props.selectedButton })

const editButton = async () => {
  await updateLink(button.value.id, button.value as LinkUpdate)
  props.onClose()
}
</script>

<template>
  <TransitionRoot as="template" :show="props.show">
    <Dialog as="div" class="relative z-50" @close="props.onClose">
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/30" />
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
                    />
                    <span class="text-gray-900 dark:text-gray-100 font-medium">
                      {{ SOCIAL_PLATFORMS[button.social_platform]?.name || button.social_platform }}
                    </span>
                  </div>
                </div>

                <!-- URL Input -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Link
                  </label>
                  <div class="relative mt-1">
                    <input
                      type="url"
                      v-if="button.social_platform"
                      v-model="button.url"
                      :placeholder="
                        SOCIAL_PLATFORMS[button.social_platform]?.placeholder || 'https://...'
                      "
                      class="w-full rounded-md bg-white dark:bg-gray-800 py-2 px-3 text-sm text-gray-900 dark:text-gray-100 shadow-sm outline-none"
                    />
                  </div>
                </div>
                <!-- Active toggle -->
                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-700 dark:text-gray-300">Active</span>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" class="sr-only peer" v-model="button.is_active" />
                    <div
                      class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:bg-emerald-500 peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"
                    ></div>
                  </label>
                </div>
              </div>

              <!-- Footer Buttons -->
              <div class="mt-6 flex justify-end gap-3">
                <Button type="button" :onClick="props.onClose" label="Cancel" outline />
                <Button type="button" :onClick="editButton" label="Save" :loading="isUpdating" />
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
