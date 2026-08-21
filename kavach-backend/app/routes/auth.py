from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import RedirectResponse
from datetime import datetime, timezone
from bson import ObjectId
from app.config import get_settings
from app.database import get_database
from app.auth_utils import create_access_token
from app.dependencies import get_current_user
from app.password import hash_password, verify_password
from app.services.google_auth_service import (
    get_google_auth_url,
    exchange_code_for_tokens,
    verify_id_token,
    get_or_create_user,
)
from app.models.user import CompleteProfileRequest, SignupRequest, LoginRequest, UserOut

settings = get_settings()
router = APIRouter(prefix="/auth", tags=["auth"])


def user_to_out(user: dict) -> UserOut:
    return UserOut(
        id=str(user["_id"]),
        email=user["email"],
        name=user["name"],
        picture_url=user.get("picture_url"),
        auth_provider=user.get("auth_provider", "email"),
        role=user.get("role"),
        district=user.get("district"),
        language=user.get("language"),
        profile_completed=user.get("profile_completed", False),
        created_at=user["created_at"],
        last_login_at=user["last_login_at"],
    )


# ─── Email/Password Auth ───────────────────────────────────────────

@router.post("/signup")
async def signup(body: SignupRequest):
    db = get_database()
    now = datetime.now(timezone.utc)

    existing = await db.users.find_one({"email": body.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    user_doc = {
        "email": body.email,
        "name": body.name,
        "password_hash": hash_password(body.password),
        "auth_provider": "email",
        "google_id": None,
        "picture_url": None,
        "role": body.role,
        "district": body.district,
        "language": body.language,
        "profile_completed": True,
        "created_at": now,
        "last_login_at": now,
    }
    result = await db.users.insert_one(user_doc)
    user_doc["_id"] = result.inserted_id

    jwt_token = create_access_token({"sub": str(user_doc["_id"]), "role": body.role})

    return {
        "access_token": jwt_token,
        "user": user_to_out(user_doc),
    }


@router.post("/login-email")
async def login_email(body: LoginRequest):
    db = get_database()

    user = await db.users.find_one({"email": body.email, "auth_provider": "email"})
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    if not verify_password(body.password, user.get("password_hash", "")):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    now = datetime.now(timezone.utc)
    await db.users.update_one(
        {"_id": user["_id"]},
        {"$set": {"last_login_at": now}},
    )

    jwt_token = create_access_token({"sub": str(user["_id"]), "role": user.get("role")})

    return {
        "access_token": jwt_token,
        "user": user_to_out(user),
    }


# ─── Google OAuth ──────────────────────────────────────────────────

@router.get("/google/login")
async def google_login():
    return RedirectResponse(url=get_google_auth_url())


@router.get("/google/callback")
async def google_callback(code: str = None):
    if not code:
        raise HTTPException(status_code=400, detail="Authorization code missing")

    try:
        tokens = await exchange_code_for_tokens(code)
        id_token_str = tokens.get("id_token")
        if not id_token_str:
            raise HTTPException(status_code=400, detail="No ID token received from Google")

        google_user = verify_id_token(id_token_str)
        user = await get_or_create_user(google_user)

        user_id = str(user["_id"])
        jwt_token = create_access_token({"sub": user_id, "role": user.get("role")})

        profile_complete = user.get("profile_completed", False)
        redirect_url = (
            f"{settings.FRONTEND_URL}/auth/callback"
            f"?token={jwt_token}"
            f"&profile_complete={'true' if profile_complete else 'false'}"
        )
        return RedirectResponse(url=redirect_url)

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Authentication failed: {str(e)}")


# ─── Profile ───────────────────────────────────────────────────────

@router.post("/complete-profile")
async def complete_profile(
    body: CompleteProfileRequest,
    user: dict = Depends(get_current_user),
):
    if user.get("profile_completed"):
        raise HTTPException(status_code=400, detail="Profile already completed")

    db = get_database()
    await db.users.update_one(
        {"_id": user["_id"]},
        {
            "$set": {
                "role": body.role,
                "district": body.district,
                "language": body.language,
                "profile_completed": True,
            }
        },
    )

    user["role"] = body.role
    user["district"] = body.district
    user["language"] = body.language
    user["profile_completed"] = True

    jwt_token = create_access_token(
        {"sub": str(user["_id"]), "role": body.role}
    )

    return {
        "access_token": jwt_token,
        "user": user_to_out(user),
    }


@router.get("/me")
async def get_me(user: dict = Depends(get_current_user)):
    return user_to_out(user)


@router.post("/logout")
async def logout():
    return {"message": "Logged out successfully"}
