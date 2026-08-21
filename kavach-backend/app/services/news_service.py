import httpx
from app.config import get_settings

settings = get_settings()

NEWS_API_URL = "https://newsapi.org/v2/everything"


async def fetch_disaster_news(district: str = "Maharashtra", page_size: int = 10):
    if not settings.NEWS_API_KEY:
        return []

    try:
        async with httpx.AsyncClient(timeout=15) as client:
            response = await client.get(
                NEWS_API_URL,
                params={
                    "q": f"disaster {district}",
                    "language": "en",
                    "sortBy": "publishedAt",
                    "pageSize": page_size,
                    "apiKey": settings.NEWS_API_KEY,
                },
            )
            response.raise_for_status()
            data = response.json()
            return data.get("articles", [])
    except Exception:
        return []
