<template>
  <div class="card">
    <div class="card-title">实时数据监控</div>
    <div class="greenhouse-grid">
      <div v-for="gh in greenhouses" :key="gh.id" class="greenhouse">
        <div class="gh-name">{{ gh.name }}</div>
        <div class="gauges">
          <div class="gauge-item">
            <div class="gauge-chart" :ref="el => gaugeRefs[gh.id + '_temp'] = el"></div>
            <div class="gauge-label">温度 °C</div>
          </div>
          <div class="gauge-item">
            <div class="gauge-chart" :ref="el => gaugeRefs[gh.id + '_humi'] = el"></div>
            <div class="gauge-label">湿度 %</div>
          </div>
        </div>
        <div class="extra-data">
          <div class="data-item">
            <span class="data-icon">☀️</span>
            <span class="data-value">{{ gh.light }}</span>
            <span class="data-unit">Lux</span>
          </div>
          <div class="data-item">
            <span class="data-icon">💨</span>
            <span class="data-value">{{ gh.co2 }}</span>
            <span class="data-unit">ppm</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import * as echarts from 'echarts'

const gaugeRefs = ref({})
const charts = {}

const greenhouses = ref([
  { id: 'gh1', name: '大棚1号', temp: 28.5, humidity: 65, light: 45000, co2: 420 },
  { id: 'gh2', name: '大棚2号', temp: 26.8, humidity: 72, light: 38000, co2: 380 },
  { id: 'gh3', name: '大棚3号', temp: 31.2, humidity: 58, light: 52000, co2: 450 }
])

function createGaugeOption(value, max, color) {
  return {
    series: [{
      type: 'gauge',
      max: max,
      progress: { show: true, width: 12 },
      axisLine: { lineStyle: { width: 12, color: [[1, 'rgba(255,255,255,0.1)']] } },
      axisTick: { show: false },
      splitLine: { show: false },
      axisLabel: { show: false },
      pointer: { show: false },
      title: { show: false },
      detail: {
        valueAnimation: true,
        fontSize: 20,
        fontWeight: 'bold',
        color: color,
        offsetCenter: [0, '0%'],
        formatter: '{value}'
      },
      data: [{ value: value }]
    }]
  }
}

function initCharts() {
  greenhouses.value.forEach(gh => {
    const tempEl = gaugeRefs.value[gh.id + '_temp']
    const humiEl = gaugeRefs.value[gh.id + '_humi']

    if (tempEl) {
      const chart = echarts.init(tempEl)
      chart.setOption(createGaugeOption(gh.temp, 50, '#f5222d'))
      charts[gh.id + '_temp'] = chart
    }

    if (humiEl) {
      const chart = echarts.init(humiEl)
      chart.setOption(createGaugeOption(gh.humidity, 100, '#1890ff'))
      charts[gh.id + '_humi'] = chart
    }
  })
}

function updateData() {
  greenhouses.value.forEach(gh => {
    gh.temp = (25 + Math.random() * 10).toFixed(1)
    gh.humidity = Math.round(55 + Math.random() * 30)
    gh.light = Math.round(30000 + Math.random() * 30000)
    gh.co2 = Math.round(350 + Math.random() * 150)

    const tempChart = charts[gh.id + '_temp']
    const humiChart = charts[gh.id + '_humi']

    if (tempChart) {
      tempChart.setOption({ series: [{ data: [{ value: gh.temp }] }] })
    }
    if (humiChart) {
      humiChart.setOption({ series: [{ data: [{ value: gh.humidity }] }] })
    }
  })
}

let refreshTimer = null

onMounted(async () => {
  await nextTick()
  initCharts()
  refreshTimer = setInterval(updateData, 10000)
})

onUnmounted(() => {
  if (refreshTimer) clearInterval(refreshTimer)
  Object.values(charts).forEach(chart => chart.dispose())
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

.greenhouse-grid {
  display: flex;
  gap: 16px;
}

.greenhouse {
  flex: 1;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 6px;
  padding: 12px;
  text-align: center;
}

.gh-name {
  font-size: 14px;
  font-weight: bold;
  color: #52c41a;
  margin-bottom: 12px;
}

.gauges {
  display: flex;
  justify-content: center;
  gap: 8px;
}

.gauge-item {
  flex: 1;
}

.gauge-chart {
  width: 100%;
  height: 120px;
}

.gauge-label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.65);
  margin-top: 4px;
}

.extra-data {
  display: flex;
  justify-content: space-around;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.data-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.data-icon {
  font-size: 14px;
}

.data-value {
  font-size: 16px;
  font-weight: bold;
  color: #faad14;
}

.data-unit {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.45);
}
</style>
