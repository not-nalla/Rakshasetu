from pydantic import BaseModel, Field, ConfigDict


class DisasterInDB(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    id: str = Field(alias="_id")
    name: str
    type: str
    date: str
    district: str
    casualties: int = 0
    displaced: int = 0
    damageEstimate: str = ""
    summary: str = ""


class DisasterOut(BaseModel):
    id: str
    name: str
    type: str
    date: str
    district: str
    casualties: int
    displaced: int
    damageEstimate: str
    summary: str
