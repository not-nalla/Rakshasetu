from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    MONGO_URI: str = "mongodb://localhost:27017/kavach"

    GOOGLE_CLIENT_ID: str = ""
    GOOGLE_CLIENT_SECRET: str = ""
    GOOGLE_REDIRECT_URI: str = "http://localhost:8000/auth/google/callback"

    JWT_SECRET: str = "change-me-in-production"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRE_MINUTES: int = 1440

    GROQ_API_KEY: str = ""
    TAVILY_API_KEY: str = ""
    NEWS_API_KEY: str = ""

    FRONTEND_URL: str = "http://localhost:5173"

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}


@lru_cache
def get_settings() -> Settings:
    return Settings()
