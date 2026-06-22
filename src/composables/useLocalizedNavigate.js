/**
 * Locale-aware navigation helpers for use outside Vue templates.
 */
export function useLocalizedNavigate() {
  const localePath = useLocalePath()

  function to(path, options) {
    return navigateTo(localePath(path), options)
  }

  return { localePath, to }
}

export function redirectToLogin() {
  if (!import.meta.client) return
  const localePath = useLocalePath()
  return navigateTo(localePath('/auth/login'))
}
