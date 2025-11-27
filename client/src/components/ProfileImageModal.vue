<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import {
  UserIcon,
  PhotoIcon,
  TrashIcon,
  CloudArrowUpIcon,
  ArrowPathIcon,
} from '@heroicons/vue/24/outline'
import { useAuthStore } from '@/stores/auth'
import { useConfirm } from '@/composables/useConfirm'
import { showToast } from '@/shared/utils'
import { useAvatarUpload } from '@/composables/useUsers'

interface Props {
  show: boolean
  onClose: () => void
}

const props = defineProps<Props>()

const authStore = useAuthStore()
const { uploadAvatar, deleteAvatar, isUploading, uploadProgress } = useAvatarUpload()
const { confirm } = useConfirm()

const selectedFile = ref<File | null>(null)
const previewUrl = ref<string>('')

const currentAvatar = computed(() => authStore.user?.avatar_url)

// Handle file selection
const handleFileSelect = (event: Event) => {debugger
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (!file) return

  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/avif']
  console.log(file.type)
  if (!allowedTypes.includes(file.type)) {
    showToast('Only JPG, PNG, WebP and Avif images are allowed', 'error')
    target.value = ''
    return
  }

  // Validate file size (5MB)
  const maxSize = 5 * 1024 * 1024
  if (file.size > maxSize) {
    showToast('File size must be less than 5MB', 'error')
    target.value = ''
    return
  }

  // Set selected file
  selectedFile.value = file

  // Create preview URL
  const reader = new FileReader()
  reader.onload = (e) => {
    previewUrl.value = e.target?.result as string
  }
  reader.readAsDataURL(file)

  // Reset input
  target.value = ''
}

// Handle upload
const handleUpload = async () => {
  if (!selectedFile.value) return

  const result = await uploadAvatar(selectedFile.value)

  if (result) {
    // Reset state
    selectedFile.value = null
    previewUrl.value = ''
    // Close modal
    props.onClose()
  }
}

// Handle remove avatar
const handleRemove = () => {
  confirm({
    title: 'Remove Profile Picture',
    message: 'Are you sure you want to remove your profile picture?',
    confirmText: 'Remove',
    cancelText: 'Cancel',
    variant: 'danger',
    onConfirm: async () => {
      await deleteAvatar()
      props.onClose()
    },
  })
}

// Handle close
const handleClose = () => {
  if (isUploading.value) {
    showToast('Please wait for upload to complete', 'warning')
    return
  }

  // Reset state
  selectedFile.value = null
  previewUrl.value = ''
  props.onClose()
}

// Reset state when modal closes
watch(
  () => props.show,
  (newShow) => {
    if (!newShow) {
      selectedFile.value = null
      previewUrl.value = ''
    }
  },
)
</script>

<template>
  <TransitionRoot appear :show="show" as="template">
    <Dialog as="div" @close="handleClose" class="relative z-50">
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
        <div class="flex min-h-full items-center justify-center p-4">
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
              class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all"
            >
              <!-- Header -->
              <DialogTitle
                as="h3"
                class="text-lg font-semibold leading-6 text-gray-900 dark:text-gray-100 mb-4"
              >
                Update Profile Picture
              </DialogTitle>

              <!-- Avatar Preview -->
              <div class="flex flex-col items-center gap-4 mb-6">
                <div class="relative w-32 h-32">
                  <!-- Current/Preview Image -->
                  <img
                    v-if="previewUrl || currentAvatar"
                    :src="(previewUrl || currentAvatar) ?? ''"
                    alt="Avatar"
                    class="w-full h-full rounded-full object-cover border-4 border-gray-200 dark:border-gray-700"
                  />
                  <!-- Placeholder if no avatar -->
                  <div
                    v-else
                    class="w-full h-full rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center"
                  >
                    <UserIcon class="w-16 h-16 text-gray-400 dark:text-gray-500" />
                  </div>

                  <!-- Upload Progress Overlay -->
                  <div
                    v-if="isUploading"
                    class="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center"
                  >
                    <div class="text-center">
                      <svg
                        class="animate-spin h-8 w-8 text-white mx-auto mb-2"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          class="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          stroke-width="4"
                        ></circle>
                        <path
                          class="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <p class="text-white text-sm">{{ uploadProgress }}%</p>
                    </div>
                  </div>
                </div>

                <!-- File info if new file selected -->
                <div v-if="selectedFile" class="text-center">
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    {{ selectedFile.name }}
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-500">
                    {{ (selectedFile.size / 1024 / 1024).toFixed(2) }} MB
                  </p>
                </div>
              </div>

              <!-- Actions -->
              <div class="space-y-3">
                <!-- Select New Image Button -->
                <label
                  v-if="!selectedFile"
                  for="avatar-file-input"
                  class="w-full inline-flex justify-center items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer transition-colors"
                >
                  <PhotoIcon class="w-5 h-5" />
                  Choose New Picture
                  <input
                    id="avatar-file-input"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp,image/avif"
                    class="hidden"
                    @change="handleFileSelect"
                  />
                </label>

                <!-- Change Selection Button (if file already selected) -->
                <label
                  v-else
                  for="avatar-file-input-change"
                  class="w-full inline-flex justify-center items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer transition-colors"
                >
                  <ArrowPathIcon class="w-5 h-5" />
                  Choose Different Picture
                  <input
                    id="avatar-file-input-change"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    class="hidden"
                    @change="handleFileSelect"
                  />
                </label>

                <!-- Upload Button (only show if new file selected) -->
                <button
                  v-if="selectedFile"
                  @click="handleUpload"
                  :disabled="isUploading"
                  class="w-full inline-flex justify-center items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <CloudArrowUpIcon class="w-5 h-5" />
                  {{ isUploading ? 'Uploading...' : 'Upload Picture' }}
                </button>

                <!-- Remove Avatar Button (only if current avatar exists and no new file) -->
                <button
                  v-if="currentAvatar && !selectedFile"
                  @click="handleRemove"
                  :disabled="isUploading"
                  class="w-full inline-flex justify-center items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <TrashIcon class="w-5 h-5" />
                  Remove Picture
                </button>

                <!-- Cancel Button -->
                <button
                  @click="handleClose"
                  :disabled="isUploading"
                  class="w-full inline-flex justify-center rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Cancel
                </button>
              </div>

              <!-- Info Text -->
              <p class="mt-4 text-xs text-gray-500 dark:text-gray-400 text-center">
                Supported formats: JPG, PNG, WebP • Max size: 5MB
              </p>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
