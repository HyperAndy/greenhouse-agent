export const formatTemperature = (value) => {
  if (value === null || value === undefined) return '--'
  return `${Number(value).toFixed(1)}°C`
}

export const formatHumidity = (value) => {
  if (value === null || value === undefined) return '--'
  return `${Number(value).toFixed(1)}%`
}

export const formatLight = (value) => {
  if (value === null || value === undefined) return '--'
  if (value >= 10000) {
    return `${(value / 10000).toFixed(1)}万Lux`
  }
  return `${value}Lux`
}

export const formatCO2 = (value) => {
  if (value === null || value === undefined) return '--'
  return `${value}ppm`
}

export const formatSoilMoisture = (value) => {
  if (value === null || value === undefined) return '--'
  return `${Number(value).toFixed(1)}%`
}

export const formatPH = (value) => {
  if (value === null || value === undefined) return '--'
  return Number(value).toFixed(2)
}

export const formatEC = (value) => {
  if (value === null || value === undefined) return '--'
  return `${Number(value).toFixed(2)}mS/cm`
}

export const formatTime = (timestamp, format = 'YYYY-MM-DD HH:mm') => {
  if (!timestamp) return '--'
  const date = new Date(timestamp)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  
  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds)
}

export const formatRelativeTime = (timestamp) => {
  if (!timestamp) return '--'
  const now = Date.now()
  const diff = now - new Date(timestamp).getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  
  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  if (days < 30) return `${days}天前`
  return formatTime(timestamp)
}

export const formatAlertLevel = (level) => {
  const levelMap = {
    info: { text: '提示', color: '#2196f3' },
    warning: { text: '警告', color: '#ff9800' },
    critical: { text: '严重', color: '#f44336' }
  }
  return levelMap[level] || { text: '未知', color: '#999' }
}
