<template>
  <div class="sidebar">
    <div class="sidebar-logo">
      <el-icon :size="24" color="#67c23a"><Promotion /></el-icon>
      <span v-show="!sidebarCollapsed" class="logo-text">大棚智控</span>
    </div>
    <el-menu
      :default-active="activeMenu"
      :collapse="sidebarCollapsed"
      background-color="#304156"
      text-color="#bfcbd9"
      active-text-color="#67c23a"
      router
      unique-opened
    >
      <template v-for="route in menuRoutes" :key="route.path">
        <el-menu-item :index="'/' + route.path">
          <el-icon><component :is="route.meta?.icon || 'Document'" /></el-icon>
          <template #title>{{ route.meta?.title }}</template>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppStore } from '@/store'

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()
const sidebarCollapsed = computed(() => appStore.sidebarCollapsed)

const activeMenu = computed(() => route.path)

const menuRoutes = computed(() => {
  const mainRoute = router.options.routes.find(r => r.path === '/')
  return (mainRoute?.children || []).filter(r => !r.meta?.hidden)
})
</script>

<style scoped>
.sidebar {
  height: 100%;
}
.sidebar-logo {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background: #2b2f3a;
}
.logo-text {
  color: #fff;
  font-size: 18px;
  font-weight: 600;
  white-space: nowrap;
}
.el-menu {
  border-right: none;
}
</style>
