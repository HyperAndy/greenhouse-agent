# 农业大棚自动化检测与控制系统 - 设计文档

## 1. 项目概述

### 1.1 项目目标
构建一套商业化农业大棚自动化检测与控制系统，面向中小农场主，提供完整的硬件+软件+安装+维护整体解决方案。

### 1.2 核心功能
- 环境监测：温度、湿度、光照、CO2浓度
- 土壤监测：土壤湿度、pH值、EC值（电导率）
- 灌溉控制：自动浇水、滴灌系统
- 通风/温控：风机、卷帘、加热/降温设备
- 遮阳/补光：遮阳帘、补光灯控制
- 智能控制：基于作物类型和生长阶段的参数推荐、AI预测与调控

### 1.3 目标用户
- 小型农户（1-10个大棚）
- 中型农场（10-50个大棚）
- 大型农场/园区（50+大棚）

### 1.4 商业模式
整体解决方案：硬件+软件+安装+维护，打包销售

---

## 2. 系统架构

### 2.1 架构总览

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
│  │ API网关     │  │ MQTT Broker│  │ WebSocket  │            │
│  │ (NestJS)   │  │ (EMQX)    │  │ 推送服务    │            │
│  └─────┬──────┘  └─────┬──────┘  └─────┬──────┘            │
│        │               │               │                    │
│  ┌─────▼───────────────▼───────────────▼──────┐            │
│  │              业务服务层                      │            │
│  │  设备管理 · 数据服务 · 规则引擎 · 告警服务   │            │
│  │  用户管理 · OTA服务 · 天气服务 · AI推荐服务   │            │
│  └─────────────────┬───────────────────────────┘            │
│                    │                                        │
│  ┌─────────────────▼───────────────────────────┐            │
│  │              数据层                          │            │
│  │  PostgreSQL + TimescaleDB                    │            │
│  │  Redis (缓存/实时状态)                        │            │
│  │  本地文件存储 (固件/导出文件)                  │            │
│  └──────────────────────────────────────────────┘           │
└─────────────────────────────────────────────────────────────┘
          │ MQTT (TLS)
          ▼
┌─────────────────────────────────────────────────────────────┐
│                     边缘层                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  大棚A(ESP32) │  │  大棚B(ESP32) │  │  大棚N(ESP32) │      │
│  │  传感器×N     │  │  传感器×N     │  │  传感器×N     │      │
│  │  继电器×N     │  │  继电器×N     │  │  继电器×N     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 核心设计原则
- **边缘自治**：ESP32有本地规则引擎，断网按预设规则继续控制
- **云边协同**：云端下发规则/参数，边缘执行+上报
- **多租户**：一个平台服务多个农场，数据隔离
- **事件驱动**：传感器数据触发规则引擎，规则引擎触发控制指令

### 2.3 技术栈总览

| 层 | 技术 | 理由 |
|---|------|------|
| 嵌入式 | ESP32 + MicroPython/C | 有硬件经验，ESP32生态成熟 |
| 云平台 | Node.js (NestJS) + EMQX | 团队熟悉Node，NestJS结构清晰 |
| 数据库 | PostgreSQL + TimescaleDB | 时序数据专用，PostgreSQL做业务数据 |
| 前端 | Vue3 + uni-app | 一套代码出小程序+Web管理后台 |
| AI | Python FastAPI | 天气预测、参数推荐独立服务 |
| 部署 | Docker Compose (本地部署) | 先本地跑通，后续可迁云 |

---

## 3. 硬件层设计

### 3.1 ESP32主控板选型

| 方案 | 芯片 | 价格 | 特点 |
|------|------|------|------|
| **推荐：ESP32-S3** | 双核240MHz | ¥18-25 | 支持MicroPython，USB原生，AI加速 |
| 备选：ESP32-C3 | 单核160MHz | ¥10-15 | 更便宜，RISC-V架构，够用但扩展性差 |
| 备选：ESP32-WROOM-32 | 双核240MHz | ¥15-20 | 经典款，生态最成熟 |

