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

export function redirectToLogin(redirect) {
  if (!import.meta.client) return
  const localePath = useLocalePath()
  const route = useRoute()
  return navigateTo({
    path: localePath('/auth/login'),
    query: { redirect: redirect || route.fullPath },
  })
}
