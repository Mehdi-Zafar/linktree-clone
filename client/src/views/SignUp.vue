<script setup lang="ts">
import Button from '@/components/Button.vue'
import { computed, onMounted, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import logo from '@/assets/images/linktree-logo-icon.png'
import { useRegle } from '@regle/core'
import { email, minLength, required, withMessage } from '@regle/rules'
import Input from '@/components/Input.vue'
import {
  CheckCircleIcon,
  EnvelopeIcon,
  LockClosedIcon,
  UserCircleIcon,
  XCircleIcon,
} from '@heroicons/vue/24/outline'
import { twMerge } from 'tailwind-merge'
import { useEmailValidation, useUsernameValidation } from '@/composables/useValidation'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import { useDebounceFn } from '@vueuse/core'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const usernameFromQuery = ref(route.query.username)
const form = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
})
const isUsernameValid = ref(false)
const isEmailValid = ref(false)
const usernameError = computed(() => {
  // First check if query has been executed and username is taken
  if (usernameValidation.value && !usernameValidation.value.available) {
    return usernameValidation.value.message
  }

  // Otherwise, show Regle validation errors
  if (r$.username.$error) {
    return r$.username.$errors[0]
  }

  return null
})

const emailError = computed(() => {
  // First check if query has been executed and email is taken
  if (emailValidation.value && !emailValidation.value.available) {
    return emailValidation.value.message
  }

  // Otherwise, show Regle validation errors
  if (r$.email.$error) {
    return r$.email.$errors[0]
  }

  return null
})

const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/
const usernameRegex = /^[a-zA-Z][a-zA-Z0-9_.-]*[a-zA-Z0-9]$|^[a-zA-Z]$/
const specialCharacterRegex = /(?=.*[^A-Za-z0-9])/
const numberRegex = /(?=.*\d)/

// Initialize Regle with validation rules
const { r$ } = useRegle(
  form,
  {
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
      }, 'Invalid Password'),
    },
    confirmPassword: {
      required: withMessage(required, 'Confirm Password is required'),
      match: withMessage((val) => {
        if (!val) return false
        // compare with password field
        return val === form.value.password
      }, 'Passwords do not match'),
    },
  },
  { lazy: true },
)
const { register, isRegistering } = useAuthStore()

const {
  data: emailValidation,
  isFetching: isEmailLoading,
  status: emailStatus,
  refetch: checkEmail,
} = useEmailValidation(computed(() => form.value.email))

const {
  data: usernameValidation,
  isFetching: isUsernameLoading,
  status: usernameStatus,
  refetch: checkUsername,
} = useUsernameValidation(computed(() => form.value.username))

const usernameChange = useDebounceFn(async () => {
  if (r$.username.$invalid || !form.value.username) return
  await checkUsername()
  isUsernameValid.value = !!usernameValidation.value?.available
}, 500)

const emailChange = useDebounceFn(async () => {
  if (r$.email.$invalid || !form.value.email) return
  await checkEmail()
  isEmailValid.value = !!emailValidation.value?.available
}, 500)

onMounted(() => {
  // If username is present in query, set it in form and validate
  if (usernameFromQuery.value) {
    form.value.username = usernameFromQuery.value.toString()
    r$.username.$touch()
    usernameChange()
  }
})

const submit = async () => {
  await r$.$validate()

  if (!r$.$invalid && !(usernameError.value || emailError.value)) {
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
            :errorMessage="usernameError"
            :touched="r$.username.$dirty"
            @input="usernameChange()"
          >
            <template #leftIcon>
              <UserCircleIcon class="inputIcon" />
            </template>
            <template #rightIcon v-if="!r$.username.$invalid && form.username">
              <div class="absolute w-5 top-1/2 right-3 -translate-y-1/2 opacity-70 cursor-pointer">
                <template v-if="isUsernameLoading">
                  <LoadingSpinner :size="20" />
                </template>
                <template v-else-if="usernameStatus !== 'pending'">
                  <CheckCircleIcon v-if="isUsernameValid" class="text-emerald-500" />
                  <XCircleIcon v-else-if="!isUsernameValid" class="text-red-500" />
                </template>
              </div>
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
            :errorMessage="emailError"
            :touched="r$.email.$dirty"
            @input="emailChange()"
          >
            <template #leftIcon>
              <EnvelopeIcon class="inputIcon" />
            </template>
            <template #rightIcon v-if="!r$.email.$invalid && form.email">
              <div class="absolute w-5 top-1/2 right-3 -translate-y-1/2 opacity-70 cursor-pointer">
                <template v-if="isEmailLoading">
                  <LoadingSpinner :size="20" />
                </template>
                <template v-else-if="emailStatus !== 'pending'">
                  <CheckCircleIcon v-if="isEmailValid" class="text-emerald-500" />
                  <XCircleIcon v-else-if="!isEmailValid" class="text-red-500" />
                </template>
              </div>
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

          <div>
            <ul class="text-xs space-y-2 list-disc ml-4">
              <li>
                <div class="flex items-center gap-2">
                  Password must be atleast 8 characters {{ r$.password.$dirty }}
                  <CheckCircleIcon v-if="form.password?.length >= 8" class="w-5 text-emerald-500" />
                  <XCircleIcon v-else class="w-5 text-red-500" />
                </div>
              </li>
              <li>
                <div class="flex items-center gap-2">
                  Password must include atleast 1 number
                  <CheckCircleIcon
                    v-if="numberRegex.test(form.password)"
                    class="w-5 text-emerald-500"
                  />
                  <XCircleIcon v-else class="w-5 text-red-500" />
                </div>
              </li>
              <li>
                <div class="flex items-center gap-2">
                  Password must include atleast 1 special character<CheckCircleIcon
                    v-if="specialCharacterRegex.test(form.password)"
                    class="w-5 text-emerald-500"
                  />
                  <XCircleIcon v-else class="w-5 text-red-500" />
                </div>
              </li>
            </ul>
          </div>
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
          >
            <template #leftIcon>
              <LockClosedIcon class="inputIcon" />
            </template>
          </Input>
        </div>

        <div class="mt-5">
          <Button label="Sign Up" :loading="isRegistering" />
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
