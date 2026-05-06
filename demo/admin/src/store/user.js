import { defineStore } from 'pinia'
import { login, logout, getUserInfo } from '@/api/auth'
import { getToken, setToken, removeToken } from '@/utils/auth'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: getToken() || '',
    userInfo: {},
    roles: []
  }),
  actions: {
    async loginAction(loginForm) {
      const res = await login(loginForm)
      this.token = res.access_token
      setToken(res.access_token)
      if (res.user) {
        this.userInfo = res.user
        this.roles = [res.user.role]
      }
      return res
    },
    async getUserInfoAction() {
      const res = await getUserInfo()
      this.userInfo = res
      this.roles = [res.role] || []
      return res
    },
    async logoutAction() {
      try {
        await logout()
      } finally {
        this.token = ''
        this.userInfo = {}
        this.roles = []
        removeToken()
      }
    }
  }
})
