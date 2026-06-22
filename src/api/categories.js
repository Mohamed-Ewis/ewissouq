import request from '@/utils/request'

export function getCategories() {
  return request({ url: '/categories', method: 'get' })
}

export function getStories() {
  return request({ url: '/stories', method: 'get' })
}
