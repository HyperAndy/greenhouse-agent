import request from './request'

export function getFarmList(params) {
  return request.get('/farms', { params })
}

export function getFarmDetail(id) {
  return request.get(`/farms/${id}`)
}

export function createFarm(data) {
  return request.post('/farms', data)
}

export function updateFarm(id, data) {
  return request.put(`/farms/${id}`, data)
}

export function deleteFarm(id) {
  return request.delete(`/farms/${id}`)
}

export function getGreenhouseList(farmId, params) {
  return request.get(`/farms/${farmId}/greenhouses`, { params })
}

export function createGreenhouse(farmId, data) {
  return request.post(`/farms/${farmId}/greenhouses`, data)
}

export function updateGreenhouse(farmId, ghId, data) {
  return request.put(`/farms/${farmId}/greenhouses/${ghId}`, data)
}

export function deleteGreenhouse(farmId, ghId) {
  return request.delete(`/farms/${farmId}/greenhouses/${ghId}`)
}
