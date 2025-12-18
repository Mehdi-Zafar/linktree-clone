<script setup lang="ts">
import IconButton from '@/components/IconButton.vue'
import { useLinks } from '@/composables/useLinks'
import { SOCIAL_PLATFORMS } from '@/shared/config'
import { type Link, type LinkReorder } from '@/shared/types'
import { PencilIcon, PlusCircleIcon, TrashIcon } from '@heroicons/vue/24/outline'
import { watchEffect, computed, onMounted } from 'vue'
import { ref } from 'vue'
import draggableComponent from 'vuedraggable'
import AddButtonModal from '@/components/AddButtonModal.vue'
import EditButtonModal from '@/components/EditButtonModal.vue'
import AddLinkModal from '@/components/AddLinkModal.vue'
import EditLinkModal from '@/components/EditLinkModal.vue'
import ProfileImageModal from '@/components/ProfileImageModal.vue'
import Skeleton from '@/components/Skeleton.vue'
import { useConfirm } from '@/composables/useConfirm'
import Button from '@/components/Button.vue'
import { useAuthStore } from '@/stores/auth'
import Avatar from '@/components/Avatar.vue'
import { useRouter } from 'vue-router'
import { showToast } from '@/shared/utils'

const { buttons, links, deleteLink, reorderLinks, isDeleting, isLoading, isReordering } = useLinks()
const showAddButtonModal = ref(false)
const showEditButtonModal = ref(false)
const showAddLinkModal = ref(false)
const showEditLinkModal = ref(false)
const showProfileImageModal = ref(false)
const selectedLink = ref<Link | null>(null)
const { confirm } = useConfirm()
const authStore = useAuthStore()

// Create reactive lists for draggable UI
const userButtons = ref<Link[]>([])
const userLinks = ref<Link[]>([])
const router = useRouter()

onMounted(() => {
  if (authStore.user && !authStore.user.is_verified) {
    router.push(`/profile/${authStore.user.username}`)
    showToast('Verify your email to access the edit profile page', 'error')
  }
})

// ✅ Watch API data and populate when ready
watchEffect(() => {
  if (buttons.value && buttons.value.length) {
    userButtons.value = [...buttons.value].sort((a, b) => a.position - b.position)
  }
  if (links.value && links.value.length) {
    userLinks.value = [...links.value].sort((a, b) => a.position - b.position)
  }
})

// ✅ Check if order has changed for buttons
const hasButtonsOrderChanged = computed(() => {
  if (!buttons.value || userButtons.value.length !== buttons.value.length) {
    return false
  }

  // Compare IDs in order
  const originalOrder = [...buttons.value].sort((a, b) => a.position - b.position).map((b) => b.id)

  const currentOrder = userButtons.value.map((b) => b.id)

  return JSON.stringify(originalOrder) !== JSON.stringify(currentOrder)
})

// ✅ Check if order has changed for links
const hasLinksOrderChanged = computed(() => {
  if (!links.value || userLinks.value.length !== links.value.length) {
    return false
  }

  // Compare IDs in order
  const originalOrder = [...links.value].sort((a, b) => a.position - b.position).map((l) => l.id)

  const currentOrder = userLinks.value.map((l) => l.id)

  return JSON.stringify(originalOrder) !== JSON.stringify(currentOrder)
})

// ✅ Save buttons reorder
const saveButtonsOrder = async () => {
  const reorderData: LinkReorder[] = userButtons.value.map((button, index) => ({
    link_id: button.id,
    new_position: index,
  }))

  await reorderLinks(reorderData)
}

// ✅ Save links reorder
const saveLinksOrder = async () => {
  const reorderData: LinkReorder[] = userLinks.value.map((link, index) => ({
    link_id: link.id,
    new_position: index,
  }))

  await reorderLinks(reorderData)
}

