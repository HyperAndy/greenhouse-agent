# 农业大棚自动化控制系统 - 实现计划

## 项目结构

```
mimo-test/
├── docs/
│   └── superpowers/specs/
│       ├── 2026-05-03-greenhouse-automation-design.md
│       └── 2026-05-03-greenhouse-implementation-plan.md
├── firmware/                    # ESP32固件
│   ├── core/                   # 核心板固件
│   ├── drivers/                # 传感器/执行器驱动
│   ├── protocols/              # MQTT通信协议
│   └── rules/                  # 本地规则引擎
├── backend/                    # NestJS后端
│   ├── src/
│   │   ├── modules/
│   │   │   ├── device/         # 设备服务
│   │   │   ├── sensor/         # 数据服务
│   │   │   ├── rule/           # 规则引擎
│   │   │   ├── alert/          # 告警服务
│   │   │   ├── user/           # 用户服务
│   │   │   ├── farm/           # 农场服务
│   │   │   ├── weather/        # 天气服务
│   │   │   └── ota/            # OTA升级
│   │   ├── common/
│   │   │   ├── mqtt/           # MQTT客户端
│   │   │   ├── database/       # 数据库连接
│   │   │   └── redis/          # Redis连接
│   │   └── main.ts
│   ├── test/
│   ├── docker-compose.yml
│   └── package.json
├── ai-service/                 # Python AI服务
│   ├── app/
│   │   ├── api/
│   │   ├── models/
│   │   ├── services/
│   │   └── main.py
│   ├── data/                   # 作物数据库
│   └── requirements.txt
├── miniapp/                    # 微信小程序 (uni-app)
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── api/
│   │   └── store/
│   └── package.json
├── admin/                      # Web管理后台
│   ├── src/
│   │   ├── views/
│   │   ├── components/
│   │   ├── api/
│   │   └── router/
│   └── package.json
└── dashboard/                  # 大屏展示
    ├── src/
    └── package.json
```

---

## Phase 1: MVP（4-6周）

### Sprint 1: 基础设施（第1周）

#### 任务1.1: 项目初始化
- [ ] 创建项目根目录结构
- [ ] 初始化Git仓库
- [ ] 创建Docker Compose配置
- [ ] 配置PostgreSQL + TimescaleDB
- [ ] 配置Redis
- [ ] 配置EMQX MQTT Broker

**产出文件：**
```
docker-compose.yml
.env.example
.gitignore
```

#### 任务1.2: 数据库初始化
- [ ] 创建数据库迁移脚本
- [ ] 创建核心业务表（farm, greenhouse, device, users）
- [ ] 创建时序数据表（sensor_data, control_log）
- [ ] 创建索引
- [ ] 配置TimescaleDB hypertable
- [ ] 配置数据保留策略

**产出文件：**
```
backend/src/migrations/
├── 001_create_farm_tables.sql
├── 002_create_device_tables.sql
├── 003_create_sensor_tables.sql
├── 004_create_user_tables.sql
└── 005_create_timescaledb.sql
```

#### 任务1.3: NestJS后端骨架
- [ ] 初始化NestJS项目
- [ ] 配置TypeORM + PostgreSQL
- [ ] 配置Redis连接
- [ ] 配置MQTT客户端
- [ ] 创建基础模块结构
- [ ] 配置全局异常过滤器
- [ ] 配置请求验证管道

**产出文件：**
```
backend/
├── src/
│   ├── app.module.ts
│   ├── main.ts
│   ├── common/
│   │   ├── database/
│   │   │   ├── database.module.ts
│   │   │   └── database.providers.ts
│   │   ├── mqtt/
│   │   │   ├── mqtt.module.ts
│   │   │   └── mqtt.service.ts
│   │   └── redis/
│   │       ├── redis.module.ts
│   │       └── redis.service.ts
│   └── config/
│       └── configuration.ts
├── package.json
└── tsconfig.json
```

---

### Sprint 2: 设备服务 + ESP32固件（第2周）

#### 任务2.1: 设备服务
- [ ] 创建Device实体
- [ ] 实现设备注册API
- [ ] 实现设备状态管理
- [ ] 实现设备分组（大棚）
- [ ] 实现设备在线/离线检测

