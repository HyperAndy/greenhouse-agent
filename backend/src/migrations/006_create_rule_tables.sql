-- 006_create_rule_tables.sql
-- 控制规则表

CREATE TABLE control_rule (
    id SERIAL PRIMARY KEY,
    greenhouse_id INT NOT NULL REFERENCES greenhouse(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    trigger_config JSONB NOT NULL,
    actions JSONB NOT NULL,
    enabled BOOLEAN DEFAULT true,
    priority INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_control_rule_greenhouse_id ON control_rule(greenhouse_id);
CREATE INDEX idx_control_rule_enabled ON control_rule(enabled);
CREATE INDEX idx_control_rule_priority ON control_rule(priority DESC);
