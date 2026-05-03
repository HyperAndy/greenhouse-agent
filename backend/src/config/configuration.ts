export default () => ({
  port: parseInt(process.env.PORT || '3000', 10),
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'greenhouse123',
    database: process.env.DB_NAME || 'greenhouse',
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
  },
  mqtt: {
    url: process.env.MQTT_URL || 'mqtt://localhost:1883',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'greenhouse-secret-key-2026',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
});
