<template>
  <div ref="chartRef" class="sensor-chart" :style="{ height: height + 'px' }"></div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
  data: {
    type: Object,
    default: () => ({ xData: [], series: [] })
  },
  height: {
    type: Number,
    default: 300
  },
  title: {
    type: String,
    default: ''
  },
  yAxisName: {
    type: String,
    default: ''
  }
})

const chartRef = ref(null)
let chartInstance = null

const initChart = () => {
  if (!chartRef.value) return
  chartInstance = echarts.init(chartRef.value)
  updateChart()
}

const updateChart = () => {
  if (!chartInstance || !props.data.xData) return
  const option = {
    title: props.title ? { text: props.title, left: 'center', textStyle: { fontSize: 14 } } : undefined,
    tooltip: { trigger: 'axis' },
    legend: { data: props.data.series.map(s => s.name), bottom: 0 },
    grid: { left: 50, right: 20, top: props.title ? 40 : 20, bottom: 40 },
    xAxis: { type: 'category', data: props.data.xData, boundaryGap: false },
    yAxis: {
      type: 'value',
      name: props.yAxisName,
      axisLine: { show: true }
    },
    series: props.data.series.map(s => ({
      ...s,
      type: 'line',
      smooth: true,
      showSymbol: false,
      areaStyle: { opacity: 0.08 }
    }))
  }
  chartInstance.setOption(option, true)
}

const handleResize = () => chartInstance?.resize()

watch(() => props.data, updateChart, { deep: true })

onMounted(() => {
  initChart()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  chartInstance?.dispose()
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.sensor-chart {
  width: 100%;
}
</style>
