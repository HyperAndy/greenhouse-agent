from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    APP_NAME: str = "Greenhouse AI Service"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True

    DATABASE_URL: str = ""
    REDIS_URL: str = "redis://localhost:6379/0"

    WEATHER_API_KEY: str = ""
    WEATHER_API_BASE: str = "https://api.weatherapi.com/v1"

    CORS_ORIGINS: list[str] = ["*"]

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


@lru_cache()
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
