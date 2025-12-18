<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import Button from '@/components/Button.vue'
import Input from '@/components/Input.vue'
import { useRegle } from '@regle/core'
import { required, withMessage } from '@regle/rules'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'
import { numberRegex, passwordRegex, specialCharacterRegex } from '@/shared/config'
import { CheckCircleIcon, LockClosedIcon, XCircleIcon } from '@heroicons/vue/24/outline'
import type { ResetPasswordRequest } from '@/shared/types'

const route = useRoute()
const token = route.query.token as string

const form = ref({
  new_password: '',
  confirm_password: '',
})

const { r$ } = useRegle(form, {
  new_password: {
    required: withMessage(required, 'Password is required'),
    // custom rule for complexity
    complexity: withMessage((val) => {
      if (!val) return false
      return passwordRegex.test(val?.toString())
    }, 'Invalid Password'),
  },
  confirm_password: {
    required: withMessage(required, 'Confirm Password is required'),
    match: withMessage((val) => {
      if (!val) return false
      // compare with password field
      return val === form.value.new_password
    }, 'Passwords do not match'),
  },
})

const authStore = useAuthStore()
const { isResettingPassword } = storeToRefs(authStore)

const submit = async () => {
  await r$.$validate()

  if (!r$.$invalid && !isResettingPassword.value) {
    const resetPasswordRequest: ResetPasswordRequest = {
      token,
      new_password: form.value.new_password,
    }
    authStore.resetPassword(resetPasswordRequest, {
      onSuccess: () => {},
    })
  }
}
</script>

<template>
  <div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm text-center">
      <h2 class="text-3xl font-bold">Reset Password</h2>
      <p class="mutedText text-sm mt-2">Enter a new password for your account.</p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-sm">
      <form @submit.prevent="submit">
        <div class="space-y-4">
          <Input
            name="new_password"
            id="new_password"
            type="password"
            label="New Password"
            v-model="form.new_password"
            placeholder="Enter your password"
            @blur="r$.new_password.$touch()"
            :errorMessage="r$.new_password.$error ? r$.new_password.$errors[0] : null"
            :touched="r$.new_password.$dirty"
          >
            <template #leftIcon>
              <LockClosedIcon class="inputIcon" />
            </template>
          </Input>

          <div>
            <ul class="text-xs space-y-2 list-disc ml-4">
              <li>
                <div class="flex items-center gap-2">
                  Password must be atleast 8 characters {{ r$.new_password.$dirty }}
                  <CheckCircleIcon
                    v-if="form.new_password?.length >= 8"
                    class="w-5 text-emerald-500"
                  />
                  <XCircleIcon v-else class="w-5 text-red-500" />
                </div>
              </li>
              <li>
                <div class="flex items-center gap-2">
                  Password must include atleast 1 number
                  <CheckCircleIcon
                    v-if="numberRegex.test(form.new_password)"
                    class="w-5 text-emerald-500"
                  />
                  <XCircleIcon v-else class="w-5 text-red-500" />
                </div>
              </li>
              <li>
                <div class="flex items-center gap-2">
                  Password must include atleast 1 special character<CheckCircleIcon
                    v-if="specialCharacterRegex.test(form.new_password)"
                    class="w-5 text-emerald-500"
                  />
                  <XCircleIcon v-else class="w-5 text-red-500" />
                </div>
              </li>
            </ul>
          </div>
          <Input
            name="confirm_password"
            id="confirm_password"
            type="password"
            label="Confirm Password"
            v-model="form.confirm_password"
            placeholder="Enter your password"
            @blur="r$.confirm_password.$touch()"
            :errorMessage="r$.confirm_password.$error ? r$.confirm_password.$errors[0] : null"
            :touched="r$.confirm_password.$dirty"
          >
            <template #leftIcon> <LockClosedIcon class="inputIcon" /> </template
          ></Input>
        </div>

        <div class="mt-5">
          <Button label="Reset Password" :loading="isResettingPassword" />
        </div>
      </form>
    </div>
  </div>
</template>
