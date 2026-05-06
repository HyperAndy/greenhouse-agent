import request from './request'

export function getAlertList(params) {
  return request.get('/alert/list', { params })
}

export function getAlertStats() {
  return request.get('/alert/stats')
}
