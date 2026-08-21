from fastapi import APIRouter, Depends, HTTPException, Query
from typing import Optional
from bson import ObjectId
from app.database import get_database
from app.dependencies import get_current_user, require_profile_completed
from app.models.authority import AuthorityOut

router = APIRouter(prefix="/authorities", tags=["authorities"])


@router.get("", response_model=list[AuthorityOut])
async def get_authorities(
    district: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    user: dict = Depends(require_profile_completed),
):
    db = get_database()
    query = {}
    if district:
        query["district"] = {"$regex": district, "$options": "i"}
    if search:
        regex = {"$regex": search, "$options": "i"}
        query["$or"] = [
            {"name": regex},
            {"role": regex},
            {"department": regex},
        ]

    authorities = await db.authorities.find(query).to_list(100)
    return [
        AuthorityOut(
            id=str(a["_id"]),
            name=a["name"],
            role=a["role"],
            department=a["department"],
            phone=a["phone"],
            email=a["email"],
            district=a["district"],
        )
        for a in authorities
    ]


@router.get("/{authority_id}", response_model=AuthorityOut)
async def get_authority(
    authority_id: str,
    user: dict = Depends(require_profile_completed),
):
    db = get_database()
    try:
        authority = await db.authorities.find_one({"_id": ObjectId(authority_id)})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid authority ID")

    if not authority:
        raise HTTPException(status_code=404, detail="Authority not found")

    return AuthorityOut(
        id=str(authority["_id"]),
        name=authority["name"],
        role=authority["role"],
        department=authority["department"],
        phone=authority["phone"],
        email=authority["email"],
        district=authority["district"],
    )
