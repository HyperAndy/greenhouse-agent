<template>
  <div class="dashboard">
    <el-row :gutter="20" class="stat-row">
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <div>
              <div class="stat-value">{{ stats.deviceTotal }}</div>
              <div class="stat-label">设备总数</div>
            </div>
            <el-icon :size="48" color="#409eff"><Monitor /></el-icon>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <div>
              <div class="stat-value" style="color: #67c23a">{{ stats.deviceOnline }}</div>
              <div class="stat-label">在线设备</div>
            </div>
            <el-icon :size="48" color="#67c23a"><CircleCheck /></el-icon>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <div>
              <div class="stat-value" style="color: #e6a23c">{{ stats.alertCount }}</div>
              <div class="stat-label">活跃告警</div>
            </div>
            <el-icon :size="48" color="#e6a23c"><Bell /></el-icon>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <div>
              <div class="stat-value" style="color: #909399">{{ stats.greenhouseCount }}</div>
              <div class="stat-label">大棚数量</div>
            </div>
            <el-icon :size="48" color="#909399"><House /></el-icon>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-card shadow="hover" class="chart-card">
      <template #header>
        <div class="card-header">
          <span>今日数据趋势</span>
          <el-radio-group v-model="chartType" size="small">
            <el-radio-button label="temp">温度</el-radio-button>
            <el-radio-button label="humi">湿度</el-radio-button>
          </el-radio-group>
        </div>
      </template>
      <div ref="chartRef" class="chart-container"></div>
    </el-card>

    <el-card shadow="hover" class="alert-card">
      <template #header>
        <div class="card-header">
          <span>最近告警</span>
          <el-button type="primary" link @click="$router.push('/alert')">查看全部</el-button>
        </div>
      </template>
      <el-table :data="recentAlerts" stripe size="small">
        <el-table-column prop="time" label="时间" width="180" />
        <el-table-column prop="greenhouse" label="大棚" width="150" />
        <el-table-column prop="level" label="级别" width="100">
          <template #default="{ row }">
            <el-tag :type="levelType(row.level)" size="small">{{ row.level }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="告警标题" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === '已确认' ? 'success' : 'danger'" size="small">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeUnmount, watch } from 'vue'
import * as echarts from 'echarts'

const chartRef = ref(null)
const chartType = ref('temp')
let chartInstance = null

const stats = reactive({
  deviceTotal: 128,
  deviceOnline: 96,
  alertCount: 5,
  greenhouseCount: 24
})

const recentAlerts = ref([
  { time: '2024-03-15 14:30:00', greenhouse: 'A区1号棚', level: '严重', title: '温度过高报警', status: '未确认' },
  { time: '2024-03-15 13:20:00', greenhouse: 'B区3号棚', level: '警告', title: '湿度偏低', status: '已确认' },
  { time: '2024-03-15 12:10:00', greenhouse: 'A区2号棚', level: '提示', title: '设备离线', status: '未确认' }
])

const levelType = (level) => {
  const map = { '严重': 'danger', '警告': 'warning', '提示': 'info' }
  return map[level] || 'info'
}

const tempData = {
  xData: ['00:00','02:00','04:00','06:00','08:00','10:00','12:00','14:00','16:00','18:00','20:00','22:00'],
  series: [
    { name: 'A区1号棚', data: [18,17,16,15,18,22,26,28,27,24,21,19] },
    { name: 'A区2号棚', data: [19,18,17,16,19,23,27,29,28,25,22,20] },
    { name: 'B区1号棚', data: [17,16,15,14,17,21,25,27,26,23,20,18] }
  ]
}

const humiData = {
  xData: tempData.xData,
  series: [
    { name: 'A区1号棚', data: [75,78,80,82,76,68,60,55,58,65,72,76] },
    { name: 'A区2号棚', data: [72,75,77,80,74,66,58,53,56,63,70,74] },
    { name: 'B区1号棚', data: [78,81,83,85,79,71,63,58,61,68,75,79] }
  ]
}

const initChart = () => {
  if (!chartRef.value) return
  chartInstance = echarts.init(chartRef.value)
  updateChart()
}

const updateChart = () => {
  const data = chartType.value === 'temp' ? tempData : humiData
  const option = {
    tooltip: { trigger: 'axis' },
    legend: { data: data.series.map(s => s.name) },
    grid: { left: 50, right: 20, top: 40, bottom: 30 },
    xAxis: { type: 'category', data: data.xData },
    yAxis: {
      type: 'value',
      name: chartType.value === 'temp' ? '温度(°C)' : '湿度(%)'
    },
    series: data.series.map(s => ({
      ...s,
      type: 'line',
      smooth: true,
      areaStyle: { opacity: 0.1 }
    }))
  }
  chartInstance.setOption(option, true)
}

watch(chartType, updateChart)

onMounted(() => {
  initChart()
  window.addEventListener('resize', () => chartInstance?.resize())
})

onBeforeUnmount(() => {
  chartInstance?.dispose()
  window.removeEventListener('resize', () => chartInstance?.resize())
})
</script>

<style scoped>
.stat-row {
  margin-bottom: 20px;
}
.stat-card .stat-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.stat-value {
  font-size: 32px;
  font-weight: 700;
  color: #409eff;
}
.stat-label {
  font-size: 14px;
  color: #909399;
  margin-top: 8px;
}
.chart-card {
  margin-bottom: 20px;
}
.chart-container {
  height: 350px;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
