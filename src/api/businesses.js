import request from '@/utils/request'

export function getBusinesses(params) {
  return request({ url: '/businesses', method: 'get', params })
}

export function getFeaturedBusinesses() {
  return request({ url: '/businesses/featured', method: 'get' })
}

export function getBusiness(slugOrId) {
  return request({ url: `/businesses/${slugOrId}`, method: 'get' })
}

export function followBusiness(id) {
  return request({ url: `/businesses/${id}/follow`, method: 'post' })
}
