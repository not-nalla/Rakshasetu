from datetime import datetime, timezone
from app.database import get_database


async def check_event_deadlines():
    db = get_database()
    now = datetime.now(timezone.utc)
    result = await db.events.update_many(
        {"status": "upcoming", "date": {"$lt": now.strftime("%Y-%m-%d")}},
        {"$set": {"status": "completed"}},
    )
    return result.modified_count


async def check_expired_alerts():
    db = get_database()
    now = datetime.now(timezone.utc)
    result = await db.alerts.update_many(
        {
            "active": True,
            "expiresAt": {"$ne": None, "$lt": now.isoformat()},
        },
        {"$set": {"active": False}},
    )
    return result.modified_count
