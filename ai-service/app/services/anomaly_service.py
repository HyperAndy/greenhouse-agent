from app.models.recommend import SensorData, AnomalyResult


class AnomalyService:
    THRESHOLDS = {
        "temperature": {"min": 0, "max": 40, "warning_min": 5, "warning_max": 35},
        "humidity": {"min": 20, "max": 95, "warning_min": 30, "warning_max": 90},
        "co2": {"min": 0, "max": 2000, "warning_min": 200, "warning_max": 1500},
        "light": {"min": 0, "max": 100000, "warning_min": 1000, "warning_max": 80000},
        "soil_moisture": {"min": 0, "max": 100, "warning_min": 20, "warning_max": 90},
    }

    def detect_anomaly(self, sensor_data: SensorData) -> AnomalyResult:
        anomalies = []
        severity = "normal"
        suggestions = []

        checks = [
            ("temperature", sensor_data.temperature),
            ("humidity", sensor_data.humidity),
            ("co2", sensor_data.co2),
        ]
        if sensor_data.light is not None:
            checks.append(("light", sensor_data.light))
        if sensor_data.soil_moisture is not None:
            checks.append(("soil_moisture", sensor_data.soil_moisture))

        for param, value in checks:
            threshold = self.THRESHOLDS.get(param)
            if not threshold:
                continue

            if value < threshold["min"] or value > threshold["max"]:
                anomalies.append(f"{param}超出安全范围: {value}")
                severity = "critical"
                suggestions.append(self._get_suggestion(param, "critical", value))
            elif value < threshold["warning_min"] or value > threshold["warning_max"]:
                anomalies.append(f"{param}接近警戒值: {value}")
                if severity != "critical":
                    severity = "warning"
                suggestions.append(self._get_suggestion(param, "warning", value))

        return AnomalyResult(
            is_anomaly=len(anomalies) > 0,
            anomalies=anomalies,
            severity=severity,
            suggestions=suggestions,
        )

    def _get_suggestion(self, param: str, level: str, value: float) -> str:
        suggestions = {
            "temperature": {
                "critical": "温度异常！请立即检查温控设备" if value > 40 else "温度过低！请启动加热设备",
                "warning": "温度接近警戒值，请关注温控系统",
            },
            "humidity": {
                "critical": "湿度异常！请检查通风和加湿设备" if value > 95 else "湿度过低！请增加喷灌",
                "warning": "湿度接近警戒值，请关注环境调控",
            },
            "co2": {
                "critical": "CO2浓度过高！请立即通风换气",
                "warning": "CO2浓度偏高，建议适当通风",
            },
            "light": {
                "critical": "光照异常！请检查补光系统",
                "warning": "光照不足，建议开启补光灯",
            },
            "soil_moisture": {
                "critical": "土壤湿度异常！请检查灌溉系统" if value > 90 else "土壤过干！请立即灌溉",
                "warning": "土壤湿度偏低，建议适当灌溉",
            },
        }
        return suggestions.get(param, {}).get(level, "请检查相关设备")


anomaly_service = AnomalyService()
