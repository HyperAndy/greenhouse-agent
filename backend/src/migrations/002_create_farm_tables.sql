-- 002_create_farm_tables.sql
-- 农场和大棚表

CREATE TABLE farm (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    address VARCHAR(255),
    location POINT,
    contact_phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE greenhouse (
    id SERIAL PRIMARY KEY,
    farm_id INT NOT NULL REFERENCES farm(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    area DECIMAL(10,2),
    crop_type VARCHAR(50),
    growth_stage VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_greenhouse_farm_id ON greenhouse(farm_id);
CREATE INDEX idx_farm_name ON farm USING gin(name gin_trgm_ops);
