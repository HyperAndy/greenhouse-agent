-- 008_create_operation_log.sql
-- 操作日志表

CREATE TABLE operation_log (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE SET NULL,
    device_id INT REFERENCES device(id) ON DELETE SET NULL,
    action VARCHAR(50) NOT NULL,
    detail JSONB DEFAULT '{}',
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_operation_log_user_id ON operation_log(user_id);
CREATE INDEX idx_operation_log_device_id ON operation_log(device_id);
CREATE INDEX idx_operation_log_action ON operation_log(action);
CREATE INDEX idx_operation_log_created_at ON operation_log(created_at DESC);
