import { get, post } from './request'

export const getAlertList = (params) => get('/alerts', params)

export const getAlertDetail = (id) => get(`/alerts/${id}`)

export const confirmAlert = (id) => post(`/alerts/${id}/acknowledge`)

export const getAlertStats = () => get('/alerts/stats')
