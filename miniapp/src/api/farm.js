import { get, post, put } from './request'

export const getFarmList = () => get('/farm/list')

export const getFarmDetail = (id) => get(`/farm/${id}`)

export const getGreenhouseList = (farmId) => get(`/farm/${farmId}/greenhouses`)

export const getGreenhouseDetail = (id) => get(`/greenhouse/${id}`)

export const updateGreenhouse = (id, data) => put(`/greenhouse/${id}`, data)
