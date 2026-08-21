from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime
from typing import Optional


class AlertCreate(BaseModel):
    title: str
    message: str
    severity: str = "info"
    district: str
    expiresAt: Optional[str] = None


class AlertInDB(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    id: str = Field(alias="_id")
    title: str
    message: str
    severity: str
    district: str
    active: bool = True
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    expiresAt: Optional[str] = None


class AlertOut(BaseModel):
    id: str
    title: str
    message: str
    severity: str
    district: str
    active: bool
    createdAt: datetime
    expiresAt: Optional[str] = None
