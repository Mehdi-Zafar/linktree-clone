<script setup lang="ts">
import Button from '@/components/Button.vue'
import { SOCIAL_PLATFORMS } from '@/shared/config'
import { Link as LinkIcon } from 'lucide-vue-next'
import { RouterLink, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Skeleton from '@/components/Skeleton.vue'
import { usePublicProfile } from '@/composables/useUsers'
import { computed } from 'vue'
import Avatar from '@/components/Avatar.vue'

const { isAuthenticated, user } = useAuthStore()
const isCurrentUser = computed(() => isAuthenticated && user?.username === username)
const route = useRoute()
const username =
  (Array.isArray(route.params.username)
    ? route.params.username[0]
    : route.params.username !== undefined
      ? route.params.username
      : '') ?? ''
const { profile, links, buttons, isLoading } = usePublicProfile(username)
</script>

<template>
  <div class="relative max-w-xl mx-auto">
    <div class="relative flex flex-col items-center justify-center gap-4 mt-8">
      <!-- <img :src="profile?.avatar_url ?? ''" alt="" class="w-32 h-32 rounded-full" /> -->
      <Avatar :src="profile?.avatar_url" :name="profile?.full_name" alt="" class="w-32 h-32 rounded-full" initials-class="text-3xl" />
      <RouterLink v-if="isCurrentUser" to="/profile/edit" class="w-fit"
        ><Button label="Edit Profile"
      /></RouterLink>
      <h1 class="text-2xl font-semibold">{{ profile?.full_name }}</h1>
      <p class="text-base">{{ profile?.bio }}</p>
      <div class="flex items-center justify-center gap-4">
        <template v-if="isLoading">
          <Skeleton />
        </template>
        <template v-else-if="buttons?.length > 0">
          <a v-for="button in buttons" :href="button.url" target="_blank">
            <div
              class="bg-emerald-500 dark:bg-emerald-600 w-16 h-16 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 duration-250"
            >
              <component
                v-if="button.social_platform"
                :is="SOCIAL_PLATFORMS[button.social_platform]?.icon"
                class="w-8 text-lightText"
              />
            </div>
          </a>
        </template>
      </div>

      <template v-if="isLoading">
        <Skeleton />
      </template>
      <div
        v-else-if="links?.length > 0"
        class="grid grid-cols-2 justify-between gap-x-8 gap-y-5 min-w-lg mt-2"
      >
        <a v-for="link in links" :href="link.url" target="_blank">
          <div
            class="bg-emerald-500 dark:bg-emerald-600 flex items-center gap-4 w-full rounded-lg py-2 px-2 cursor-pointer hover:scale-105 duration-250"
          >
            <span class="w-10 h-10 text-lightText flex justify-center items-center rounded-lg"
              ><LinkIcon class="w-6"
            /></span>
            <h4 class="flex-1 text-lightText line-clamp-1">{{ link.title }}</h4>
          </div>
        </a>
      </div>
    </div>
  </div>
</template>
