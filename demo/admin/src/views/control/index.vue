<template>
  <div class="control-page">
    <el-row :gutter="20">
      <el-col :span="16">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>设备控制</span>
              <el-select v-model="selectedGreenhouse" placeholder="选择大棚" style="width: 200px" @change="handleGreenhouseChange">
                <el-option v-for="gh in greenhouses" :key="gh.id" :label="gh.name" :value="gh.id" />
              </el-select>
            </div>
          </template>

          <el-empty v-if="!selectedGreenhouse" description="请先选择大棚" />

          <div v-else class="control-grid">
            <div v-for="device in controlDevices" :key="device.id" class="control-card">
              <div class="control-header">
                <el-icon :size="24" :color="device.iconColor"><component :is="device.icon" /></el-icon>
                <span class="control-name">{{ device.name }}</span>
                <StatusBadge :status="device.status" />
              </div>
              <div class="control-channels">
                <div v-for="ch in device.channels" :key="ch.id" class="channel-item">
                  <span class="channel-label">{{ ch.name }}</span>
                  <el-switch
                    v-model="ch.on"
                    :active-text="'开'"
                    :inactive-text="'关'"
                    inline-prompt
                    @change="(val) => handleToggle(device, ch, val)"
                  />
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card shadow="hover">
          <template #header>控制记录</template>
          <el-timeline>
            <el-timeline-item
              v-for="log in controlLogs"
              :key="log.id"
              :timestamp="log.time"
              placement="top"
              :type="log.type"
            >
              <p>{{ log.content }}</p>
              <p class="log-operator">操作人: {{ log.operator }}</p>
            </el-timeline-item>
          </el-timeline>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import StatusBadge from '@/components/StatusBadge.vue'

const selectedGreenhouse = ref('')
const greenhouses = ref([
  { id: 1, name: 'A区1号棚' },
  { id: 2, name: 'A区2号棚' },
  { id: 3, name: 'B区1号棚' }
])

const controlDevices = ref([
  {
    id: 1, name: '风机控制', icon: 'Fan', iconColor: '#409eff', status: 'online',
    channels: [
      { id: 1, name: '通道1 - 排风扇', on: true },
      { id: 2, name: '通道2 - 循环扇', on: false }
    ]
  },
  {
    id: 2, name: '水泵控制', icon: 'Drizzling', iconColor: '#67c23a', status: 'online',
    channels: [
      { id: 1, name: '通道1 - 灌溉泵', on: false },
      { id: 2, name: '通道2 - 排水泵', on: false }
    ]
  },
  {
    id: 3, name: '卷帘控制', icon: 'Menu', iconColor: '#e6a23c', status: 'online',
    channels: [
      { id: 1, name: '通道1 - 侧帘', on: true },
      { id: 2, name: '通道2 - 顶帘', on: false }
    ]
  },
  {
    id: 4, name: '补光灯', icon: 'Sunny', iconColor: '#f56c6c', status: 'offline',
    channels: [
      { id: 1, name: '通道1 - LED灯组A', on: false },
      { id: 2, name: '通道2 - LED灯组B', on: false }
    ]
  }
])

const controlLogs = ref([
  { id: 1, time: '2024-03-15 14:30:00', content: '风机-通道1 排风扇 已开启', operator: '张三', type: 'success' },
  { id: 2, time: '2024-03-15 14:00:00', content: '卷帘-通道1 侧帘 已开启', operator: '张三', type: 'primary' },
  { id: 3, time: '2024-03-15 12:00:00', content: '水泵-通道1 灌溉泵 已关闭', operator: '李四', type: 'warning' },
  { id: 4, time: '2024-03-15 10:30:00', content: '补光灯 设备离线', operator: '系统', type: 'danger' }
])

const handleGreenhouseChange = () => {
  ElMessage.info('已切换大棚')
}

const handleToggle = async (device, channel, val) => {
  const action = val ? '开启' : '关闭'
  await ElMessageBox.confirm(
    `确定${action} ${device.name} - ${channel.name}?`,
    '控制确认',
    { type: 'warning', confirmButtonText: '确定执行' }
  )
  ElMessage.success(`${channel.name} 已${action}`)
}
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.control-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}
.control-card {
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  padding: 16px;
}
.control-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
}
.control-name {
  flex: 1;
  font-weight: 600;
  font-size: 15px;
}
.control-channels {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.channel-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.channel-label {
  font-size: 14px;
  color: #606266;
}
.log-operator {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
}
</style>
