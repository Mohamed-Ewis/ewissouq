import request from '@/utils/request'

export function getUsers() {
  return request({ url: '/users', method: 'get' })
}

export function getUser(id) {
  return request({ url: `/users/${id}`, method: 'get' })
}

export function followUser(id) {
  return request({ url: `/users/${id}/follow`, method: 'post' })
}
