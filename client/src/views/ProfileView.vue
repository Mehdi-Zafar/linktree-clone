<script setup lang="ts">
import profileImg from '@/assets/images/profile.jpg'
import Button from '@/components/Button.vue'
import { useLinks } from '@/composables/useLinks'
import { getPlatformConfig, SOCIAL_PLATFORMS } from '@/shared/config'
import { Link as LinkIcon } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'

const { links, buttons } = useLinks()

</script>

<template>
  <div class="relative">
    <img :src="profileImg" alt="" class="w-full h-64 object-cover brightness-75" />
    <RouterLink to="/profile/edit" class="absolute top-4 right-4 w-fit"
      ><Button label="Edit Profile"
    /></RouterLink>
    <div class="relative -top-16 flex flex-col items-center justify-center gap-4">
      <img
        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
        alt=""
        class="w-32 h-32 rounded-full"
      />
      <h1 class="text-2xl font-semibold">Alex Ferguson</h1>
      <p class="text-sm">A person located in Sydney, Australia.</p>
      <div class="flex items-center justify-center gap-4">
        <div
          v-for="button in buttons"
          class="bg-emerald-500 dark:bg-emerald-600 w-16 h-16 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 duration-250"
        >
          <component v-if="button.social_platform" :is="SOCIAL_PLATFORMS[button.social_platform]?.icon" class="w-8 text-lightText" />
        </div>
      </div>

      <div class="grid grid-cols-3 gap-x-8 gap-y-5 min-w-4xl mt-2">
        <div
          v-for="link in links"
          class="bg-emerald-500 dark:bg-emerald-600 flex items-center gap-4 w-full rounded-lg py-2 px-2 cursor-pointer hover:scale-105 duration-250"
        >
          <span class="w-10 h-10 text-lightText flex justify-center items-center rounded-lg"
            ><LinkIcon class="w-6"
          /></span>
          <h4 class="flex-1 text-lightText">{{ link.title }}</h4>
        </div>
      </div>
    </div>
  </div>
</template>
