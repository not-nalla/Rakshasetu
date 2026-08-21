from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime


class RegistrationInDB(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    id: str = Field(alias="_id")
    user_id: str
    event_id: str
    registered_at: datetime = Field(default_factory=datetime.utcnow)


class RegistrationOut(BaseModel):
    id: str
    user_id: str
    event_id: str
    registered_at: datetime
