# Greenhouse Agent

[中文文档](README_CN.md)

An intelligent IoT platform for automated greenhouse monitoring and control, powered by AI agents. Provides real-time sensor data collection, intelligent control rules, AI-powered recommendations, and multi-tenant management.

## Features

- **Real-time Monitoring** — Temperature, humidity, light, CO2, soil moisture, pH, EC
- **Automated Control** — Rule-based relay control for fans, irrigation, shading, lighting
- **AI Recommendations** — Crop-specific parameter suggestions based on growth stage
- **Multi-tenant** — Farm-level data isolation with role-based access control
- **Multiple Clients** — WeChat Mini Program, Web Admin Dashboard, Large Screen Display
- **Edge Computing** — ESP32 local control with offline fallback capability

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        User Layer                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Mini Program │  │  Web Admin   │  │  Dashboard   │      │
│  │  (Farmers)   │  │  (Managers)  │  │  (Monitoring)│      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
└─────────┼─────────────────┼─────────────────┼───────────────┘
          │                 │                 │
          ▼                 ▼                 ▼
┌─────────────────────────────────────────────────────────────┐
│                     Cloud Platform                          │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐            │
│  │  NestJS API│  │  EMQX MQTT │  │  FastAPI AI│            │
│  └────────────┘  └────────────┘  └────────────┘            │
│  ┌────────────────────────────────────────────┐            │
│  │  PostgreSQL + Redis                        │            │
│  └────────────────────────────────────────────┘            │
└─────────────────────────────────────────────────────────────┘
          │ MQTT
          ▼
┌─────────────────────────────────────────────────────────────┐
│                     Edge Layer                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  ESP32 #1    │  │  ESP32 #2    │  │  ESP32 #N    │      │
│  │  Sensors     │  │  Sensors     │  │  Sensors     │      │
│  │  Relays      │  │  Relays      │  │  Relays      │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | NestJS, TypeScript, TypeORM |
| AI Service | Python, FastAPI, SQLAlchemy |
| Database | PostgreSQL, Redis |
| MQTT | EMQX |
| Frontend | Vue 3, Element Plus, ECharts |
| Mini Program | uni-app, Vue 3 |
| Edge | ESP32, MicroPython |
| Deployment | Docker Compose |

## Project Structure

```
greenhouse/
├── backend/              # NestJS API server
│   ├── src/
│   │   ├── modules/      # Business modules
│   │   │   ├── auth/     # Authentication
│   │   │   ├── farm/     # Farm & Greenhouse
│   │   │   ├── device/   # Device management
│   │   │   ├── sensor/   # Sensor data
│   │   │   ├── rule/     # Control rules
│   │   │   ├── alert/    # Alert system
│   │   │   └── control/  # Device control
│   │   └── common/       # Shared modules
│   └── Dockerfile
├── ai-service/           # Python AI service
│   ├── app/
│   │   ├── api/          # API routes
│   │   ├── services/     # Business logic
│   │   └── data/         # Crop database
│   └── Dockerfile
├── admin/                # Web admin dashboard
│   └── src/
│       ├── views/        # Page components
│       ├── api/          # API calls
│       └── store/        # State management
├── dashboard/            # Large screen display
│   └── src/
│       ├── components/   # Dashboard widgets
│       └── views/        # Main view
├── miniapp/              # WeChat Mini Program
│   └── src/
│       ├── pages/        # Pages
│       └── components/   # Components
├── mock/                 # Mock data generator
├── docker-compose.yml    # Docker orchestration
└── nginx/                # Nginx config
```

## Quick Start

### Prerequisites

- Docker & Docker Compose
- Node.js 18+ (for local development)
- Python 3.11+ (for AI service development)

### 1. Clone & Configure

```bash
git clone https://github.com/HyperAndy/greenhouse-agent.git
cd greenhouse-agent
cp .env.example .env
```

### 2. Start Infrastructure

```bash
docker-compose up -d postgres redis emqx
```

### 3. Start Backend Services

```bash
docker-compose up -d backend ai-service
```

### 4. Start Frontend (Development)

```bash
# Admin Dashboard
cd admin
npm install
npm run dev    # http://localhost:3001

# Large Screen Display
cd dashboard
npm install
npm run dev    # http://localhost:3200
```

