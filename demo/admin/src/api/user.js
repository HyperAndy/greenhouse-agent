import request from './request'

export function getUserList(params) {
  return request.get('/users', { params })
}

export function getUserDetail(id) {
  return request.get(`/users/${id}`)
}

export function createUser(data) {
  return request.post('/users', data)
}

export function updateUser(id, data) {
  return request.put(`/users/${id}`, data)
}

export function deleteUser(id) {
  return request.delete(`/users/${id}`)
}

export function assignRole(id, role) {
  return request.put(`/users/${id}/role`, { role })
}

export function toggleUser(id, enabled) {
  return request.put(`/users/${id}/toggle`, { enabled })
}
