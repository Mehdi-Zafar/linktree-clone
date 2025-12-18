import {
  Instagram,
  Twitter,
  Facebook,
  Linkedin,
  Youtube,
  Music,
  Github,
  MessageCircle,
  Twitch,
  Headphones,
  Pin,
  Ghost,
  MessageSquare,
  Send,
  Phone,
  Link as LinkIcon,
  type LucideIcon,
} from 'lucide-vue-next'

export interface SocialPlatformConfig {
  name: string
  icon: LucideIcon
  color: string
  placeholder: string
  urlPattern?: RegExp
}

// Social platform configurations with Lucide icons
export const SOCIAL_PLATFORMS: Record<string, SocialPlatformConfig> = {
  instagram: {
    name: 'Instagram',
    icon: Instagram,
    color: '#E4405F',
    placeholder: 'https://instagram.com/username',
    urlPattern: /instagram\.com/i,
  },
  twitter: {
    name: 'Twitter / X',
    icon: Twitter,
    color: '#1DA1F2',
    placeholder: 'https://twitter.com/username',
    urlPattern: /twitter\.com|x\.com/i,
  },
  facebook: {
    name: 'Facebook',
    icon: Facebook,
    color: '#1877F2',
    placeholder: 'https://facebook.com/username',
    urlPattern: /facebook\.com/i,
  },
  linkedin: {
    name: 'LinkedIn',
    icon: Linkedin,
    color: '#0A66C2',
    placeholder: 'https://linkedin.com/in/username',
    urlPattern: /linkedin\.com/i,
  },
  youtube: {
    name: 'YouTube',
    icon: Youtube,
    color: '#FF0000',
    placeholder: 'https://youtube.com/@username',
    urlPattern: /youtube\.com|youtu\.be/i,
  },
  tiktok: {
    name: 'TikTok',
    icon: Music,
    color: '#000000',
    placeholder: 'https://tiktok.com/@username',
    urlPattern: /tiktok\.com/i,
  },
  github: {
    name: 'GitHub',
    icon: Github,
    color: '#181717',
    placeholder: 'https://github.com/username',
    urlPattern: /github\.com/i,
  },
  discord: {
    name: 'Discord',
    icon: MessageCircle,
    color: '#5865F2',
    placeholder: 'https://discord.gg/invite',
    urlPattern: /discord\.gg|discord\.com/i,
  },
  twitch: {
    name: 'Twitch',
    icon: Twitch,
    color: '#9146FF',
    placeholder: 'https://twitch.tv/username',
    urlPattern: /twitch\.tv/i,
  },
  spotify: {
    name: 'Spotify',
    icon: Headphones,
    color: '#1DB954',
    placeholder: 'https://open.spotify.com/user/username',
    urlPattern: /spotify\.com/i,
  },
  pinterest: {
    name: 'Pinterest',
    icon: Pin,
    color: '#E60023',
    placeholder: 'https://pinterest.com/username',
    urlPattern: /pinterest\.com/i,
  },
  snapchat: {
    name: 'Snapchat',
    icon: Ghost,
    color: '#FFFC00',
    placeholder: 'https://snapchat.com/add/username',
    urlPattern: /snapchat\.com/i,
  },
  reddit: {
    name: 'Reddit',
    icon: MessageSquare,
    color: '#FF4500',
    placeholder: 'https://reddit.com/u/username',
    urlPattern: /reddit\.com/i,
  },
  telegram: {
    name: 'Telegram',
    icon: Send,
    color: '#26A5E4',
    placeholder: 'https://t.me/username',
    urlPattern: /t\.me|telegram\.me/i,
  },
  whatsapp: {
    name: 'WhatsApp',
    icon: Phone,
    color: '#25D366',
    placeholder: 'https://wa.me/1234567890',
    urlPattern: /wa\.me|whatsapp\.com/i,
  },
}

// Helper: Get platform config by key
export const getPlatformConfig = (platform: string): SocialPlatformConfig | null => {
  return SOCIAL_PLATFORMS[platform.toLowerCase()] ?? null
}

// Helper: Get all platforms as array
export const getAllPlatforms = () => {
  return Object.entries(SOCIAL_PLATFORMS).map(([key, value]) => ({
    value: key,
    ...value,
  }))
}

// Helper: Detect platform from URL
export const detectPlatformFromUrl = (url: string): string | null => {
  for (const [key, config] of Object.entries(SOCIAL_PLATFORMS)) {
    if (config.urlPattern && config.urlPattern.test(url)) {
      return key
    }
  }
  return null
}

// Helper: Validate URL for platform
export const validatePlatformUrl = (platform: string, url: string): boolean => {
  const config = getPlatformConfig(platform)
  if (config === null) return false
  if (!config.urlPattern) return true // No pattern means any URL is valid
  return config.urlPattern.test(url)
}

export const dummy_avatar =
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'

export const passwordRegex =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/
export const usernameRegex = /^[a-zA-Z][a-zA-Z0-9_.-]*[a-zA-Z0-9]$|^[a-zA-Z]$/
export const fullNameRegex = /^[a-zA-Z ]+$/
export const specialCharacterRegex = /(?=.*[^A-Za-z0-9])/
export const numberRegex = /(?=.*\d)/
