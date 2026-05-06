<template>
  <view class="container">
    <!-- 大棚基本信息 -->
    <view class="greenhouse-info">
      <view class="info-header">
        <view class="info-name">{{ greenhouse.name }}</view>
        <view class="info-crop">{{ greenhouse.cropType }}</view>
      </view>
      <view class="info-stage">
        <text class="text-gray">生长阶段：</text>
        <text>{{ greenhouse.growthStage || '未知' }}</text>
      </view>
    </view>

    <!-- 传感器数据区 -->
    <view class="section">
      <view class="section-title">📊 实时数据</view>
      <view class="sensor-grid">
        <sensor-card
          icon="🌡️"
          label="空气温度"
          :value="sensorData.temp"
          :formatter="formatTemp"
          :warningRange="[15, 35]"
        />
        <sensor-card
          icon="💧"
          label="空气湿度"
          :value="sensorData.humi"
          :formatter="formatHum"
          :warningRange="[40, 80]"
        />
        <sensor-card
          icon="☀️"
          label="光照强度"
          :value="sensorData.light"
          :formatter="formatLux"
        />
        <sensor-card
          icon="🫧"
          label="CO2浓度"
          :value="sensorData.co2"
          :formatter="formatCO2Val"
          :warningRange="[300, 1500]"
        />
        <sensor-card
          icon="🌱"
          label="土壤湿度"
          :value="sensorData.soil_moisture?.[0]"
          :formatter="formatSoil"
          :warningRange="[30, 70]"
        />
        <sensor-card
          icon="⚗️"
          label="土壤pH"
          :value="sensorData.ph"
          :formatter="formatPHVal"
          :warningRange="[5.5, 7.5]"
        />
        <sensor-card
          icon="🔬"
          label="土壤EC"
          :value="sensorData.ec"
          :formatter="formatECVal"
        />
      </view>
    </view>

    <!-- 设备列表 -->
    <view class="section">
      <view class="section-title">⚙️ 设备状态</view>
      <view v-if="devices.length === 0" class="empty-text">暂无设备</view>
      <device-status
        v-for="device in devices"
        :key="device.id"
        :device="device"
        @toggle="handleDeviceToggle"
      />
    </view>

    <!-- 底部操作栏 -->
    <view class="bottom-bar">
      <view class="bottom-bar__item" @tap="goToControl">
        <text class="bar-icon">🎛️</text>
        <text>设备控制</text>
      </view>
      <view class="bottom-bar__item" @tap="goToAlert">
        <text class="bar-icon">🔔</text>
        <text>查看告警</text>
      </view>
      <view class="bottom-bar__item" @tap="goToHistory">
        <text class="bar-icon">📈</text>
        <text>历史数据</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getGreenhouseDetail } from '../../api/farm'
import { getSensorData } from '../../api/sensor'
import { getDeviceList, controlDevice } from '../../api/device'
import SensorCard from '../../components/sensor-card.vue'
import DeviceStatus from '../../components/device-status.vue'
import {
  formatTemperature,
  formatHumidity,
  formatLight,
  formatCO2,
  formatSoilMoisture,
  formatPH,
  formatEC
} from '../../utils/format'

const greenhouseId = ref('')
const greenhouse = ref({})
const sensorData = ref({})
const devices = ref([])

const formatTemp = (v) => formatTemperature(v)
const formatHum = (v) => formatHumidity(v)
const formatLux = (v) => formatLight(v)
const formatCO2Val = (v) => formatCO2(v)
const formatSoil = (v) => formatSoilMoisture(v)
const formatPHVal = (v) => formatPH(v)
const formatECVal = (v) => formatEC(v)

const loadData = async () => {
  try {
    const [greenhouseRes, sensorRes, deviceRes] = await Promise.all([
      getGreenhouseDetail(greenhouseId.value),
      getSensorData(greenhouseId.value),
      getDeviceList(greenhouseId.value)
    ])
    greenhouse.value = greenhouseRes || {}
    sensorData.value = Array.isArray(sensorRes) ? sensorRes[0] || {} : sensorRes || {}
    devices.value = deviceRes || []
  } catch (error) {
    console.error('加载数据失败', error)
    uni.showToast({ title: '加载失败', icon: 'none' })
  }
}

const handleDeviceToggle = async ({ deviceId, channel, state }) => {
  try {
    await controlDevice({ deviceId, channel, state })
    uni.showToast({ title: state ? '已开启' : '已关闭', icon: 'success' })
    loadData()
  } catch (error) {
    uni.showToast({ title: '控制失败', icon: 'none' })
  }
}

const goToControl = () => {
  uni.navigateTo({ url: `/pages/control/index?id=${greenhouseId.value}` })
}

const goToAlert = () => {
  uni.switchTab({ url: `/pages/alert/list` })
}

const goToHistory = () => {
  uni.showToast({ title: '功能开发中', icon: 'none' })
}

onMounted(() => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  greenhouseId.value = currentPage.options?.id || ''
  if (greenhouseId.value) {
    loadData()
  }
})
</script>

<style scoped>
.container {
  padding: 20rpx;
  padding-bottom: 120rpx;
  background: #f5f5f5;
  min-height: 100vh;
}

.greenhouse-info {
  background: linear-gradient(135deg, #4CAF50, #388E3C);
  border-radius: 20rpx;
  padding: 32rpx;
  margin-bottom: 24rpx;
  color: #fff;
}

.info-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
}

.info-name {
  font-size: 36rpx;
  font-weight: bold;
}

.info-crop {
  font-size: 24rpx;
  background: rgba(255, 255, 255, 0.3);
  padding: 4rpx 16rpx;
  border-radius: 20rpx;
}

.info-stage {
  font-size: 26rpx;
  opacity: 0.9;
}

.section {
  margin-bottom: 24rpx;
}

.section-title {
  font-size: 30rpx;
  font-weight: bold;
  margin-bottom: 16rpx;
  padding-left: 8rpx;
}

.sensor-grid {
  display: flex;
  flex-direction: column;
}

.empty-text {
  text-align: center;
  color: #999;
  padding: 40rpx;
}

.bottom-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: space-around;
  background: #fff;
  padding: 20rpx 0;
  padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
  box-shadow: 0 -2rpx 12rpx rgba(0, 0, 0, 0.05);
}

.bottom-bar__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 24rpx;
  color: #666;
}

.bar-icon {
  font-size: 40rpx;
  margin-bottom: 8rpx;
}
</style>
