<template>
  <div class="card">
    <div class="card-title">24小时数据趋势</div>
    <div class="chart-container" ref="chartRef"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'

const chartRef = ref(null)
let chart = null

function generateData() {
  const hours = []
  const temp1 = [], temp2 = [], temp3 = []
  const humi1 = [], humi2 = [], humi3 = []

  for (let i = 0; i < 24; i++) {
    hours.push(`${i.toString().padStart(2, '0')}:00`)
    temp1.push((22 + Math.sin(i / 3) * 5 + Math.random() * 2).toFixed(1))
    temp2.push((20 + Math.sin(i / 3) * 4 + Math.random() * 2).toFixed(1))
    temp3.push((24 + Math.sin(i / 3) * 6 + Math.random() * 2).toFixed(1))
    humi1.push((60 + Math.cos(i / 4) * 15 + Math.random() * 5).toFixed(0))
    humi2.push((65 + Math.cos(i / 4) * 12 + Math.random() * 5).toFixed(0))
    humi3.push((55 + Math.cos(i / 4) * 18 + Math.random() * 5).toFixed(0))
  }

  return { hours, temp1, temp2, temp3, humi1, humi2, humi3 }
}

function initChart() {
  if (!chartRef.value) return
  chart = echarts.init(chartRef.value)
  const data = generateData()

  const option = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(10, 25, 41, 0.9)',
      borderColor: 'rgba(24, 144, 255, 0.5)',
      textStyle: { color: '#fff' }
    },
    legend: {
      data: ['1号温度', '2号温度', '3号温度'],
      textStyle: { color: 'rgba(255,255,255,0.65)' },
      top: 0
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '40px',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: data.hours,
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.2)' } },
      axisLabel: { color: 'rgba(255,255,255,0.45)', fontSize: 10 }
    },
    yAxis: {
      type: 'value',
      name: '温度(°C)',
      nameTextStyle: { color: 'rgba(255,255,255,0.45)' },
      axisLine: { show: false },
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } },
      axisLabel: { color: 'rgba(255,255,255,0.45)' }
    },
    series: [
      {
        name: '1号温度',
        type: 'line',
        smooth: true,
        data: data.temp1,
        lineStyle: { color: '#1890ff' },
        itemStyle: { color: '#1890ff' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(24,144,255,0.3)' },
            { offset: 1, color: 'rgba(24,144,255,0)' }
          ])
        }
      },
      {
        name: '2号温度',
        type: 'line',
        smooth: true,
        data: data.temp2,
        lineStyle: { color: '#52c41a' },
        itemStyle: { color: '#52c41a' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(82,196,26,0.3)' },
            { offset: 1, color: 'rgba(82,196,26,0)' }
          ])
        }
      },
      {
        name: '3号温度',
        type: 'line',
        smooth: true,
        data: data.temp3,
        lineStyle: { color: '#faad14' },
        itemStyle: { color: '#faad14' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(250,173,20,0.3)' },
            { offset: 1, color: 'rgba(250,173,20,0)' }
          ])
        }
      }
    ]
  }

  chart.setOption(option)
}

onMounted(() => {
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
  flex: 1;
}

.card-title {
  font-size: 16px;
  font-weight: bold;
  color: #1890ff;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(24, 144, 255, 0.3);
}

.chart-container {
  width: 100%;
  height: calc(100% - 50px);
  min-height: 200px;
}
</style>
