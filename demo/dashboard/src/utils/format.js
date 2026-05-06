import dayjs from 'dayjs'

export function formatTime(date, fmt = 'YYYY-MM-DD HH:mm:ss') {
  return dayjs(date).format(fmt)
}

export function formatNumber(num) {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + '万'
  }
  return num.toString()
}

export function formatPercent(value, total) {
  if (total === 0) return '0%'
  return ((value / total) * 100).toFixed(1) + '%'
}
