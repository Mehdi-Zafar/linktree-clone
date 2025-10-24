import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { authApi } from '@/api/auth.api'
import type { LoginCredentials, RegisterData } from '@/shared/types'
import { useRoute, useRouter } from 'vue-router'
import { showToast, tokenHelpers } from '@/shared/utils'
import { computed, toValue, type Ref } from 'vue'

export function useAuth() {
  const queryClient = useQueryClient()
  const router = useRouter()
  const route = useRoute()

  // Get current user
  const {
    data: user,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['currentUser'],
    queryFn: authApi.getCurrentUser,
    enabled: !!tokenHelpers.getToken(), // Only fetch if token exists
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) => authApi.login(credentials),
    onSuccess: async () => {
      // Fetch user data after successful login
      await queryClient.invalidateQueries({ queryKey: ['currentUser'] })
      showToast('Sign In success!', 'success')
      router.push('/profile')
    },
  })

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: (data: RegisterData) => authApi.register(data),
    onSuccess: () => {
      showToast('Sign up success!', 'success')
      router.push('/sign-in')
    },
  })

  // Logout function
  const logout = async () => {
    authApi.logout()
    queryClient.setQueryData(['currentUser'], null)
    if (route.meta.requiresAuth) {
      await router.push('/sign-in')
    }
    showToast('Sign out success!', 'success')
  }

  const isAuthenticated = computed(() => !!user.value)

  const validateEmail = async (email: string) => {
    try {
      const res = await authApi.validateEmail(email)
      return res
    } catch (err) {
      console.error(err)
    }
  }

  const validateUsername = async (username: string) => {
    try {
      const res = await authApi.validateUsername(username)
      return res
    } catch (err) {
      console.error(err)
    }
  }

  function useEmailValidation(email: Ref<string>) {
    return useQuery({
      queryKey: ['validate-email', email],
      queryFn: () => authApi.validateEmail(toValue(email)),
      enabled: false,
      staleTime: 0,
      retry: false,
    })
  }

  function useUsernameValidation(username: Ref<string>) {
    return useQuery({
      queryKey: ['validate-username', username],
      queryFn: () => authApi.validateUsername(toValue(username)),
      enabled: false,
      staleTime: 0,
      retry: false,
    })
  }

  return {
    // State
    user,
    isLoading,
    error,
    isAuthenticated,
    // Actions
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout,
    refetchUser: refetch,
    useEmailValidation,
    useUsernameValidation,

    // Mutation states
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,
    isRegistering: registerMutation.isPending,
    registerError: registerMutation.error,
  }
}
