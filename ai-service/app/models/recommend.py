from pydantic import BaseModel
from typing import Optional


class SensorData(BaseModel):
    temperature: float
    humidity: float
    co2: float
    light: Optional[float] = None
    soil_moisture: Optional[float] = None


class AnomalyResult(BaseModel):
    is_anomaly: bool
    anomalies: list[str]
    severity: str
    suggestions: list[str]


class WeatherInfo(BaseModel):
    city: str
    temperature: float
    humidity: float
    description: str
    wind_speed: float
    forecast: list[dict]


class HealthResponse(BaseModel):
    status: str
    version: str
    database: str
    redis: str
