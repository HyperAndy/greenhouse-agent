import json
from pathlib import Path
from typing import Optional
from app.models.crop import CropInfo, StageParams

DATA_DIR = Path(__file__).parent.parent / "data"


class CropService:
    def __init__(self):
        self._crops: dict[str, CropInfo] = {}
        self._load_crops()

    def _load_crops(self):
        crops_file = DATA_DIR / "crops.json"
        with open(crops_file, "r", encoding="utf-8") as f:
            data = json.load(f)
        for key, value in data.items():
            self._crops[key] = CropInfo(**value)

    def get_all_crops(self) -> list[dict]:
        return [
            {
                "name": crop.name,
                "display_name": crop.display_name,
                "category": crop.category,
                "stages": [s.name for s in crop.stages],
            }
            for crop in self._crops.values()
        ]

    def get_crop(self, crop_name: str) -> Optional[CropInfo]:
        return self._crops.get(crop_name.lower())

    def get_crop_stages(self, crop_name: str) -> list[str]:
        crop = self.get_crop(crop_name)
        if not crop:
            return []
        return [s.name for s in crop.stages]

    def recommend(self, crop_name: str, stage_name: str) -> Optional[dict]:
        crop = self.get_crop(crop_name)
        if not crop:
            return None

        target_stage = None
        for stage in crop.stages:
            if stage.name == stage_name:
                target_stage = stage
                break

        if not target_stage:
            return None

        tips = self._generate_tips(crop_name, stage_name)

        return {
            "crop": crop.display_name,
            "stage": target_stage.name,
            "params": target_stage.params.model_dump(),
            "tips": tips,
        }

    def _generate_tips(self, crop_name: str, stage_name: str) -> list[str]:
        tips_map = {
            "苗期": [
                "注意保持土壤湿润，避免积水",
                "适当通风，防止病害发生",
                "控制氮肥用量，促进根系发育",
            ],
            "开花期": [
                "保持适宜温差，促进花芽分化",
                "减少浇水频率，避免落花",
                "可适当补充硼肥，提高坐果率",
            ],
            "结果期": [
                "增加钾肥用量，促进果实膨大",
                "保持稳定的水分供应",
                "注意防治病虫害",
            ],
            "采收期": [
                "适当控水，提高果实品质",
                "及时采收，避免过熟",
                "采收后适当追肥，恢复植株",
            ],
        }
        return tips_map.get(stage_name, [])


crop_service = CropService()
