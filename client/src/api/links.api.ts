import api from './axios'
import type { Link, LinkCreate, LinkUpdate, LinkReorder } from '@/shared/types'

export const linksApi = {
  // Get my links (authenticated)
  getMyLinks: async (): Promise<Link[]> => {
    const response = await api.get<Link[]>('/links/')
    return response.data
  },

  // Get link by ID (authenticated)
  getById: async (linkId: number): Promise<Link> => {
    const response = await api.get<Link>(`/links/${linkId}`)
    return response.data
  },

  // Create new link (authenticated)
  create: async (data: LinkCreate): Promise<Link> => {
    const response = await api.post<Link>('/links/', data)
    return response.data
  },

  // Update link (authenticated)
  update: async (linkId: number, data: LinkUpdate): Promise<Link> => {
    const response = await api.put<Link>(`/links/${linkId}`, data)
    return response.data
  },

  // Delete link (authenticated)
  delete: async (linkId: number): Promise<void> => {
    await api.delete(`/links/${linkId}`)
  },

  // Reorder multiple links (authenticated)
  reorder: async (reorderData: LinkReorder[]): Promise<Link[]> => {
    const response = await api.post<Link[]>('/links/reorder', reorderData)
    return response.data
  },

  // Increment click count - PUBLIC (no auth required)
  incrementClick: async (linkId: number): Promise<Link> => {
    const response = await api.post<Link>(`/links/${linkId}/click`)
    return response.data
  },

  // Get user's public links - PUBLIC (no auth required)
  getUserLinks: async (username: string): Promise<Link[]> => {
    const response = await api.get<Link[]>(`/links/user/${username}`)
    return response.data
  },
}
