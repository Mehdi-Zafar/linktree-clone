// composables/useConfirm.ts
import { inject } from 'vue'
import type { ConfirmationOptions } from '@/components/ConfirmationModal.vue'

export function useConfirm() {
  const confirmModal = inject<any>('confirmModal')

  const confirm = (options: ConfirmationOptions) => {
    confirmModal?.value?.open(options)
  }

  return { confirm }
}
