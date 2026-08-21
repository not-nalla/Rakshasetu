from fastapi import APIRouter, Depends
from app.database import get_database
from app.dependencies import require_profile_completed

router = APIRouter(prefix="/home", tags=["home"])


@router.get("/stats")
async def get_home_stats(user: dict = Depends(require_profile_completed)):
    db = get_database()

    events_total = await db.events.count_documents({})
    events_upcoming = await db.events.count_documents({"status": "upcoming"})
    pipeline = [{"$group": {"_id": None, "total": {"$sum": "$enrolledCount"}}}]
    result = await db.events.aggregate(pipeline).to_list(1)
    total_enrolled = result[0]["total"] if result else 0

    alerts_active = await db.alerts.count_documents({"active": True})
    shelters_count = await db.shelters.count_documents({})

    return {
        "total": events_total,
        "upcoming": events_upcoming,
        "totalEnrolled": total_enrolled,
        "activeAlerts": alerts_active,
        "reliefCampsNearby": shelters_count,
    }
