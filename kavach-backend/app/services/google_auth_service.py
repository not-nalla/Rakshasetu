import httpx
from datetime import datetime, timezone
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from app.config import get_settings
from app.database import get_database
from app.models.user import GoogleUserPayload

settings = get_settings()

GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth"
GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token"
GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v3/userinfo"


def get_google_auth_url() -> str:
    params = {
        "client_id": settings.GOOGLE_CLIENT_ID,
        "redirect_uri": settings.GOOGLE_REDIRECT_URI,
        "response_type": "code",
        "scope": "openid email profile",
        "access_type": "offline",
        "prompt": "consent",
    }
    query = "&".join(f"{k}={v}" for k, v in params.items())
    return f"{GOOGLE_AUTH_URL}?{query}"


async def exchange_code_for_tokens(code: str) -> dict:
    async with httpx.AsyncClient() as client:
        response = await client.post(
            GOOGLE_TOKEN_URL,
            data={
                "code": code,
                "client_id": settings.GOOGLE_CLIENT_ID,
                "client_secret": settings.GOOGLE_CLIENT_SECRET,
                "redirect_uri": settings.GOOGLE_REDIRECT_URI,
                "grant_type": "authorization_code",
            },
        )
        response.raise_for_status()
        return response.json()


def verify_id_token(id_token_str: str) -> GoogleUserPayload:
    idinfo = id_token.verify_oauth2_token(
        id_token_str,
        google_requests.Request(),
        settings.GOOGLE_CLIENT_ID,
        clock_skew_in_seconds=300,
    )
    return GoogleUserPayload(
        sub=idinfo["sub"],
        email=idinfo["email"],
        name=idinfo.get("name", ""),
        picture=idinfo.get("picture"),
    )


async def get_or_create_user(google_user: GoogleUserPayload) -> dict:
    db = get_database()
    now = datetime.now(timezone.utc)

    existing = await db.users.find_one({"google_id": google_user.sub})
    if existing:
        await db.users.update_one(
            {"_id": existing["_id"]},
            {"$set": {"last_login_at": now, "picture_url": google_user.picture}},
        )
        existing["last_login_at"] = now
        existing["picture_url"] = google_user.picture
        return existing

    user_doc = {
        "google_id": google_user.sub,
        "email": google_user.email,
        "name": google_user.name,
        "picture_url": google_user.picture,
        "role": None,
        "district": None,
        "language": None,
        "profile_completed": False,
        "created_at": now,
        "last_login_at": now,
    }
    result = await db.users.insert_one(user_doc)
    user_doc["_id"] = result.inserted_id
    return user_doc
