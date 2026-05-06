<template>
  <div class="card">
    <div class="card-title">能耗统计</div>
    <div class="energy-grid">
      <div class="energy-item">
        <div class="energy-icon">⚡</div>
        <div class="energy-info">
          <div class="energy-value">{{ animatedPower }}</div>
          <div class="energy-label">今日用电(度)</div>
        </div>
      </div>
      <div class="energy-item">
        <div class="energy-icon">⏱️</div>
        <div class="energy-info">
          <div class="energy-value">{{ animatedRuntime }}</div>
          <div class="energy-label">设备运行(小时)</div>
        </div>
      </div>
    </div>
    <div class="energy-chart" ref="chartRef"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'

const chartRef = ref(null)
let chart = null

const animatedPower = ref(0)
const animatedRuntime = ref(0)

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

function initChart() {
  if (!chartRef.value) return
  chart = echarts.init(chartRef.value)

  const hours = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`)
  const powerData = hours.map(() => (Math.random() * 3 + 1).toFixed(1))

  const option = {
    grid: {
      left: '10%',
      right: '5%',
      top: '10%',
      bottom: '15%'
    },
    xAxis: {
      type: 'category',
      data: hours,
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.2)' } },
      axisLabel: {
        color: 'rgba(255,255,255,0.45)',
        fontSize: 8,
        interval: 3
      }
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } },
      axisLabel: { color: 'rgba(255,255,255,0.45)', fontSize: 8 }
    },
    series: [{
      type: 'bar',
      data: powerData,
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#1890ff' },
          { offset: 1, color: 'rgba(24,144,255,0.2)' }
        ]),
        borderRadius: [3, 3, 0, 0]
      },
      barWidth: '40%'
    }]
  }

  chart.setOption(option)
}

onMounted(() => {
  animateValue(0, 45, 1500, v => animatedPower.value = v.toFixed(1))
  animateValue(0, 18, 1500, v => animatedRuntime.value = v.toFixed(1))
  initChart()
  window.addEventListener('resize', () => chart?.resize())
})

onUnmounted(() => {
  if (chart) chart.dispose()
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

.energy-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 12px;
}

.energy-item {
  display: flex;
  align-items: center;
  padding: 12px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 6px;
}

.energy-icon {
  font-size: 28px;
  margin-right: 12px;
}

.energy-value {
  font-size: 24px;
  font-weight: bold;
  color: #faad14;
}

.energy-label {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.45);
  margin-top: 2px;
}

.energy-chart {
  width: 100%;
  height: 120px;
}
</style>
