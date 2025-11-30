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
import Input from './Input.vue'
import { LinkType, type LinkCreate } from '@/shared/types'
import { useLinks } from '@/composables/useLinks'
import { useRegle } from '@regle/core'
import { required, url, withMessage } from '@regle/rules'

interface Props {
  show: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'close'): void
}>()

const { buttons, createLink, isCreating } = useLinks()

const getInitialValue = (): LinkCreate => ({
  url: '',
  is_active: true,
  title: '',
  link_type: LinkType.BUTTON,
  position: buttons.value?.length ? buttons.value.length + 1 : 1,
  social_platform: undefined,
})

const newButton = ref<LinkCreate>(getInitialValue())

// Platform options for the dropdown
const platformOptions = Object.entries(SOCIAL_PLATFORMS).map(([key, platform]) => ({
  value: key,
  label: platform.name,
}))

const selectedOption = computed(
  () => platformOptions.find((p) => p.value === newButton.value.social_platform) || null,
)

// Initialize Regle validation
const { r$ } = useRegle(newButton, {
  social_platform: {
    required: withMessage(required, 'Please select a platform'),
  },
  url: {
    required: withMessage(required, 'URL is required'),
    url: withMessage(url, 'Please enter a valid URL'),
  },
})

const handleClose = () => {
  // Reset form to initial values and clear validation state
  r$.$reset({
    toState: getInitialValue(),
  })
  emit('close')
}

const addButton = async () => {
  try {
    // Validate form
    await r$.$validate()

    // Only proceed if validation passes and not already creating
    if (!r$.$invalid && !isCreating.value) {
      const newLink: LinkCreate = {
        ...newButton.value,
        title: selectedOption.value?.label ?? '',
        social_platform: newButton.value.social_platform!,
      }

      await createLink(newLink)

      // Only reset and close on success
      handleClose()
    }
  } catch (error) {
    console.error('Error creating link:', error)
  }
}

// Computed property to check if form is valid for submit button state
const isFormValid = computed(() => !r$.$invalid && !isCreating.value)
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
                Add New Button
              </DialogTitle>

              <form @submit.prevent="addButton" novalidate>
                <div class="mt-4 space-y-4">
                  <!-- Platform Select -->
                  <div>
                    <Listbox
                      v-model="newButton.social_platform"
                      @update:modelValue="r$.social_platform.$touch()"
                    >
                      <ListboxLabel
                        class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Platform
                      </ListboxLabel>

                      <div class="relative mt-2">
                        <!-- Button -->
                        <ListboxButton
                          :class="[
                            'relative w-full cursor-default rounded-md py-2 pl-3 pr-10 text-left shadow-sm sm:text-sm transition-colors',
                            'bg-gray-50 dark:bg-gray-800',
                            'focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500',
                            r$.social_platform.$dirty && r$.social_platform.$error
                              ? 'border border-red-500 dark:border-red-500'
                              : 'border border-gray-300 dark:border-gray-700',
                          ]"
                          :aria-invalid="r$.social_platform.$dirty && r$.social_platform.$error"
                          :aria-describedby="
                            r$.social_platform.$dirty && r$.social_platform.$error
                              ? 'platform-error'
                              : undefined
                          "
                        >
                          <span class="flex items-center gap-3">
                            <template v-if="selectedOption">
                              <component
                                :is="SOCIAL_PLATFORMS[selectedOption.value]?.icon"
                                class="w-5 h-5 text-emerald-500"
                                aria-hidden="true"
                              />
                            </template>
                            <span class="block truncate text-gray-900 dark:text-gray-100">
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
                                    ? 'bg-emerald-500 text-white'
                                    : 'text-gray-900 dark:text-gray-100',
                                  'relative cursor-default select-none py-2 pl-3 pr-9 flex items-center gap-3',
                                ]"
                              >
                                <component
                                  v-if="SOCIAL_PLATFORMS[option.value]?.icon"
                                  :is="SOCIAL_PLATFORMS[option.value]?.icon"
                                  :class="['w-5 h-5', active ? 'text-white' : 'text-emerald-500']"
                                  aria-hidden="true"
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
                                    active ? 'text-white' : 'text-emerald-500',
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

                    <!-- Platform Error Message -->
                    <p
                      v-if="r$.social_platform.$dirty && r$.social_platform.$error"
                      id="platform-error"
                      role="alert"
                      class="text-red-500 text-sm mt-1"
                    >
                      {{ r$.social_platform.$errors[0] }}
                    </p>
                  </div>

                  <!-- URL Input -->
                  <Input
                    id="link-url"
                    name="url"
                    type="url"
                    label="Link"
                    v-model="newButton.url"
                    :placeholder="
                      newButton.social_platform
                        ? SOCIAL_PLATFORMS[newButton.social_platform]?.placeholder
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
                        v-model="newButton.is_active"
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
                    :disabled="isCreating"
                  />
                  <Button type="submit" label="Add" :loading="isCreating" />
                </div>
              </form>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