// ✅ Cancel buttons reorder
const cancelButtonsReorder = () => {
  if (buttons.value) {
    userButtons.value = [...buttons.value].sort((a, b) => a.position - b.position)
  }
}

// ✅ Cancel links reorder
const cancelLinksReorder = () => {
  if (links.value) {
    userLinks.value = [...links.value].sort((a, b) => a.position - b.position)
  }
}

const editButton = (link: Link) => {
  selectedLink.value = link
  showEditButtonModal.value = true
}

const editLink = (link: Link) => {
  selectedLink.value = link
  showEditLinkModal.value = true
}

const closeEditButtonModal = () => {
  showEditButtonModal.value = false
  selectedLink.value = null
}

const closeEditLinkModal = () => {
  showEditLinkModal.value = false
  selectedLink.value = null
}

const handleDelete = (id: number) => {
  confirm({
    title: 'Delete Item',
    message: 'Are you sure?',
    variant: 'danger',
    onConfirm: async () => {
      await deleteLink(id)
    },
  })
}
</script>

<template>
  <div class="relative">
    <div class="relative flex flex-col items-center justify-center gap-4 mt-8">
      <div class="relative">
        <Avatar
          :src="authStore?.user?.avatar_url"
          :name="authStore?.user?.full_name"
          alt=""
          class="w-32 h-32 rounded-full"
          initials-class="text-3xl"
        />
        <IconButton
          btnClass="absolute top-0 right-0 w-fit"
          :onClick="() => (showProfileImageModal = true)"
        >
          <template #icon>
            <PencilIcon class="w-5" />
          </template>
        </IconButton>
      </div>

      <!-- BUTTONS SECTION -->
      <div class="min-w-xl mt-16 mb-8">
        <div class="flex justify-between items-center">
          <h2 class="text-left text-2xl">Buttons</h2>
          <IconButton
            btnClass="w-fit p-0 bg-transparent hover:bg-transparent"
            :onClick="() => (showAddButtonModal = true)"
          >
            <template #icon>
              <PlusCircleIcon class="w-10 text-emerald-500" />
            </template>
          </IconButton>
        </div>

        <div class="my-4">
          <Skeleton v-if="isLoading" />
          <div v-else-if="userButtons?.length === 0">
            <h2 class="text-center">No Buttons present!</h2>
          </div>
          <div v-else>
            <draggableComponent
              v-model="userButtons"
              tag="ul"
              item-key="id"
              handle=".drag-handle"
              class="space-y-3"
            >
              <template #item="{ element: button }">
                <li
                  class="flex items-center gap-3 bg-white dark:bg-gray-800 p-3 rounded-lg cursor-default"
                >
                  <!-- Drag handle -->
                  <span
                    class="drag-handle cursor-grab active:cursor-grabbing text-gray-500 dark:text-gray-400"
                    title="Drag to reorder"
                  >
                    ⋮⋮
                  </span>

                  <!-- Platform icon -->
                  <component
                    :is="SOCIAL_PLATFORMS[button.social_platform]?.icon"
                    class="w-5 h-5 text-emerald-500"
                  />

                  <!-- Platform name -->
                  <span
                    class="font-medium flex-1 flex items-center gap-2 text-gray-900 dark:text-gray-100"
                  >
                    {{ SOCIAL_PLATFORMS[button.social_platform]?.name }}
                    <span class="green-badge" v-if="button.is_active">Active</span>
                    <span class="red-badge" v-else>Inactive</span>
                  </span>

                  <!-- Actions -->
                  <div class="flex items-center gap-2">
                    <IconButton :onClick="() => editButton(button)">
                      <template #icon>
                        <PencilIcon class="w-5" />
                      </template>
                    </IconButton>
                    <IconButton :disabled="isDeleting" :onClick="() => handleDelete(button.id)">
                      <template #icon>
                        <TrashIcon class="w-5" />
                      </template>
                    </IconButton>
                  </div>
                </li>
              </template>
            </draggableComponent>

            <!-- ✅ Save/Cancel Buttons for Buttons Section -->
            <div v-if="hasButtonsOrderChanged" class="mt-4 flex justify-end gap-3 p-4">
              <Button
                label="Cancel"
                :onClick="cancelButtonsReorder"
                :disabled="isReordering"
                outline
              />
              <Button label="Save" :onClick="saveButtonsOrder" :loading="isReordering" />
            </div>
          </div>
        </div>
      </div>

      <!-- LINKS SECTION -->
      <div class="min-w-xl my-8">
        <div class="flex justify-between items-center">
          <h2 class="text-left text-2xl">Links</h2>
          <IconButton
            btnClass="w-fit p-0 bg-transparent hover:bg-transparent"
            :onClick="() => (showAddLinkModal = true)"
          >
            <template #icon>
              <PlusCircleIcon class="w-10 text-emerald-500" />
            </template>
          </IconButton>
        </div>

        <div class="my-4">
          <Skeleton v-if="isLoading" />
          <div v-else-if="userLinks?.length === 0">
            <h2 class="text-center">No Links present!</h2>
          </div>
          <div v-else>
            <draggableComponent
              v-model="userLinks"
              tag="ul"
              item-key="id"
              handle=".drag-handle"
              class="space-y-3"
            >
              <template #item="{ element: link }">
                <li
                  class="flex items-center gap-3 bg-white dark:bg-gray-800 p-3 rounded-lg cursor-default"
                >
                  <!-- Drag handle -->
                  <span
                    class="drag-handle cursor-grab active:cursor-grabbing text-gray-500 dark:text-gray-400"
                    title="Drag to reorder"
                  >
                    ⋮⋮
                  </span>

                  <!-- Platform icon -->
                  <component
                    :is="SOCIAL_PLATFORMS[link.social_platform]?.icon"
                    class="w-5 h-5 text-emerald-500"
                  />

                  <!-- Platform name -->
                  <span
                    class="font-medium flex-1 flex items-center gap-2 text-gray-900 dark:text-gray-100"
                  >
                    {{ link.title }}
                    <span class="green-badge" v-if="link.is_active">Active</span>
                    <span class="red-badge" v-else>Inactive</span>
                  </span>

                  <!-- Actions -->
                  <div class="flex items-center gap-2">
                    <IconButton :onClick="() => editLink(link)">
                      <template #icon>
                        <PencilIcon class="w-5" />
                      </template>
                    </IconButton>
                    <IconButton :disabled="isDeleting" :onClick="() => handleDelete(link.id)">
                      <template #icon>
                        <TrashIcon class="w-5" />
                      </template>
                    </IconButton>
                  </div>
                </li>
              </template>
            </draggableComponent>

            <!-- ✅ Save/Cancel Buttons for Links Section -->

            <div v-if="hasLinksOrderChanged" class="mt-4 flex gap-3 p-4">
              <Button
                label="Cancel"
                :onClick="cancelLinksReorder"
                :disabled="isReordering"
                outline
              />
              <Button label="Save" :onClick="saveLinksOrder" :loading="isReordering" />
            </div>
          </div>
        </div>
      </div>

      <!-- Modals -->
      <AddButtonModal :show="showAddButtonModal" @close="() => (showAddButtonModal = false)" />
      <EditButtonModal
        v-if="selectedLink"
        :show="showEditButtonModal"
        @close="closeEditButtonModal"
        :selectedButton="selectedLink"
      />
      <AddLinkModal :show="showAddLinkModal" @close="() => (showAddLinkModal = false)" />
      <EditLinkModal
        v-if="selectedLink"
        :show="showEditLinkModal"
        @close="closeEditLinkModal"
        :selectedLink="selectedLink"
      />
      <ProfileImageModal
        :show="showProfileImageModal"
        :on-close="() => (showProfileImageModal = false)"
      />
    </div>
  </div>
</template>
