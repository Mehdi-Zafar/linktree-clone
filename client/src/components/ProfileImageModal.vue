<script setup lang="ts">
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from '@headlessui/vue'
interface Props {
  show: boolean
  onClose: () => void
}

const props = defineProps<Props>()
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
                Edit Profile Image
              </DialogTitle>

              <!-- Footer Buttons -->
              <div class="mt-6 flex justify-end gap-3">
                <!-- <Button type="button" :onClick="props.onClose" label="Cancel" :outline="true" /> -->
                <!-- <Button type="button" :onClick="addButton" label="Add" :loading="isCreating" /> -->
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
