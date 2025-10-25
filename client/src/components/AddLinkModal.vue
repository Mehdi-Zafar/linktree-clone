<script setup lang="ts">
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'

import Button from './Button.vue'
import { ref } from 'vue'
import { useLinks } from '@/composables/useLinks'
import { LinkType, type LinkCreate } from '@/shared/types'

interface Props {
  show: boolean
  onClose: () => void
}

const props = defineProps<Props>()
const { createLink, isCreating, links } = useLinks()

const initialValue = {
  title: '',
  description: '',
  is_active: true,
  url: '',
  link_type: LinkType.LINK,
  position: links.value?.length ? links.value?.length + 1 : 1,
}
const newLink = ref<LinkCreate>(initialValue)

const addLink = async () => {
  if (!newLink.value.title) return
  await createLink(newLink.value)
  newLink.value = initialValue
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
                Add New Link
              </DialogTitle>

              <div class="mt-4 space-y-4">
                <!-- Title -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >Title</label
                  >
                  <input
                    type="text"
                    v-model="newLink.title"
                    class="mt-1 w-full rounded-md bg-white dark:bg-gray-800 py-2 px-3 text-sm text-gray-900 dark:text-gray-100 shadow-sm outline-none"
                  />
                </div>

                <!-- Description -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >Description</label
                  >
                  <textarea
                    v-model="newLink.description"
                    rows="3"
                    class="mt-1 w-full rounded-md bg-white dark:bg-gray-800 py-2 px-3 text-sm text-gray-900 dark:text-gray-100 shadow-sm outline-none"
                  />
                </div>

                <!-- URL -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >Link</label
                  >
                  <input
                    type="url"
                    v-model="newLink.url"
                    :placeholder="'https://...'"
                    class="mt-1 w-full rounded-md bg-white dark:bg-gray-800 py-2 px-3 text-sm text-gray-900 dark:text-gray-100 shadow-sm outline-none"
                  />
                </div>

                <!-- Active toggle -->
                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-700 dark:text-gray-300">Active</span>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" class="sr-only peer" v-model="newLink.is_active" />
                    <div
                      class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:bg-emerald-500 peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"
                    ></div>
                  </label>
                </div>
              </div>

              <!-- Footer -->
              <div class="mt-6 flex justify-end gap-3">
                <Button type="button" :onClick="props.onClose" label="Cancel" outline />
                <Button type="button" :onClick="addLink" label="Add" :loading="isCreating" />
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
