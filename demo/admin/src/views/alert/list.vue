<template>
  <div class="alert-list">
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <span>告警管理</span>
          <el-button type="warning" icon="Check" @click="handleBatchAck" :disabled="!selectedIds.length">
            批量确认
          </el-button>
        </div>
      </template>

      <div class="filter-bar">
        <el-select v-model="filters.level" placeholder="告警级别" clearable style="width: 140px" @change="fetchList">
          <el-option label="严重" value="critical" />
          <el-option label="警告" value="warning" />
          <el-option label="提示" value="info" />
        </el-select>
        <el-select v-model="filters.status" placeholder="状态" clearable style="width: 140px" @change="fetchList">
          <el-option label="未确认" value="active" />
          <el-option label="已确认" value="acked" />
        </el-select>
        <el-date-picker
          v-model="filters.dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          style="width: 300px"
          @change="fetchList"
        />
      </div>

      <el-table
        :data="alertList"
        v-loading="loading"
        stripe
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="50" />
        <el-table-column prop="time" label="时间" width="180" />
        <el-table-column prop="greenhouse" label="大棚" width="120" />
        <el-table-column prop="level" label="级别" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="levelMap[row.level]" effect="dark" size="small">
              {{ levelLabel[row.level] }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="告警标题" min-width="200" />
        <el-table-column prop="description" label="描述" min-width="200" show-overflow-tooltip />
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === 'acked' ? 'success' : 'danger'" size="small">
              {{ row.status === 'acked' ? '已确认' : '未确认' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="{ row }">
            <el-button
              v-if="row.status !== 'acked'"
              type="primary"
              link
              icon="Check"
              @click="handleAck(row)"
            >
              确认
            </el-button>
            <span v-else class="text-muted">已处理</span>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :total="pagination.total"
          :page-sizes="[10, 20, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="fetchList"
          @current-change="fetchList"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const loading = ref(false)
const selectedIds = ref([])
const pagination = reactive({ page: 1, pageSize: 10, total: 0 })
const filters = reactive({ level: '', status: '', dateRange: [] })

const levelMap = { critical: 'danger', warning: 'warning', info: 'info' }
const levelLabel = { critical: '严重', warning: '警告', info: '提示' }

const alertList = ref([
  { id: 1, time: '2024-03-15 14:30:00', greenhouse: 'A区1号棚', level: 'critical', title: '温度过高报警', description: '当前温度35.2°C，超过阈值30°C', status: 'active' },
  { id: 2, time: '2024-03-15 13:20:00', greenhouse: 'B区1号棚', level: 'warning', title: '湿度偏低', description: '当前湿度35%，低于阈值40%', status: 'active' },
  { id: 3, time: '2024-03-15 12:10:00', greenhouse: 'A区2号棚', level: 'info', title: '设备离线通知', description: '温湿度传感器-02已离线超过30分钟', status: 'acked' },
  { id: 4, time: '2024-03-15 10:00:00', greenhouse: 'A区1号棚', level: 'critical', title: 'CO₂浓度过高', description: '当前CO₂浓度850ppm，超过阈值800ppm', status: 'active' },
  { id: 5, time: '2024-03-14 22:30:00', greenhouse: 'B区1号棚', level: 'warning', title: '土壤湿度过低', description: '当前土壤湿度25%，低于阈值30%', status: 'acked' }
])

const fetchList = () => {
  loading.value = true
  setTimeout(() => {
    pagination.total = alertList.value.length
    loading.value = false
  }, 300)
}

const handleSelectionChange = (rows) => {
  selectedIds.value = rows.map(r => r.id)
}

const handleAck = async (row) => {
  await ElMessageBox.confirm('确定确认该告警?', '确认', { type: 'warning' })
  row.status = 'acked'
  ElMessage.success('已确认')
}

const handleBatchAck = async () => {
  await ElMessageBox.confirm(`确定确认选中的 ${selectedIds.value.length} 条告警?`, '批量确认', { type: 'warning' })
  alertList.value.forEach(a => {
    if (selectedIds.value.includes(a.id)) a.status = 'acked'
  })
  selectedIds.value = []
  ElMessage.success('批量确认成功')
}

onMounted(fetchList)
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
.pagination-wrapper {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
.text-muted {
  color: #909399;
  font-size: 13px;
}
</style>
