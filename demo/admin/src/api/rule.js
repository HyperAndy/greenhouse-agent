import request from './request'

export function getRuleList(params) {
  return request.get('/rules', { params })
}

export function getRuleDetail(id) {
  return request.get(`/rules/${id}`)
}

export function createRule(data) {
  return request.post('/rules', data)
}

export function updateRule(id, data) {
  return request.put(`/rules/${id}`, data)
}

export function deleteRule(id) {
  return request.delete(`/rules/${id}`)
}

export function toggleRule(id, enabled) {
  return request.put(`/rules/${id}/toggle`, { enabled })
}
