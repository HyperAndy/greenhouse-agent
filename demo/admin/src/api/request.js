const wait = (value, ms = 180) =>
  new Promise(resolve => setTimeout(() => resolve(structuredClone(value)), ms))

const now = new Date()
const pad = value => String(value).padStart(2, '0')
const time = offset => {
  const d = new Date(now.getTime() - offset * 60 * 1000)
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:00`
}

const sessionUser = {
  id: 'user-admin',
  phone: '13800138000',
  name: '演示管理员',
  role: 'admin',
  avatar: ''
}

let farms = [
  { id: 'farm-1', name: '阳光示范农场', address: '北京市昌平区小汤山', greenhouseCount: 8, contact: '张工', phone: '13800138001' },
  { id: 'farm-2', name: '绿源智慧农场', address: '北京市大兴区庞各庄', greenhouseCount: 12, contact: '李工', phone: '13800138002' },
  { id: 'farm-3', name: '丰收实验基地', address: '河北省廊坊市固安县', greenhouseCount: 6, contact: '王工', phone: '13800138003' }
]

let greenhouses = [
  { id: 'gh-1', farmId: 'farm-1', name: '番茄 1 号棚', area: 480, crop: '番茄', status: 'normal', temp: 28.4, humidity: 66 },
  { id: 'gh-2', farmId: 'farm-1', name: '黄瓜 2 号棚', area: 520, crop: '黄瓜', status: 'normal', temp: 26.7, humidity: 72 },
  { id: 'gh-3', farmId: 'farm-2', name: '辣椒 1 号棚', area: 450, crop: '辣椒', status: 'warning', temp: 31.2, humidity: 58 }
]

let devices = [
  { id: 'dev-1', name: '温湿度传感器-01', mac: 'AA:BB:CC:DD:EE:01', greenhouse: '番茄 1 号棚', status: 'online', lastOnline: time(1), firmware: 'v2.1.0', ip: '192.168.1.101' },
  { id: 'dev-2', name: '光照传感器-02', mac: 'AA:BB:CC:DD:EE:02', greenhouse: '黄瓜 2 号棚', status: 'online', lastOnline: time(3), firmware: 'v2.1.0', ip: '192.168.1.102' },
  { id: 'dev-3', name: '继电器控制器-01', mac: 'AA:BB:CC:DD:EE:03', greenhouse: '番茄 1 号棚', status: 'error', lastOnline: time(42), firmware: 'v1.8.4', ip: '192.168.1.103' },
  { id: 'dev-4', name: 'CO2 传感器-03', mac: 'AA:BB:CC:DD:EE:04', greenhouse: '辣椒 1 号棚', status: 'offline', lastOnline: time(180), firmware: 'v2.0.2', ip: '192.168.1.104' }
]

let alerts = [
  { id: 'alert-1', time: time(5), greenhouse: '辣椒 1 号棚', level: '严重', title: '温度超过上限', status: '未确认', message: '当前温度 35.2℃，建议开启通风和遮阳。' },
  { id: 'alert-2', time: time(18), greenhouse: '番茄 1 号棚', level: '警告', title: '土壤湿度偏低', status: '未确认', message: '土壤湿度低于 40%，建议启动滴灌。' },
  { id: 'alert-3', time: time(64), greenhouse: '黄瓜 2 号棚', level: '提示', title: '补光任务完成', status: '已确认', message: '今日补光计划已完成。' }
]

let users = [
  { id: 'user-admin', name: '演示管理员', phone: '13800138000', role: 'admin', enabled: true, createdAt: '2026-05-01 09:00:00' },
  { id: 'user-farmer', name: '农户一号', phone: '13800138001', role: 'farmer', enabled: true, createdAt: '2026-05-02 10:30:00' }
]

let rules = [
  { id: 'rule-1', name: '高温自动通风', greenhouse: '番茄 1 号棚', condition: '温度 > 32℃ 持续 5 分钟', action: '开启风机', enabled: true },
  { id: 'rule-2', name: '低湿自动灌溉', greenhouse: '黄瓜 2 号棚', condition: '土壤湿度 < 45%', action: '开启滴灌 10 分钟', enabled: true },
  { id: 'rule-3', name: '夜间补光', greenhouse: '辣椒 1 号棚', condition: '光照 < 12000Lux', action: '开启补光灯', enabled: false }
]

function list(data) {
  return { list: data, items: data, records: data, total: data.length }
}

function sensorHistory() {
  const rows = Array.from({ length: 24 }, (_, index) => ({
    time: `${pad(index)}:00`,
    temp: Number((22 + Math.sin(index / 3) * 5).toFixed(1)),
    humi: Math.round(62 + Math.cos(index / 4) * 12),
    light: Math.round(28000 + Math.sin(index / 5) * 16000),
    co2: Math.round(420 + Math.cos(index / 4) * 80),
    ph: Number((6.5 + Math.sin(index / 6) * 0.3).toFixed(1)),
    ec: Number((1.2 + Math.cos(index / 7) * 0.2).toFixed(2))
  }))
  return list(rows)
}

function ok(method, url, payload) {
  if (url === '/auth/login') return wait({ access_token: 'demo-access-token', user: sessionUser })
  if (url === '/auth/profile') return wait(sessionUser)
  if (url === '/auth/logout' || url === '/auth/refresh') return wait({ success: true })

  if (url === '/farms') return wait(method === 'get' ? list(farms) : { success: true })
  if (url.includes('/greenhouses')) return wait(method === 'get' ? list(greenhouses) : { success: true })
  if (url === '/devices') return wait(method === 'get' ? list(devices) : { success: true })
  if (url.startsWith('/devices/')) return wait(method === 'get' ? devices.find(d => url.includes(d.id)) || devices[0] : { success: true })
  if (url === '/alerts') return wait(method === 'get' ? list(alerts) : { success: true })
  if (url.includes('/ack')) {
    alerts = alerts.map(alert => ({ ...alert, status: '已确认' }))
    return wait({ success: true })
  }
  if (url === '/rules') return wait(method === 'get' ? list(rules) : { success: true })
  if (url.includes('/toggle')) return wait({ success: true, enabled: payload?.enabled ?? true })
  if (url === '/users') return wait(method === 'get' ? list(users) : { success: true })
  if (url.startsWith('/sensors')) return wait(url.includes('latest') ? { temp: 28.5, humi: 66, light: 45000, co2: 430, ph: 6.7, ec: 1.2 } : sensorHistory())

  return wait({ success: true })
}

const request = {
  get(url, config = {}) {
    return ok('get', url, config.params)
  },
  post(url, data) {
    return ok('post', url, data)
  },
  put(url, data) {
    return ok('put', url, data)
  },
  delete(url) {
    return ok('delete', url)
  }
}

export default request
