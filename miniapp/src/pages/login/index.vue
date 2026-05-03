<template>
  <view class="login-page">
    <!-- Logo区域 -->
    <view class="logo-section">
      <view class="logo-icon">🌱</view>
      <view class="logo-title">智慧大棚</view>
      <view class="logo-subtitle">农业大棚自动化控制系统</view>
    </view>

    <!-- 登录表单 -->
    <view class="form-section">
      <view class="form-item">
        <view class="form-icon">📱</view>
        <input
          v-model="phone"
          type="number"
          maxlength="11"
          placeholder="请输入手机号"
          class="form-input"
        />
      </view>

      <view class="form-item">
        <view class="form-icon">🔒</view>
        <input
          v-model="password"
          :password="!showPassword"
          placeholder="请输入密码"
          class="form-input"
        />
        <view class="form-eye" @tap="showPassword = !showPassword">
          {{ showPassword ? '👁️' : '👁️‍🗨️' }}
        </view>
      </view>

      <button
        class="login-btn"
        :disabled="!canSubmit || loading"
        @tap="handleLogin"
      >
        {{ loading ? '登录中...' : '登 录' }}
      </button>

      <view class="form-footer">
        <text class="text-gray" @tap="forgotPassword">忘记密码？</text>
        <text class="text-primary" @tap="goRegister">注册账号</text>
      </view>
    </view>

    <!-- 其他登录方式 -->
    <view class="other-login">
      <view class="divider">
        <view class="divider-line"></view>
        <text class="divider-text">其他登录方式</text>
        <view class="divider-line"></view>
      </view>

      <view class="social-buttons">
        <button class="social-btn" open-type="getPhoneNumber" @tap="wxLogin">
          <text class="social-icon">💬</text>
          <text>微信登录</text>
        </button>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useUserStore } from '../../store/user'

const userStore = useUserStore()

const phone = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)

const canSubmit = computed(() => {
  return phone.value.length === 11 && password.value.length >= 6
})

const handleLogin = async () => {
  if (!canSubmit.value || loading.value) return
  
  loading.value = true
  try {
    await userStore.login({
      phone: phone.value,
      password: password.value
    })
    uni.showToast({ title: '登录成功', icon: 'success' })
    setTimeout(() => {
      uni.switchTab({ url: '/pages/index/index' })
    }, 1000)
  } catch (error) {
    uni.showToast({ title: error.message || '登录失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}

const wxLogin = () => {
  uni.showToast({ title: '微信登录开发中', icon: 'none' })
}

const forgotPassword = () => {
  uni.showToast({ title: '请联系管理员重置密码', icon: 'none' })
}

const goRegister = () => {
  uni.showToast({ title: '注册功能开发中', icon: 'none' })
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #4CAF50 0%, #388E3C 30%, #f5f5f5 30%);
  padding: 0 40rpx;
}

.logo-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 120rpx;
  padding-bottom: 60rpx;
}

.logo-icon {
  font-size: 100rpx;
  margin-bottom: 20rpx;
}

.logo-title {
  font-size: 48rpx;
  font-weight: bold;
  color: #fff;
  margin-bottom: 12rpx;
}

.logo-subtitle {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.8);
}

.form-section {
  background: #fff;
  border-radius: 24rpx;
  padding: 40rpx;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.1);
}

.form-item {
  display: flex;
  align-items: center;
  border-bottom: 1rpx solid #eee;
  padding: 24rpx 0;
  margin-bottom: 20rpx;
}

.form-icon {
  font-size: 36rpx;
  margin-right: 16rpx;
}

.form-input {
  flex: 1;
  font-size: 30rpx;
  height: 48rpx;
}

.form-eye {
  font-size: 32rpx;
  padding: 8rpx;
}

.login-btn {
  width: 100%;
  height: 96rpx;
  line-height: 96rpx;
  background: #4CAF50;
  color: #fff;
  font-size: 32rpx;
  font-weight: bold;
  border-radius: 48rpx;
  margin-top: 40rpx;
  border: none;
}

.login-btn[disabled] {
  opacity: 0.5;
}

.login-btn:active {
  background: #388E3C;
}

.form-footer {
  display: flex;
  justify-content: space-between;
  margin-top: 30rpx;
  font-size: 26rpx;
}

.other-login {
  margin-top: 80rpx;
}

.divider {
  display: flex;
  align-items: center;
  margin-bottom: 40rpx;
}

.divider-line {
  flex: 1;
  height: 1rpx;
  background: #ddd;
}

.divider-text {
  padding: 0 20rpx;
  font-size: 24rpx;
  color: #999;
}

.social-buttons {
  display: flex;
  justify-content: center;
}

.social-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: none;
  border: none;
  font-size: 24rpx;
  color: #666;
  padding: 20rpx;
}

.social-icon {
  font-size: 60rpx;
  margin-bottom: 12rpx;
}
</style>
