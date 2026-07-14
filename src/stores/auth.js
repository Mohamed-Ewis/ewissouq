import { defineStore } from 'pinia'
import { login as loginApi, register as registerApi, getMe } from '@/api/auth'
import { setTokens, clearTokens, getStoredUser, setStoredUser, getToken } from '@/utils/auth'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    loading: false,
    error: null,
    initialized: false,
  }),

  getters: {
    isLoggedIn: (state) => !!state.user,
    isVerified: (state) => state.user?.verified || false,
    isStoreAccount: (state) => state.user?.accountType === 'business' || !!state.user?.businessId,
  },

  actions: {
    async init() {
      if (this.initialized) return
      const stored = getStoredUser()
      if (stored && getToken()) {
        this.user = stored
        try {
          const res = await getMe()
          this.user = res.data || res
          setStoredUser(this.user)
        } catch {
          // keep stored user for mock
        }
      }
      this.initialized = true
    },

    async login(credentials) {
      this.loading = true
      this.error = null
      try {
        const res = await loginApi(credentials)
        const { user, accessToken, refreshToken } = res.data || res
        const remember = !!credentials.remember
        setTokens({ accessToken, refreshToken, remember })
        setStoredUser(user, { remember })
        this.user = user
        return user
      } catch (err) {
        this.error = err.message
        throw err
      } finally {
        this.loading = false
      }
    },

    async register(data) {
      this.loading = true
      this.error = null
      try {
        const res = await registerApi(data)
        const { user, accessToken, refreshToken } = res.data || res
        setTokens({ accessToken, refreshToken, remember: true })
        setStoredUser(user, { remember: true })
        this.user = user
        return user
      } catch (err) {
        this.error = err.message
        throw err
      } finally {
        this.loading = false
      }
    },

    logout() {
      clearTokens()
      this.user = null
      const localePath = useLocalePath()
      navigateTo(localePath('/auth/login'))
    },
  },
})
