from fastapi import APIRouter, HTTPException, Query
from app.services.crop_service import crop_service

router = APIRouter(prefix="/api/recommend", tags=["推荐"])


@router.get("/crops")
async def get_crops():
    return crop_service.get_all_crops()


@router.get("/{crop}")
async def get_recommend(crop: str, stage: str = Query(..., description="生长阶段")):
    result = crop_service.recommend(crop, stage)
    if not result:
        available_crops = [c["name"] for c in crop_service.get_all_crops()]
        if crop.lower() not in available_crops:
            raise HTTPException(status_code=404, detail=f"不支持的作物: {crop}")
        available_stages = crop_service.get_crop_stages(crop)
        raise HTTPException(
            status_code=404,
            detail=f"无效的生长阶段: {stage}，可选: {available_stages}",
        )
    return result
