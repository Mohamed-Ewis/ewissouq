import { TOKEN_KEY, REFRESH_TOKEN_KEY, USER_KEY } from './constants'
import {
  getCookie,
  setCookie,
  removeCookie,
  getJSONCookie,
  setJSONCookie,
  getAuthCookieOptions,
  COOKIE_EXPIRES,
} from './cookies'

export function getToken() {
  return getCookie(TOKEN_KEY) || null
}

export function getRefreshToken() {
  return getCookie(REFRESH_TOKEN_KEY) || null
}

export function setTokens({ accessToken, refreshToken, remember = false }) {
  const rememberOpts = getAuthCookieOptions(remember)
  const refreshOpts = remember
    ? rememberOpts
    : { expires: COOKIE_EXPIRES.refresh }

  if (accessToken) setCookie(TOKEN_KEY, accessToken, rememberOpts)
  if (refreshToken) setCookie(REFRESH_TOKEN_KEY, refreshToken, refreshOpts)
}

export function clearTokens() {
  removeCookie(TOKEN_KEY)
  removeCookie(REFRESH_TOKEN_KEY)
  removeCookie(USER_KEY)
}

export function getStoredUser() {
  return getJSONCookie(USER_KEY)
}

export function setStoredUser(user, { remember = false } = {}) {
  if (user) {
    setJSONCookie(USER_KEY, user, getAuthCookieOptions(remember))
  } else {
    removeCookie(USER_KEY)
  }
}

export function isAuthenticated() {
  return !!getToken()
}
