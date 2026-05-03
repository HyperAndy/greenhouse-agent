from fastapi import APIRouter
from app.models.recommend import SensorData, AnomalyResult
from app.services.anomaly_service import anomaly_service

router = APIRouter(prefix="/api/anomaly", tags=["异常检测"])


@router.post("/check", response_model=AnomalyResult)
async def check_anomaly(data: SensorData):
    return anomaly_service.detect_anomaly(data)