### 5. Start Mock Data

```bash
cd mock
npm install
npm start
```

### 6. Access Services

| Service | URL | Credentials |
|---------|-----|-------------|
| Admin Dashboard | http://localhost:3001 | 13800138000 / admin123 |
| Large Screen | http://localhost:3200 | - |
| API Server | http://localhost:3000 | - |
| AI Service Docs | http://localhost:8000/docs | - |
| EMQX Dashboard | http://localhost:18083 | admin / public |

## API Documentation

### Authentication

```bash
# Register
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"phone":"13800138001","password":"test123","name":"Test User"}'

# Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"phone":"13800138000","password":"admin123"}'

# Get Profile (with token)
curl http://localhost:3000/auth/profile \
  -H "Authorization: Bearer <token>"
```

### Farm Management

```bash
# Create Farm
curl -X POST http://localhost:3000/farms \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"name":"Demo Farm","address":"Beijing"}'

# List Farms
curl http://localhost:3000/farms \
  -H "Authorization: Bearer <token>"
```

### Sensor Data

```bash
# Get Latest Data
curl http://localhost:3000/sensor/gh-001/latest \
  -H "Authorization: Bearer <token>"

# Get History
curl "http://localhost:3000/sensor/gh-001/history?start=2026-05-01&end=2026-05-03" \
  -H "Authorization: Bearer <token>"
```

### AI Recommendations

```bash
# Get Crop Recommendations
curl http://localhost:8000/api/recommend/tomato?stage=flowering

# Health Check
curl http://localhost:8000/health
```

## MQTT Protocol

### Topic Structure

```
greenhouse/{greenhouse_id}/sensor/data     # Sensor data upload
greenhouse/{greenhouse_id}/control/set     # Control commands
greenhouse/{greenhouse_id}/control/ack     # Control acknowledgment
greenhouse/{greenhouse_id}/status          # Device status
```

### Sensor Data Format

```json
{
  "temp": 28.5,
  "humi": 65.2,
  "light": 45000,
  "co2": 800,
  "soil_moisture": [45.0, 42.0],
  "ph": 6.8,
  "ec": 1.2,
  "relay_state": [true, false, true, false, false, false, false, false]
}
```

## Database Schema

### Core Tables

- `users` — User accounts with role-based access
- `farms` — Farm organizations
- `greenhouses` — Greenhouse units within farms
- `devices` — IoT devices (ESP32 controllers)
- `sensor_data` — Time-series sensor readings
- `control_rules` — Automation rules
- `alerts` — System alerts
- `control_logs` — Device control history

### Default Seed Data

After first run, the following test data is available:

- **Farm:** Demo Farm
- **Greenhouses:** Tomato, Cucumber, Pepper
- **User:** admin / admin123 (phone: 13800138000)

## Development

### Backend Development

```bash
cd backend
npm install
npm run start:dev    # Hot reload on port 3000
```

### AI Service Development

```bash
cd ai-service
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### Database Migrations

```bash
# Run migrations
npm run migration:run

# Generate new migration
npm run migration:generate -- src/migrations/NewMigration
```

## Deployment

### Production Build

```bash
# Build all services
docker-compose build

# Start in production mode
docker-compose up -d
```

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `DB_HOST` | localhost | PostgreSQL host |
| `DB_PORT` | 5432 | PostgreSQL port |
| `DB_USERNAME` | postgres | Database user |
| `DB_PASSWORD` | greenhouse123 | Database password |
| `DB_NAME` | greenhouse | Database name |
| `REDIS_HOST` | localhost | Redis host |
| `MQTT_URL` | mqtt://localhost:1883 | MQTT broker URL |
| `JWT_SECRET` | greenhouse-secret-key-2026 | JWT signing key |

## Roadmap

- [x] Phase 1: Core platform with mock data
- [ ] Phase 2: Web admin & AI service
- [ ] Phase 3: ESP32 firmware
- [ ] Phase 4: WeChat Mini Program integration
- [ ] Phase 5: Production deployment & CI/CD
- [ ] Phase 6: Advanced AI features (yield prediction, disease detection)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- Documentation: `/docs`
- Issues: GitHub Issues
- Email: support@example.com
