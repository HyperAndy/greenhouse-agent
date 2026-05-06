import { get, post, put } from './request'

export const getFarmList = () => get('/farms')

export const getFarmDetail = (id) => get(`/farms/${id}`)

export const getGreenhouseList = (farmId) => get(`/farms/${farmId}/greenhouses`)

export const getGreenhouseDetail = (id) => get(`/farms/greenhouses/${id}`)

export const updateGreenhouse = (id, data) => put(`/farms/greenhouses/${id}`, data)
