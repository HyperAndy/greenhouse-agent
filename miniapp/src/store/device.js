import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getDeviceList, controlDevice, batchControl } from '../api/device'

export const useDeviceStore = defineStore('device', () => {
  const devices = ref([])
  const loading = ref(false)
  
  const onlineDevices = computed(() => devices.value.filter(d => d.status === 'online'))
  const offlineDevices = computed(() => devices.value.filter(d => d.status === 'offline'))
  
  const fetchDevices = async (greenhouseId) => {
    loading.value = true
    try {
      const res = await getDeviceList(greenhouseId)
      devices.value = res.data || []
      return devices.value
    } catch (error) {
      console.error('获取设备列表失败', error)
      throw error
    } finally {
      loading.value = false
    }
  }
  
  const toggleDevice = async (deviceId, action) => {
    try {
      const res = await controlDevice(deviceId, action)
      const index = devices.value.findIndex(d => d.id === deviceId)
      if (index !== -1) {
        devices.value[index] = { ...devices.value[index], ...res.data }
      }
      return res
    } catch (error) {
      console.error('控制设备失败', error)
      throw error
    }
  }
  
  const batchControlDevices = async (data) => {
    try {
      const res = await batchControl(data)
      await fetchDevices(data.greenhouseId)
      return res
    } catch (error) {
      console.error('批量控制失败', error)
      throw error
    }
  }
  
  return {
    devices,
    loading,
    onlineDevices,
    offlineDevices,
    fetchDevices,
    toggleDevice,
    batchControlDevices
  }
})
