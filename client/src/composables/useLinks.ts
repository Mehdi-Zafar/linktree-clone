import { computed } from 'vue'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { linksApi } from '@/api/links.api'
import {
  type LinkCreate,
  type LinkUpdate,
  type LinkReorder,
  LinkType,
  type Link,
} from '@/shared/types'
import { useAuthStore } from '@/stores/auth'
import { showToast } from '@/shared/utils'

/**
 * Composable for managing authenticated user's links
 */
export function useLinks() {
  const queryClient = useQueryClient()
  const { user } = useAuthStore()

  // Fetch all my links
  const {
    data: linksData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['myLinks'],
    queryFn: linksApi.getMyLinks,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })

  // Computed: Sorted links by position
  const sortedLinks = computed(() => {
    if (!links.value) return []
    return [...links.value].sort((a, b) => a.position - b.position)
  })

  // Computed: Active links only
  const activeLinks = computed(() => {
    return sortedLinks.value.filter((link) => link.is_active)
  })

  // Create link mutation
  const createMutation = useMutation({
    mutationFn: (data: LinkCreate) => linksApi.create(data),
    onSuccess: (newLink) => {
      // Add the new link to the existing query data
      queryClient.setQueryData<Link[]>(['myLinks'], (oldLinks) => {
        if (!oldLinks) return [newLink]
        return [...oldLinks, newLink]
      })
      queryClient.invalidateQueries({ queryKey: ['publicLinks', user?.username] })
      showToast('Link Created!', 'success')
    },
    onError: () => {
      showToast('Creation failed!', 'error')
    },
  })

  // Update link mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: LinkUpdate }) => linksApi.update(id, data),
    onSuccess: (updatedLink) => {
      // Update the specific link in the query data
      queryClient.setQueryData<Link[]>(['myLinks'], (oldLinks) => {
        if (!oldLinks) return [updatedLink]
        return oldLinks.map((link) => (link.id === updatedLink.id ? updatedLink : link))
      })
      queryClient.invalidateQueries({ queryKey: ['publicLinks', user?.username] })
      showToast('Link updated!', 'success')
    },
    onError: () => {
      showToast('Update Failed!', 'error')
    },
  })

  // Delete link mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => linksApi.delete(id),
    onSuccess: (_, deletedId) => {
      // Remove the deleted link from query data
      queryClient.setQueryData<Link[]>(['myLinks'], (oldLinks) => {
        if (!oldLinks) return []
        return oldLinks.filter((link) => link.id !== deletedId)
      })
      queryClient.invalidateQueries({ queryKey: ['publicLinks', user?.username] })
      showToast('Link Deleted!', 'success')
    },
    onError: () => {
      showToast('Delete failed!', 'error')
    },
  })

  // Reorder links mutation
  const reorderMutation = useMutation({
    mutationFn: (reorderData: LinkReorder[]) => linksApi.reorder(reorderData),
    onSuccess: (data) => {
      // Update cache immediately with new data
      queryClient.setQueryData(['myLinks'], data)
      queryClient.invalidateQueries({ queryKey: ['publicLinks', user?.username] })
      showToast('Links Reordered!', 'success')
    },
    onError: () => {
      showToast('Reorder failed!', 'error')
    },
  })

  // Helper: Toggle link active status
  const toggleActive = (linkId: number) => {
    const link = links.value?.find((l) => l.id === linkId)
    if (!link) return

    updateMutation.mutate({
      id: linkId,
      data: { is_active: !link.is_active },
    })
  }

  // Helper: Move link up/down
  const moveLink = (linkId: number, direction: 'up' | 'down') => {
    if (!sortedLinks.value) return

    const currentIndex = sortedLinks.value.findIndex((l) => l.id === linkId)
    if (currentIndex === -1) return

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    if (newIndex < 0 || newIndex >= sortedLinks.value.length) return

    if (sortedLinks.value[currentIndex] && sortedLinks.value[newIndex]) {
      // Create reorder data for affected links
      const reorderData: LinkReorder[] = [
        { link_id: sortedLinks.value[currentIndex].id, new_position: newIndex },
        { link_id: sortedLinks.value[newIndex].id, new_position: currentIndex },
      ]

      reorderMutation.mutate(reorderData)
    }
  }

  const buttons = computed(() =>
    linksData?.value?.filter((link) => link.link_type === LinkType.BUTTON),
  )
  const links = computed(() => linksData?.value?.filter((link) => link.link_type === LinkType.LINK))

  return {
    // State
    links,
    buttons,
    sortedLinks,
    activeLinks,
    isLoading,
    error,

    // Actions
    createLink: createMutation.mutateAsync,
    updateLink: (id: number, data: LinkUpdate) => updateMutation.mutateAsync({ id, data }),
    deleteLink: deleteMutation.mutateAsync,
    reorderLinks: reorderMutation.mutateAsync,
    toggleActive,
    moveLink,
    refetch,

    // Mutation states
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isReordering: reorderMutation.isPending,

    // Errors
    createError: createMutation.error,
    updateError: updateMutation.error,
    deleteError: deleteMutation.error,
  }
}

/**
 * Composable for fetching public user links (no authentication required)
 */
export function usePublicLinks(username: string) {
  const {
    data: linksData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['publicLinks', username],
    queryFn: () => linksApi.getUserLinks(username),
    enabled: !!username,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
  const queryClient = useQueryClient()

  // Sorted links
  const sortedLinks = computed(() => {
    if (!linksData.value) return []
    return [...linksData.value].sort((a, b) => a.position - b.position)
  })

  // Computed: Active links only
  const activeLinks = computed(() => {
    return sortedLinks.value.filter((link) => link.is_active)
  })

  // Track click mutation (no auth required)
  const clickMutation = useMutation({
    mutationFn: (linkId: number) => linksApi.incrementClick(linkId),
    onSuccess: (updatedLink) => {
      // Optimistically update the cache
      queryClient.setQueryData(['publicLinks', username], (oldData: any) => {
        if (!oldData) return oldData
        return oldData.map((link: any) => (link.id === updatedLink.id ? updatedLink : link))
      })
    },
  })

  const handleLinkClick = (linkId: number, url: string) => {
    // Track the click
    clickMutation.mutate(linkId)
    // Open link in new tab
    window.open(url, '_blank')
  }

  const buttons = computed(() =>
    activeLinks?.value?.filter((link) => link.link_type === LinkType.BUTTON),
  )
  const links = computed(() =>
    activeLinks?.value?.filter((link) => link.link_type === LinkType.LINK),
  )

  return {
    links,
    buttons,
    sortedLinks,
    isLoading,
    error,
    refetch,
    handleLinkClick,
    isTrackingClick: clickMutation.isPending,
  }
}

/**
 * Composable for fetching a single link by ID
 */
export function useLink(linkId: number) {
  const {
    data: link,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['link', linkId],
    queryFn: () => linksApi.getById(linkId),
    enabled: !!linkId,
  })

  return {
    link,
    isLoading,
    error,
  }
}