**产出文件：**
```
backend/src/modules/device/
├── device.module.ts
├── device.controller.ts
├── device.service.ts
├── entities/
│   └── device.entity.ts
├── dto/
│   ├── register-device.dto.ts
│   └── update-device.dto.ts
└── __tests__/
    └── device.service.spec.ts
```

#### 任务2.2: ESP32基础固件
- [ ] 配置MicroPython开发环境
- [ ] 实现WiFi连接管理
- [ ] 实现MQTT客户端
- [ ] 实现设备注册流程
- [ ] 实现心跳保活

**产出文件：**
```
firmware/
├── core/
│   ├── main.py
│   ├── config.py
│   └── wifi_manager.py
├── protocols/
│   ├── mqtt_client.py
│   └── message_handler.py
└── lib/
    └── umqtt_simple.py
```

#### 任务2.3: 传感器驱动
- [ ] SHT30温湿度传感器驱动
- [ ] BH1750光照传感器驱动
- [ ] MH-Z19B CO2传感器驱动
- [ ] 电容式土壤湿度传感器驱动
- [ ] 传感器数据采集调度器

**产出文件：**
```
firmware/drivers/
├── sht30.py
├── bh1750.py
├── mhz19b.py
├── soil_moisture.py
└── sensor_manager.py
```

---

### Sprint 3: 数据采集 + 规则引擎（第3周）

#### 任务3.1: 数据服务
- [ ] 创建SensorData实体
- [ ] 实现数据接收MQTT Handler
- [ ] 实现数据存储（TimescaleDB）
- [ ] 实现数据查询API
- [ ] 实现数据聚合统计

**产出文件：**
```
backend/src/modules/sensor/
├── sensor.module.ts
├── sensor.controller.ts
├── sensor.service.ts
├── entities/
│   └── sensor-data.entity.ts
├── handlers/
│   └── sensor-data.handler.ts
└── __tests__/
    └── sensor.service.spec.ts
```

#### 任务3.2: 规则引擎
- [ ] 创建ControlRule实体
- [ ] 实现规则解析器
- [ ] 实现条件评估器
- [ ] 实现动作执行器
- [ ] 实现定时任务支持
- [ ] 实现规则CRUD API

**产出文件：**
```
backend/src/modules/rule/
├── rule.module.ts
├── rule.controller.ts
├── rule.service.ts
├── engine/
│   ├── rule-engine.ts
│   ├── condition-evaluator.ts
│   └── action-executor.ts
├── entities/
│   └── control-rule.entity.ts
└── __tests__/
    ├── rule-engine.spec.ts
    └── condition-evaluator.spec.ts
```

#### 任务3.3: ESP32本地控制
- [ ] 实现继电器驱动
- [ ] 实现本地规则引擎
- [ ] 实现控制指令接收
- [ ] 实现控制状态上报
- [ ] 实现断网自治逻辑

**产出文件：**
```
firmware/
├── drivers/
│   └── relay.py
├── rules/
│   ├── local_rule_engine.py
│   └── default_rules.py
└── control/
    ├── control_manager.py
    └── action_executor.py
```

---

### Sprint 4: 用户服务 + 小程序（第4周）

#### 任务4.1: 用户服务
- [ ] 创建User实体
- [ ] 实现手机号登录
- [ ] 实现微信登录
- [ ] 实现JWT认证
- [ ] 实现角色权限管理
- [ ] 实现用户-农场关联

**产出文件：**
```
backend/src/modules/user/
├── user.module.ts
├── user.controller.ts
├── user.service.ts
├── auth/
│   ├── auth.module.ts
│   ├── auth.service.ts
│   ├── auth.controller.ts
│   ├── strategies/
│   │   ├── jwt.strategy.ts
│   │   └── wechat.strategy.ts
│   └── guards/
│       ├── jwt-auth.guard.ts
│       └── roles.guard.ts
├── entities/
│   └── user.entity.ts
└── __tests__/
    └── user.service.spec.ts
```

#### 任务4.2: 农场服务
- [ ] 创建Farm/Greenhouse实体
- [ ] 实现农场CRUD
- [ ] 实现大棚CRUD
- [ ] 实现农场-用户关联

