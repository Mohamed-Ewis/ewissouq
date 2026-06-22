import Cookies from 'js-cookie'

const DEFAULTS = {
  path: '/',
  sameSite: 'Lax',
}

export const COOKIE_EXPIRES = {
  session: undefined,
  access: 1,
  refresh: 7,
  remember: 30,
  theme: 365,
}

function resolveExpires(remember) {
  return remember ? COOKIE_EXPIRES.remember : COOKIE_EXPIRES.session
}

export function getCookie(key) {
  if (import.meta.server) return undefined
  return Cookies.get(key)
}

export function setCookie(key, value, options = {}) {
  if (import.meta.server) return
  const { expires, ...rest } = options
  Cookies.set(key, value, {
    ...DEFAULTS,
    ...rest,
    ...(expires !== undefined ? { expires } : {}),
  })
}

export function removeCookie(key) {
  if (import.meta.server) return
  Cookies.remove(key, { path: '/' })
}

export function getJSONCookie(key) {
  const raw = getCookie(key)
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function setJSONCookie(key, value, options = {}) {
  setCookie(key, JSON.stringify(value), options)
}

export function getAuthCookieOptions(remember = false) {
  const expires = resolveExpires(remember)
  return expires ? { expires } : {}
}
