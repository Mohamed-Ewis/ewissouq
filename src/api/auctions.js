import request from '@/utils/request'

export function getAuctions(params) {
  return request({ url: '/auctions', method: 'get', params })
}

export function getAuction(id) {
  return request({ url: `/auctions/${id}`, method: 'get' })
}

export function placeBid(id, data) {
  return request({ url: `/auctions/${id}/bid`, method: 'post', data })
}
