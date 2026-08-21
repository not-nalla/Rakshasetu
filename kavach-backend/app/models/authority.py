from pydantic import BaseModel, Field, ConfigDict
from typing import Optional


class AuthorityInDB(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    id: str = Field(alias="_id")
    name: str
    role: str
    department: str
    phone: str
    email: str
    district: str


class AuthorityOut(BaseModel):
    id: str
    name: str
    role: str
    department: str
    phone: str
    email: str
    district: str
