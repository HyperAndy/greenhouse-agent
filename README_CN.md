# 农业大棚自动化控制系统

[English](README.md)

一套商业级农业大棚物联网监控平台，支持实时传感器数据采集、智能控制规则、AI参数推荐和多租户管理。

## 功能特性

- **实时监测** — 温度、湿度、光照、CO2、土壤湿度、pH、EC
- **自动控制** — 基于规则的继电器控制（风机、灌溉、遮阳、补光）
- **AI推荐** — 基于作物类型和生长阶段的参数推荐
- **多租户** — 农场级数据隔离，基于角色的权限控制
- **多端接入** — 微信小程序、Web管理后台、大屏展示
- **边缘计算** — ESP32本地控制，断网可自治

## 系统架构

```
┌─────────────────────────────────────────────────────────────┐
│                        用户层                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  微信小程序    │  │  Web管理后台  │  │  大屏展示     │      │
│  │  (农户使用)   │  │  (管理员)    │  │  (监控中心)   │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
└─────────┼─────────────────┼─────────────────┼───────────────┘
          │                 │                 │
          ▼                 ▼                 ▼
┌─────────────────────────────────────────────────────────────┐
│                     云平台层                                 │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐            │
│  │ NestJS API │  │ EMQX MQTT  │  │ FastAPI AI │            │
│  └────────────┘  └────────────┘  └────────────┘            │
│  ┌────────────────────────────────────────────┐            │
│  │  PostgreSQL + Redis                        │            │
│  └────────────────────────────────────────────┘            │
└─────────────────────────────────────────────────────────────┘
          │ MQTT
          ▼
┌─────────────────────────────────────────────────────────────┐
│                     边缘层                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  ESP32 #1    │  │  ESP32 #2    │  │  ESP32 #N    │      │
│  │  传感器+继电器│  │  传感器+继电器│  │  传感器+继电器│      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

## 技术栈

| 层级 | 技术 |
|------|------|
| 后端 | NestJS, TypeScript, TypeORM |
| AI服务 | Python, FastAPI, SQLAlchemy |
| 数据库 | PostgreSQL, Redis |
| 消息队列 | EMQX (MQTT) |
| 前端 | Vue 3, Element Plus, ECharts |
| 小程序 | uni-app, Vue 3 |
| 硬件 | ESP32, MicroPython |
| 部署 | Docker Compose |

## 项目结构

```
greenhouse/
├── backend/              # NestJS后端服务
│   ├── src/
│   │   ├── modules/      # 业务模块
│   │   │   ├── auth/     # 认证模块
│   │   │   ├── farm/     # 农场管理
│   │   │   ├── device/   # 设备管理
│   │   │   ├── sensor/   # 传感器数据
│   │   │   ├── rule/     # 控制规则
│   │   │   ├── alert/    # 告警系统
│   │   │   └── control/  # 设备控制
│   │   └── common/       # 公共模块
│   └── Dockerfile
├── ai-service/           # Python AI服务
│   ├── app/
│   │   ├── api/          # API路由
│   │   ├── services/     # 业务逻辑
│   │   └── data/         # 作物数据库
│   └── Dockerfile
├── admin/                # Web管理后台
│   └── src/
│       ├── views/        # 页面组件
│       ├── api/          # API调用
│       └── store/        # 状态管理
├── dashboard/            # 大屏展示
│   └── src/
│       ├── components/   # 大屏组件
│       └── views/        # 主视图
├── miniapp/              # 微信小程序
│   └── src/
│       ├── pages/        # 页面
│       └── components/   # 组件
├── mock/                 # Mock数据生成器
├── docker-compose.yml    # Docker编排
└── nginx/                # Nginx配置
```

## 快速开始

### 环境要求

- Docker & Docker Compose
- Node.js 18+（本地开发）
- Python 3.11+（AI服务开发）

### 1. 克隆项目

```bash
git clone https://github.com/your-org/greenhouse.git
cd greenhouse
cp .env.example .env
```

### 2. 启动基础设施

```bash
docker-compose up -d postgres redis emqx
```

### 3. 启动后端服务

```bash
docker-compose up -d backend ai-service
```

### 4. 启动前端（开发模式）

```bash
# 管理后台
cd admin
npm install
npm run dev    # http://localhost:3001

