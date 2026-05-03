-- 004_create_device_tables.sql
-- 设备表

CREATE TABLE device (
    id SERIAL PRIMARY KEY,
    greenhouse_id INT NOT NULL REFERENCES greenhouse(id) ON DELETE CASCADE,
    mac_addr VARCHAR(17) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    device_type VARCHAR(50) NOT NULL CHECK (device_type IN ('sensor', 'actuator', 'both')),
    firmware_ver VARCHAR(20),
    status VARCHAR(20) NOT NULL DEFAULT 'offline' CHECK (status IN ('online', 'offline', 'error')),
    last_seen TIMESTAMP,
    config JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_device_greenhouse_id ON device(greenhouse_id);
CREATE INDEX idx_device_mac_addr ON device(mac_addr);
CREATE INDEX idx_device_status ON device(status);
CREATE INDEX idx_device_type ON device(device_type);
