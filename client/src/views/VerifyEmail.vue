<template>
  <div class="flex flex-col items-center justify-center min-h-screen p-4">
    <div v-if="isLoading" class="text-center space-y-4">
      <div class="loader border-blue-500"></div>
      <p class="text-lg text-gray-700">Verifying your email…</p>
    </div>

    <div v-if="isSuccess" class="text-center space-y-4">
      <h2 class="text-2xl font-bold text-green-600">Email Verified 🎉</h2>
      <p class="text-gray-700">
        Your email has been successfully verified. You can now continue using your account.
      </p>
      <router-link to="/login" class="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700">
        Go to Login
      </router-link>
    </div>

    <div v-if="isError" class="text-center space-y-4">
      <h2 class="text-2xl font-bold text-red-600">Verification Failed 😕</h2>
      <p class="text-gray-700">{{ errorMessage }}</p>
      <router-link to="/" class="px-4 py-2 text-white bg-gray-600 rounded hover:bg-gray-700">
        Go Home
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { showToast } from '@/shared/utils'

const route = useRoute()
const router = useRouter()
const token = route.query.token

const authStore = useAuthStore()

const { verifyEmail } = authStore

onMounted(() => {
  if (!token) {
    showToast('Verification token is missing', 'error')
    router.push('/')
    return
  }
  if (token && typeof token === 'string') {
    verifyEmail(token)
  }
})
</script>

<style scoped>
.loader {
  /* Tailwind doesn’t have a built-in spin-loader with border only, so we style one */
  width: 3rem;
  height: 3rem;
  border-width: 4px;
  border-style: solid;
  border-radius: 9999px;
  border-top-color: transparent;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
