export default defineNuxtPlugin(async () => {
  const authStore = useAuthStore()
  const { initTheme } = useTheme()
  initTheme()
  await authStore.init()
})
