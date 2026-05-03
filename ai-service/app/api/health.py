from fastapi import APIRouter
from sqlalchemy import text
from app.models.recommend import HealthResponse
from app.config import settings

router = APIRouter(tags=["健康检查"])


@router.get("/api/health", response_model=HealthResponse)
async def health_check():
    db_status = "connected"
    redis_status = "connected"

    try:
        from app.database import engine
        async with engine.connect() as conn:
            await conn.execute(text("SELECT 1"))
    except Exception:
        db_status = "disconnected"

    try:
        import redis.asyncio as aioredis
        r = aioredis.from_url(settings.REDIS_URL)
        await r.ping()
        await r.close()
    except Exception:
        redis_status = "disconnected"

    return HealthResponse(
        status="healthy" if db_status == "connected" else "degraded",
        version=settings.APP_VERSION,
        database=db_status,
        redis=redis_status,
    )
