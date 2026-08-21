from fastapi import APIRouter, Depends, HTTPException
from bson import ObjectId
from app.database import get_database
from app.dependencies import require_admin
from app.models.alert import AlertCreate, AlertOut
from app.models.event import EventCreate, EventOut

router = APIRouter(prefix="/admin", tags=["admin"])


@router.post("/alerts", response_model=AlertOut)
async def admin_trigger_alert(
    body: AlertCreate,
    user: dict = Depends(require_admin),
):
    db = get_database()
    from datetime import datetime
    alert_doc = {
        "title": body.title,
        "message": body.message,
        "severity": body.severity,
        "district": body.district,
        "active": True,
        "createdAt": datetime.utcnow(),
        "expiresAt": body.expiresAt,
    }
    result = await db.alerts.insert_one(alert_doc)
    alert_doc["_id"] = result.inserted_id
    return AlertOut(
        id=str(alert_doc["_id"]),
        title=alert_doc["title"],
        message=alert_doc["message"],
        severity=alert_doc["severity"],
        district=alert_doc["district"],
        active=alert_doc["active"],
        createdAt=alert_doc["createdAt"],
        expiresAt=alert_doc.get("expiresAt"),
    )


@router.post("/events", response_model=EventOut)
async def admin_publish_event(
    body: EventCreate,
    user: dict = Depends(require_admin),
):
    db = get_database()
    from datetime import datetime
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


@router.get("/alerts", response_model=list[AlertOut])
async def admin_get_all_alerts(user: dict = Depends(require_admin)):
    db = get_database()
    alerts = await db.alerts.find().sort("createdAt", -1).to_list(100)
    return [
        AlertOut(
            id=str(a["_id"]),
            title=a["title"],
            message=a["message"],
            severity=a["severity"],
            district=a["district"],
            active=a.get("active", True),
            createdAt=a["createdAt"],
            expiresAt=a.get("expiresAt"),
        )
        for a in alerts
    ]


@router.get("/events", response_model=list[EventOut])
async def admin_get_all_events(user: dict = Depends(require_admin)):
    db = get_database()
    events = await db.events.find().to_list(1000)
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


@router.get("/pending-approvals")
async def admin_get_pending_approvals(user: dict = Depends(require_admin)):
    db = get_database()
    pending = await db.pending_approvals.find(
        {"status": "pending"}
    ).to_list(50)
    return [
        {
            "id": str(p["_id"]),
            "type": p.get("type", ""),
            "title": p.get("title", ""),
            "submittedBy": p.get("submittedBy", ""),
            "submittedAt": p.get("submittedAt", ""),
            "status": p.get("status", "pending"),
        }
        for p in pending
    ]
