from pydantic import BaseModel, Field
from typing import Optional


class EnvironmentRange(BaseModel):
    min: float
    max: float
    unit: str


class StageParams(BaseModel):
    temperature: EnvironmentRange
    humidity: EnvironmentRange
    light: EnvironmentRange
    co2: EnvironmentRange


class CropStage(BaseModel):
    name: str
    duration_days: int
    params: StageParams


class CropInfo(BaseModel):
    name: str
    display_name: str
    category: str
    total_growth_days: int
    stages: list[CropStage]
    description: Optional[str] = None


class RecommendRequest(BaseModel):
    crop: str = Field(..., description="作物名称")
    stage: str = Field(..., description="生长阶段")


class RecommendResponse(BaseModel):
    crop: str
    stage: str
    params: StageParams
    tips: list[str]
