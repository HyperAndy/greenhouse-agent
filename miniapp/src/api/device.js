import { get, post, put } from './request'

export const getDeviceList = (greenhouseId) => get('/devices', { greenhouseId })

export const getDeviceDetail = (id) => get(`/devices/${id}`)

export const controlDevice = (data) => post('/control', data)

export const batchControl = (data) => post('/control/batch', data)
