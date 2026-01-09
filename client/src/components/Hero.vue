<script setup lang="ts">
import { ref } from 'vue'
import Button from './Button.vue'
import Input from './Input.vue'
import heroImg from '@/assets/images/linktree-logo-icon.png'
import { useRouter } from 'vue-router'
import { showToast } from '@/shared/utils'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'

const link = ref('')
const router = useRouter()
const authStore = useAuthStore()
const { isAuthenticated, user } = storeToRefs(authStore)

function navigateToSignUp() {
  if (link.value.trim() === '') {
    showToast('Please enter a username', 'error')
    return
  }
  if (link.value.length < 6) {
    showToast('Username must be at least 6 characters long', 'error')
    return
  }
  if (isAuthenticated.value) {
    showToast('You are already logged in', 'info')
    return
  }
  router.push({
    path: '/sign-up',
    query: { username: link.value },
  })
}
</script>

<template>
  <div class="h-[80vh] py-8 px-32 grid grid-cols-12 gap-12">
    <div class="col-span-6 flex flex-col items-start justify-center gap-4 w-full">
      <h1 class="text-5xl font-extrabold text-emerald-500 uppercase leading-13">
        Everything you are. In one, simple link in bio.
      </h1>
      <h5 class="text-base opacity-70">
        Share your links, social profiles, contact info and more on one page.
      </h5>
      <div class="flex items-center gap-2 w-full">
        <div
          class="w-full flex-1 max-w-sm flex items-center gap-1 py-2 border border-gray-300 dark:border-gray-700 rounded-md pl-3 text-sm"
        >
          <span class="opacity-70">linktree/</span>
          <Input
            containerClass="w-full flex-1"
            inputClass="py-0 px-0 border-none bg-transparent"
            v-model="link"
            placeholder="Enter a username"
          />
        </div>
        <Button label="Proceed" btnClass="py-2 w-fit" :onClick="navigateToSignUp" />
      </div>
    </div>
    <div class="col-span-3 col-start-9 flex justify-center items-center">
      <img :src="heroImg" alt="hero image" class="w-72 h-72 object-cover rounded-2xl" />
    </div>
  </div>
</template>
