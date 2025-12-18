// stores/auth.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import type {
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  LoginCredentials,
  RegisterData,
  ResetPasswordRequest,
} from '@/shared/types'
import { authApi } from '@/api/auth.api'
import { useRouter } from 'vue-router'
import { showToast } from '@/shared/utils'
import { is } from 'zod/locales'

export const useAuthStore = defineStore('auth', () => {
  const queryClient = useQueryClient()
  const router = useRouter()

  // ============ STATE ============
  const accessToken = ref<string | null>(null)
  const isInitialized = ref(false)
  const isInitializing = ref(false)

  // ============ COMPUTED ============
  const isAuthenticated = computed(() => !!accessToken.value)

  // ============ USER QUERY ============
  const userQuery = useQuery({
    queryKey: ['currentUser'],
    queryFn: authApi.getCurrentUser,
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
    retry: false,
  })

  // ============ LOGIN MUTATION ============
  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const response = await authApi.login(credentials)
      accessToken.value = response.access_token
      return response
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['currentUser'] })
      const user = await queryClient.ensureQueryData({
        queryKey: ['currentUser'],
        queryFn: authApi.getCurrentUser,
      })
      showToast('Sign in success!', 'success')
      router.push(user?.username ? `/profile/${user.username}` : '/dashboard')
    },
    onError: (error: any) => {
      showToast(error.response?.data?.detail || 'Login failed', 'error')
    },
  })

  // ============ REGISTER MUTATION ============
  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: () => {
      showToast('Sign up success! Please sign in.', 'success')
      router.push('/sign-in')
    },
    onError: (error: any) => {
      showToast(error.response?.data?.detail || 'Registration failed', 'error')
    },
  })

  // ============ ACTIONS ============
  const initialize = async () => {
    if (isInitialized.value || isInitializing.value) return
    isInitializing.value = true
    try {
      const response = await authApi.refresh()
      accessToken.value = response.access_token
      await queryClient.invalidateQueries({ queryKey: ['currentUser'] })
    } catch (error) {
      accessToken.value = null
    } finally {
      isInitializing.value = false
      isInitialized.value = true
    }
  }

  const logout = async () => {
    try {
      await authApi.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      accessToken.value = null
      queryClient.clear()
      showToast('Signed out successfully', 'success')
      router.push('/sign-in')
    }
  }

  const verifyEmailMutation = useMutation({
    mutationFn: (token: string) => authApi.verifyEmail(token),
    onSuccess: () => {
      // Show success message
      showToast('Email verified successfully!', 'success')
      // Redirect to dashboard
      router.push('/')
    },
    onError: (error: any) => {
      // Handle specific errors
      if (error.response?.status === 400) {
        showToast('Invalid or expired verification link', 'error')
      } else if (error.response?.status === 409) {
        showToast('Email already verified', 'error')
      } else {
        showToast('Verification failed. Please try again.', 'error')
      }
      router.push('/')
    },
    retry: false,
  })

  const forgotPasswordMutation = useMutation({
    mutationFn: (data: ForgotPasswordRequest) => authApi.forgotPassword(data),
    onSuccess: (response: ForgotPasswordResponse) => {
      showToast(
        response?.message ?? 'Password reset email sent! Please check your inbox.',
        'success',
      )
    },
    onError: (error: any) => {
      showToast(error.response?.data?.detail || 'Forgot Password failed', 'error')
    },
  })

  // reset password
  const resetPasswordMutation = useMutation({
    mutationFn: (data: ResetPasswordRequest) => authApi.resetPassword(data),
    onSuccess: () => {
      showToast('Password reset successfull!', 'success')
      router.push('/sign-in')
    },
    onError: (error: any) => {
      showToast(error.response?.data?.detail || 'Reset Password failed', 'error')
    },
  })

  const resendVerificationEmailMutation = useMutation({
    mutationFn: () => authApi.resendVerificationEmail(),
    onSuccess: () => {
      showToast('Verification email sent successfully!', 'success')
    },
    onError: (error: any) => {
      showToast(error.response?.data?.detail || 'Failed to resend verification email', 'error')
    },
  })

  // ============ RETURN ============
  return {
    // State
    user: computed(() => userQuery.data.value),
    isAuthenticated,
    isInitialized,
    isLoading: computed(
      () =>
        userQuery.isLoading.value ||
        loginMutation.isPending.value ||
        registerMutation.isPending.value,
    ),
    accessToken,

    // Actions
    initialize,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout,
    refetchUser: userQuery.refetch,
    verifyEmail: verifyEmailMutation.mutateAsync,
    forgotPassword: forgotPasswordMutation.mutateAsync,
    resetPassword: resetPasswordMutation.mutateAsync,
    resendVerificationEmail: resendVerificationEmailMutation.mutateAsync,

    // Mutation states
    isLoggingIn: computed(() => loginMutation.isPending.value),
    isRegistering: computed(() => registerMutation.isPending.value),
    loginError: computed(() => loginMutation.error.value),
    registerError: computed(() => registerMutation.error.value),
    isForgettingPassword: computed(() => forgotPasswordMutation.isPending.value),
    forgotPasswordError: computed(() => forgotPasswordMutation.error.value),
    isResettingPassword: computed(() => resetPasswordMutation.isPending.value),
    resetPasswordError: computed(() => resetPasswordMutation.error.value),
    isResendingVerificationEmail: computed(() => resendVerificationEmailMutation.isPending.value),
    resendVerificationEmailError: computed(() => resendVerificationEmailMutation.error.value),
  }
})
