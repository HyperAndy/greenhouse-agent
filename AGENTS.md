# AGENTS.md - 项目开发指南

本文档为AI助手和开发者提供项目上下文、技术栈和开发规范。

---

## 项目概述

农业大棚自动化控制系统，支持实时传感器监测、智能控制、AI推荐、多端展示。

**项目类型：** IoT物联网平台
**开发语言：** TypeScript + Python
**部署方式：** Docker Compose

---

## 技术栈

### 后端（backend/）
- **框架：** NestJS 10.x
- **语言：** TypeScript 5.x
- **ORM：** TypeORM 0.3.x
- **数据库：** PostgreSQL 15
- **缓存：** Redis 7
- **消息队列：** EMQX 5.x（MQTT）
- **认证：** JWT + Passport

### AI服务（ai-service/）
- **框架：** FastAPI 0.104.x
- **语言：** Python 3.11
- **ORM：** SQLAlchemy 2.x（异步）
- **数据库：** asyncpg（PostgreSQL异步驱动）

### 管理后台（admin/）
- **框架：** Vue 3 + Vite
- **UI库：** Element Plus
- **图表：** ECharts
- **状态管理：** Pinia
- **HTTP客户端：** Axios

### 大屏展示（dashboard/）
- **框架：** Vue 3 + Vite
- **图表：** ECharts
- **样式：** 深色科技风（#0a1929背景）

### 微信小程序（miniapp/）
- **框架：** uni-app + Vue 3
- **平台：** 微信小程序

### 硬件（firmware/）
- **芯片：** ESP32-S3
- **语言：** MicroPython
- **通信：** WiFi + MQTT

---

## 项目结构

```
mimo-test/
├── backend/                # NestJS后端
│   ├── src/
│   │   ├── common/         # 公共模块
│   │   │   ├── database/   # 数据库连接
│   │   │   ├── mqtt/       # MQTT服务
│   │   │   ├── redis/      # Redis服务
│   │   │   ├── guards/     # 认证守卫
│   │   │   └── filters/    # 异常过滤器
│   │   ├── config/         # 配置
│   │   └── modules/        # 业务模块
│   │       ├── auth/       # 认证模块
│   │       ├── farm/       # 农场管理
│   │       ├── device/     # 设备管理
│   │       ├── sensor/     # 传感器数据
│   │       ├── rule/       # 控制规则
│   │       ├── alert/      # 告警系统
│   │       └── control/    # 设备控制
│   ├── migrations/         # 数据库迁移
│   └── Dockerfile
├── ai-service/             # Python AI服务
│   ├── app/
│   │   ├── api/            # API路由
│   │   ├── services/       # 业务逻辑
│   │   ├── models/         # 数据模型
│   │   └── data/           # 作物数据库
│   └── Dockerfile
├── admin/                  # Web管理后台
│   └── src/
│       ├── api/            # API调用
│       ├── views/          # 页面
│       ├── store/          # 状态管理
│       ├── router/         # 路由
│       └── layout/         # 布局
├── dashboard/              # 大屏展示
│   └── src/
│       ├── api/            # API调用
│       ├── views/          # 主视图
│       └── components/     # 组件
├── miniapp/                # 微信小程序
│   └── src/
│       ├── api/            # API调用
│       ├── pages/          # 页面
│       └── components/     # 组件
├── mock/                   # Mock数据生成器
├── docs/                   # 文档
├── nginx/                  # Nginx配置
├── docker-compose.yml      # Docker编排
├── .env.example            # 环境变量示例
└── .gitignore
```

---

## 核心模块说明

### 认证模块（auth/）
- JWT Token认证
- 手机号+密码登录
- 角色：admin / farmer / operator / viewer
- Token有效期：7天

### 农场模块（farm/）
- 农场CRUD
- 大棚CRUD
- 一对多关系：农场 → 大棚

### 设备模块（device/）
- 设备注册（MAC地址唯一标识）
- 设备状态：online / offline / error
- 设备配置（JSONB存储）

### 传感器模块（sensor/）
- MQTT接收传感器数据
- 数据存储到PostgreSQL
- Redis缓存最新数据
- 支持历史查询和统计

### 规则引擎（rule/）
- 条件触发：阈值比较（>, <, >=, <=, ==, !=）
- 动作执行：继电器开关
- 冷却时间：防止重复触发
- 持续时间：避免瞬时波动

### 告警模块（alert/）
- 告警级别：info / warning / critical
- 告警确认机制
- 告警统计

