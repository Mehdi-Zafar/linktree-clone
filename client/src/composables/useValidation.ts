import { useQuery } from '@tanstack/vue-query'
import { authApi } from '@/api/auth.api'
import { computed, toValue, type Ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

// Email validation hook
export function useEmailValidation(email: Ref<string>) {
  return useQuery({
    queryKey: ['validate-email', email],
    queryFn: () => authApi.validateEmail(toValue(email)),
    enabled: false, // Manual trigger only
    staleTime: 0, // Always fresh
    gcTime: 0, // Don't cache
    retry: false,
  })
}

// Username validation hook
export function useUsernameValidation(username: Ref<string>) {
  return useQuery({
    queryKey: ['validate-username', username],
    queryFn: () => authApi.validateUsername(toValue(username)),
    enabled: false, // Manual trigger only
    staleTime: 0, // Always fresh
    gcTime: 0, // Don't cache
    retry: false,
  })
}

// Optional: Hook to check if user has specific permissions/roles
export function useUserPermissions() {
  const { user } = useAuthStore()

  const isVerified = computed(() => {
    return user?.is_verified === true
  })

  return {
    isVerified,
    user,
  }
}
