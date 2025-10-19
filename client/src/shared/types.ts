// ============ AUTH TYPES ============
export interface Token {
  access_token: string
  token_type: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  username: string
  password: string
  confirmPassword: string
}

// ============ USER TYPES ============
export interface User {
  id: number
  email: string
  username: string
  full_name: string | null
  bio: string | null
  avatar_url: string | null
  is_active: boolean
  is_verified: boolean
  created_at: string
  updated_at: string | null
}

export interface UserUpdate {
  email?: string
  username?: string
  full_name?: string
  bio?: string
  avatar_url?: string
}

export interface UserWithProfile extends User {
  profile: Profile | null
}

// ============ PROFILE TYPES ============
export interface Profile {
  id: number
  user_id: number
  page_title: string | null
  theme: string
  background_color: string
  text_color: string
  button_style: string
  meta_description: string | null
  custom_domain: string | null
  is_public: boolean
  created_at: string
  updated_at: string | null
}

export interface ProfileCreate {
  page_title?: string
  theme?: string
  background_color?: string
  text_color?: string
  button_style?: string
  meta_description?: string
  custom_domain?: string
  is_public?: boolean
}

export interface ProfileUpdate extends ProfileCreate {}

// ============ LINK TYPES ============
export interface Link {
  id: number
  user_id: number
  title: string
  url: string
  description: string | null
  icon: string | null
  thumbnail_url: string | null
  position: number
  is_active: boolean
  click_count: number
  created_at: string
  updated_at: string | null
}

export interface LinkCreate {
  title: string
  url: string
  description?: string
  icon?: string
  thumbnail_url?: string
  position?: number
  is_active?: boolean
}

export interface LinkUpdate {
  title?: string
  url?: string
  description?: string
  icon?: string
  thumbnail_url?: string
  position?: number
  is_active?: boolean
}

export interface LinkReorder {
  link_id: number
  new_position: number
}

// ============ PUBLIC PROFILE TYPES ============
export interface PublicUserProfile {
  username: string
  full_name: string | null
  bio: string | null
  avatar_url: string | null
  profile: Profile | null
  links: Link[]
}

// ============ API ERROR TYPES ============
export interface ApiError {
  detail: string
}
