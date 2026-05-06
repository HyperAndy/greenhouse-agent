import request from './request'

export function getDeviceList() {
  return request.get('/device/list')
}

export function getDeviceStatus() {
  return request.get('/device/status')
}
