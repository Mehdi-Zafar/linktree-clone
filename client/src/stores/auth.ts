// stores/auth.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import type { LoginCredentials, RegisterData } from '@/shared/types'
import { authApi } from '@/api/auth.api'
import { useRouter } from 'vue-router'
import { showToast } from '@/shared/utils'

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
    alert('Email verified successfully!')
    // Redirect to dashboard
    router.push('/')
  },
  onError: (error: any) => {
    // Handle specific errors
    if (error.response?.status === 400) {
      alert('Invalid or expired verification link')
    } else if (error.response?.status === 409) {
      alert('Email already verified')
    } else {
      alert('Verification failed. Please try again.')
    }
    router.push('/')
  },
  retry: false,
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

    // Mutation states
    isLoggingIn: computed(() => loginMutation.isPending.value),
    isRegistering: computed(() => registerMutation.isPending.value),
    loginError: computed(() => loginMutation.error.value),
    registerError: computed(() => registerMutation.error.value),
  }
})
