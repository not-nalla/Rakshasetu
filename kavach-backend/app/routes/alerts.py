from fastapi import APIRouter, Depends, HTTPException
from typing import Optional
from bson import ObjectId
from datetime import datetime
from app.database import get_database
from app.dependencies import get_current_user, require_profile_completed, require_admin
from app.models.alert import AlertCreate, AlertOut

router = APIRouter(prefix="/alerts", tags=["alerts"])


@router.get("/active", response_model=Optional[AlertOut])
async def get_active_alert(user: dict = Depends(require_profile_completed)):
    db = get_database()
    alert = await db.alerts.find_one(
        {"active": True},
        sort=[("createdAt", -1)],
    )
    if not alert:
        return None
    return AlertOut(
        id=str(alert["_id"]),
        title=alert["title"],
        message=alert["message"],
        severity=alert["severity"],
        district=alert["district"],
        active=alert.get("active", True),
        createdAt=alert["createdAt"],
        expiresAt=alert.get("expiresAt"),
    )


@router.get("", response_model=list[AlertOut])
async def get_all_alerts(user: dict = Depends(require_profile_completed)):
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


@router.post("", response_model=AlertOut)
async def trigger_alert(
    body: AlertCreate,
    user: dict = Depends(require_admin),
):
    db = get_database()
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


@router.put("/{alert_id}/dismiss")
async def dismiss_alert(
    alert_id: str,
    user: dict = Depends(require_admin),
):
    db = get_database()
    try:
        result = await db.alerts.update_one(
            {"_id": ObjectId(alert_id)},
            {"$set": {"active": False}},
        )
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid alert ID")

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Alert not found")

    return {"message": "Alert dismissed"}
