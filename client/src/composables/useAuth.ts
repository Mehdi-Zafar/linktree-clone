import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { authApi } from '@/api/auth.api'
import type { LoginCredentials, RegisterData } from '@/shared/types'
import { useRoute, useRouter } from 'vue-router'
import { showToast, tokenHelpers } from '@/shared/utils'
import { computed } from 'vue'

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
      router.push('/login')
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
  console.log(isAuthenticated)

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

    // Mutation states
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,
    isRegistering: registerMutation.isPending,
    registerError: registerMutation.error,
  }
}
