from pydantic import BaseModel, Field, ConfigDict


class ShelterInDB(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    id: str = Field(alias="_id")
    name: str
    distance: str
    occupancy: int = 0
    status: str = "Available"
    lat: float
    lng: float


class ShelterOut(BaseModel):
    id: str
    name: str
    distance: str
    occupancy: int
    status: str
    lat: float
    lng: float
