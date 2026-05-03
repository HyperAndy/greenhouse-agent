<template>
  <div class="card">
    <div class="card-title">设备状态</div>
    <div class="device-list">
      <div v-for="device in devices" :key="device.name" class="device-item">
        <div class="device-icon">{{ device.icon }}</div>
        <div class="device-info">
          <div class="device-name">{{ device.name }}</div>
          <div class="device-bar">
            <div class="bar-bg">
              <div class="bar-fill" :style="{ width: (device.active / device.total * 100) + '%' }"></div>
            </div>
            <span class="device-count">{{ device.active }}/{{ device.total }}</span>
          </div>
        </div>
        <div class="device-status" :class="{ active: device.active > 0 }">
          {{ device.active > 0 ? '运行中' : '已停止' }}
        </div>
      </div>
    </div>
    <div class="ai-suggest">
      <div class="suggest-title">AI 智能建议</div>
      <div class="suggest-content">
        <p>建议开启3号大棚遮阳帘</p>
        <p class="suggest-reason">预计30分钟后温度将超过35°C</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const devices = ref([
  { name: '风机', icon: '🌀', active: 3, total: 5 },
  { name: '灌溉', icon: '💧', active: 2, total: 4 },
  { name: '遮阳帘', icon: '☀️', active: 1, total: 3 },
  { name: '补光灯', icon: '💡', active: 4, total: 6 }
])
</script>

<style scoped>
.card {
  background: rgba(24, 144, 255, 0.1);
  border: 1px solid rgba(24, 144, 255, 0.3);
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 0 15px rgba(24, 144, 255, 0.2);
  flex: 1;
  display: flex;
  flex-direction: column;
}

.card-title {
  font-size: 16px;
  font-weight: bold;
  color: #1890ff;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(24, 144, 255, 0.3);
}

.device-list {
  flex: 1;
}

.device-item {
  display: flex;
  align-items: center;
  padding: 10px;
  margin-bottom: 8px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 6px;
}

.device-icon {
  font-size: 24px;
  margin-right: 12px;
}

.device-info {
  flex: 1;
}

.device-name {
  font-size: 14px;
  margin-bottom: 6px;
}

.device-bar {
  display: flex;
  align-items: center;
  gap: 8px;
}

.bar-bg {
  flex: 1;
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #1890ff, #52c41a);
  border-radius: 3px;
  transition: width 0.5s ease;
}

.device-count {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.65);
  min-width: 30px;
}

.device-status {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 4px;
  background: rgba(245, 34, 45, 0.2);
  color: #f5222d;
}

.device-status.active {
  background: rgba(82, 196, 26, 0.2);
  color: #52c41a;
}

.ai-suggest {
  margin-top: 12px;
  padding: 12px;
  background: rgba(250, 173, 20, 0.1);
  border: 1px solid rgba(250, 173, 20, 0.3);
  border-radius: 6px;
}

.suggest-title {
  font-size: 14px;
  font-weight: bold;
  color: #faad14;
  margin-bottom: 8px;
}

.suggest-content {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.85);
}

.suggest-reason {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.45);
  margin-top: 4px;
}
</style>
