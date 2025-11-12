<script setup lang="ts">
import profileImg from '@/assets/images/profile.jpg'
import IconButton from '@/components/IconButton.vue'
import { useLinks } from '@/composables/useLinks'
import { SOCIAL_PLATFORMS } from '@/shared/config'
import { type Link } from '@/shared/types'
import { PencilIcon, PlusCircleIcon, TrashIcon } from '@heroicons/vue/24/outline'
import { watchEffect } from 'vue'
import { ref } from 'vue'
import draggableComponent from 'vuedraggable'
import AddButtonModal from '@/components/AddButtonModal.vue'
import EditButtonModal from '@/components/EditButtonModal.vue'
import AddLinkModal from '@/components/AddLinkModal.vue'
import EditLinkModal from '@/components/EditLinkModal.vue'
import ProfileImageModal from '@/components/ProfileImageModal.vue'
import Skeleton from '@/components/Skeleton.vue'
import { useConfirm } from '@/composables/useConfirm'

const { links, buttons, deleteLink, isDeleting, isLoading } = useLinks()
const showAddButtonModal = ref(false)
const showEditButtonModal = ref(false)
const showAddLinkModal = ref(false)
const showEditLinkModal = ref(false)
const showProfileImageModal = ref(false)
const selectedLink = ref<Link | null>(null)
const { confirm } = useConfirm()

// Create a reactive list for draggable UI
const userButtons = ref<Link[]>([])
const userLinks = ref<Link[]>([])

// ✅ Watch API data and populate when ready
watchEffect(() => {
  if (buttons.value && buttons.value.length) {
    userButtons.value = [...buttons.value]
  }
  if (links.value && links.value.length) {
    userLinks.value = [...links.value]
  }
})

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
    <div class="relative max-w-xl h-64 mx-auto">
      <img
        :src="profileImg"
        alt=""
        class="w-full h-full object-cover brightness-75 rounded-lg mt-0.5"
      />
      <IconButton btnClass="absolute top-4 right-4 w-fit">
        <template #icon>
          <PencilIcon class="w-5" />
        </template>
      </IconButton>
    </div>
    <div class="relative -top-16 flex flex-col items-center justify-center gap-4">
      <div class="relative">
        <img
          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
          alt=""
          class="w-32 h-32 rounded-full"
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
            <h2 class="text-center">No Links present!</h2>
          </div>
          <draggableComponent
            v-model="userButtons"
            tag="ul"
            item-key="id"
            handle=".drag-handle"
            class="space-y-3"
            v-else
          >
            <template #item="{ element: button }">
              <li
                class="flex items-center gap-3 bg-white dark:bg-gray-800 p-3 rounded-lg cursor-default"
              >
                <!-- Drag handle (only this part triggers drag) -->
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

                <!-- Link -->
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
        </div>
      </div>
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
          <draggableComponent
            v-model="userLinks"
            tag="ul"
            item-key="id"
            handle=".drag-handle"
            class="space-y-3"
            v-else
          >
            <template #item="{ element: link }">
              <li
                class="flex items-center gap-3 bg-white dark:bg-gray-800 p-3 rounded-lg cursor-default"
              >
                <!-- Drag handle (only this part triggers drag) -->
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
                <span class="font-medium flex-1 text-gray-900 dark:text-gray-100">
                  {{ link.title }}
                  <span class="green-badge" v-if="link.is_active">Active</span>
                  <span class="red-badge" v-else>Inactive</span>
                </span>

                <!-- Link -->
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
        </div>
      </div>
      <AddButtonModal :show="showAddButtonModal" :on-close="() => (showAddButtonModal = false)" />
      <EditButtonModal
        v-if="selectedLink"
        :show="showEditButtonModal"
        :on-close="closeEditButtonModal"
        :selectedButton="selectedLink"
      />
      <AddLinkModal :show="showAddLinkModal" :on-close="() => (showAddLinkModal = false)" />
      <EditLinkModal
        v-if="selectedLink"
        :show="showEditLinkModal"
        :on-close="closeEditLinkModal"
        :selectedLink="selectedLink"
      />
      <ProfileImageModal
        :show="showProfileImageModal"
        :on-close="() => (showProfileImageModal = false)"
      />
    </div>
  </div>
</template>
