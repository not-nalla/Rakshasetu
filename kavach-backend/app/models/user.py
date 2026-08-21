from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime
from typing import Optional


class GoogleUserPayload(BaseModel):
    sub: str
    email: str
    name: str
    picture: Optional[str] = None


class SignupRequest(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: str = Field(..., pattern=r'^[^@]+@[^@]+\.[^@]+$')
    password: str = Field(..., min_length=6)
    role: str = Field(default="citizen", pattern="^(citizen|student|official)$")
    district: str
    language: str = Field(default="en", pattern="^(en|hi|mr)$")


class LoginRequest(BaseModel):
    email: str
    password: str


class UserInDB(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    id: str = Field(alias="_id")
    google_id: Optional[str] = None
    email: str
    name: str
    picture_url: Optional[str] = None
    password_hash: Optional[str] = None
    auth_provider: str = "email"
    role: Optional[str] = None
    district: Optional[str] = None
    language: Optional[str] = None
    profile_completed: bool = False
    created_at: datetime
    last_login_at: datetime


class UserOut(BaseModel):
    id: str
    email: str
    name: str
    picture_url: Optional[str] = None
    auth_provider: str
    role: Optional[str] = None
    district: Optional[str] = None
    language: Optional[str] = None
    profile_completed: bool
    created_at: datetime
    last_login_at: datetime


class CompleteProfileRequest(BaseModel):
    role: str = Field(..., pattern="^(citizen|student|official)$")
    district: str
    language: str = Field(default="en", pattern="^(en|hi|mr)$")
