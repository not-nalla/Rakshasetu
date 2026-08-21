from fastapi import APIRouter, Depends
from app.database import get_database
from app.dependencies import require_profile_completed
from app.models.shelter import ShelterOut

router = APIRouter(prefix="/shelters", tags=["shelters"])


@router.get("", response_model=list[ShelterOut])
async def get_shelters(user: dict = Depends(require_profile_completed)):
    db = get_database()
    shelters = await db.shelters.find().to_list(100)
    return [
        ShelterOut(
            id=str(s["_id"]),
            name=s["name"],
            distance=s["distance"],
            occupancy=s.get("occupancy", 0),
            status=s.get("status", "Available"),
            lat=s["lat"],
            lng=s["lng"],
        )
        for s in shelters
    ]


@router.get("/nearest", response_model=ShelterOut | None)
async def get_nearest_shelter(user: dict = Depends(require_profile_completed)):
    db = get_database()
    shelter = await db.shelters.find_one()
    if not shelter:
        return None
    return ShelterOut(
        id=str(shelter["_id"]),
        name=shelter["name"],
        distance=shelter["distance"],
        occupancy=shelter.get("occupancy", 0),
        status=shelter.get("status", "Available"),
        lat=shelter["lat"],
        lng=shelter["lng"],
    )
