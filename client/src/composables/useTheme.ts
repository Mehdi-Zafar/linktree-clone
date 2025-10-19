// composables/useTheme.ts
import { useDark, useToggle } from '@vueuse/core'

export function useTheme() {
  // useDark automatically persists to localStorage if you pass a key
  const isDark = useDark({
    storageKey: 'linktree-theme', // <-- Your custom localStorage key
    valueDark: 'dark',
    valueLight: 'light',
  })

  const toggleDark = useToggle(isDark)

  return {
    isDark,
    toggleDark,
  }
}
