import { tokenHelpers } from '@/shared/utils'
import api from './axios'
import type {
  Token,
  LoginCredentials,
  RegisterData,
  User,
  EmailValidationResponse,
  UsernameValidationResponse,
} from '@/shared/types'

const BASE_URL = '/auth'

export const authApi = {
  // Register new user
  register: async (data: RegisterData): Promise<User> => {
    const response = await api.post<User>(`${BASE_URL}/register`, data)
    return response.data
  },

  // Login (OAuth2 format)
  login: async (credentials: LoginCredentials): Promise<Token> => {
    const params = new URLSearchParams()
    params.append('username', credentials.email) // OAuth2 requires 'username'
    params.append('password', credentials.password)

    const response = await api.post<Token>(`${BASE_URL}/login`, params, {
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
    const response = await api.get<User>(`${BASE_URL}/me`)
    return response.data
  },

  // Logout
  logout: () => {
    tokenHelpers.removeToken()
  },

  validateEmail: async (email: string): Promise<EmailValidationResponse> => {
    const response = await api.get<EmailValidationResponse>(`${BASE_URL}/validate/email/${email}`)
    return response.data
  },

  validateUsername: async (username: string): Promise<UsernameValidationResponse> => {
    const response = await api.get<UsernameValidationResponse>(
      `${BASE_URL}/validate/username/${username}`,
    )
    return response.data
  },
}
