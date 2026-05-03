# ESP32 Mock Data Generator

模拟ESP32设备发送传感器数据的Mock数据生成器，用于开发和测试智慧农业监控系统。

## 功能特性

- 模拟3个温室大棚的传感器设备
- 实时生成符合真实场景的传感器数据
- 模拟昼夜变化对传感器数据的影响
- 随机触发告警条件
- 模拟设备上下线状态
- 通过MQTT协议发布数据

## 文件说明

- `index.js` - 主程序，生成传感器数据
- `device-status.js` - 设备状态模拟器
- `package.json` - 项目配置和依赖

## 安装依赖

```bash
npm install
```

## 使用方法

### 1. 启动MQTT Broker

确保本地MQTT Broker正在运行（默认端口1883）：

```bash
# 使用Mosquitto
mosquitto

# 或使用Docker
docker run -d -p 1883:1883 eclipse-mosquitto
```

### 2. 启动数据生成器

```bash
# 启动传感器数据生成器
npm start

# 或者分别启动
node index.js          # 传感器数据（每5秒）
node device-status.js  # 设备状态（每60秒）
```

### 3. 查看输出

程序将在控制台输出类似以下内容：

```
[2024-05-03T10:30:00.000Z] Greenhouse-1:
  Temp: 28.5°C | Humidity: 65.2% | Light: 45000 lux
  CO2: 800ppm | Soil: 45%, 42%
  pH: 6.8 | EC: 1.2 | Relays: 2/8 ON
```

## MQTT主题结构

### 传感器数据
```
farm/1/greenhouse/{1,2,3}/sensor/data
```

数据格式：
```json
{
  "ts": 1714723200000,
  "temp": 28.5,
  "humi": 65.2,
  "light": 45000,
  "co2": 800,
  "soil_moisture": [45.0, 42.0],
  "ph": 6.8,
  "ec": 1.2,
  "relay_state": [true, false, true, false, false, false, false, false],
  "alerts": ["HIGH_TEMP"],
  "device_id": "uuid-string",
  "online": true
}
```

### 设备状态
```
farm/1/greenhouse/{1,2,3}/status
```

数据格式：
```json
{
  "ts": 1714723200000,
  "device_id": "uuid-string",
  "greenhouse": 1,
  "online": true,
  "last_seen": 1714723200000,
  "signal_strength": -65,
  "battery_level": 85.5,
  "firmware_version": "1.2.3",
  "uptime": 3600,
  "ip_address": "192.168.1.101",
  "mac_address": "AA:BB:CC:DD:EE:01"
}
```

## 数据模拟逻辑

### 传感器数据范围
- **温度**: 15-40°C，昼夜正弦波动
- **湿度**: 30-90%，与温度反相波动
- **光照**: 白天50000lux，夜间5000lux
- **CO2**: 400-1500ppm，随机波动
- **土壤湿度**: 20-80%，缓慢下降+灌溉回升
- **pH**: 6.0-7.5，缓慢波动
- **EC**: 0.5-2.5 mS/cm，缓慢波动

### 告警条件
- 温度 > 35°C 或 < 15°C
- 湿度 < 40% 或 > 85%
- CO2 > 1200ppm
- 土壤湿度 < 30%
- pH超出6.0-7.5范围
- EC超出0.8-2.0范围

### 设备状态
- 每30秒随机更新设备在线状态（10%概率变化）
- 模拟信号强度波动
- 模拟电池电量消耗

## 自定义配置

在`index.js`中可以修改以下参数：

```javascript
// 数据发送间隔（毫秒）
setInterval(() => { ... }, 5000); // 5秒

// 设备数量
const devices = [ ... ]; // 添加更多设备

// 传感器范围
const temp = clamp(tempBase + tempNoise, 15, 40); // 修改范围
```

## 依赖项

- `mqtt` - MQTT客户端库
- `uuid` - 生成唯一设备ID

## 许可证

MIT