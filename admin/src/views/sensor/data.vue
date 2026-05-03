<template>
  <div class="sensor-data">
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <span>数据查询</span>
          <el-button type="success" icon="Download" @click="handleExport">导出数据</el-button>
        </div>
      </template>

      <div class="filter-bar">
        <el-select v-model="filters.deviceId" placeholder="选择设备" style="width: 200px">
          <el-option v-for="d in deviceOptions" :key="d.id" :label="d.name" :value="d.id" />
        </el-select>
        <el-date-picker
          v-model="filters.dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          style="width: 300px"
        />
        <el-button type="primary" icon="Search" @click="handleSearch">查询</el-button>
      </div>

      <el-row :gutter="20">
        <el-col :span="16">
          <el-card shadow="never">
            <div ref="chartRef" class="chart-container"></div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card shadow="never">
            <template #header>最新数据</template>
            <el-descriptions :column="1" border size="small">
              <el-descriptions-item label="温度">26.5°C</el-descriptions-item>
              <el-descriptions-item label="湿度">62.3%</el-descriptions-item>
              <el-descriptions-item label="光照">45200 Lux</el-descriptions-item>
              <el-descriptions-item label="CO₂">412 ppm</el-descriptions-item>
              <el-descriptions-item label="土壤湿度">45.2%</el-descriptions-item>
              <el-descriptions-item label="更新时间">2024-03-15 14:30:00</el-descriptions-item>
            </el-descriptions>
          </el-card>
        </el-col>
      </el-row>

      <el-card shadow="never" style="margin-top: 16px">
        <template #header>数据记录</template>
        <el-table :data="tableData" stripe size="small" max-height="400">
          <el-table-column prop="time" label="时间" width="180" />
          <el-table-column prop="temperature" label="温度(°C)" width="120" />
          <el-table-column prop="humidity" label="湿度(%)" width="120" />
          <el-table-column prop="light" label="光照(Lux)" width="120" />
          <el-table-column prop="co2" label="CO₂(ppm)" width="120" />
          <el-table-column prop="soilMoisture" label="土壤湿度(%)" width="130" />
        </el-table>
        <div class="pagination-wrapper">
          <el-pagination
            v-model:current-page="pagination.page"
            v-model:page-size="pagination.pageSize"
            :total="pagination.total"
            layout="total, prev, pager, next"
          />
        </div>
      </el-card>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts'
import { ElMessage } from 'element-plus'

const chartRef = ref(null)
let chartInstance = null

const deviceOptions = [
  { id: 1, name: '温湿度传感器-01' },
  { id: 2, name: '温湿度传感器-02' },
  { id: 3, name: '光照传感器-01' }
]

const filters = reactive({ deviceId: 1, dateRange: [] })
const pagination = reactive({ page: 1, pageSize: 20, total: 100 })

const tableData = ref(
  Array.from({ length: 10 }, (_, i) => ({
    time: `2024-03-15 ${14 - i}:${30 - i * 2}:00`,
    temperature: (25 + Math.random() * 5).toFixed(1),
    humidity: (55 + Math.random() * 15).toFixed(1),
    light: Math.floor(40000 + Math.random() * 10000),
    co2: Math.floor(400 + Math.random() * 50),
    soilMoisture: (40 + Math.random() * 10).toFixed(1)
  }))
)

const initChart = () => {
  if (!chartRef.value) return
  chartInstance = echarts.init(chartRef.value)
  const hours = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`)
  chartInstance.setOption({
    tooltip: { trigger: 'axis' },
    legend: { data: ['温度', '湿度'] },
    grid: { left: 50, right: 50, top: 40, bottom: 30 },
    xAxis: { type: 'category', data: hours },
    yAxis: [
      { type: 'value', name: '温度(°C)', position: 'left' },
      { type: 'value', name: '湿度(%)', position: 'right' }
    ],
    series: [
      {
        name: '温度',
        type: 'line',
        data: hours.map(() => 20 + Math.random() * 10),
        smooth: true
      },
      {
        name: '湿度',
        type: 'line',
        yAxisIndex: 1,
        data: hours.map(() => 50 + Math.random() * 30),
        smooth: true
      }
    ]
  })
}

const handleSearch = () => {
  ElMessage.success('查询完成')
}

const handleExport = () => {
  ElMessage.success('导出成功')
}

onMounted(() => {
  initChart()
  window.addEventListener('resize', () => chartInstance?.resize())
})

onBeforeUnmount(() => {
  chartInstance?.dispose()
})
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.filter-bar {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}
.chart-container {
  height: 350px;
}
.pagination-wrapper {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}
</style>
