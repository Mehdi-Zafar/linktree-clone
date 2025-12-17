<script setup lang="ts">
import Button from '@/components/Button.vue'
import Input from '@/components/Input.vue'
import { ref } from 'vue'
import { useRegle } from '@regle/core'
import { required, email, withMessage } from '@regle/rules'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'
import { showToast } from '@/shared/utils'

const form = ref({ email: '' })

const { r$ } = useRegle(form, {
  email: {
    required: withMessage(required, 'Email is required'),
    email: withMessage(email, 'Invalid email'),
  },
})

const authStore = useAuthStore()
const { isForgettingPassword } = storeToRefs(authStore)

const submit = async () => {
  await r$.$validate()

  if (!r$.$invalid && !isForgettingPassword.value) {
    authStore.forgotPassword(form.value, {
      onSuccess: () => {
        r$.$reset({ toInitialState: true })
        // showToast('If an account exists, an email has been sent.', 'success')
      },
    })
  }
}
</script>

<template>
  <div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm text-center">
      <h2 class="text-3xl font-bold">Forgot Password</h2>
      <p class="mutedText text-sm mt-2">Enter your email and we’ll send you a reset link.</p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-sm">
      <form @submit.prevent="submit">
        <div class="space-y-4">
          <Input
            name="email"
            id="email"
            label="Email Address"
            v-model="form.email"
            placeholder="Enter your email"
            @blur="r$.email.$touch()"
            :errorMessage="r$.email.$error ? r$.email.$errors[0] : null"
            :touched="r$.email.$dirty"
          />
        </div>

        <div class="mt-5">
          <Button label="Send Reset Link" :loading="isForgettingPassword" />
        </div>
      </form>
    </div>
  </div>
</template>
