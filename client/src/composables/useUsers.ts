// composables/useUsers.ts
import { computed, ref } from 'vue'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { usersApi } from '@/api/users.api'
import { type UserUpdate, type PublicUserProfile, type User, LinkType } from '@/shared/types'
import { useAuthStore } from '@/stores/auth'
import { showToast } from '@/shared/utils'

/**
 * Composable for managing authenticated user's profile
 */
export function useCurrentUser() {
  const queryClient = useQueryClient()
  const authStore = useAuthStore()

  // Fetch current user
  const {
    data: user,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['currentUser'],
    queryFn: usersApi.getCurrentUser,
    enabled: computed(() => authStore.isAuthenticated),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  // Update user mutation
  const updateMutation = useMutation({
    mutationFn: (data: UserUpdate) => usersApi.updateMe(data),
    onSuccess: (updatedUser) => {
      // Update cache
      queryClient.setQueryData(['currentUser'], updatedUser)
      // Update auth store
      //   authStore.updateUser(updatedUser)
      // Invalidate public profile if username changed
      if (updatedUser.username) {
        queryClient.invalidateQueries({ queryKey: ['publicProfile', updatedUser.username] })
      }
      showToast('Profile updated successfully', 'success')
    },
    onError: (error: any) => {
      showToast(error.response?.data?.detail || 'Failed to update profile', 'error')
    },
  })

  // Update avatar mutation
  const updateAvatarMutation = useMutation({
    mutationFn: (avatarUrl: string) => usersApi.updateAvatar(avatarUrl),
    onSuccess: (updatedUser) => {
      // Update cache
      queryClient.setQueryData(['currentUser'], updatedUser)
      // Update auth store
      //   authStore.updateUser(updatedUser)
      // Invalidate public profile
      if (updatedUser.username) {
        queryClient.invalidateQueries({ queryKey: ['publicProfile', updatedUser.username] })
      }
      showToast('Avatar updated successfully', 'success')
    },
    onError: (error: any) => {
      showToast(error.response?.data?.detail || 'Failed to update avatar', 'error')
    },
  })

  // Remove avatar mutation
  const removeAvatarMutation = useMutation({
    mutationFn: () => usersApi.removeAvatar(),
    onSuccess: (updatedUser) => {
      // Update cache
      queryClient.setQueryData(['currentUser'], updatedUser)
      // Update auth store
      //   authStore.updateUser(updatedUser)
      // Invalidate public profile
      if (updatedUser.username) {
        queryClient.invalidateQueries({ queryKey: ['publicProfile', updatedUser.username] })
      }
      showToast('Avatar removed successfully', 'success')
    },
    onError: (error: any) => {
      showToast(error.response?.data?.detail || 'Failed to remove avatar', 'error')
    },
  })

  // Delete account mutation
  const deleteAccountMutation = useMutation({
    mutationFn: () => usersApi.deleteMe(),
    onSuccess: () => {
      // Clear all caches
      queryClient.clear()
      // Logout user
      authStore.logout()
      showToast('Account deleted successfully', 'success')
    },
    onError: (error: any) => {
      showToast(error.response?.data?.detail || 'Failed to delete account', 'error')
    },
  })

  return {
    // State
    user,
    isLoading,
    error,

    // Actions
    updateProfile: updateMutation.mutateAsync,
    updateAvatar: updateAvatarMutation.mutateAsync,
    removeAvatar: removeAvatarMutation.mutateAsync,
    deleteAccount: deleteAccountMutation.mutateAsync,
    refetch,

    // Mutation states
    isUpdating: updateMutation.isPending,
    isUpdatingAvatar: updateAvatarMutation.isPending,
    isRemovingAvatar: removeAvatarMutation.isPending,
    isDeletingAccount: deleteAccountMutation.isPending,

    // Errors
    updateError: updateMutation.error,
    avatarError: computed(() => updateAvatarMutation.error || removeAvatarMutation.error),
    deleteError: deleteAccountMutation.error,
  }
}

/**
 * Composable for fetching public user profile (no authentication required)
 */
export function usePublicProfile(username: string) {
  const {
    data: profile,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['publicProfile', username],
    queryFn: () => usersApi.getByUsername(username),
    enabled: !!username,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1, // Only retry once for 404s
  })

  // Computed: Active links sorted by position
  const sortedLinks = computed(() => {
    if (!profile.value?.links) return []
    return [...profile.value.links].sort((a, b) => a.position - b.position)
  })

  // Computed: Active links only
  const activeLinks = computed(() => {
    return sortedLinks.value.filter((link) => link.is_active)
  })

  // Computed: Profile metadata for SEO
  const metaData = computed(() => {
    if (!profile.value) return null

    return {
      title: profile.value.profile?.page_title || profile.value.full_name || profile.value.username,
      description: profile.value.profile?.meta_description || profile.value.bio || '',
      image: profile.value.avatar_url || '',
    }
  })

  // Computed: Check if profile is available
  const isProfileAvailable = computed(() => {
    return !error.value && !!profile.value
  })

  const buttons = computed(() =>
    activeLinks?.value?.filter((link) => link.link_type === LinkType.BUTTON),
  )
  const links = computed(() =>
    activeLinks?.value?.filter((link) => link.link_type === LinkType.LINK),
  )

  return {
    profile,
    buttons,
    links,
    sortedLinks,
    metaData,
    isProfileAvailable,
    isLoading,
    error,
    refetch,
  }
}

