// api/users.ts
import api from './axios'
import type { User, UserWithProfile, UserUpdate, PublicUserProfile } from '@/shared/types'

export const usersApi = {
  // Get all users (authenticated, admin-like endpoint)
  getAll: async (skip: number = 0, limit: number = 100): Promise<User[]> => {
    const response = await api.get<User[]>('/users/', {
      params: { skip, limit },
    })
    return response.data
  },

  // Get user by ID (authenticated)
  getById: async (userId: number): Promise<UserWithProfile> => {
    const response = await api.get<UserWithProfile>(`/users/${userId}`)
    return response.data
  },

  // Get user by username - PUBLIC (no auth required)
  getByUsername: async (username: string): Promise<PublicUserProfile> => {
    const response = await api.get<PublicUserProfile>(`/users/username/${username}`)
    return response.data
  },

  // Get current user's profile (authenticated)
  getCurrentUser: async (): Promise<User> => {
    const response = await api.get<User>('/auth/me')
    return response.data
  },

  // Update current user (authenticated)
  updateMe: async (data: UserUpdate): Promise<User> => {
    const response = await api.put<User>('/users/me', data)
    return response.data
  },

  // Update avatar (authenticated)
  updateAvatar: async (avatarUrl: string): Promise<User> => {
    const response = await api.patch<User>('/users/me/avatar', {
      avatar_url: avatarUrl,
    })
    return response.data
  },

  // Delete current user account (authenticated)
  deleteMe: async (): Promise<void> => {
    await api.delete('/users/me')
  },

  uploadAvatar: async (file: File): Promise<User> => {
    const formData = new FormData()
    formData.append('file', file)

    const response = await api.post<User>('/users/me/avatar/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  // Remove avatar
  removeAvatar: async (): Promise<User> => {
    const response = await api.delete<User>('/users/me/avatar')
    return response.data
  },
}
