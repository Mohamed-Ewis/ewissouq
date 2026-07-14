/**
 * Gate interactive actions behind login while preserving return path.
 */
export function useRequireAuth() {
  const authStore = useAuthStore()
  const localePath = useLocalePath()
  const route = useRoute()

  function requireAuth(opts = {}) {
    if (authStore.isLoggedIn) return true

    const redirect = opts.redirect || route.fullPath
    navigateTo({
      path: localePath('/auth/login'),
      query: { redirect },
    })
    return false
  }

  function afterAuthPath(fallback = '/') {
    const redirect = route.query.redirect
    if (typeof redirect === 'string' && redirect.startsWith('/')) {
      return redirect
    }
    return localePath(fallback)
  }

  return { requireAuth, afterAuthPath, isLoggedIn: computed(() => authStore.isLoggedIn) }
}
