<template>
  <view class="container">
    <!-- 大棚信息 -->
    <view class="greenhouse-header">
      <text class="header-name">{{ greenhouseName }}</text>
      <text class="header-sub">设备控制面板</text>
    </view>

    <!-- 批量控制 -->
    <view class="batch-control">
      <view class="batch-title">批量操作</view>
      <view class="batch-buttons">
        <button class="batch-btn batch-btn--on" @tap="batchAction('on')" :disabled="controlling">
          全部开启
        </button>
        <button class="batch-btn batch-btn--off" @tap="batchAction('off')" :disabled="controlling">
          全部关闭
        </button>
      </view>
    </view>

    <!-- 设备列表 -->
    <view class="device-section">
      <view class="section-title">设备列表</view>
      <view v-if="loading" class="loading-box">加载中...</view>
      <view v-else-if="devices.length === 0" class="empty-box">
        <text>暂无设备</text>
      </view>
      <view v-else class="device-list">
        <view
          v-for="device in devices"
          :key="device.id"
          class="device-card"
          :class="{ 'device-card--active': device.state === 'on' || device.state === 1 }"
        >
          <view class="device-card__header">
            <view class="device-card__icon">{{ getDeviceIcon(device.type) }}</view>
            <view class="device-card__info">
              <view class="device-card__name">{{ device.name }}</view>
              <view class="device-card__type">{{ getDeviceTypeName(device.type) }}</view>
            </view>
            <view class="device-card__status" :class="{ 'status--online': device.status === 'online' }">
              {{ device.status === 'online' ? '在线' : '离线' }}
            </view>
          </view>

          <view class="device-card__control">
            <view class="control-label">
              当前状态：
              <text :class="device.state === 'on' || device.state === 1 ? 'text-primary' : 'text-gray'">
                {{ device.state === 'on' || device.state === 1 ? '运行中' : '已停止' }}
              </text>
            </view>
            <view class="control-buttons">
              <button
                class="ctrl-btn ctrl-btn--on"
                :disabled="device.status !== 'online' || controlling"
                @tap="controlSingle(device.id, 'on')"
              >
                开启
              </button>
              <button
                class="ctrl-btn ctrl-btn--off"
                :disabled="device.status !== 'online' || controlling"
                @tap="controlSingle(device.id, 'off')"
              >
                关闭
              </button>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 控制确认弹窗 -->
    <view v-if="showConfirm" class="modal-mask" @tap="showConfirm = false">
      <view class="modal-content" @tap.stop>
        <view class="modal-title">确认操作</view>
        <view class="modal-desc">{{ confirmText }}</view>
        <view class="modal-buttons">
          <button class="modal-btn modal-btn--cancel" @tap="showConfirm = false">取消</button>
          <button class="modal-btn modal-btn--confirm" @tap="confirmAction">确认</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getDeviceList, controlDevice, batchControl } from '../../api/device'
import { getFarmList, getGreenhouseList } from '../../api/farm'

const greenhouseId = ref('')
const greenhouseName = ref('设备控制')
const devices = ref([])
const loading = ref(false)
const controlling = ref(false)
const showConfirm = ref(false)
const confirmText = ref('')
const pendingAction = ref(null)

const deviceIcons = {
  fan: '🌀',
  curtain: '🪟',
  irrigation: '💧',
  light: '💡',
  heater: '🔥',
  cooler: '❄️',
  humidifier: '💨'
}

const deviceTypeNames = {
  fan: '风机',
  curtain: '卷帘',
  irrigation: '灌溉系统',
  light: '补光灯',
  heater: '加热器',
  cooler: '制冷器',
  humidifier: '加湿器'
}

const getDeviceIcon = (type) => deviceIcons[type] || '⚙️'
const getDeviceTypeName = (type) => deviceTypeNames[type] || '设备'

