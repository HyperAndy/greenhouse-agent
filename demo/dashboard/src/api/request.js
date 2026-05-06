const wait = value =>
  new Promise(resolve => setTimeout(() => resolve(structuredClone(value)), 160))

const realtime = [
  { id: 'gh-1', name: '番茄 1 号棚', temp: 28.5, humidity: 65, light: 45000, co2: 420 },
  { id: 'gh-2', name: '黄瓜 2 号棚', temp: 26.8, humidity: 72, light: 38000, co2: 380 },
  { id: 'gh-3', name: '辣椒 1 号棚', temp: 31.2, humidity: 58, light: 52000, co2: 450 }
]

const request = {
  get(url) {
    if (url === '/sensor/realtime') return wait(realtime)
    if (url === '/sensor/history') {
      return wait(Array.from({ length: 24 }, (_, index) => ({
        time: `${String(index).padStart(2, '0')}:00`,
        temp: Number((22 + Math.sin(index / 3) * 5).toFixed(1)),
        humi: Math.round(62 + Math.cos(index / 4) * 12)
      })))
    }
    if (url === '/alert/list') {
      return wait([
        { time: '15:28', level: 'danger', levelText: '严重', message: '辣椒 1 号棚温度过高 35.2℃' },
        { time: '15:25', level: 'warning', levelText: '警告', message: '黄瓜 2 号棚传感器离线' },
        { time: '15:20', level: 'info', levelText: '提示', message: '番茄 1 号棚通风已开启' }
      ])
    }
    if (url === '/alert/stats') return wait({ total: 18, active: 2, critical: 1 })
    if (url === '/device/list') return wait([
      { name: '风机', active: 3, total: 5 },
      { name: '灌溉', active: 2, total: 4 },
      { name: '遮阳帘', active: 1, total: 3 },
      { name: '补光灯', active: 4, total: 6 }
    ])
    if (url === '/device/status') return wait({ online: 10, total: 12, error: 1 })
    return wait({})
  }
}

export default request
