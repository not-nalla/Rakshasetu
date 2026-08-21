import httpx
from datetime import datetime
from app.config import get_settings

settings = get_settings()

TAVILY_API_URL = "https://api.tavily.com/search"


async def search_disaster_info(query: str, max_results: int = 5):
    if not settings.TAVILY_API_KEY:
        return []

    current_year = datetime.now().year
    search_query = f"{query} {current_year}"

    try:
        async with httpx.AsyncClient(timeout=15) as client:
            response = await client.post(
                TAVILY_API_URL,
                json={
                    "api_key": settings.TAVILY_API_KEY,
                    "query": search_query,
                    "max_results": max_results,
                    "search_depth": "advanced",
                    "days": 7,
                },
            )
            response.raise_for_status()
            data = response.json()
            return data.get("results", [])
    except Exception:
        return []
