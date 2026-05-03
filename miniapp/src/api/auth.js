import { post, get } from './request'

export const login = (data) => post('/auth/login', data)

export const register = (data) => post('/auth/register', data)

export const getUserInfo = () => get('/auth/userinfo')

export const updateUserInfo = (data) => post('/auth/update', data)

export const logout = () => post('/auth/logout')
