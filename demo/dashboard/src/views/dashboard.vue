<template>
  <div class="dashboard">
    <header class="header">
      <h1 class="title">智慧农业大棚自动化控制系统</h1>
      <div class="time">{{ currentTime }}</div>
    </header>
    <main class="main">
      <aside class="left-panel">
        <FarmOverview />
        <WeatherInfo />
        <EnergyStats />
      </aside>
      <section class="center-panel">
        <RealtimeData />
        <DataChart />
      </section>
      <aside class="right-panel">
        <AlertScroll />
        <DeviceStatus />
      </aside>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { formatTime } from '../utils/format'
import FarmOverview from '../components/FarmOverview.vue'
import RealtimeData from '../components/RealtimeData.vue'
import AlertScroll from '../components/AlertScroll.vue'
import DeviceStatus from '../components/DeviceStatus.vue'
import DataChart from '../components/DataChart.vue'
import WeatherInfo from '../components/WeatherInfo.vue'
import EnergyStats from '../components/EnergyStats.vue'

const currentTime = ref(formatTime(new Date()))
let timer = null

onMounted(() => {
  timer = setInterval(() => {
    currentTime.value = formatTime(new Date())
  }, 1000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<style scoped>
.dashboard {
  width: 100vw;
  height: 100vh;
  background: #0a1929;
  color: #fff;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.header {
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background: linear-gradient(180deg, rgba(24, 144, 255, 0.3) 0%, transparent 100%);
  border-bottom: 2px solid rgba(24, 144, 255, 0.5);
}

.title {
  font-size: 32px;
  font-weight: bold;
  background: linear-gradient(90deg, #1890ff, #52c41a);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 20px rgba(24, 144, 255, 0.5);
}

.time {
  position: absolute;
  right: 40px;
  font-size: 18px;
  color: #1890ff;
}

.main {
  flex: 1;
  display: flex;
  padding: 16px;
  gap: 16px;
  overflow: hidden;
}

.left-panel, .right-panel {
  width: 300px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.center-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
