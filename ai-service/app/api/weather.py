from fastapi import APIRouter, Query
from app.services.weather_service import weather_service

router = APIRouter(prefix="/api/weather", tags=["天气"])


@router.get("")
async def get_weather(city: str = Query("北京", description="城市名称")):
    return await weather_service.get_weather(city)
