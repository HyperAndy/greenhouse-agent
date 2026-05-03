import { get } from './request'

export const getSensorData = (greenhouseId) => get(`/sensor/data`, { greenhouseId })

export const getSensorHistory = (greenhouseId, params) => get(`/sensor/history`, { greenhouseId, ...params })

export const getSensorTypes = () => get('/sensor/types')
