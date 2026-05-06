<template>
  <view class="container">
    <view class="title">API测试</view>
    
    <view class="section">
      <view class="section-title">登录测试</view>
      <view class="status">状态: {{ loginStatus }}</view>
      <button @tap="testLogin" size="mini">测试登录</button>
    </view>

    <view class="section">
      <view class="section-title">农场列表</view>
      <view class="status">状态: {{ farmStatus }}</view>
      <view class="data">{{ farmData }}</view>
      <button @tap="testFarms" size="mini">测试农场</button>
    </view>

    <view class="section">
      <view class="section-title">大棚列表</view>
      <view class="status">状态: {{ ghStatus }}</view>
      <view class="data">{{ ghData }}</view>
      <button @tap="testGreenhouses" size="mini">测试大棚</button>
    </view>

    <view class="section">
      <view class="section-title">传感器数据</view>
      <view class="status">状态: {{ sensorStatus }}</view>
      <view class="data">{{ sensorData }}</view>
      <button @tap="testSensor" size="mini">测试传感器</button>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

const loginStatus = ref('未测试')
const farmStatus = ref('未测试')
const ghStatus = ref('未测试')
const sensorStatus = ref('未测试')

const farmData = ref('')
const ghData = ref('')
const sensorData = ref('')

let token = ''

const testLogin = async () => {
  loginStatus.value = '请求中...'
  try {
    const res = await new Promise((resolve, reject) => {
      uni.request({
        url: 'http://localhost:3000/auth/login',
        method: 'POST',
        data: { phone: '13800138000', password: 'test123456' },
        header: { 'Content-Type': 'application/json' },
        success: resolve,
        fail: reject
      })
    })
    if (res.statusCode === 201) {
      token = res.data.access_token
      loginStatus.value = '成功'
      uni.setStorageSync('token', token)
    } else {
      loginStatus.value = `失败: ${res.statusCode}`
    }
  } catch (error) {
    loginStatus.value = `错误: ${error.message}`
  }
}

const testFarms = async () => {
  farmStatus.value = '请求中...'
  try {
    const res = await new Promise((resolve, reject) => {
      uni.request({
        url: 'http://localhost:3000/farms',
        method: 'GET',
        header: { 'Authorization': `Bearer ${token}` },
        success: resolve,
        fail: reject
      })
    })
    if (res.statusCode === 200) {
      farmStatus.value = `成功 (${res.data.length}个)`
      farmData.value = JSON.stringify(res.data, null, 2)
    } else {
      farmStatus.value = `失败: ${res.statusCode}`
      farmData.value = JSON.stringify(res.data, null, 2)
    }
  } catch (error) {
    farmStatus.value = `错误: ${error.message}`
  }
}

const testGreenhouses = async () => {
  ghStatus.value = '请求中...'
  try {
    const farmId = '9e68ef3d-b62e-41e1-9494-f86a8c326c38'
    const res = await new Promise((resolve, reject) => {
      uni.request({
        url: `http://localhost:3000/farms/${farmId}/greenhouses`,
        method: 'GET',
        header: { 'Authorization': `Bearer ${token}` },
        success: resolve,
        fail: reject
      })
    })
    if (res.statusCode === 200) {
      ghStatus.value = `成功 (${res.data.length}个)`
      ghData.value = JSON.stringify(res.data, null, 2)
    } else {
      ghStatus.value = `失败: ${res.statusCode}`
      ghData.value = JSON.stringify(res.data, null, 2)
    }
  } catch (error) {
    ghStatus.value = `错误: ${error.message}`
  }
}

const testSensor = async () => {
  sensorStatus.value = '请求中...'
  try {
    const ghId = 'b0400fbb-da7f-4e2e-b436-39318b085eba'
    const res = await new Promise((resolve, reject) => {
      uni.request({
        url: `http://localhost:3000/sensor/${ghId}/latest`,
        method: 'GET',
        header: { 'Authorization': `Bearer ${token}` },
        success: resolve,
        fail: reject
      })
    })
    if (res.statusCode === 200) {
      sensorStatus.value = `成功 (${res.data.length}条)`
      sensorData.value = JSON.stringify(res.data[0] || res.data, null, 2)
    } else {
      sensorStatus.value = `失败: ${res.statusCode}`
      sensorData.value = JSON.stringify(res.data, null, 2)
    }
  } catch (error) {
    sensorStatus.value = `错误: ${error.message}`
  }
}
</script>

<style scoped>
.container {
  padding: 20rpx;
}
.title {
  font-size: 40rpx;
  font-weight: bold;
  margin-bottom: 30rpx;
  text-align: center;
}
.section {
  background: #fff;
  border-radius: 16rpx;
  padding: 20rpx;
  margin-bottom: 20rpx;
}
.section-title {
  font-size: 28rpx;
  font-weight: bold;
  margin-bottom: 10rpx;
}
.status {
  font-size: 24rpx;
  color: #666;
  margin-bottom: 10rpx;
}
.data {
  font-size: 20rpx;
  background: #f5f5f5;
  padding: 10rpx;
  border-radius: 8rpx;
  white-space: pre-wrap;
  word-break: break-all;
  max-height: 300rpx;
  overflow-y: auto;
}
button {
  margin-top: 10rpx;
  background: #4CAF50;
  color: #fff;
}
</style>
