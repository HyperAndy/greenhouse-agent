from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from apscheduler.schedulers.asyncio import AsyncIOScheduler

from app.config import settings
from app.database import init_db, close_db
from app.api import recommend, weather, anomaly, health

scheduler = AsyncIOScheduler()


async def scheduled_task():
    pass


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    scheduler.add_job(scheduled_task, "interval", minutes=30)
    scheduler.start()
    yield
    scheduler.shutdown()
    await close_db()


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(recommend.router)
app.include_router(weather.router)
app.include_router(anomaly.router)
app.include_router(health.router)


@app.get("/")
async def root():
    return {"message": "Greenhouse AI Service", "version": settings.APP_VERSION}
