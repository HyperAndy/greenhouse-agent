-- 009_seed_data.sql
-- 初始测试数据

-- 创建测试农场
INSERT INTO farm (name, address, location, contact_phone)
VALUES ('示范农场', '北京市海淀区农业科技园', POINT(116.310, 39.993), '13800138000');

-- 创建3个大棚
INSERT INTO greenhouse (farm_id, name, area, crop_type, growth_stage)
VALUES
    (1, '番茄棚', 500.00, '番茄', '开花期'),
    (1, '黄瓜棚', 400.00, '黄瓜', '幼苗期'),
    (1, '辣椒棚', 450.00, '辣椒', '结果期');

-- 创建管理员用户 (密码: admin123)
INSERT INTO users (phone, name, password_hash, role, status)
VALUES ('13800000001', '管理员', '$2b$10$rQEY5z5d5z5d5z5d5z5d5OKhZr8qF1Jz8qF1Jz8qF1Jz8qF1Jz8q', 'admin', 'active');

-- 创建普通用户
INSERT INTO users (phone, name, password_hash, role, status)
VALUES
    ('13800000002', '张三', '$2b$10$rQEY5z5d5z5d5z5d5z5d5OKhZr8qF1Jz8qF1Jz8qF1Jz8qF1Jz8q', 'farmer', 'active'),
    ('13800000003', '李四', '$2b$10$rQEY5z5d5z5d5z5d5z5d5OKhZr8qF1Jz8qF1Jz8qF1Jz8qF1Jz8q', 'operator', 'active');

-- 分配用户到农场
INSERT INTO user_farm (user_id, farm_id, role)
VALUES
    (1, 1, 'owner'),
    (2, 1, 'manager'),
    (3, 1, 'worker');

-- 创建3个设备（每个大棚1个）
INSERT INTO device (greenhouse_id, mac_addr, name, device_type, firmware_ver, status, config)
VALUES
    (1, 'AA:BB:CC:DD:EE:01', '番茄棚主控', 'both', '1.0.0', 'offline', '{"channels": 4}'),
    (2, 'AA:BB:CC:DD:EE:02', '黄瓜棚主控', 'both', '1.0.0', 'offline', '{"channels": 4}'),
    (3, 'AA:BB:CC:DD:EE:03', '辣椒棚主控', 'both', '1.0.0', 'offline', '{"channels": 4}');

-- 创建默认控制规则
INSERT INTO control_rule (greenhouse_id, name, trigger_config, actions, enabled, priority)
VALUES
    (1, '番茄棚高温报警', '{"type": "threshold", "metric": "temp", "operator": ">", "value": 35}', '[{"type": "alert", "level": "warning"}, {"type": "actuator", "channel": 1, "state": true}]', true, 10),
    (1, '番茄棚低温报警', '{"type": "threshold", "metric": "temp", "operator": "<", "value": 10}', '[{"type": "alert", "level": "critical"}, {"type": "actuator", "channel": 2, "state": true}]', true, 10),
    (2, '黄瓜棚湿度控制', '{"type": "threshold", "metric": "humi", "operator": "<", "value": 60}', '[{"type": "actuator", "channel": 1, "state": true}]', true, 5),
    (3, '辣椒棚CO2控制', '{"type": "threshold", "metric": "co2", "operator": ">", "value": 1000}', '[{"type": "actuator", "channel": 1, "state": false}]', true, 8);

-- 创建测试告警
INSERT INTO alert (greenhouse_id, level, title, message)
VALUES
    (1, 'info', '系统初始化', '示范农场已完成初始化配置'),
    (2, 'warning', '设备离线', '黄瓜棚主控设备已离线超过1小时');
