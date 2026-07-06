import request from '@/utils/request'

export function getOffers(params) {
  return request({ url: '/offers', method: 'get', params })
}

export function getOffer(id) {
  return request({ url: `/offers/${id}`, method: 'get' })
}
