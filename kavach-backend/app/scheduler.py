from apscheduler.schedulers.asyncio import AsyncIOScheduler
from app.services.reminder_service import check_expired_alerts, check_event_deadlines
from app.services.sachet_service import fetch_sachet_alerts
from app.database import get_database
from datetime import datetime


scheduler = AsyncIOScheduler()


async def job_check_expired_alerts():
    count = await check_expired_alerts()
    if count:
        print(f"[Scheduler] Expired {count} alerts")


async def job_check_event_deadlines():
    count = await check_event_deadlines()
    if count:
        print(f"[Scheduler] Completed {count} past events")


async def job_fetch_sachet_alerts():
    new_alerts = await fetch_sachet_alerts()
    if new_alerts:
        db = get_database()
        for alert in new_alerts:
            existing = await db.alerts.find_one({"title": alert["title"]})
            if not existing:
                await db.alerts.insert_one(alert)
        print(f"[Scheduler] Fetched {len(new_alerts)} SACHET alerts")


def start_scheduler():
    scheduler.add_job(job_check_expired_alerts, "interval", minutes=5)
    scheduler.add_job(job_check_event_deadlines, "interval", minutes=10)
    scheduler.add_job(job_fetch_sachet_alerts, "interval", minutes=15)
    scheduler.start()
    print("[Scheduler] Started background jobs")


def stop_scheduler():
    if scheduler.running:
        scheduler.shutdown()
        print("[Scheduler] Stopped")
