<script setup lang="ts">
import Button from '@/components/Button.vue'
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import logo from '@/assets/images/linktree-logo-icon.png'
import { useRegle } from '@regle/core'
import { email, minLength, required, withMessage } from '@regle/rules'
import Input from '@/components/Input.vue'
import { EnvelopeIcon, LockClosedIcon, UserCircleIcon } from '@heroicons/vue/24/outline'
import { twMerge } from 'tailwind-merge'
import { useAuth } from '@/composables/useAuth'

const form = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
})

const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/
const usernameRegex = /^[a-zA-Z][a-zA-Z0-9_.-]*[a-zA-Z0-9]$|^[a-zA-Z]$/

// Initialize Regle with validation rules
const { r$ } = useRegle(form, {
  username: {
    required: withMessage(required, 'Username is required'),
    minLength: withMessage(minLength(6), 'Username should be atleast 6 characters'),
    complexity: withMessage((val) => {
      if (!val) return false
      return usernameRegex.test(val?.toString())
    }, 'Invalid Username'),
  },
  email: {
    required: withMessage(required, 'Email is required'),
    email: withMessage(email, 'Invalid email'),
  },
  password: {
    required: withMessage(required, 'Password is required'),
    // custom rule for complexity
    complexity: withMessage((val) => {
      if (!val) return false
      return passwordRegex.test(val?.toString())
    }, 'Password must be at least 8 characters, include a number and a special character'),
  },
  confirmPassword: {
    required: withMessage(required, 'Confirm Password is required'),
    match: withMessage((val) => {
      if (!val) return false
      // compare with password field
      return val === form.value.password
    }, 'Passwords do not match'),
  },
})
const { register, isRegistering } = useAuth()

const submit = async () => {
  await r$.$validate()

  if (!r$.$invalid) {
    console.log('Form is valid!', form.value)
    register(form.value)
  }
}
</script>

<template>
  <div class="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <RouterLink to="/"><img class="mx-auto h-16 w-auto" :src="logo" alt="LinkTree" /></RouterLink>
      <div class="mt-8 space-y-2">
        <h2 class="text-center text-3xl font-bold tracking-tight text-darkText dark:text-lightText">
          Create an Account
        </h2>
        <h5 :class="twMerge('mutedText', 'text-center text-sm')">
          Join now to streamline your experience from day one.
        </h5>
      </div>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-sm">
      <form @submit.prevent="submit" method="POST">
        <div class="space-y-4">
          <Input
            name="username"
            id="username"
            type="username"
            label="Username"
            v-model="form.username"
            placeholder="Enter your username"
            @blur="r$.username.$touch()"
            :errorMessage="r$.username.$error ? r$.username.$errors[0] : null"
            :touched="r$.username.$dirty"
          >
            <template #icon>
              <UserCircleIcon class="inputIcon" />
            </template>
          </Input>
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
            <template #icon>
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
            :isPassword="true"
          >
            <template #icon>
              <LockClosedIcon class="inputIcon" />
            </template>
          </Input>
          <Input
            name="confirmPassword"
            id="confirmPassword"
            type="password"
            label="Confirm Password"
            v-model="form.confirmPassword"
            placeholder="Enter your password"
            @blur="r$.confirmPassword.$touch()"
            :errorMessage="r$.confirmPassword.$error ? r$.confirmPassword.$errors[0] : null"
            :touched="r$.confirmPassword.$dirty"
            :isPassword="true"
          >
            <template #icon>
              <LockClosedIcon class="inputIcon" />
            </template>
          </Input>
        </div>

        <div class="mt-5">
          <Button label="Sign Up" :onClick="submit" :loading="isRegistering" />
        </div>
      </form>

      <p class="mt-6 text-center text-sm/6 text-gray-600 dark:text-gray-400">
        Already a member?
        {{ ' ' }}
        <RouterLink to="/sign-in" class="link"> Sign In </RouterLink>
      </p>
    </div>
  </div>
</template>
