-- 005_create_sensor_tables.sql
-- 传感器数据表

CREATE TABLE sensor_data (
    time TIMESTAMPTZ NOT NULL,
    device_id INT NOT NULL,
    temp DECIMAL(5,2),
    humi DECIMAL(5,2),
    light INT,
    co2 INT,
    soil_moisture DECIMAL(5,2)[],
    ph DECIMAL(4,2),
    ec DECIMAL(5,2),
    relay_state BOOLEAN[]
);

CREATE TABLE control_log (
    time TIMESTAMPTZ NOT NULL,
    device_id INT NOT NULL,
    channel INT,
    state BOOLEAN,
    source VARCHAR(20) NOT NULL CHECK (source IN ('manual', 'rule', 'ai')),
    created_by INT
);

CREATE INDEX idx_sensor_data_device_id ON sensor_data(device_id, time DESC);
CREATE INDEX idx_control_log_device_id ON control_log(device_id, time DESC);