### 3.2 传感器配置（每棚一套）

```
ESP32-S3 主控板
    │
    ├── I2C总线 ──┬── SHT30 (温湿度，精度±0.3°C)
    │             ├── BH1750 (光照，0-65535lux)
    │             └── 土壤湿度×2 (电容式，埋在不同位置)
    │
    ├── UART ───── MH-Z19B (CO2，NDIR红外)
    │
    ├── ADC ────── pH传感器 (模拟输出，需信号调理)
    │             EC传感器 (模拟输出)
    │
    └── GPIO ───── 继电器模块 (4/8路)
                    ├── 风机控制
                    ├── 卷帘电机
                    ├── 电磁阀(灌溉)
                    ├── 补光灯
                    ├── 遮阳帘电机
                    └── 加热/降温设备
```

### 3.3 通信方案

| 场景 | 方案 | 理由 |
|------|------|------|
| **推荐：WiFi** | ESP32自带WiFi | 成本最低，农场一般有WiFi覆盖 |
| 备选：4G模组 | SIM800C/A7670 | 无WiFi覆盖的偏远大棚，每棚多¥30-50 |
| 备选：LoRa | SX1278 | 多棚远距离组网，需网关转发 |

**策略：先做WiFi版本，预留4G模组接口，后续按需出4G版。**

### 3.4 供电方案

```
220V市电
    │
    ├── AC-DC电源模块 (220V→12V/5V)
    │       ├── ESP32主控 (5V)
    │       ├── 传感器 (3.3V/5V)
    │       └── 继电器 (12V线圈)
    │
    └── UPS备用电源 (可选)
            └── 18650锂电池，断电维持2-4小时
```

### 3.5 PCB设计方向

- **核心板+扩展板模式**
  - 核心板：ESP32最小系统，固定不变
  - 扩展板：传感器接口+继电器，按需搭配
- **防潮防腐** — 灌封胶/IP65外壳，大棚环境湿度高
- **接线端子** — 免焊接，农户自己能装

### 3.6 成本核算（单棚）

| 部件 | 型号 | 数量 | 单价 | 小计 |
|------|------|------|------|------|
| 主控板 | ESP32-S3 | 1 | ¥25 | ¥25 |
| 温湿度 | SHT30 | 1 | ¥15 | ¥15 |
| 光照 | BH1750 | 1 | ¥10 | ¥10 |
| CO2 | MH-Z19B | 1 | ¥70 | ¥70 |
| 土壤湿度 | 电容式 | 2 | ¥8 | ¥16 |
| pH传感器 | 模拟 | 1 | ¥45 | ¥45 |
| EC传感器 | 模拟 | 1 | ¥45 | ¥45 |
| 继电器 | 8路 | 1 | ¥20 | ¥20 |
| 电源模块 | AC-DC | 1 | ¥15 | ¥15 |
| PCB+外壳 | 定制 | 1 | ¥40 | ¥40 |
| 线材/端子 | - | - | ¥20 | ¥20 |
| **合计** | | | | **¥321** |

pH/EC可选配，去掉后 **¥231/棚**。

---

## 4. 云平台层设计

### 4.1 服务架构

