import 'vue-sonner/style.css'
import { Toaster, toast } from 'vue-sonner'

const ACCESS_TOKEN_KEY = 'linktree_access_token'

export const tokenHelpers = {
  /** Save access token to localStorage */
  setToken(token: string): void {
    localStorage.setItem(ACCESS_TOKEN_KEY, token)
  },

  /** Retrieve access token from localStorage */
  getToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN_KEY)
  },

  /** Remove access token from localStorage */
  removeToken(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY)
  },
}

export const showToast = (text: string, type?: 'success' | 'error' | 'info' | 'warning') => {
  if (type === 'success') {
    toast.success(text)
  } else if (type === 'error') {
    toast.error(text)
  } else if (type === 'info') {
    toast.info(text)
  } else if (type === 'warning') {
    toast.warning(text)
  } else {
    toast(text)
  }
}