**产出文件：**
```
backend/src/modules/farm/
├── farm.module.ts
├── farm.controller.ts
├── farm.service.ts
├── entities/
│   ├── farm.entity.ts
│   └── greenhouse.entity.ts
└── __tests__/
    └── farm.service.spec.ts
```

#### 任务4.3: 微信小程序基础
- [ ] 初始化uni-app项目
- [ ] 配置API请求封装
- [ ] 配置状态管理（Pinia）
- [ ] 实现登录页面
- [ ] 实现大棚列表页面
- [ ] 实现大棚详情页面（实时数据）

**产出文件：**
```
miniapp/
├── src/
│   ├── pages/
│   │   ├── login/
│   │   │   └── index.vue
│   │   ├── home/
│   │   │   └── index.vue
│   │   └── greenhouse/
│   │       ├── list.vue
│   │       └── detail.vue
│   ├── api/
│   │   ├── request.ts
│   │   ├── auth.ts
│   │   └── device.ts
│   ├── store/
│   │   ├── user.ts
│   │   └── device.ts
│   └── utils/
│       └── mqtt.ts
├── pages.json
└── manifest.json
```

---

### Sprint 5: 告警 + 设备控制（第5周）

#### 任务5.1: 告警服务
- [ ] 创建Alert实体
- [ ] 实现阈值告警
- [ ] 实现设备离线告警
- [ ] 实现告警确认/处理
- [ ] 实现告警推送（WebSocket）

**产出文件：**
```
backend/src/modules/alert/
├── alert.module.ts
├── alert.controller.ts
├── alert.service.ts
├── entities/
│   └── alert.entity.ts
├── handlers/
│   └── alert-trigger.handler.ts
└── __tests__/
    └── alert.service.spec.ts
```

#### 任务5.2: 设备控制
- [ ] 实现控制指令下发（MQTT）
- [ ] 实现控制确认回调
- [ ] 实现手动控制API
- [ ] 实现批量控制

**产出文件：**
```
backend/src/modules/control/
├── control.module.ts
├── control.controller.ts
├── control.service.ts
└── __tests__/
    └── control.service.spec.ts
```

#### 任务5.3: 小程序设备控制
- [ ] 实现设备控制页面
- [ ] 实现继电器开关控制
- [ ] 实现告警列表页面
- [ ] 实现告警详情页面

**产出文件：**
```
miniapp/src/pages/
├── control/
│   └── index.vue
└── alert/
    ├── list.vue
    └── detail.vue
```

---

### Sprint 6: 部署 + 联调（第6周）

#### 任务6.1: Docker部署
- [ ] 编写后端Dockerfile
- [ ] 编写AI服务Dockerfile
- [ ] 配置Nginx反向代理
- [ ] 配置数据持久化卷
- [ ] 编写部署文档

**产出文件：**
```
docker-compose.yml (完善)
nginx/
├── nginx.conf
└── conf.d/
    └── default.conf
backend/Dockerfile
ai-service/Dockerfile
```

#### 任务6.2: 联调测试
- [ ] ESP32 ↔ MQTT Broker联调
- [ ] MQTT ↔ 后端服务联调
- [ ] 后端 ↔ 小程序联调
- [ ] 规则引擎端到端测试
- [ ] 告警流程测试

#### 任务6.3: MVP交付物
- [ ] 完整的Docker Compose部署包
- [ ] ESP32固件烧录工具
- [ ] 基础用户手册
- [ ] 演示数据

---

## Phase 2: 完善（4-6周）

### Sprint 7: Web管理后台（第7-8周）

#### 任务7.1: 后台框架搭建
- [ ] 初始化Vue3 + Element Plus项目
- [ ] 配置路由和权限
- [ ] 配置API请求封装
- [ ] 实现登录页面
- [ ] 实现布局框架

#### 任务7.2: 核心管理页面
- [ ] 仪表盘（数据概览、图表）
- [ ] 农场管理（CRUD）
- [ ] 大棚管理（CRUD）
- [ ] 设备管理（列表、状态、OTA）
- [ ] 用户管理（列表、角色）