### 控制模块（control/）
- MQTT下发控制指令
- 控制记录日志
- 紧急停止功能

---

## 数据库设计

### 核心表
```sql
users           -- 用户表
farms           -- 农场表
greenhouses     -- 大棚表
devices         -- 设备表
sensor_data     -- 传感器数据（时序）
control_rules   -- 控制规则
alerts          -- 告警记录
control_logs    -- 控制日志
operation_logs  -- 操作日志
```

### 关键字段
- 所有表使用UUID主键
- 包含created_at、updated_at时间戳
- 软删除：is_active字段

---

## API设计

### 认证接口
```
POST /auth/register    # 注册
POST /auth/login       # 登录
GET  /auth/profile     # 获取用户信息
```

### 农场接口
```
GET    /farms           # 农场列表
POST   /farms           # 创建农场
GET    /farms/:id       # 农场详情
PUT    /farms/:id       # 更新农场
DELETE /farms/:id       # 删除农场
```

### 设备接口
```
GET    /devices         # 设备列表
POST   /devices         # 注册设备
GET    /devices/:id     # 设备详情
PUT    /devices/:id     # 更新设备
```

### 传感器接口
```
GET /sensor/:greenhouseId/latest      # 最新数据
GET /sensor/:greenhouseId/history     # 历史数据
GET /sensor/:greenhouseId/statistics  # 统计数据
```

### 规则接口
```
GET    /rules           # 规则列表
POST   /rules           # 创建规则
GET    /rules/:id       # 规则详情
PUT    /rules/:id       # 更新规则
DELETE /rules/:id       # 删除规则
```

### 告警接口
```
GET  /alerts                 # 告警列表
GET  /alerts/stats           # 告警统计
PUT  /alerts/:id/acknowledge # 确认告警
```

### 控制接口
```
POST /control                # 发送控制指令
GET  /control/log/:id        # 控制记录
```

---

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

---

## 开发规范

### 代码风格
- TypeScript：使用ESLint + Prettier
- Python：使用Black + isort
- Vue：遵循Vue 3 Composition API规范

### 命名规范
- 文件名：kebab-case（如：sensor-data.handler.ts）
- 类名：PascalCase（如：SensorDataHandler）
- 方法名：camelCase（如：getLatestData）
- 常量：UPPER_SNAKE_CASE（如：MQTT_TOPICS）
- 数据库表：snake_case（如：sensor_data）

### Git规范
- 分支：feature/xxx、fix/xxx、docs/xxx
- 提交：feat: xxx、fix: xxx、docs: xxx
- PR：描述清楚改动内容和原因

---

## 环境变量

```bash
# 数据库
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=greenhouse123
DB_NAME=greenhouse

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# MQTT
MQTT_URL=mqtt://localhost:1883

# JWT
JWT_SECRET=greenhouse-secret-key-2026
JWT_EXPIRES_IN=7d

# 服务端口
PORT=3000
```

---

## Docker服务

| 服务 | 端口 | 说明 |
|------|------|------|
| postgres | 5432 | PostgreSQL数据库 |
| redis | 6379 | Redis缓存 |
| emqx | 1883, 18083 | MQTT Broker |
| backend | 3000 | NestJS后端 |
| ai-service | 8000 | Python AI服务 |
| nginx | 80, 443 | 反向代理 |

---

## 测试账号

| 服务 | 地址 | 账号 | 密码 |
|------|------|------|------|
| 管理后台 | http://localhost:3001 | 13800138000 | admin123 |
| EMQX控制台 | http://localhost:18083 | admin | public |

---

## 常用命令

```bash
# 启动所有服务
docker-compose up -d

# 查看日志
docker-compose logs -f backend

# 重启服务
docker-compose restart backend

# 重新构建
docker-compose build --no-cache backend

# 进入容器
docker-compose exec backend sh

# 数据库操作
docker-compose exec postgres psql -U postgres -d greenhouse
```

---

## 已知问题

1. ~~中文编码显示乱码~~（已修复：使用UTF-8编码）
2. ~~TypeORM UUID主键冲突~~（已修复：移除迁移脚本，使用TypeORM自动同步）
3. Element Plus el-radio API警告（不影响功能）

---

## 下一步开发

参考 `docs/roadmap.md` 查看完整开发路线图。

**优先级P0：**
- ESP32固件开发
- 微信小程序登录对接
- 告警推送功能
- 数据导出功能

---

*最后更新：2026-05-03*
