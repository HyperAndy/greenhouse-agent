import request from './request'

export function login(data) {
  return request.post('/auth/login', data)
}

export function logout() {
  return request.post('/auth/logout')
}

export function refreshToken(data) {
  return request.post('/auth/refresh', data)
}

export function getUserInfo() {
  return request.get('/auth/profile')
}
