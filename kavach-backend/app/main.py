from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.config import get_settings
from app.database import create_indexes
from app.scheduler import start_scheduler, stop_scheduler
from app.routes import auth, events, alerts, authorities, disasters, admin, shelters, home, ai

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("[Startup] Creating database indexes...")
    await create_indexes()
    print("[Startup] Starting scheduler...")
    start_scheduler()
    yield
    print("[Shutdown] Stopping scheduler...")
    stop_scheduler()


app = FastAPI(
    title="Kavach API",
    description="Disaster Awareness & Preparedness Backend",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(events.router)
app.include_router(alerts.router)
app.include_router(authorities.router)
app.include_router(disasters.router)
app.include_router(admin.router)
app.include_router(shelters.router)
app.include_router(home.router)
app.include_router(ai.router)


@app.get("/")
async def root():
    return {"message": "Kavach API is running", "docs": "/docs"}


@app.get("/health")
async def health():
    return {"status": "ok"}