```
┌─────────────────────────────────────────────────────────────┐
│                     云平台 (NestJS)                          │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  API网关层                                           │    │
│  │  认证鉴权 · 限流 · 路由 · 日志                        │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  设备服务     │  │  数据服务     │  │  规则引擎     │      │
│  │              │  │              │  │              │      │
│  │  设备注册    │  │  数据采集     │  │  条件触发     │      │
│  │  状态管理    │  │  历史查询     │  │  动作执行     │      │
│  │  分组管理    │  │  统计分析     │  │  定时任务     │      │
│  │  OTA升级    │  │  数据导出     │  │  联动控制     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  告警服务     │  │  用户服务     │  │  天气服务     │      │
│  │              │  │              │  │              │      │
│  │  阈值告警    │  │  多租户      │  │  天气API对接  │      │
│  │  异常检测    │  │  权限管理    │  │  预报数据     │      │
│  │  推送通知    │  │  操作日志    │  │  灾害预警     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  AI服务 (Python FastAPI 独立服务)                     │    │
│  │  参数推荐 · 生长预测 · 异常检测 · 智能调控策略         │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 4.2 MQTT主题设计

```
farm/{farm_id}/greenhouse/{gh_id}/sensor/data     # 传感器数据上报
farm/{farm_id}/greenhouse/{gh_id}/control/set      # 控制指令下发
farm/{farm_id}/greenhouse/{gh_id}/control/ack      # 控制确认
farm/{farm_id}/greenhouse/{gh_id}/status           # 设备状态
farm/{farm_id}/greenhouse/{gh_id}/config           # 配置下发
farm/{farm_id}/greenhouse/{gh_id}/ota              # OTA升级
farm/{farm_id}/alert                               # 告警
```

**数据上报JSON格式：**
```json
{
  "ts": 1714723200,
  "temp": 28.5,
  "humi": 65.2,
  "light": 45000,
  "co2": 800,
  "soil_moisture": [45, 42],
  "ph": 6.8,
  "ec": 1.2,
  "relay_state": [1,0,1,0,0,0,0,0]
}
```

### 4.3 规则引擎设计

规则格式：
```json
{
  "name": "高温通风",
  "trigger": {
    "type": "threshold",
    "sensor": "temp",
    "operator": ">",
    "value": 30,
    "duration": 60
  },
  "actions": [
    {"type": "relay", "channel": 0, "state": "on"},
    {"type": "relay", "channel": 1, "state": "on"}
  ],
  "cooldown": 300
}
```

- **duration** — 持续60秒才触发，避免瞬时波动
- **cooldown** — 触发后300秒内不重复触发
- 支持组合条件：`temp > 30 AND humidity < 40`

### 4.4 关键技术选型

| 组件 | 选型 | 理由 |
|------|------|------|
| 框架 | NestJS + TypeScript | 团队熟悉Node，NestJS结构清晰 |
| MQTT Broker | EMQX | 国产，性能强，支持规则引擎，有免费版 |
| 数据库 | PostgreSQL 15 | 业务数据 |
| 时序扩展 | TimescaleDB | 插件式，不改SQL习惯，自动分区 |
| 缓存 | Redis | 设备实时状态、会话、限流 |
| 文件存储 | 本地磁盘 + Nginx | 先本地部署，不依赖云服务 |
| 消息队列 | Redis Streams | 轻量，不引入Kafka增加运维负担 |
| 部署 | Docker Compose | 本地部署，先跑通 |

### 4.5 多租户设计

```
农场(farm)
  └── 大棚(greenhouse)
        └── 设备(device)
              └── 传感器/执行器

用户 → 角色 → 权限
  - 超级管理员：所有农场
  - 农场管理员：本农场
  - 操作员：指定大棚
  - 只读用户：仅查看
```

---

## 5. 数据库设计

### 5.1 核心业务表

```sql
-- 农场
CREATE TABLE farm (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    address     VARCHAR(255),
    location    POINT,           -- GPS坐标
    created_at  TIMESTAMP DEFAULT NOW()
);

-- 大棚
CREATE TABLE greenhouse (
    id          SERIAL PRIMARY KEY,
    farm_id     INT REFERENCES farm(id),
    name        VARCHAR(100) NOT NULL,
    area        DECIMAL(10,2),   -- 面积(平方米)
    crop_type   VARCHAR(50),     -- 当前作物
    created_at  TIMESTAMP DEFAULT NOW()
);

-- 设备
CREATE TABLE device (
    id              SERIAL PRIMARY KEY,
    greenhouse_id   INT REFERENCES greenhouse(id),
    mac_addr        VARCHAR(17) UNIQUE NOT NULL,
    firmware_ver    VARCHAR(20),
    status          VARCHAR(20) DEFAULT 'offline',
    last_seen       TIMESTAMP,
    config          JSONB,
    created_at      TIMESTAMP DEFAULT NOW()
);

