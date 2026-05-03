<template>
  <view class="container">
    <!-- 用户信息区 -->
    <view class="user-section">
      <view class="user-avatar">
        <image v-if="userStore.avatar" :src="userStore.avatar" class="avatar-img" />
        <text v-else class="avatar-placeholder">👤</text>
      </view>
      <view class="user-info">
        <view class="user-name">{{ userStore.username || '未登录' }}</view>
        <view class="user-phone">{{ userStore.phone || '请先登录' }}</view>
      </view>
      <view class="edit-btn" @tap="editProfile">
        <text>编辑</text>
      </view>
    </view>

    <!-- 功能菜单 -->
    <view class="menu-section">
      <view class="menu-group">
        <view class="menu-item" @tap="goToFarmManage">
          <text class="menu-icon">🏠</text>
          <text class="menu-text">农场管理</text>
          <text class="menu-arrow">›</text>
        </view>
        <view class="menu-item" @tap="goToNotificationCenter">
          <text class="menu-icon">🔔</text>
          <text class="menu-text">通知设置</text>
          <text class="menu-arrow">›</text>
        </view>
        <view class="menu-item" @tap="goToDataStats">
          <text class="menu-icon">📊</text>
          <text class="menu-text">数据统计</text>
          <text class="menu-arrow">›</text>
        </view>
      </view>

      <view class="menu-group">
        <view class="menu-item" @tap="goToHelp">
          <text class="menu-icon">❓</text>
          <text class="menu-text">帮助中心</text>
          <text class="menu-arrow">›</text>
        </view>
        <view class="menu-item" @tap="goToAbout">
          <text class="menu-icon">ℹ️</text>
          <text class="menu-text">关于我们</text>
          <text class="menu-arrow">›</text>
        </view>
        <view class="menu-item" @tap="goToFeedback">
          <text class="menu-icon">💬</text>
          <text class="menu-text">意见反馈</text>
          <text class="menu-arrow">›</text>
        </view>
      </view>

      <view class="menu-group">
        <view class="menu-item" @tap="clearCache">
          <text class="menu-icon">🗑️</text>
          <text class="menu-text">清除缓存</text>
          <text class="menu-value">{{ cacheSize }}</text>
          <text class="menu-arrow">›</text>
        </view>
        <view class="menu-item">
          <text class="menu-icon">📱</text>
          <text class="menu-text">当前版本</text>
          <text class="menu-value">v1.0.0</text>
        </view>
      </view>
    </view>

    <!-- 退出登录 -->
    <view class="logout-section">
      <button class="logout-btn" @tap="handleLogout">退出登录</button>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '../../store/user'

const userStore = useUserStore()
const cacheSize = ref('0KB')

const calculateCacheSize = () => {
  try {
    const res = uni.getStorageInfoSync()
    cacheSize.value = res.currentSize ? `${res.currentSize}KB` : '0KB'
  } catch (e) {
    cacheSize.value = '0KB'
  }
}

const editProfile = () => {
  uni.showToast({ title: '功能开发中', icon: 'none' })
}

const goToFarmManage = () => {
  uni.showToast({ title: '功能开发中', icon: 'none' })
}

const goToNotificationCenter = () => {
  uni.showToast({ title: '功能开发中', icon: 'none' })
}

const goToDataStats = () => {
  uni.showToast({ title: '功能开发中', icon: 'none' })
}

const goToHelp = () => {
  uni.showToast({ title: '功能开发中', icon: 'none' })
}

const goToAbout = () => {
  uni.showToast({ title: '功能开发中', icon: 'none' })
}

const goToFeedback = () => {
  uni.showToast({ title: '功能开发中', icon: 'none' })
}

const clearCache = () => {
  uni.showModal({
    title: '提示',
    content: '确定清除所有缓存？',
    success: (res) => {
      if (res.confirm) {
        uni.clearStorageSync()
        calculateCacheSize()
        uni.showToast({ title: '清除成功', icon: 'success' })
      }
    }
  })
}

const handleLogout = () => {
  uni.showModal({
    title: '提示',
    content: '确定退出登录？',
    success: async (res) => {
      if (res.confirm) {
        await userStore.logout()
      }
    }
  })
}

onMounted(() => {
  calculateCacheSize()
})
</script>

<style scoped>
.container {
  min-height: 100vh;
  background: #f5f5f5;
}

.user-section {
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #4CAF50, #388E3C);
  padding: 60rpx 32rpx 40rpx;
  color: #fff;
}

.user-avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 24rpx;
  overflow: hidden;
}

.avatar-img {
  width: 100%;
  height: 100%;
}

.avatar-placeholder {
  font-size: 60rpx;
}

.user-info {
  flex: 1;
}

.user-name {
  font-size: 36rpx;
  font-weight: bold;
  margin-bottom: 8rpx;
}

.user-phone {
  font-size: 26rpx;
  opacity: 0.8;
}

.edit-btn {
  font-size: 26rpx;
  background: rgba(255, 255, 255, 0.3);
  padding: 8rpx 24rpx;
  border-radius: 20rpx;
}

.menu-section {
  padding: 20rpx;
}

.menu-group {
  background: #fff;
  border-radius: 16rpx;
  margin-bottom: 20rpx;
  overflow: hidden;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 28rpx 24rpx;
  border-bottom: 1rpx solid #f5f5f5;
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-icon {
  font-size: 36rpx;
  margin-right: 16rpx;
}

.menu-text {
  flex: 1;
  font-size: 28rpx;
  color: #333;
}

.menu-value {
  font-size: 26rpx;
  color: #999;
  margin-right: 8rpx;
}

.menu-arrow {
  font-size: 32rpx;
  color: #ccc;
}

.logout-section {
  padding: 40rpx 20rpx;
}

.logout-btn {
  width: 100%;
  height: 88rpx;
  line-height: 88rpx;
  background: #fff;
  color: #f44336;
  font-size: 30rpx;
  border-radius: 16rpx;
  border: none;
}

.logout-btn:active {
  background: #f5f5f5;
}
</style>
