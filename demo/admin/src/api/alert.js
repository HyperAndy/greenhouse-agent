import request from './request'

export function getAlertList(params) {
  return request.get('/alerts', { params })
}

export function getAlertDetail(id) {
  return request.get(`/alerts/${id}`)
}

export function ackAlert(id) {
  return request.put(`/alerts/${id}/ack`)
}

export function batchAckAlerts(ids) {
  return request.put('/alerts/batch-ack', { ids })
}
