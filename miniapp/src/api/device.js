import { get, post, put } from './request'

export const getDeviceList = (greenhouseId) => get(`/device/list`, { greenhouseId })

export const getDeviceDetail = (id) => get(`/device/${id}`)

export const controlDevice = (id, action) => post(`/device/${id}/control`, { action })

export const batchControl = (data) => post('/device/batch-control', data)

export const getDeviceStatus = (id) => get(`/device/${id}/status`)