# 大屏展示
cd dashboard
npm install
npm run dev    # http://localhost:3200
```

### 5. 启动Mock数据

```bash
cd mock
npm install
npm start
```

### 6. 访问服务

| 服务 | 地址 | 账号密码 |
|------|------|----------|
| 管理后台 | http://localhost:3001 | 13800138000 / admin123 |
| 大屏展示 | http://localhost:3200 | - |
| API服务 | http://localhost:3000 | - |
| AI服务文档 | http://localhost:8000/docs | - |
| EMQX控制台 | http://localhost:18083 | admin / public |

## API文档

### 认证接口

```bash
# 注册
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"phone":"13800138001","password":"test123","name":"测试用户"}'

# 登录
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"phone":"13800138000","password":"admin123"}'

# 获取用户信息
curl http://localhost:3000/auth/profile \
  -H "Authorization: Bearer <token>"
```

### 农场管理

```bash
# 创建农场
curl -X POST http://localhost:3000/farms \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"name":"示范农场","address":"北京市"}'

# 农场列表
curl http://localhost:3000/farms \
  -H "Authorization: Bearer <token>"
```

### 传感器数据

```bash
# 获取最新数据
curl http://localhost:3000/sensor/gh-001/latest \
  -H "Authorization: Bearer <token>"

# 获取历史数据
curl "http://localhost:3000/sensor/gh-001/history?start=2026-05-01&end=2026-05-03" \
  -H "Authorization: Bearer <token>"
```

### AI推荐

```bash
# 获取作物推荐参数
curl http://localhost:8000/api/recommend/tomato?stage=flowering

# 健康检查
curl http://localhost:8000/health
```

## MQTT协议

### 主题结构

```
greenhouse/{greenhouse_id}/sensor/data     # 传感器数据上报
greenhouse/{greenhouse_id}/control/set     # 控制指令下发
greenhouse/{greenhouse_id}/control/ack     # 控制确认
greenhouse/{greenhouse_id}/status          # 设备状态
```

### 数据格式

```json
{
  "temp": 28.5,
  "humi": 65.2,
  "light": 45000,
  "co2": 800,
  "soil_moisture": [45.0, 42.0],
  "ph": 6.8,
  "ec": 1.2,
  "relay_state": [true, false, true, false, false, false, false, false]
}
```

## 数据库设计

### 核心表

- `users` — 用户账号，基于角色的访问控制
- `farms` — 农场组织
- `greenhouses` — 大棚单元
- `devices` — IoT设备（ESP32控制器）
- `sensor_data` — 时序传感器数据
- `control_rules` — 自动化规则
- `alerts` — 系统告警
- `control_logs` — 设备控制记录

### 默认测试数据

首次运行后，系统包含以下测试数据：

- **农场：** 示范农场
- **大棚：** 番茄棚、黄瓜棚、辣椒棚
- **用户：** admin / admin123（手机号：13800138000）

## 开发指南

### 后端开发

```bash
cd backend
npm install
npm run start:dev    # 热重载，端口3000
```

### AI服务开发

```bash
cd ai-service
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### 数据库迁移

```bash
# 执行迁移
npm run migration:run

# 生成新迁移
npm run migration:generate -- src/migrations/NewMigration
```

## 部署

### 生产构建

```bash
# 构建所有服务
docker-compose build

# 生产模式启动
docker-compose up -d
```

### 环境变量

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `DB_HOST` | localhost | PostgreSQL主机 |
| `DB_PORT` | 5432 | PostgreSQL端口 |
| `DB_USERNAME` | postgres | 数据库用户 |
| `DB_PASSWORD` | greenhouse123 | 数据库密码 |
| `DB_NAME` | greenhouse | 数据库名 |
| `REDIS_HOST` | localhost | Redis主机 |
| `MQTT_URL` | mqtt://localhost:1883 | MQTT地址 |
| `JWT_SECRET` | greenhouse-secret-key-2026 | JWT密钥 |

## 开发路线

- [x] 第一阶段：核心平台 + Mock数据
- [ ] 第二阶段：Web后台 + AI服务
- [ ] 第三阶段：ESP32固件开发
- [ ] 第四阶段：微信小程序对接
- [ ] 第五阶段：生产部署 + CI/CD
- [ ] 第六阶段：高级AI功能（产量预测、病虫害检测）

## 参与贡献

1. Fork 本仓库
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m '添加新功能'`)
4. 推送分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

## 开源协议

本项目基于 MIT 协议开源 - 查看 [LICENSE](LICENSE) 文件了解详情

## 技术支持

- 文档：`/docs`
- 问题反馈：GitHub Issues
- 邮箱：support@example.com
