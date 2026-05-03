import request from './request'

export function getDeviceList(params) {
  return request.get('/devices', { params })
}

export function getDeviceDetail(id) {
  return request.get(`/devices/${id}`)
}

export function createDevice(data) {
  return request.post('/devices', data)
}

export function updateDevice(id, data) {
  return request.put(`/devices/${id}`, data)
}

export function deleteDevice(id) {
  return request.delete(`/devices/${id}`)
}

export function sendCommand(deviceId, data) {
  return request.post(`/devices/${deviceId}/command`, data)
}
