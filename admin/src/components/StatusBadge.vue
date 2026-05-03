<template>
  <span :class="['status-badge', statusClass]">
    <span class="status-dot"></span>
    <span class="status-text">{{ statusText }}</span>
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  status: {
    type: String,
    default: 'offline'
  }
})

const statusClass = computed(() => ({
  'status-online': props.status === 'online',
  'status-offline': props.status === 'offline',
  'status-error': props.status === 'error'
}))

const statusText = computed(() => {
  const map = { online: '在线', offline: '离线', error: '故障' }
  return map[props.status] || props.status
})
</script>

<style scoped>
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
}
.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}
.status-online .status-dot {
  background: #67c23a;
  box-shadow: 0 0 6px #67c23a;
}
.status-offline .status-dot {
  background: #909399;
}
.status-error .status-dot {
  background: #f56c6c;
  box-shadow: 0 0 6px #f56c6c;
}
.status-online .status-text {
  color: #67c23a;
}
.status-offline .status-text {
  color: #909399;
}
.status-error .status-text {
  color: #f56c6c;
}
</style>
