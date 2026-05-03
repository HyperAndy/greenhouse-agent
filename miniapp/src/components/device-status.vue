<template>
  <view class="device-status" :class="{ 'device-status--active': isActive }">
    <view class="device-status__header">
      <view class="device-status__icon">{{ deviceIcon }}</view>
      <view class="device-status__info">
        <view class="device-status__name">{{ device.name }}</view>
        <view class="device-status__type">{{ deviceType }}</view>
      </view>
      <view class="device-status__indicator" :class="{ 'indicator--online': device.status === 'online' }">
        {{ device.status === 'online' ? '在线' : '离线' }}
      </view>
    </view>
    
    <view class="device-status__control">
      <view class="device-status__state">
        {{ isActive ? '运行中' : '已关闭' }}
      </view>
      <switch
        :checked="isActive"
        :disabled="device.status !== 'online'"
        color="#4CAF50"
        @change="onToggle"
      />
    </view>
  </view>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  device: { type: Object, required: true }
})

const emit = defineEmits(['toggle'])

const deviceIcons = {
  fan: '🌀',
  curtain: '🪟',
  irrigation: '💧',
  light: '💡',
  heater: '🔥',
  cooler: '❄️',
  humidifier: '💨',
  default: '⚙️'
}

const deviceTypes = {
  fan: '风机',
  curtain: '卷帘',
  irrigation: '灌溉',
  light: '补光灯',
  heater: '加热器',
  cooler: '制冷器',
  humidifier: '加湿器',
  default: '设备'
}

const deviceIcon = computed(() => deviceIcons[props.device.type] || deviceIcons.default)
const deviceType = computed(() => deviceTypes[props.device.type] || deviceTypes.default)
const isActive = computed(() => props.device.state === 'on' || props.device.state === 1)

const onToggle = (e) => {
  emit('toggle', {
    deviceId: props.device.id,
    action: e.detail.value ? 'on' : 'off'
  })
}
</script>

<style scoped>
.device-status {
  background: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 16rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
}

.device-status--active {
  border-left: 8rpx solid #4CAF50;
}

.device-status__header {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
}

.device-status__icon {
  font-size: 48rpx;
  margin-right: 16rpx;
}

.device-status__info {
  flex: 1;
}

.device-status__name {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
}

.device-status__type {
  font-size: 24rpx;
  color: #999;
  margin-top: 4rpx;
}

.device-status__indicator {
  font-size: 22rpx;
  padding: 4rpx 12rpx;
  border-radius: 20rpx;
  background: #f5f5f5;
  color: #999;
}

.indicator--online {
  background: #e8f5e9;
  color: #4CAF50;
}

.device-status__control {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 20rpx;
  border-top: 1rpx solid #f5f5f5;
}

.device-status__state {
  font-size: 26rpx;
  color: #666;
}
</style>
