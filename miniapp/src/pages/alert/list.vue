<template>
  <view class="container">
    <!-- 筛选栏 -->
    <view class="filter-bar">
      <view
        class="filter-item"
        :class="{ 'filter-item--active': filter === 'unconfirmed' }"
        @tap="filter = 'unconfirmed'"
      >
        未确认
        <view v-if="unconfirmedCount > 0" class="filter-badge">{{ unconfirmedCount }}</view>
      </view>
      <view
        class="filter-item"
        :class="{ 'filter-item--active': filter === 'all' }"
        @tap="filter = 'all'"
      >
        全部
      </view>
    </view>

    <!-- 统计信息 -->
    <view class="stats-bar">
      <view class="stat-item">
        <text class="stat-value text-danger">{{ stats.critical || 0 }}</text>
        <text class="stat-label">严重</text>
      </view>
      <view class="stat-item">
        <text class="stat-value text-warning">{{ stats.warning || 0 }}</text>
        <text class="stat-label">警告</text>
      </view>
      <view class="stat-item">
        <text class="stat-value text-info">{{ stats.info || 0 }}</text>
        <text class="stat-label">提示</text>
      </view>
    </view>

    <!-- 告警列表 -->
    <view v-if="loading" class="loading-box">加载中...</view>
    <view v-else-if="filteredList.length === 0" class="empty-box">
      <text class="empty-icon">🔔</text>
      <text class="empty-text">暂无告警信息</text>
    </view>
    <view v-else class="alert-list">
      <alert-item
        v-for="alert in filteredList"
        :key="alert.id"
        :alert="alert"
        @confirm="handleConfirm"
      />
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getAlertList, confirmAlert, getAlertStats } from '../../api/alert'
import AlertItem from '../../components/alert-item.vue'

const filter = ref('unconfirmed')
const loading = ref(false)
const alerts = ref([])
const stats = ref({})

const unconfirmedCount = computed(() => {
  return alerts.value.filter(a => !a.confirmed).length
})

const filteredList = computed(() => {
  if (filter.value === 'unconfirmed') {
    return alerts.value.filter(a => !a.confirmed)
  }
  return alerts.value
})

const loadData = async () => {
  loading.value = true
  try {
    const [alertRes, statsRes] = await Promise.all([
      getAlertList(),
      getAlertStats()
    ])
    alerts.value = alertRes || []
    stats.value = statsRes || {}
  } catch (error) {
    console.error('加载告警数据失败', error)
    uni.showToast({ title: '加载失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}

const handleConfirm = async (alertId) => {
  uni.showModal({
    title: '确认处理',
    content: '确认已处理此告警？',
    success: async (res) => {
      if (res.confirm) {
        try {
          await confirmAlert(alertId)
          uni.showToast({ title: '已确认', icon: 'success' })
          loadData()
        } catch (error) {
          uni.showToast({ title: '操作失败', icon: 'none' })
        }
      }
    }
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

.filter-bar {
  display: flex;
  background: #fff;
  border-radius: 12rpx;
  padding: 8rpx;
  margin-bottom: 20rpx;
}

.filter-item {
  flex: 1;
  text-align: center;
  padding: 16rpx;
  font-size: 28rpx;
  color: #666;
  border-radius: 8rpx;
  position: relative;
}

.filter-item--active {
  background: #4CAF50;
  color: #fff;
}

.filter-badge {
  position: absolute;
  top: -10rpx;
  right: 20rpx;
  background: #f44336;
  color: #fff;
  font-size: 20rpx;
  min-width: 32rpx;
  height: 32rpx;
  line-height: 32rpx;
  border-radius: 16rpx;
  padding: 0 8rpx;
}

.stats-bar {
  display: flex;
  justify-content: space-around;
  background: #fff;
  border-radius: 12rpx;
  padding: 24rpx;
  margin-bottom: 20rpx;
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
  color: #999;
  margin-top: 8rpx;
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
</style>
