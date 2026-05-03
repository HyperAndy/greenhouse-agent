<template>
  <view class="container">
    <!-- 顶部农场信息 -->
    <view class="farm-header">
      <view class="farm-header__name">{{ farmName }}</view>
      <view class="farm-header__stats">
        <view class="stat-item">
          <text class="stat-value">{{ greenhouseList.length }}</text>
          <text class="stat-label">大棚总数</text>
        </view>
        <view class="stat-item">
          <text class="stat-value text-primary">{{ onlineCount }}</text>
          <text class="stat-label">在线设备</text>
        </view>
        <view class="stat-item">
          <text class="stat-value text-warning">{{ alertCount }}</text>
          <text class="stat-label">待处理告警</text>
        </view>
      </view>
    </view>

    <!-- 大棚列表 -->
    <view class="section-title">
      <text>我的大棚</text>
      <text class="text-primary" @tap="refreshData">刷新</text>
    </view>

    <view v-if="loading" class="loading-box">
      <text>加载中...</text>
    </view>

    <view v-else-if="greenhouseList.length === 0" class="empty-box">
      <text class="empty-icon">🏠</text>
      <text class="empty-text">暂无大棚数据</text>
    </view>

    <view v-else class="greenhouse-list">
      <view
        v-for="item in greenhouseList"
        :key="item.id"
        class="greenhouse-card"
        @tap="goToDetail(item.id)"
      >
        <view class="greenhouse-card__header">
          <view class="greenhouse-card__name">{{ item.name }}</view>
          <view class="greenhouse-card__crop">{{ item.cropType }}</view>
        </view>

        <view class="greenhouse-card__data">
          <view class="data-item">
            <text class="data-icon">🌡️</text>
            <text class="data-value">{{ formatTemp(item.temperature) }}</text>
          </view>
          <view class="data-item">
            <text class="data-icon">💧</text>
            <text class="data-value">{{ formatHumidity(item.humidity) }}</text>
          </view>
          <view class="data-item">
            <text class="data-icon">☀️</text>
            <text class="data-value">{{ formatLight(item.light) }}</text>
          </view>
        </view>

        <view class="greenhouse-card__footer">
          <view class="device-status">
            <view class="status-dot" :class="{ 'status-dot--online': item.deviceOnline }"></view>
            <text>{{ item.deviceOnline ? '设备在线' : '设备离线' }}</text>
          </view>
          <text class="text-gray">更新于 {{ formatTime(item.updateTime) }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getGreenhouseList } from '../../api/farm'
import { getAlertStats } from '../../api/alert'
import { formatTemperature, formatHumidity, formatLight, formatTime } from '../../utils/format'

const loading = ref(false)
const farmName = ref('我的农场')
const greenhouseList = ref([])
const alertCount = ref(0)

const onlineCount = computed(() => {
  return greenhouseList.value.filter(item => item.deviceOnline).length
})

const formatTemp = (val) => formatTemperature(val)
const formatHumidity = (val) => formatHumidity(val)
const formatLight = (val) => formatLight(val)

const loadData = async () => {
  loading.value = true
  try {
    const [greenhouseRes, alertRes] = await Promise.all([
      getGreenhouseList(),
      getAlertStats()
    ])
    greenhouseList.value = greenhouseRes.data || []
    alertCount.value = alertRes.data?.unconfirmed || 0
  } catch (error) {
    console.error('加载数据失败', error)
  } finally {
    loading.value = false
  }
}

const refreshData = () => {
  loadData()
}

const goToDetail = (id) => {
  uni.navigateTo({
    url: `/pages/greenhouse/detail?id=${id}`
  })
}

onMounted(() => {
  loadData()
})

onPullDownRefresh(() => {
  loadData().finally(() => {
    uni.stopPullDownRefresh()
  })
})
</script>

<style scoped>
.container {
  padding: 20rpx;
  background: #f5f5f5;
  min-height: 100vh;
}

.farm-header {
  background: linear-gradient(135deg, #4CAF50, #388E3C);
  border-radius: 20rpx;
  padding: 32rpx;
  margin-bottom: 24rpx;
  color: #fff;
}

.farm-header__name {
  font-size: 36rpx;
  font-weight: bold;
  margin-bottom: 24rpx;
}

.farm-header__stats {
  display: flex;
  justify-content: space-around;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-value {
  font-size: 40rpx;
  font-weight: bold;
}

.stat-label {
  font-size: 24rpx;
  opacity: 0.8;
  margin-top: 8rpx;
}

.section-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
  font-size: 30rpx;
  font-weight: bold;
}

.loading-box,
.empty-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100rpx 0;
}

.empty-icon {
  font-size: 80rpx;
  margin-bottom: 20rpx;
}

.empty-text {
  color: #999;
  font-size: 28rpx;
}

.greenhouse-card {
  background: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
}

.greenhouse-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.greenhouse-card__name {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.greenhouse-card__crop {
  font-size: 24rpx;
  color: #4CAF50;
  background: #e8f5e9;
  padding: 4rpx 16rpx;
  border-radius: 20rpx;
}

.greenhouse-card__data {
  display: flex;
  justify-content: space-around;
  padding: 20rpx 0;
  border-top: 1rpx solid #f5f5f5;
  border-bottom: 1rpx solid #f5f5f5;
}

.data-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.data-icon {
  font-size: 36rpx;
  margin-bottom: 8rpx;
}

.data-value {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
}

.greenhouse-card__footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16rpx;
  font-size: 24rpx;
}

.device-status {
  display: flex;
  align-items: center;
}

.status-dot {
  width: 16rpx;
  height: 16rpx;
  border-radius: 50%;
  background: #f44336;
  margin-right: 8rpx;
}

.status-dot--online {
  background: #4CAF50;
}
</style>
