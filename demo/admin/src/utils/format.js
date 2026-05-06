import dayjs from 'dayjs'

export function formatDate(date, fmt = 'YYYY-MM-DD HH:mm:ss') {
  if (!date) return '-'
  return dayjs(date).format(fmt)
}

export function formatTemperature(val) {
  if (val === null || val === undefined) return '-'
  return `${Number(val).toFixed(1)}°C`
}

export function formatHumidity(val) {
  if (val === null || val === undefined) return '-'
  return `${Number(val).toFixed(1)}%`
}

export function formatStatus(status) {
  const map = {
    online: '在线',
    offline: '离线',
    error: '故障'
  }
  return map[status] || status
}

export function formatAlertLevel(level) {
  const map = {
    critical: '严重',
    warning: '警告',
    info: '提示'
  }
  return map[level] || level
}
