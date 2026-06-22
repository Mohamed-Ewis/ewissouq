export default defineNuxtRouteMiddleware(() => {
  const authStore = useAuthStore()
  const localePath = useLocalePath()
  if (!authStore.isLoggedIn) {
    return navigateTo(localePath('/auth/login'))
  }
})
