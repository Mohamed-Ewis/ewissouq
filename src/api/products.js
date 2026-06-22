import request from '@/utils/request'

export function getProducts(params) {
  return request({ url: '/products', method: 'get', params })
}

export function getProduct(id) {
  return request({ url: `/products/${id}`, method: 'get' })
}

export function createProduct(data) {
  return request({ url: '/products', method: 'post', data })
}

export function likeProduct(id) {
  return request({ url: `/products/${id}/like`, method: 'post' })
}

export function saveProduct(id) {
  return request({ url: `/products/${id}/save`, method: 'post' })
}

export function getProductComments(id) {
  return request({ url: `/products/${id}/comments`, method: 'get' })
}

export function addComment(id, data) {
  return request({ url: `/products/${id}/comments`, method: 'post', data })
}

export function getTrendingProducts() {
  return request({ url: '/products/trending', method: 'get' })
}

export function getRecommendedProducts() {
  return request({ url: '/products/recommended', method: 'get' })
}

export function getMostViewedProducts() {
  return request({ url: '/products/most-viewed', method: 'get' })
}

export function getSavedProducts() {
  return request({ url: '/products/saved', method: 'get' })
}

export function getFeed(params) {
  return request({ url: '/feed', method: 'get', params })
}
