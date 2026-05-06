import { createRouter, createWebHistory } from 'vue-router'
import { getToken } from '@/utils/auth'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: { title: '登录', noAuth: true }
  },
  {
    path: '/',
    component: () => import('@/layout/index.vue'),
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: { title: '仪表盘', icon: 'Odometer' }
      },
      {
        path: 'farm',
        name: 'FarmList',
        component: () => import('@/views/farm/list.vue'),
        meta: { title: '农场管理', icon: 'House' }
      },
      {
        path: 'farm/:id/greenhouse',
        name: 'Greenhouse',
        component: () => import('@/views/farm/greenhouse.vue'),
        meta: { title: '大棚管理', hidden: true }
      },
      {
        path: 'device',
        name: 'DeviceList',
        component: () => import('@/views/device/list.vue'),
        meta: { title: '设备管理', icon: 'Monitor' }
      },
      {
        path: 'sensor',
        name: 'SensorData',
        component: () => import('@/views/sensor/data.vue'),
        meta: { title: '数据查询', icon: 'DataLine' }
      },
      {
        path: 'rule',
        name: 'RuleList',
        component: () => import('@/views/rule/list.vue'),
        meta: { title: '规则管理', icon: 'Setting' }
      },
      {
        path: 'alert',
        name: 'AlertList',
        component: () => import('@/views/alert/list.vue'),
        meta: { title: '告警管理', icon: 'Bell' }
      },
      {
        path: 'control',
        name: 'Control',
        component: () => import('@/views/control/index.vue'),
        meta: { title: '设备控制', icon: 'Switch' }
      },
      {
        path: 'user',
        name: 'UserList',
        component: () => import('@/views/user/list.vue'),
        meta: { title: '用户管理', icon: 'User' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const token = getToken()
  if (to.meta.noAuth) {
    next()
  } else if (!token) {
    next('/login')
  } else {
    next()
  }
})

export default router
