import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { login as loginApi, getUserInfo, logout as logoutApi } from '../api/auth'

export const useUserStore = defineStore('user', () => {
  const token = ref(uni.getStorageSync('token') || '')
  const userInfo = ref(uni.getStorageSync('userInfo') || null)
  
  const isLoggedIn = computed(() => !!token.value)
  const username = computed(() => userInfo.value?.username || '')
  const phone = computed(() => userInfo.value?.phone || '')
  const avatar = computed(() => userInfo.value?.avatar || '')
  
  const login = async (loginData) => {
    try {
      const res = await loginApi(loginData)
      token.value = res.data.token
      userInfo.value = res.data.userInfo
      uni.setStorageSync('token', res.data.token)
      uni.setStorageSync('userInfo', res.data.userInfo)
      return res
    } catch (error) {
      throw error
    }
  }
  
  const fetchUserInfo = async () => {
    try {
      const res = await getUserInfo()
      userInfo.value = res.data
      uni.setStorageSync('userInfo', res.data)
      return res.data
    } catch (error) {
      throw error
    }
  }
  
  const logout = async () => {
    try {
      await logoutApi()
    } catch (error) {
      console.error('退出登录失败', error)
    } finally {
      token.value = ''
      userInfo.value = null
      uni.removeStorageSync('token')
      uni.removeStorageSync('userInfo')
      uni.reLaunch({ url: '/pages/login/index' })
    }
  }
  
  return {
    token,
    userInfo,
    isLoggedIn,
    username,
    phone,
    avatar,
    login,
    fetchUserInfo,
    logout
  }
})
