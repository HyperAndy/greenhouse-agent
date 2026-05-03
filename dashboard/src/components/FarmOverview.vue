<template>
  <div class="card">
    <div class="card-title">农场总览</div>
    <div class="stats-grid">
      <div class="stat-item">
        <div class="stat-value online">{{ animatedOnline }}</div>
        <div class="stat-label">在线设备</div>
      </div>
      <div class="stat-item">
        <div class="stat-value total">{{ animatedTotal }}</div>
        <div class="stat-label">设备总数</div>
      </div>
      <div class="stat-item">
        <div class="stat-value alert">{{ animatedAlerts }}</div>
        <div class="stat-label">今日告警</div>
      </div>
      <div class="stat-item">
        <div class="stat-value data">{{ animatedDataCount }}</div>
        <div class="stat-label">数据采集(万)</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const online = 10
const total = 12
const alerts = 2
const dataCount = 12.5

const animatedOnline = ref(0)
const animatedTotal = ref(0)
const animatedAlerts = ref(0)
const animatedDataCount = ref(0)

let animFrame = null

function animateValue(start, end, duration, callback) {
  const startTime = performance.now()
  function update(currentTime) {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)
    const value = start + (end - start) * easeOutCubic(progress)
    callback(value)
    if (progress < 1) {
      requestAnimationFrame(update)
    }
  }
  requestAnimationFrame(update)
}

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3)
}

onMounted(() => {
  animateValue(0, online, 1500, v => animatedOnline.value = Math.round(v))
  animateValue(0, total, 1500, v => animatedTotal.value = Math.round(v))
  animateValue(0, alerts, 1500, v => animatedAlerts.value = Math.round(v))
  animateValue(0, dataCount, 1500, v => animatedDataCount.value = v.toFixed(1))
})

onUnmounted(() => {
  if (animFrame) cancelAnimationFrame(animFrame)
})
</script>

<style scoped>
.card {
  background: rgba(24, 144, 255, 0.1);
  border: 1px solid rgba(24, 144, 255, 0.3);
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 0 15px rgba(24, 144, 255, 0.2);
}

.card-title {
  font-size: 16px;
  font-weight: bold;
  color: #1890ff;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(24, 144, 255, 0.3);
}

.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.stat-item {
  text-align: center;
  padding: 12px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 6px;
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 4px;
}

.stat-value.online { color: #52c41a; }
.stat-value.total { color: #1890ff; }
.stat-value.alert { color: #f5222d; }
.stat-value.data { color: #faad14; }

.stat-label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.65);
}
</style>
