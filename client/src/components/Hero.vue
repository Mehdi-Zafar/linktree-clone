<script setup lang="ts">
import { ref } from 'vue'
import Button from './Button.vue'
import Input from './Input.vue'
import heroImg from '@/assets/images/linktree-logo-icon.png'

const link = ref('linktree/')
</script>

<template>
  <div class="h-[80vh] py-8 px-32 grid grid-cols-12 gap-12">
    <div class="col-span-6 flex flex-col items-start justify-center gap-4 w-full">
      <h1 class="text-5xl font-extrabold text-emerald-500 uppercase leading-13">
        Everything you are. In one, simple link in bio.
      </h1>
      <h5 class="text-base opacity-70">Share your links, social profiles, contact info and more on one page.</h5>
      <div class="flex items-center gap-2 w-full">
        <Input containerClass="w-full flex-1 max-w-sm" inputClass="py-2" :model-value="link" />
        <Button label="Proceed" btnClass="py-2 w-fit" />
      </div>
    </div>
    <div class="col-span-3 col-start-9 flex justify-center items-center">
      <img :src="heroImg" alt="hero image" class="w-72 h-72 object-cover rounded-2xl" />
    </div>
  </div>
</template>