#### 任务7.3: 规则配置界面
- [ ] 可视化规则编辑器
- [ ] 条件组合配置
- [ ] 动作配置
- [ ] 定时任务配置

---

### Sprint 8: AI服务（第9-10周）

#### 任务8.1: AI服务框架
- [ ] 初始化FastAPI项目
- [ ] 配置数据库连接
- [ ] 配置任务调度
- [ ] 实现健康检查API

#### 任务8.2: 作物参数推荐
- [ ] 创建作物数据库（JSON/YAML）
- [ ] 实现作物+阶段查询
- [ ] 实现参数推荐算法
- [ ] 实现推荐API

#### 任务8.3: 天气联动
- [ ] 对接天气API（和风天气）
- [ ] 实现天气预报获取
- [ ] 实现天气联动策略
- [ ] 实现提前调控逻辑

#### 任务8.4: 异常检测
- [ ] 实现传感器故障检测
- [ ] 实现设备离线检测
- [ ] 实现环境异常检测
- [ ] 实现告警触发

---

### Sprint 9: OTA + 推送（第11-12周）

#### 任务9.1: OTA升级
- [ ] 实现固件版本管理
- [ ] 实现固件上传存储
- [ ] 实现OTA指令下发
- [ ] 实现升级状态回调
- [ ] ESP32端OTA接收

#### 任务9.2: 推送通知
- [ ] 实现微信模板消息
- [ ] 实现小程序订阅消息
- [ ] 实现短信告警（可选）
- [ ] 实现推送配置管理

---

## Phase 3: 商业化（4-6周）

### Sprint 10: 大屏展示（第13-14周）

#### 任务10.1: 大屏框架
- [ ] 初始化Vue3 + ECharts/DataV项目
- [ ] 配置响应式布局
- [ ] 实现数据实时刷新

#### 任务10.2: 大屏组件
- [ ] 农场总览面板
- [ ] 地图/3D展示
- [ ] 实时数据轮播
- [ ] 告警滚动
- [ ] 曲线图
- [ ] 能耗统计
- [ ] 天气信息

---

### Sprint 11: 多租户 + 安全（第15-16周）

#### 任务11.1: 多租户完善
- [ ] 数据隔离验证
- [ ] 权限细化
- [ ] 操作日志审计
- [ ] 数据导出功能

#### 任务11.2: 安全加固
- [ ] API限流
- [ ] 输入验证加固
- [ ] SQL注入防护
- [ ] XSS防护
- [ ] HTTPS配置

---

### Sprint 12: 文档 + 测试（第17-18周）

#### 任务12.1: 用户文档
- [ ] 安装部署手册
- [ ] 用户使用手册
- [ ] API接口文档
- [ ] 硬件接线指南

#### 任务12.2: 测试完善
- [ ] 单元测试覆盖 > 80%
- [ ] 集成测试
- [ ] E2E测试
- [ ] 性能测试

---

## Phase 4: 智能化（持续迭代）

### Sprint 13+: AI增强
- [ ] 历史数据学习
- [ ] 参数优化算法
- [ ] 产量预测模型
- [ ] 病虫害预警
- [ ] 能耗优化策略
- [ ] 用户行为学习

---

## 技术风险与应对

| 风险 | 影响 | 应对策略 |
|------|------|----------|
| ESP32稳定性 | 高 | 充分测试，看门狗机制，本地降级 |
| MQTT消息丢失 | 高 | QoS=1，本地缓存，重试机制 |
| 传感器精度 | 中 | 多传感器校准，异常值过滤 |
| 大棚环境恶劣 | 中 | IP65外壳，灌封胶，防潮设计 |
| 网络不稳定 | 高 | 断网自治，消息队列缓冲 |
| 多租户数据泄露 | 高 | 严格数据隔离，权限校验 |

---

## 里程碑

| 里程碑 | 时间 | 交付物 |
|--------|------|--------|
| M1: MVP完成 | 第6周末 | 可运行的最小系统，支持单大棚 |
| M2: 功能完善 | 第12周末 | Web后台、AI服务、OTA升级 |
| M3: 商业就绪 | 第18周末 | 大屏、多租户、完整文档 |
| M4: 智能化 | 持续 | AI增强功能 |