const loadData = async () => {
  loading.value = true
  try {
    const farmRes = await getFarmList()
    const farms = farmRes || []
    if (farms.length > 0) {
      const farmId = farms[0].id
      const ghRes = await getGreenhouseList(farmId)
      const greenhouses = ghRes || []
      if (greenhouses.length > 0) {
        greenhouseId.value = greenhouses[0].id
        greenhouseName.value = greenhouses[0].name || '设备控制'
        const deviceRes = await getDeviceList(greenhouses[0].id)
        devices.value = deviceRes || []
      }
    }
  } catch (error) {
    console.error('加载数据失败', error)
    uni.showToast({ title: '加载失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}

const controlSingle = (deviceId, action) => {
  const device = devices.value.find(d => d.id === deviceId)
  confirmText.value = `确认${action === 'on' ? '开启' : '关闭'}${device?.name || '设备'}？`
  pendingAction.value = { type: 'single', deviceId, action }
  showConfirm.value = true
}

const batchAction = (action) => {
  confirmText.value = `确认${action === 'on' ? '开启' : '关闭'}所有设备？`
  pendingAction.value = { type: 'batch', action }
  showConfirm.value = true
}

const confirmAction = async () => {
  if (!pendingAction.value) return
  showConfirm.value = false
  controlling.value = true

  try {
    if (pendingAction.value.type === 'single') {
      await controlDevice({
        deviceId: pendingAction.value.deviceId,
        state: pendingAction.value.action === 'on'
      })
      uni.showToast({ title: '操作成功', icon: 'success' })
    } else {
      await batchControl({
        greenhouseId: greenhouseId.value,
        state: pendingAction.value.action === 'on'
      })
      uni.showToast({ title: '批量操作成功', icon: 'success' })
    }
    loadData()
  } catch (error) {
    uni.showToast({ title: '操作失败', icon: 'none' })
  } finally {
    controlling.value = false
    pendingAction.value = null
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.container {
  padding: 20rpx;
  background: #f5f5f5;
  min-height: 100vh;
}

.greenhouse-header {
  background: linear-gradient(135deg, #4CAF50, #388E3C);
  border-radius: 20rpx;
  padding: 32rpx;
  margin-bottom: 24rpx;
  color: #fff;
}

.header-name {
  font-size: 36rpx;
  font-weight: bold;
  display: block;
}

.header-sub {
  font-size: 26rpx;
  opacity: 0.8;
}

.batch-control {
  background: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 24rpx;
}

.batch-title {
  font-size: 28rpx;
  font-weight: bold;
  margin-bottom: 16rpx;
}

.batch-buttons {
  display: flex;
  gap: 20rpx;
}

.batch-btn {
  flex: 1;
  height: 80rpx;
  line-height: 80rpx;
  border-radius: 12rpx;
  font-size: 28rpx;
  border: none;
}

.batch-btn--on {
  background: #4CAF50;
  color: #fff;
}

.batch-btn--off {
  background: #f5f5f5;
  color: #666;
}

.batch-btn[disabled] {
  opacity: 0.5;
}

.section-title {
  font-size: 30rpx;
  font-weight: bold;
  margin-bottom: 16rpx;
}

.loading-box,
.empty-box {
  text-align: center;
  padding: 60rpx;
  color: #999;
}

.device-card {
  background: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 16rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
}

.device-card--active {
  border-left: 8rpx solid #4CAF50;
}

.device-card__header {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
}

.device-card__icon {
  font-size: 48rpx;
  margin-right: 16rpx;
}

.device-card__info {
  flex: 1;
}

.device-card__name {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
}

.device-card__type {
  font-size: 24rpx;
  color: #999;
  margin-top: 4rpx;
}

.device-card__status {
  font-size: 22rpx;
  padding: 4rpx 12rpx;
  border-radius: 20rpx;
  background: #f5f5f5;
  color: #999;
}

.status--online {
  background: #e8f5e9;
  color: #4CAF50;
}

.device-card__control {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 20rpx;
  border-top: 1rpx solid #f5f5f5;
}

.control-label {
  font-size: 26rpx;
  color: #666;
}

.control-buttons {
  display: flex;
  gap: 16rpx;
}

.ctrl-btn {
  min-width: 120rpx;
  height: 64rpx;
  line-height: 64rpx;
  padding: 0 24rpx;
  border-radius: 8rpx;
  font-size: 26rpx;
  border: none;
}

.ctrl-btn--on {
  background: #4CAF50;
  color: #fff;
}

.ctrl-btn--off {
  background: #f5f5f5;
  color: #666;
}

.ctrl-btn[disabled] {
  opacity: 0.5;
}

.modal-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.modal-content {
  background: #fff;
  border-radius: 20rpx;
  padding: 40rpx;
  width: 80%;
  max-width: 600rpx;
}

.modal-title {
  font-size: 32rpx;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20rpx;
}

.modal-desc {
  font-size: 28rpx;
  color: #666;
  text-align: center;
  margin-bottom: 40rpx;
}

.modal-buttons {
  display: flex;
  gap: 20rpx;
}

.modal-btn {
  flex: 1;
  height: 80rpx;
  line-height: 80rpx;
  border-radius: 12rpx;
  font-size: 28rpx;
  border: none;
}

.modal-btn--cancel {
  background: #f5f5f5;
  color: #666;
}

.modal-btn--confirm {
  background: #4CAF50;
  color: #fff;
}
</style>
