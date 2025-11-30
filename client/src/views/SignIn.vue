<script setup lang="ts">
import Button from '@/components/Button.vue'
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import logo from '@/assets/images/linktree-logo-icon.png'
import { EnvelopeIcon, LockClosedIcon } from '@heroicons/vue/24/outline'
import Input from '@/components/Input.vue'
import { useRegle } from '@regle/core'
import { required, email, withMessage } from '@regle/rules'
import { twMerge } from 'tailwind-merge'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'

const form = ref({
  email: '',
  password: '',
})

// Initialize Regle with validation rules
const { r$ } = useRegle(form, {
  email: {
    required: withMessage(required, 'Email is required'),
    email: withMessage(email, 'Invalid email'),
  },
  password: {
    required: withMessage(required, 'Password is required'),
  },
})

const authStore = useAuthStore()
const { isLoggingIn } = storeToRefs(authStore)
const { login } = authStore

const submit = async () => {
  await r$.$validate()

  if (!r$.$invalid && !isLoggingIn.value) {
    login(form.value)
  }
}
</script>

<template>
  <div class="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <RouterLink to="/"><img class="mx-auto h-16 w-auto" :src="logo" alt="LinkTree" /></RouterLink>
      <div class="mt-8 space-y-2">
        <h2 class="text-center text-3xl font-bold tracking-tight text-darkText dark:text-lightText">
          Welcome Back
        </h2>
        <h5 :class="twMerge('mutedText', 'text-center text-sm')">
          Enter your email and password to access your account.
        </h5>
      </div>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-sm">
      <form @submit.prevent="submit" method="POST">
        <div class="space-y-4">
          <Input
            name="email"
            id="email"
            type="email"
            label="Email Address"
            v-model="form.email"
            placeholder="Enter your email"
            @blur="r$.email.$touch()"
            :errorMessage="r$.email.$error ? r$.email.$errors[0] : null"
            :touched="r$.email.$dirty"
          >
            <template #leftIcon>
              <EnvelopeIcon class="inputIcon" />
            </template>
          </Input>
          <Input
            name="password"
            id="password"
            type="password"
            label="Password"
            v-model="form.password"
            placeholder="Enter your password"
            @blur="r$.password.$touch()"
            :errorMessage="r$.password.$error ? r$.password.$errors[0] : null"
            :touched="r$.password.$dirty"
          >
            <template #leftIcon>
              <LockClosedIcon class="inputIcon" />
            </template>
          </Input>
        </div>
        <div class="text-sm w-fit ml-auto mt-2">
          <RouterLink to="/forgot-password" class="link">Forgot password?</RouterLink>
        </div>

        <div class="mt-5">
          <Button label="Sign In" :loading="isLoggingIn" />
        </div>
      </form>

      <p class="mt-6 text-center text-sm/6 text-gray-600 dark:text-gray-400">
        Not a member?
        {{ ' ' }}
        <RouterLink to="/sign-up" class="link"> Sign Up </RouterLink>
      </p>
    </div>
  </div>
</template>
