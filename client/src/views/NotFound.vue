<script setup lang="ts">
import Button from '@/components/Button.vue'
import { useRouter } from 'vue-router'
const router = useRouter()

function goToHome() {
  router.push('/')
}
</script>

<template>
  <div class="h-screen flex flex-col justify-center items-center gap-4">
    <h2 class="text-2xl text-darkText dark:text-lightText">Not Found!</h2>
    <Button label="Back To Home" :onClick="goToHome" btnClass="w-fit text-sm py-3 px-4" />
  </div>
</template>
