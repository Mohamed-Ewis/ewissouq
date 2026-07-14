export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore()
  const localePath = useLocalePath()
  if (!authStore.isLoggedIn) {
    return navigateTo({
      path: localePath('/auth/login'),
      query: { redirect: to.fullPath },
    })
  }
})
