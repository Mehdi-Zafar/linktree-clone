<script setup lang="ts">
import profileImg from '@/assets/images/profile.jpg'
import IconButton from '@/components/IconButton.vue'
import { useLinks } from '@/composables/useLinks'
import { SOCIAL_PLATFORMS } from '@/shared/config'
import { PencilIcon } from '@heroicons/vue/24/outline'
import { ref } from 'vue'
import draggableComponent from 'vuedraggable'

const { links, buttons } = useLinks()
</script>

<template>
  <div class="relative">
    <img :src="profileImg" alt="" class="w-full h-64 object-cover brightness-75" />
    <IconButton btnClass="absolute top-4 right-4 w-fit">
      <template #icon>
        <PencilIcon class="w-5" />
      </template>
    </IconButton>
    <div class="relative -top-16 flex flex-col items-center justify-center gap-4">
      <div class="relative">
        <img
          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
          alt=""
          class="w-32 h-32 rounded-full"
        />
        <IconButton btnClass="absolute top-0 right-0 w-fit">
          <template #icon>
            <PencilIcon class="w-5" />
          </template>
        </IconButton>
      </div>

      <draggableComponent v-model="buttons" tag="ul" item-key="id">
        <template #item="{ element: button }"
          ><li :itemid="button">
            <component :is="SOCIAL_PLATFORMS[button.social_platform]?.icon" class="w-5 h-5" /></li
        ></template>
      </draggableComponent>
    </div>
  </div>
</template>
