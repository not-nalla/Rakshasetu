from fastapi import APIRouter, Depends, HTTPException, Query
from typing import Optional
from bson import ObjectId
from datetime import datetime
from app.database import get_database
from app.dependencies import get_current_user, require_profile_completed, require_admin
from app.models.event import EventCreate, EventOut, EventStats

router = APIRouter(prefix="/events", tags=["events"])


@router.get("", response_model=list[EventOut])
async def get_events(
    type: Optional[str] = Query(None),
    district: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    user: dict = Depends(require_profile_completed),
):
    db = get_database()
    query = {}
    if type and type != "All":
        query["type"] = type
    if district:
        query["district"] = {"$regex": district, "$options": "i"}
    if status:
        query["status"] = status

    events = await db.events.find(query).to_list(1000)
    return [
        EventOut(
            id=str(e["_id"]),
            title=e["title"],
            type=e["type"],
            description=e["description"],
            date=e["date"],
            time=e["time"],
            location=e["location"],
            district=e["district"],
            lat=e["lat"],
            lng=e["lng"],
            status=e.get("status", "upcoming"),
            enrolledCount=e.get("enrolledCount", 0),
            maxCapacity=e.get("maxCapacity", 200),
            tags=e.get("tags", []),
        )
        for e in events
    ]


@router.get("/stats", response_model=EventStats)
async def get_event_stats(user: dict = Depends(require_profile_completed)):
    db = get_database()
    total = await db.events.count_documents({})
    upcoming = await db.events.count_documents({"status": "upcoming"})
    pipeline = [{"$group": {"_id": None, "totalEnrolled": {"$sum": "$enrolledCount"}}}]
    result = await db.events.aggregate(pipeline).to_list(1)
    total_enrolled = result[0]["totalEnrolled"] if result else 0
    return EventStats(total=total, upcoming=upcoming, totalEnrolled=total_enrolled)


@router.get("/drills/upcoming", response_model=list[EventOut])
async def get_upcoming_drills(user: dict = Depends(require_profile_completed)):
    db = get_database()
    events = await db.events.find(
        {"type": "Mock Drill", "status": "upcoming"}
    ).to_list(100)
    return [
        EventOut(
            id=str(e["_id"]),
            title=e["title"],
            type=e["type"],
            description=e["description"],
            date=e["date"],
            time=e["time"],
            location=e["location"],
            district=e["district"],
            lat=e["lat"],
            lng=e["lng"],
            status=e.get("status", "upcoming"),
            enrolledCount=e.get("enrolledCount", 0),
            maxCapacity=e.get("maxCapacity", 200),
            tags=e.get("tags", []),
        )
        for e in events
    ]


@router.get("/{event_id}", response_model=EventOut)
async def get_event(event_id: str, user: dict = Depends(require_profile_completed)):
    db = get_database()
    try:
        event = await db.events.find_one({"_id": ObjectId(event_id)})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid event ID")

    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    return EventOut(
        id=str(event["_id"]),
        title=event["title"],
        type=event["type"],
        description=event["description"],
        date=event["date"],
        time=event["time"],
        location=event["location"],
        district=event["district"],
        lat=event["lat"],
        lng=event["lng"],
        status=event.get("status", "upcoming"),
        enrolledCount=event.get("enrolledCount", 0),
        maxCapacity=event.get("maxCapacity", 200),
        tags=event.get("tags", []),
    )


@router.post("/{event_id}/register")
async def register_for_event(
    event_id: str,
    user: dict = Depends(require_profile_completed),
):
    db = get_database()
    try:
        event = await db.events.find_one({"_id": ObjectId(event_id)})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid event ID")

    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    existing = await db.registrations.find_one(
        {"user_id": str(user["_id"]), "event_id": event_id}
    )
    if existing:
        raise HTTPException(status_code=400, detail="Already registered for this event")

    await db.registrations.insert_one(
        {
            "user_id": str(user["_id"]),
            "event_id": event_id,
            "registered_at": datetime.utcnow(),
        }
    )

    await db.events.update_one(
        {"_id": ObjectId(event_id)},
        {"$inc": {"enrolledCount": 1}},
    )

    updated = await db.events.find_one({"_id": ObjectId(event_id)})
    return EventOut(
        id=str(updated["_id"]),
        title=updated["title"],
        type=updated["type"],
        description=updated["description"],
        date=updated["date"],
        time=updated["time"],
        location=updated["location"],
        district=updated["district"],
        lat=updated["lat"],
        lng=updated["lng"],
        status=updated.get("status", "upcoming"),
        enrolledCount=updated.get("enrolledCount", 0),
        maxCapacity=updated.get("maxCapacity", 200),
        tags=updated.get("tags", []),
    )


@router.post("", response_model=EventOut)
async def create_event(
    body: EventCreate,
    user: dict = Depends(require_admin),
):
    db = get_database()
    event_doc = {
        "title": body.title,
        "type": body.type,
        "description": body.description,
        "date": body.date,
        "time": body.time,
        "location": body.location,
        "district": body.district,
        "lat": body.lat,
        "lng": body.lng,
        "status": "upcoming",
        "enrolledCount": 0,
        "maxCapacity": body.maxCapacity,
        "tags": body.tags,
        "created_at": datetime.utcnow(),
    }
    result = await db.events.insert_one(event_doc)
    event_doc["_id"] = result.inserted_id

    return EventOut(
        id=str(event_doc["_id"]),
        title=event_doc["title"],
        type=event_doc["type"],
        description=event_doc["description"],
        date=event_doc["date"],
        time=event_doc["time"],
        location=event_doc["location"],
        district=event_doc["district"],
        lat=event_doc["lat"],
        lng=event_doc["lng"],
        status=event_doc["status"],
        enrolledCount=event_doc["enrolledCount"],
        maxCapacity=event_doc["maxCapacity"],
        tags=event_doc["tags"],
    )
