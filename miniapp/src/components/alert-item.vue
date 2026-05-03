<template>
  <view class="alert-item" :class="`alert-item--${alert.level}`">
    <view class="alert-item__header">
      <view class="alert-item__level" :style="{ background: levelInfo.color }">
        {{ levelInfo.text }}
      </view>
      <view class="alert-item__time">{{ formattedTime }}</view>
    </view>
    
    <view class="alert-item__content">
      <view class="alert-item__title">{{ alert.title }}</view>
      <view class="alert-item__desc">{{ alert.description }}</view>
    </view>
    
    <view v-if="alert.greenhouseName" class="alert-item__location">
      <text class="text-gray">📍 {{ alert.greenhouseName }}</text>
    </view>
    
    <view v-if="expand" class="alert-item__detail">
      <view class="alert-item__detail-row">
        <text class="text-gray">触发值：</text>
        <text>{{ alert.triggerValue }}</text>
      </view>
      <view class="alert-item__detail-row">
        <text class="text-gray">阈值范围：</text>
        <text>{{ alert.thresholdRange }}</text>
      </view>
    </view>
    
    <view class="alert-item__footer">
      <view class="alert-item__expand" @tap="expand = !expand">
        {{ expand ? '收起详情' : '查看详情' }}
      </view>
      <view v-if="!alert.confirmed" class="alert-item__confirm" @tap="onConfirm">
        确认处理
      </view>
      <view v-else class="alert-item__confirmed">
        ✓ 已处理
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { formatRelativeTime, formatAlertLevel } from '../utils/format'

const props = defineProps({
  alert: { type: Object, required: true }
})

const emit = defineEmits(['confirm'])
const expand = ref(false)

const levelInfo = computed(() => formatAlertLevel(props.alert.level))
const formattedTime = computed(() => formatRelativeTime(props.alert.createdAt))

const onConfirm = () => {
  emit('confirm', props.alert.id)
}
</script>

<style scoped>
.alert-item {
  background: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 16rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
  border-left: 8rpx solid #ccc;
}

.alert-item--info {
  border-left-color: #2196f3;
}

.alert-item--warning {
  border-left-color: #ff9800;
}

.alert-item--critical {
  border-left-color: #f44336;
}

.alert-item__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
}

.alert-item__level {
  font-size: 22rpx;
  color: #fff;
  padding: 4rpx 16rpx;
  border-radius: 20rpx;
}

.alert-item__time {
  font-size: 24rpx;
  color: #999;
}

.alert-item__content {
  margin-bottom: 12rpx;
}

.alert-item__title {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 8rpx;
}

.alert-item__desc {
  font-size: 26rpx;
  color: #666;
  line-height: 1.5;
}

.alert-item__location {
  margin-bottom: 12rpx;
}

.alert-item__detail {
  background: #f9f9f9;
  padding: 16rpx;
  border-radius: 12rpx;
  margin-bottom: 16rpx;
}

.alert-item__detail-row {
  display: flex;
  justify-content: space-between;
  font-size: 24rpx;
  margin-bottom: 8rpx;
}

.alert-item__footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16rpx;
  border-top: 1rpx solid #f5f5f5;
}

.alert-item__expand {
  font-size: 26rpx;
  color: #2196f3;
}

.alert-item__confirm {
  font-size: 26rpx;
  color: #fff;
  background: #4CAF50;
  padding: 8rpx 24rpx;
  border-radius: 20rpx;
}

.alert-item__confirmed {
  font-size: 26rpx;
  color: #4CAF50;
}
</style>
