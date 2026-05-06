import request from './request'

export function getRealtimeData() {
  return request.get('/sensor/realtime')
}

export function getHistoryData(params) {
  return request.get('/sensor/history', { params })
}
