import { get, post } from './request'

export const getAlertList = (params) => get('/alert/list', params)

export const getAlertDetail = (id) => get(`/alert/${id}`)

export const confirmAlert = (id) => post(`/alert/${id}/confirm`)

export const getAlertStats = () => get('/alert/stats')
