const STORAGE_PREFIX = 'greenhouse_'

export const setStorage = (key, value) => {
  try {
    uni.setStorageSync(`${STORAGE_PREFIX}${key}`, JSON.stringify(value))
  } catch (e) {
    console.error('存储失败', e)
  }
}

export const getStorage = (key, defaultValue = null) => {
  try {
    const value = uni.getStorageSync(`${STORAGE_PREFIX}${key}`)
    return value ? JSON.parse(value) : defaultValue
  } catch (e) {
    console.error('读取存储失败', e)
    return defaultValue
  }
}

export const removeStorage = (key) => {
  try {
    uni.removeStorageSync(`${STORAGE_PREFIX}${key}`)
  } catch (e) {
    console.error('删除存储失败', e)
  }
}

export const clearStorage = () => {
  try {
    uni.clearStorageSync()
  } catch (e) {
    console.error('清空存储失败', e)
  }
}