-- 用户
CREATE TABLE users (
    id          SERIAL PRIMARY KEY,
    phone       VARCHAR(20) UNIQUE,
    wechat_id   VARCHAR(100),
    name        VARCHAR(50),
    role        VARCHAR(20) NOT NULL,
    created_at  TIMESTAMP DEFAULT NOW()
);

-- 用户-农场关联
CREATE TABLE user_farm (
    user_id     INT REFERENCES users(id),
    farm_id     INT REFERENCES farm(id),
    role        VARCHAR(20),
    PRIMARY KEY (user_id, farm_id)
);

-- 控制规则
CREATE TABLE control_rule (
    id              SERIAL PRIMARY KEY,
    greenhouse_id   INT REFERENCES greenhouse(id),
    name            VARCHAR(100),
    trigger_config  JSONB NOT NULL,
    actions         JSONB NOT NULL,
    enabled         BOOLEAN DEFAULT true,
    created_at      TIMESTAMP DEFAULT NOW()
);

-- 告警记录
CREATE TABLE alert (
    id              SERIAL PRIMARY KEY,
    greenhouse_id   INT REFERENCES greenhouse(id),
    rule_id         INT REFERENCES control_rule(id),
    level           VARCHAR(20),
    message         TEXT,
    acknowledged    BOOLEAN DEFAULT false,
    created_at      TIMESTAMP DEFAULT NOW()
);

-- 操作日志
CREATE TABLE operation_log (
    id              SERIAL PRIMARY KEY,
    user_id         INT REFERENCES users(id),
    device_id       INT REFERENCES device(id),
    action          VARCHAR(50),
    detail          JSONB,
    created_at      TIMESTAMP DEFAULT NOW()
);
```

### 5.2 时序数据表（TimescaleDB）

```sql
-- 传感器数据
CREATE TABLE sensor_data (
    time            TIMESTAMPTZ NOT NULL,
    device_id       INT NOT NULL,
    temp            DECIMAL(5,2),
    humi            DECIMAL(5,2),
    light           INT,
    co2             INT,
    soil_moisture   DECIMAL(5,2)[],
    ph              DECIMAL(4,2),
    ec              DECIMAL(5,2),
    relay_state     BOOLEAN[]
);

SELECT create_hypertable('sensor_data', 'time');

-- 设备控制记录
CREATE TABLE control_log (
    time            TIMESTAMPTZ NOT NULL,
    device_id       INT NOT NULL,
    channel         INT NOT NULL,
    state           BOOLEAN,
    source          VARCHAR(20),
    created_by      INT
);

SELECT create_hypertable('control_log', 'time');
```

### 5.3 数据保留策略

```sql
-- 原始数据保留90天
SELECT add_retention_policy('sensor_data', INTERVAL '90 days');

-- 按小时聚合，永久保留
CREATE MATERIALIZED VIEW sensor_hourly
WITH (timescaledb.continuous) AS
SELECT
    time_bucket('1 hour', time) AS bucket,
    device_id,
    AVG(temp) AS avg_temp,
    MAX(temp) AS max_temp,
    MIN(temp) AS min_temp,
    AVG(humi) AS avg_humi,
    AVG(soil_moisture[1]) AS avg_soil
