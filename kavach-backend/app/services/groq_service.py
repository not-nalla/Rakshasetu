import re
import httpx
from app.config import get_settings

settings = get_settings()

GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"


def strip_thinking(text: str) -> str:
    text = re.sub(r'<think>[\s\S]*?</think>', '', text).strip()
    text = re.sub(r'<think>[\s\S]*?</think>', '', text).strip()
    if not text:
        return "I couldn't generate a response. Please try again."
    return text


async def chat_completion(messages: list[dict], model: str = "qwen/qwen3.6-27b") -> str:
    if not settings.GROQ_API_KEY:
        return "AI service is not configured. Please set the GROQ_API_KEY."

    try:
        async with httpx.AsyncClient(timeout=60) as client:
            response = await client.post(
                GROQ_API_URL,
                headers={
                    "Authorization": f"Bearer {settings.GROQ_API_KEY}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": model,
                    "messages": messages,
                    "max_tokens": 4096,
                    "temperature": 0.7,
                },
            )
            response.raise_for_status()
            data = response.json()
            content = data["choices"][0]["message"]["content"].strip()
            return strip_thinking(content)
    except httpx.HTTPStatusError as e:
        return f"AI service returned an error: {e.response.status_code}"
    except Exception as e:
        return f"AI service error: {str(e)}"


async def generate_disaster_summary(disaster_data: dict) -> str:
    if not settings.GROQ_API_KEY:
        return disaster_data.get("summary", "")

    prompt = f"""Generate a concise disaster impact summary for:
    Name: {disaster_data.get('name', 'Unknown')}
    Type: {disaster_data.get('type', 'Unknown')}
    District: {disaster_data.get('district', 'Unknown')}
    Casualties: {disaster_data.get('casualties', 0)}
    Displaced: {disaster_data.get('displaced', 0)}
    Damage: {disaster_data.get('damageEstimate', 'Unknown')}

    Write a 2-3 sentence summary of the disaster impact."""

    try:
        async with httpx.AsyncClient(timeout=30) as client:
            response = await client.post(
                GROQ_API_URL,
                headers={
                    "Authorization": f"Bearer {settings.GROQ_API_KEY}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": "qwen/qwen3.6-27b",
                    "messages": [{"role": "user", "content": prompt}],
                    "max_tokens": 200,
                    "temperature": 0.5,
                },
            )
            response.raise_for_status()
            data = response.json()
            content = data["choices"][0]["message"]["content"].strip()
            return strip_thinking(content)
    except Exception:
        return disaster_data.get("summary", "")
