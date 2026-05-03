-- 007_create_alert_tables.sql
-- 告警表

CREATE TABLE alert (
    id SERIAL PRIMARY KEY,
    greenhouse_id INT NOT NULL REFERENCES greenhouse(id) ON DELETE CASCADE,
    device_id INT REFERENCES device(id) ON DELETE SET NULL,
    rule_id INT REFERENCES control_rule(id) ON DELETE SET NULL,
    level VARCHAR(20) NOT NULL CHECK (level IN ('info', 'warning', 'critical')),
    title VARCHAR(200) NOT NULL,
    message TEXT,
    acknowledged BOOLEAN DEFAULT false,
    acknowledged_by INT REFERENCES users(id) ON DELETE SET NULL,
    acknowledged_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_alert_greenhouse_id ON alert(greenhouse_id);
CREATE INDEX idx_alert_device_id ON alert(device_id);
CREATE INDEX idx_alert_level ON alert(level);
CREATE INDEX idx_alert_acknowledged ON alert(acknowledged);
CREATE INDEX idx_alert_created_at ON alert(created_at DESC);
