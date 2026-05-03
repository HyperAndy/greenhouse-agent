-- 001_init_extensions.sql
-- 启用必要的PostgreSQL扩展

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pg_trgm;
