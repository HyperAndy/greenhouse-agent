import request from './request'

export function getSensorData(params) {
  return request.get('/sensors/data', { params })
}

export function getSensorLatest(deviceId) {
  return request.get(`/sensors/${deviceId}/latest`)
}

export function getSensorList(params) {
  return request.get('/sensors', { params })
}

export function exportSensorData(params) {
  return request.get('/sensors/export', { params, responseType: 'blob' })
}
