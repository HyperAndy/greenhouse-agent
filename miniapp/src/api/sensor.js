import { get } from './request'

export const getSensorData = (greenhouseId) => get(`/sensor/${greenhouseId}/latest`)

export const getSensorHistory = (greenhouseId, params) => get(`/sensor/${greenhouseId}/history`, params)

export const getSensorStats = (greenhouseId, params) => get(`/sensor/${greenhouseId}/statistics`, params)
