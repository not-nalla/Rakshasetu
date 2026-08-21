from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime
from typing import Optional, List


class EventCreate(BaseModel):
    title: str
    type: str
    description: str
    date: str
    time: str
    location: str
    district: str
    lat: float
    lng: float
    maxCapacity: int = 200
    tags: List[str] = []


class EventInDB(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    id: str = Field(alias="_id")
    title: str
    type: str
    description: str
    date: str
    time: str
    location: str
    district: str
    lat: float
    lng: float
    status: str = "upcoming"
    enrolledCount: int = 0
    maxCapacity: int = 200
    tags: List[str] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)


class EventOut(BaseModel):
    id: str
    title: str
    type: str
    description: str
    date: str
    time: str
    location: str
    district: str
    lat: float
    lng: float
    status: str
    enrolledCount: int
    maxCapacity: int
    tags: List[str]


class EventStats(BaseModel):
    total: int
    upcoming: int
    totalEnrolled: int
