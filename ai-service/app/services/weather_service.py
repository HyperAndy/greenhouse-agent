import random
from typing import Optional


class WeatherService:
    def __init__(self):
        self._mock_enabled = True

    async def get_weather(self, city: str) -> dict:
        if self._mock_enabled:
            return self._get_mock_weather(city)
        return await self._get_real_weather(city)

    def _get_mock_weather(self, city: str) -> dict:
        base_temp = random.uniform(15, 35)
        return {
            "city": city,
            "temperature": round(base_temp, 1),
            "humidity": round(random.uniform(40, 85), 1),
            "description": random.choice(["晴", "多云", "阴", "小雨", "阵雨"]),
            "wind_speed": round(random.uniform(1, 15), 1),
            "forecast": [
                {
                    "date": f"2024-01-{15 + i}",
                    "temp_max": round(base_temp + random.uniform(2, 8), 1),
                    "temp_min": round(base_temp - random.uniform(2, 8), 1),
                    "description": random.choice(["晴", "多云", "阴", "小雨"]),
                }
                for i in range(3)
            ],
        }

    async def _get_real_weather(self, city: str) -> dict:
        import httpx
        from app.config import settings

        async with httpx.AsyncClient() as client:
            resp = await client.get(
                f"{settings.WEATHER_API_BASE}/forecast.json",
                params={
                    "key": settings.WEATHER_API_KEY,
                    "q": city,
                    "days": 3,
                    "lang": "zh",
                },
            )
            resp.raise_for_status()
            data = resp.json()

            return {
                "city": data["location"]["name"],
                "temperature": data["current"]["temp_c"],
                "humidity": data["current"]["humidity"],
                "description": data["current"]["condition"]["text"],
                "wind_speed": data["current"]["wind_kph"],
                "forecast": [
                    {
                        "date": day["date"],
                        "temp_max": day["day"]["maxtemp_c"],
                        "temp_min": day["day"]["mintemp_c"],
                        "description": day["day"]["condition"]["text"],
                    }
                    for day in data["forecast"]["forecastday"]
                ],
            }


weather_service = WeatherService()