FROM sensor_data
GROUP BY bucket, device_id;
```

### 5.4 索引设计

```sql
CREATE INDEX idx_device_greenhouse ON device(greenhouse_id);
CREATE INDEX idx_device_mac ON device(mac_addr);
CREATE INDEX idx_rule_greenhouse ON control_rule(greenhouse_id);
CREATE INDEX idx_alert_greenhouse ON alert(greenhouse_id);
CREATE INDEX idx_alert_created ON alert(created_at DESC);
CREATE INDEX idx_oplog_user ON operation_log(user_id);
CREATE INDEX idx_oplog_created ON operation_log(created_at DESC);
```

---

## 6. AI服务层设计

### 6.1 服务架构（Python FastAPI）

```
┌─────────────────────────────────────────────────────────────┐
│                     AI服务 (FastAPI)                         │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  参数推荐     │  │  异常检测     │  │  生长预测     │      │
│  │  作物数据库  │  │  统计模型    │  │  历史趋势    │      │
│  │  生长阶段    │  │  阈值学习    │  │  产量预估    │      │
│  │  环境适配    │  │  异常告警    │  │  采收建议    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  天气联动     │  │  智能调控     │  │  数据分析     │      │
│  │  天气预报    │  │  策略生成    │  │  报表生成    │      │
│  │  灾害预警    │  │  参数优化    │  │  对比分析    │      │
│  │  提前调控    │  │  节能策略    │  │  趋势预测    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

### 6.2 核心功能

#### 作物参数推荐

```python
crop_profiles = {
    "番茄": {
        "苗期":    {"temp": [18, 25], "humi": [60, 70], "light": 20000, "co2": 800},
        "开花期":  {"temp": [20, 28], "humi": [50, 65], "light": 30000, "co2": 1000},
        "结果期":  {"temp": [22, 30], "humi": [50, 60], "light": 35000, "co2": 1200},
        "采收期":  {"temp": [18, 25], "humi": [55, 65], "light": 25000, "co2": 800},
    },
}
```

#### 天气联动策略

- 明天最高温35°C → 今晚提前开遮阳帘
- 明天有暴雨 → 关闭通风窗
- 连续阴天3天 → 开启补光灯
- 夜间低温预警 → 提前启动加热

#### 异常检测

- 传感器故障：数据长时间不变、超出物理范围、跳变过大
- 设备离线：超过阈值未上报
- 环境异常：温湿度突变、CO2异常升高

### 6.3 技术选型

| 组件 | 选型 | 理由 |
|------|------|------|
| 框架 | FastAPI | 异步，自动生成文档 |
| ML框架 | scikit-learn + pandas | 够用，不需要深度学习 |
| 任务调度 | APScheduler | 定时异常检测 |
| 作物数据 | 自建JSON/YAML | 灵活可配置 |
| 天气API | 和风天气/心知天气 | 国内稳定，有免费额度 |

### 6.4 MVP路线

**第一阶段（MVP）：**
- 基于作物+阶段的参数推荐
- 天气预报获取 + 简单联动策略
- 传感器异常检测

**第二阶段：**
- 历史数据学习，优化参数
- 多大棚联动
- 能耗优化策略

**第三阶段：**
- 产量预测模型
- 病虫害预警（接入图像识别）
- 用户行为学习，个性化推荐

---

## 7. 前端设计

### 7.1 技术栈

| 端 | 技术 | 理由 |
|------|------|------|
| 农户端 | uni-app + Vue3 | 一套代码出小程序 |
| 管理后台 | Vue3 + Element Plus | 组件丰富，开发快 |
| 大屏展示 | Vue3 + ECharts/DataV | 数据可视化成熟方案 |

### 7.2 农户端（微信小程序）

**核心页面：**

| 页面 | 功能 |
|------|------|
| 首页/大棚列表 | 大棚概览、实时数据、在线状态 |
| 大棚详情 | 传感器实时数据、历史曲线、设备控制 |
| 设备控制 | 手动开关风机/灌溉/遮阳等 |
| 报警中心 | 告警列表、确认处理、推送设置 |
| 智能建议 | AI推荐参数、一键应用 |
| 作物管理 | 选择作物、设置生长阶段 |
| 历史数据 | 数据查询、曲线图、导出 |
| 我的 | 个人信息、通知设置、农场管理 |

### 7.3 管理后台（Web）

**核心功能：**