/**
 * Composable for fetching a user by ID (authenticated)
 */
export function useUser(userId: number) {
  const {
    data: user,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => usersApi.getById(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  return {
    user,
    isLoading,
    error,
    refetch,
  }
}

/**
 * Composable for fetching all users (admin/authenticated)
 */
export function useUsers(skip: number = 0, limit: number = 100) {
  const queryClient = useQueryClient()

  const {
    data: users,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['users', skip, limit],
    queryFn: () => usersApi.getAll(skip, limit),
    staleTime: 2 * 60 * 1000, // 2 minutes
  })

  // Computed: Total users count
  const totalUsers = computed(() => users.value?.length || 0)

  return {
    users,
    totalUsers,
    isLoading,
    error,
    refetch,
  }
}

/**
 * Composable for avatar upload with Supabase Storage
 */
export function useAvatarUpload() {
  const authStore = useAuthStore()
  const isUploading = ref(false)
  const uploadProgress = ref(0)
  const queryClient = useQueryClient()

  const uploadAvatar = async (file: File): Promise<string | null> => {
    if (!authStore.user) {
      showToast('Please log in to upload avatar', 'error')
      return null
    }

    // Validate file
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      showToast('File size must be less than 5MB', 'error')
      return null
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/avif']
    if (!allowedTypes.includes(file.type)) {
      showToast('Only JPG, PNG, WebP and Avif images are allowed', 'error')
      return null
    }

    try {
      isUploading.value = true
      uploadProgress.value = 0

      uploadProgress.value = 30

      // Upload via backend
      const updatedUser = await usersApi.uploadAvatar(file)

      uploadProgress.value = 80

      // Update local store
      queryClient.setQueryData(['currentUser'], updatedUser)

      queryClient.invalidateQueries({ queryKey: ['publicProfile', updatedUser.username] })

      uploadProgress.value = 100
      showToast('Avatar uploaded successfully', 'success')
      return updatedUser.avatar_url
    } catch (error: any) {
      console.error('Avatar upload error:', error)
      showToast(error.response?.data?.detail || 'Failed to upload avatar', 'error')
      return null
    } finally {
      isUploading.value = false
      uploadProgress.value = 0
    }
  }

  const deleteAvatar = async () => {
    if (!authStore.user?.avatar_url) return

    try {
      // Delete via backend
      const updatedUser = await usersApi.removeAvatar()

      // Update local store
      //   authStore.updateUser(updatedUser)
      queryClient.setQueryData(['currentUser'], updatedUser)

      queryClient.invalidateQueries({ queryKey: ['publicProfile', updatedUser.username] })

      showToast('Avatar removed successfully', 'success')
    } catch (error: any) {
      console.error('Avatar delete error:', error)
      showToast(error.response?.data?.detail || 'Failed to remove avatar', 'error')
    }
  }

  return {
    uploadAvatar,
    deleteAvatar,
    isUploading: computed(() => isUploading.value),
    uploadProgress: computed(() => uploadProgress.value),
  }
}
