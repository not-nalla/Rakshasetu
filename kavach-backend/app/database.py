import motor.motor_asyncio
from app.config import get_settings

settings = get_settings()

client = motor.motor_asyncio.AsyncIOMotorClient(settings.MONGO_URI)
db = client.kavach


def get_database():
    return db


async def create_indexes():
    await db.users.create_index(
        "google_id",
        unique=True,
        partialFilterExpression={"google_id": {"$exists": True, "$type": "string"}},
    )
    await db.users.create_index("email", unique=True)
    await db.users.create_index("district")

    await db.events.create_index("district")
    await db.events.create_index("type")
    await db.events.create_index("status")

    await db.alerts.create_index("active")
    await db.alerts.create_index("district")

    await db.authorities.create_index("district")
    await db.registrations.create_index([("user_id", 1), ("event_id", 1)], unique=True)
    await db.registrations.create_index("user_id")
    await db.registrations.create_index("event_id")
