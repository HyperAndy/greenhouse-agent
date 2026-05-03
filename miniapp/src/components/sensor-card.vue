<template>
  <view class="sensor-card" :class="{ 'sensor-card--warning': isWarning }">
    <view class="sensor-card__icon">{{ icon }}</view>
    <view class="sensor-card__content">
      <view class="sensor-card__label">{{ label }}</view>
      <view class="sensor-card__value" :class="{ 'text-warning': isWarning, 'text-danger': isDanger }">
        {{ formattedValue }}
      </view>
    </view>
    <view v-if="showRange" class="sensor-card__range">
      <text class="text-gray">{{ range }}</text>
    </view>
  </view>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  icon: { type: String, default: '📊' },
  label: { type: String, required: true },
  value: { type: [Number, String], default: null },
  unit: { type: String, default: '' },
  formatter: { type: Function, default: null },
  warningRange: { type: Array, default: null },
  dangerRange: { type: Array, default: null },
  showRange: { type: Boolean, default: false }
})

const formattedValue = computed(() => {
  if (props.value === null || props.value === undefined) return '--'
  if (props.formatter) return props.formatter(props.value)
  return `${props.value}${props.unit}`
})

const isWarning = computed(() => {
  if (!props.warningRange || props.value === null) return false
  return props.value < props.warningRange[0] || props.value > props.warningRange[1]
})

const isDanger = computed(() => {
  if (!props.dangerRange || props.value === null) return false
  return props.value < props.dangerRange[0] || props.value > props.dangerRange[1]
})

const range = computed(() => {
  if (!props.warningRange) return ''
  return `${props.warningRange[0]}~${props.warningRange[1]}${props.unit}`
})
</script>

<style scoped>
.sensor-card {
  display: flex;
  align-items: center;
  padding: 24rpx;
  background: #fff;
  border-radius: 16rpx;
  margin-bottom: 16rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
  transition: all 0.3s;
}

.sensor-card--warning {
  border-left: 8rpx solid #ff9800;
}

.sensor-card__icon {
  font-size: 48rpx;
  margin-right: 20rpx;
}

.sensor-card__content {
  flex: 1;
}

.sensor-card__label {
  font-size: 26rpx;
  color: #666;
  margin-bottom: 8rpx;
}

.sensor-card__value {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
}

.sensor-card__range {
  font-size: 22rpx;
}
</style>
