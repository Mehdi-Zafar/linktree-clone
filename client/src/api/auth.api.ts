import api from './axios'
import type {
  Token,
  LoginCredentials,
  RegisterData,
  User,
  EmailValidationResponse,
  UsernameValidationResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
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

    // DO NOT store token here - will be handled by auth store
    return response.data
  },

  // Refresh access token
  refresh: async (): Promise<Token> => {
    const response = await api.post<Token>(`${BASE_URL}/refresh`)
    return response.data
  },

  // Get current user
  getCurrentUser: async (): Promise<User> => {
    const response = await api.get<User>(`${BASE_URL}/me`)
    return response.data
  },

  // Logout - calls backend to clear cookie
  logout: async (): Promise<void> => {
    await api.post(`${BASE_URL}/logout`)
  },

  // Email validation
  validateEmail: async (email: string): Promise<EmailValidationResponse> => {
    const response = await api.get<EmailValidationResponse>(
      `${BASE_URL}/validate/email/${encodeURIComponent(email)}`,
    )
    return response.data
  },

  // Username validation
  validateUsername: async (username: string): Promise<UsernameValidationResponse> => {
    const response = await api.get<UsernameValidationResponse>(
      `${BASE_URL}/validate/username/${encodeURIComponent(username)}`,
    )
    return response.data
  },

  // verify email
  verifyEmail: async (token: string): Promise<void> => {
    const response = await api.get<void>(`${BASE_URL}/verify-email`, {
      params: { token },
    })
    return response.data
  },

  forgotPassword: async (forgotPasswordRequest: ForgotPasswordRequest) => {
    const response = await api.post<ForgotPasswordResponse>(`${BASE_URL}/forgot-password`, forgotPasswordRequest)
    return response.data
  },

  resetPassword: async (resetPasswordRequest: ResetPasswordRequest) => {
    const response = await api.post<ResetPasswordResponse>(`${BASE_URL}/reset-password`, resetPasswordRequest)
    return response.data
  },
}
