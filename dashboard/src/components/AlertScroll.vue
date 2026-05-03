<template>
  <div class="card">
    <div class="card-title">实时告警</div>
    <div class="alert-list" ref="listRef" @mouseenter="pause" @mouseleave="resume">
      <div v-for="(alert, index) in alerts" :key="index" class="alert-item" :class="alert.level">
        <div class="alert-time">{{ alert.time }}</div>
        <div class="alert-content">
          <span class="alert-tag">{{ alert.levelText }}</span>
          {{ alert.message }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const listRef = ref(null)
let scrollTimer = null
let isPaused = false

const alerts = ref([
  { time: '15:28', level: 'danger', levelText: '严重', message: '大棚1温度过高 35.2°C' },
  { time: '15:25', level: 'warning', levelText: '警告', message: '大棚3传感器离线' },
  { time: '15:20', level: 'info', levelText: '提示', message: '灌溉系统已完成浇水' },
  { time: '15:15', level: 'danger', levelText: '严重', message: '大棚2湿度异常 92%' },
  { time: '15:10', level: 'warning', levelText: '警告', message: '补光灯3号故障' },
  { time: '15:05', level: 'info', levelText: '提示', message: '大棚1通风已开启' },
  { time: '14:58', level: 'warning', levelText: '警告', message: 'CO2浓度偏高 580ppm' },
  { time: '14:50', level: 'info', levelText: '提示', message: '系统自检完成' }
])

function pause() {
  isPaused = true
}

function resume() {
  isPaused = false
}

function startScroll() {
  scrollTimer = setInterval(() => {
    if (isPaused || !listRef.value) return
    const el = listRef.value
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 10) {
      el.scrollTop = 0
    } else {
      el.scrollTop += 1
    }
  }, 50)
}

onMounted(() => {
  startScroll()
})

onUnmounted(() => {
  if (scrollTimer) clearInterval(scrollTimer)
})
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
  overflow: hidden;
}

.card-title {
  font-size: 16px;
  font-weight: bold;
  color: #1890ff;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(24, 144, 255, 0.3);
}

.alert-list {
  flex: 1;
  overflow-y: auto;
  scrollbar-width: none;
}

.alert-list::-webkit-scrollbar {
  display: none;
}

.alert-item {
  padding: 10px;
  margin-bottom: 8px;
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.2);
  border-left: 3px solid;
}

.alert-item.danger {
  border-left-color: #f5222d;
}

.alert-item.warning {
  border-left-color: #faad14;
}

.alert-item.info {
  border-left-color: #1890ff;
}

.alert-time {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.45);
  margin-bottom: 4px;
}

.alert-content {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.85);
}

.alert-tag {
  display: inline-block;
  padding: 1px 6px;
  border-radius: 3px;
  font-size: 11px;
  margin-right: 6px;
}

.danger .alert-tag {
  background: rgba(245, 34, 45, 0.3);
  color: #f5222d;
}

.warning .alert-tag {
  background: rgba(250, 173, 20, 0.3);
  color: #faad14;
}

.info .alert-tag {
  background: rgba(24, 144, 255, 0.3);
  color: #1890ff;
}
</style>
