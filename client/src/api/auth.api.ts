import { tokenHelpers } from '@/shared/utils'
import api from './axios'
import type { Token, LoginCredentials, RegisterData, User } from '@/shared/types'

export const authApi = {
  // Register new user
  register: async (data: RegisterData): Promise<User> => {
    const response = await api.post<User>('/auth/register', data)
    return response.data
  },

  // Login (OAuth2 format)
  login: async (credentials: LoginCredentials): Promise<Token> => {
    const params = new URLSearchParams()
    params.append('username', credentials.email) // OAuth2 requires 'username'
    params.append('password', credentials.password)

    const response = await api.post<Token>('/auth/login', params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })

    // Store token
    tokenHelpers.setToken(response.data.access_token)

    return response.data
  },

  // Get current user
  getCurrentUser: async (): Promise<User> => {
    const response = await api.get<User>('/auth/me')
    return response.data
  },

  // Logout
  logout: () => {
    tokenHelpers.removeToken()
  },
}
