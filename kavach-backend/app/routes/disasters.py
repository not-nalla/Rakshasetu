from fastapi import APIRouter, Depends, HTTPException, Query
from typing import Optional
from bson import ObjectId
from app.database import get_database
from app.dependencies import get_current_user, require_profile_completed
from app.models.disaster_record import DisasterOut

router = APIRouter(prefix="/disasters", tags=["disasters"])


@router.get("/types", response_model=list[str])
async def get_disaster_types(user: dict = Depends(require_profile_completed)):
    db = get_database()
    types = await db.disasters.distinct("type")
    return sorted(types)


@router.get("/years", response_model=list[str])
async def get_disaster_years(user: dict = Depends(require_profile_completed)):
    db = get_database()
    pipeline = [
        {"$project": {"year": {"$substr": ["$date", 0, 4]}}},
        {"$group": {"_id": "$year"}},
        {"$sort": {"_id": -1}},
    ]
    result = await db.disasters.aggregate(pipeline).to_list(100)
    return [r["_id"] for r in result if r["_id"]]


@router.get("", response_model=list[DisasterOut])
async def get_disasters(
    type: Optional[str] = Query(None),
    year: Optional[str] = Query(None),
    user: dict = Depends(require_profile_completed),
):
    db = get_database()
    query = {}
    if type and type != "All":
        query["type"] = type
    if year and year != "All":
        query["date"] = {"$regex": f"^{year}"}

    disasters = await db.disasters.find(query).to_list(1000)
    return [
        DisasterOut(
            id=str(d["_id"]),
            name=d["name"],
            type=d["type"],
            date=d["date"],
            district=d["district"],
            casualties=d.get("casualties", 0),
            displaced=d.get("displaced", 0),
            damageEstimate=d.get("damageEstimate", ""),
            summary=d.get("summary", ""),
        )
        for d in disasters
    ]


@router.get("/{disaster_id}", response_model=DisasterOut)
async def get_disaster(
    disaster_id: str,
    user: dict = Depends(require_profile_completed),
):
    db = get_database()
    try:
        disaster = await db.disasters.find_one({"_id": ObjectId(disaster_id)})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid disaster ID")

    if not disaster:
        raise HTTPException(status_code=404, detail="Disaster not found")

    return DisasterOut(
        id=str(disaster["_id"]),
        name=disaster["name"],
        type=disaster["type"],
        date=disaster["date"],
        district=disaster["district"],
        casualties=disaster.get("casualties", 0),
        displaced=disaster.get("displaced", 0),
        damageEstimate=disaster.get("damageEstimate", ""),
        summary=disaster.get("summary", ""),
    )
