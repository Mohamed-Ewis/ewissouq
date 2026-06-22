import axios from 'axios'
import { getToken, getRefreshToken, setTokens, clearTokens } from './auth'
import { handleMockRequest } from '@/services/mock/handler'
import { redirectToLogin } from '@/composables/useLocalizedNavigate'

let isRefreshing = false
let failedQueue = []

function processQueue(error, token = null) {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error)
    else prom.resolve(token)
  })
  failedQueue = []
}

function normalizeError(error) {
  const response = error.response
  return {
    message: response?.data?.message || error.message || 'Something went wrong',
    status: response?.status || error.status || 500,
    data: response?.data || error.data || null,
    original: error,
  }
}

function createAxiosInstance() {
  const config = useRuntimeConfig()

  const instance = axios.create({
    baseURL: config.public.apiBaseUrl,
    timeout: 30000,
    headers: { 'Content-Type': 'application/json' },
  })

  instance.interceptors.request.use(
    (reqConfig) => {
      const token = getToken()
      if (token) reqConfig.headers.Authorization = `Bearer ${token}`
      return reqConfig
    },
    (error) => Promise.reject(error),
  )

  instance.interceptors.response.use(
    (response) => response.data,
    async (error) => {
      const originalRequest = error.config
      if (!originalRequest || error.response?.status !== 401) {
        return Promise.reject(normalizeError(error))
      }
      if (originalRequest._retry) {
        clearTokens()
        if (import.meta.client) redirectToLogin()
        return Promise.reject(normalizeError(error))
      }
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`
          return instance(originalRequest)
        })
      }
      originalRequest._retry = true
      isRefreshing = true
      const refreshToken = getRefreshToken()
      if (!refreshToken) {
        isRefreshing = false
        clearTokens()
        if (import.meta.client) redirectToLogin()
        return Promise.reject(normalizeError(error))
      }
      try {
        const refreshResponse = await handleMockRequest({
          url: '/auth/refresh',
          method: 'post',
          data: { refreshToken },
        })
        const tokens = refreshResponse.data || refreshResponse
        setTokens({ accessToken: tokens.accessToken, refreshToken: tokens.refreshToken || refreshToken })
        processQueue(null, tokens.accessToken)
        originalRequest.headers.Authorization = `Bearer ${tokens.accessToken}`
        return instance(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError, null)
        clearTokens()
        if (import.meta.client) redirectToLogin()
        return Promise.reject(normalizeError(refreshError))
      } finally {
        isRefreshing = false
      }
    },
  )

  return instance
}

let axiosInstance = null

async function mockRequest(config) {
  const result = await handleMockRequest(config)
  if (result.status && result.status >= 400) {
    return Promise.reject(normalizeError({ message: result.message, status: result.status, data: result }))
  }
  return result
}

export default function request(config) {
  const runtimeConfig = useRuntimeConfig()
  if (runtimeConfig.public.useMock) {
    return mockRequest(config)
  }
  if (!axiosInstance) axiosInstance = createAxiosInstance()
  return axiosInstance(config)
}

export function resetRequestInstance() {
  axiosInstance = null
}