| 模块 | 功能 |
|------|------|
| 仪表盘 | 全局数据概览、设备状态统计、告警趋势 |
| 农场管理 | 农场增删改查、GPS定位 |
| 大棚管理 | 大棚配置、作物绑定、面积管理 |
| 设备管理 | 设备注册、状态监控、OTA升级 |
| 用户管理 | 用户增删、角色分配、权限控制 |
| 规则配置 | 可视化规则编辑器、条件组合、定时任务 |
| 告警管理 | 告警规则配置、通知渠道设置 |
| 数据中心 | 数据查询、报表导出、对比分析 |
| AI分析 | 参数推荐、异常报告、生长预测 |
| 系统设置 | 通知配置、系统参数、日志查询 |

### 7.4 大屏展示

```
┌─────────────────────────────────────────────────────────────┐
│                      智慧农业监控大屏                         │
├──────────────┬──────────────────────┬───────────────────────┤
│  左侧面板     │      中央区域         │      右侧面板         │
│  农场总览    │  3D大棚模型/地图热力图 │  实时告警             │
│  环境数据    │  实时数据轮播         │  AI建议               │
│  能耗统计    │                      │  设备状态             │
└──────────────┴──────────────────────┴───────────────────────┘
```

**大屏功能：**
- 农场总览：设备数、在线率、告警数、今日数据量
- 地图/3D展示：大棚分布、热力图
- 实时数据轮播：各大棚关键指标滚动展示
- 告警滚动：最新告警实时滚动
- 曲线图：关键指标24小时趋势
- 能耗统计：设备运行时长、用电量估算
- 天气信息：当前天气 + 未来3天预报

### 7.5 推送通知方案

| 渠道 | 场景 |
|------|------|
| 微信模板消息 | 告警通知、日报推送 |
| 小程序订阅消息 | 设备离线、环境异常 |
| 短信 | 严重告警（温度失控等） |

---

## 8. 部署方案

### 8.1 本地部署架构

```
┌─────────────────────────────────────────────────────────────┐
│                    本地服务器 (Docker Compose)                │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  NestJS API  │  │  EMQX        │  │  Python AI   │      │
│  │  :3000       │  │  :1883       │  │  :8000       │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  PostgreSQL  │  │  Redis       │  │  Nginx       │      │
│  │  :5432       │  │  :6379       │  │  :80/:443    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 8.2 Docker Compose配置概要

```yaml
services:
  api:
    build: ./backend
    ports: ["3000:3000"]
    depends_on: [postgres, redis, emqx]

  ai-service:
    build: ./ai
    ports: ["8000:8000"]
    depends_on: [postgres, redis]

  postgres:
    image: timescale/timescaledb:latest-pg15
    ports: ["5432:5432"]
    volumes: ["pgdata:/var/lib/postgresql/data"]

  redis:
    image: redis:7-alpine
    ports: ["6379:6379"]

  emqx:
    image: emqx/emqx:latest
    ports: ["1883:1883", "8083:8083"]

  nginx:
    image: nginx:alpine
    ports: ["80:80"]
    volumes:
      - ./frontend/dist:/usr/share/nginx/html
      - ./nginx.conf:/etc/nginx/nginx.conf
```

---

## 9. 开发路线图

### Phase 1: MVP（4-6周）
- [ ] ESP32基础固件：传感器采集 + WiFi + MQTT
- [ ] 云平台：设备注册、数据采集、基础API
- [ ] 微信小程序：大棚列表、实时数据、手动控制
- [ ] 规则引擎：阈值触发、基础联动
- [ ] Docker Compose本地部署

### Phase 2: 完善（4-6周）
- [ ] Web管理后台
- [ ] AI参数推荐服务
- [ ] 天气联动
- [ ] OTA固件升级
- [ ] 告警系统 + 推送通知

### Phase 3: 商业化（4-6周）
- [ ] 大屏展示
- [ ] 多租户完善
- [ ] 安装部署工具
- [ ] 用户手册
- [ ] 性能优化

### Phase 4: 智能化（持续迭代）
- [ ] AI异常检测
- [ ] 生长预测
- [ ] 能耗优化
- [ ] 病虫害预警
