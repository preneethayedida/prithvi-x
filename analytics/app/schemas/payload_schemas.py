from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class WeatherModel(BaseModel):
    temperature: float
    feelsLike: Optional[float] = None
    humidity: float
    rainfall: Optional[float] = 0.0
    windSpeed: Optional[float] = 0.0
    windDirection: Optional[float] = 0.0
    surfacePressure: Optional[float] = 1013.25
    uvIndex: Optional[float] = 0.0
    cloudCover: Optional[float] = 0.0

class AirQualityModel(BaseModel):
    aqi: Optional[float] = 50.0
    pm2_5: Optional[float] = 15.0
    pm10: Optional[float] = 30.0
    no2: Optional[float] = 10.0
    so2: Optional[float] = 5.0
    o3: Optional[float] = 30.0
    co: Optional[float] = 300.0

class ObservationItem(BaseModel):
    timestamp: Optional[Any] = None
    weather: Optional[WeatherModel] = None
    airQuality: Optional[AirQualityModel] = None
    temperature: Optional[float] = None
    humidity: Optional[float] = None
    rainfall: Optional[float] = None
    windSpeed: Optional[float] = None
    aqi: Optional[float] = None

class AnomalyRequest(BaseModel):
    current: Dict[str, Any]
    history: List[Dict[str, Any]] = []
    regionCode: str = "IN-AP-BVM"

class IndexRequest(BaseModel):
    weather: WeatherModel
    airQuality: Optional[AirQualityModel] = None

class TrendRequest(BaseModel):
    history: List[Dict[str, Any]]

class PredictRequest(BaseModel):
    history: List[Dict[str, Any]]
    metric: str = "temperature"
    horizonHours: int = 24
