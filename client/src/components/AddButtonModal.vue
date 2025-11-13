<script setup lang="ts">
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
  Listbox,
  ListboxButton,
  ListboxLabel,
  ListboxOption,
  ListboxOptions,
} from '@headlessui/vue'
import { ref, computed } from 'vue'
import { ChevronUpDownIcon, CheckIcon } from '@heroicons/vue/20/solid'
import { SOCIAL_PLATFORMS } from '@/shared/config'
import Button from './Button.vue'
import { LinkType, type LinkCreate } from '@/shared/types'
import { useLinks } from '@/composables/useLinks'

interface Props {
  show: boolean
  onClose: () => void
}

const props = defineProps<Props>()
const { buttons, createLink, isCreating } = useLinks()
const getInitialValue = () => ({
  url: '',
  is_active: true,
  title: '',
  link_type: LinkType.BUTTON,
  position: buttons.value?.length ? buttons.value?.length + 1 : 1,
})
const newButton = ref<LinkCreate>(getInitialValue())

const platformOptions = Object.entries(SOCIAL_PLATFORMS).map(([key, platform]) => ({
  value: key,
  label: platform.name,
}))

const selectedOption = computed(
  () => platformOptions.find((p) => p.value === newButton.value.social_platform) || null,
)

const addButton = async () => {
  if (!newButton.value.url) return
  const newLink: LinkCreate = {
    ...newButton.value,
    title: selectedOption.value?.label ?? '',
  }
  await createLink(newLink)
  newButton.value = getInitialValue()
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
                Add New Button
              </DialogTitle>

              <div class="mt-4 space-y-4">
                <!-- Platform Select -->
                <div>
                  <Listbox v-model="newButton.social_platform">
                    <ListboxLabel
                      class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Platform
                    </ListboxLabel>

                    <div class="relative mt-2">
                      <!-- Button -->
                      <ListboxButton
                        class="relative w-full cursor-default rounded-md bg-gray-50 dark:bg-gray-800 py-2 pl-3 pr-10 text-left shadow-sm sm:text-sm"
                      >
                        <span class="flex items-center gap-3">
                          <template v-if="selectedOption">
                            <component
                              :is="SOCIAL_PLATFORMS[selectedOption.value]?.icon"
                              class="w-5 h-5 text-emerald-500"
                            />
                          </template>
                          <span class="block truncate">
                            {{ selectedOption?.label || 'Select a platform' }}
                          </span>
                        </span>
                        <span
                          class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"
                        >
                          <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </span>
                      </ListboxButton>

                      <!-- Dropdown -->
                      <transition
                        leave-active-class="transition ease-in duration-100"
                        leave-from-class="opacity-100"
                        leave-to-class="opacity-0"
                      >
                        <ListboxOptions
                          class="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white dark:bg-gray-800 py-1 text-base shadow-lg ring-1 ring-black/10 dark:ring-white/10 focus:outline-none sm:text-sm"
                        >
                          <ListboxOption
                            v-for="option in platformOptions"
                            :key="option.value"
                            :value="option.value"
                            v-slot="{ active, selected }"
                          >
                            <li
                              :class="[
                                active
                                  ? 'bg-indigo-500 text-white'
                                  : 'text-gray-900 dark:text-gray-100',
                                'relative cursor-default select-none py-2 pl-3 pr-9 flex items-center gap-3',
                              ]"
                            >
                              <component
                                v-if="SOCIAL_PLATFORMS[option.value]?.icon"
                                :is="SOCIAL_PLATFORMS[option.value]?.icon"
                                class="w-5 h-5 text-emerald-500"
                              />

                              <span
                                :class="[
                                  selected ? 'font-semibold' : 'font-normal',
                                  'block truncate',
                                ]"
                              >
                                {{ option.label }}
                              </span>

                              <span
                                v-if="selected"
                                :class="[
                                  active ? 'text-white' : 'text-indigo-500 dark:text-indigo-400',
                                  'absolute inset-y-0 right-0 flex items-center pr-4',
                                ]"
                              >
                                <CheckIcon class="h-5 w-5" aria-hidden="true" />
                              </span>
                            </li>
                          </ListboxOption>
                        </ListboxOptions>
                      </transition>
                    </div>
                  </Listbox>
                </div>

                <!-- URL Input -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Link
                  </label>
                  <div class="relative mt-1">
                    <input
                      type="url"
                      v-model="newButton.url"
                      :placeholder="
                        newButton.social_platform
                          ? SOCIAL_PLATFORMS[newButton.social_platform]?.placeholder
                          : 'https://...'
                      "
                      class="w-full rounded-md bg-white dark:bg-gray-800 py-2 px-3 text-sm text-gray-900 dark:text-gray-100 shadow-sm outline-none"
                    />
                  </div>
                </div>
                <!-- Active toggle -->
                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-700 dark:text-gray-300">Active</span>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" class="sr-only peer" v-model="newButton.is_active" />
                    <div
                      class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:bg-emerald-500 peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"
                    ></div>
                  </label>
                </div>
              </div>

              <!-- Footer Buttons -->
              <div class="mt-6 flex justify-end gap-3">
                <Button type="button" :onClick="props.onClose" label="Cancel" :outline="true" />
                <Button type="button" :onClick="addButton" label="Add" :loading="isCreating" />
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
