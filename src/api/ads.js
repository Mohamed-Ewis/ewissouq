import request from '@/utils/request'

export function getHomeAds() {
  return request({ url: '/ads/home', method: 'get' })
}
