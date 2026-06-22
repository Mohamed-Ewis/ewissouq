import { getCookie, setCookie, COOKIE_EXPIRES } from '@/utils/cookies'

const THEME_KEY = 'ewissouq_theme'

export function useTheme() {
  const theme = useState('theme', () => 'light')

  const isDark = computed(() => theme.value === 'dark')

  function applyTheme(value) {
    theme.value = value
    if (import.meta.client) {
      document.documentElement.setAttribute('data-bs-theme', value)
      setCookie(THEME_KEY, value, { expires: COOKIE_EXPIRES.theme })
    }
  }

  function toggleTheme() {
    applyTheme(theme.value === 'dark' ? 'light' : 'dark')
  }

  function initTheme() {
    if (import.meta.client) {
      const saved = getCookie(THEME_KEY)
      const preferred = saved || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      applyTheme(preferred)
    }
  }

  return { theme, isDark, toggleTheme, applyTheme, initTheme }
}
