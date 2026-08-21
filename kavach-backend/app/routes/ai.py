from fastapi import APIRouter, HTTPException
from app.models.chat import ChatRequest, ChatResponse
from app.services.groq_service import chat_completion
from app.services.tavily_service import search_disaster_info
from app.dependencies import get_current_user
from fastapi import Depends
from datetime import datetime

router = APIRouter(prefix="/ai", tags=["ai"])

SYSTEM_PROMPT = """You are Kavach AI, a disaster preparedness assistant for India.

## Response Style
- When real-time search data is provided, give a **detailed, well-structured** response — not a short paragraph
- Start with a 1-2 sentence summary of the situation
- Then use **headers** (like "## Major Affected Regions") and **bullet points** to break down information by region, event, or category
- Each bullet point should have a **bold region/event name** followed by a colon and specific details (districts, casualty numbers, displacement figures, damage info)
- Cite sources inline using markdown links like [Source Name](url) at the end of relevant bullet points
- Use **bold** for key numbers, place names, and important terms

## CRITICAL: Data Freshness Rules
- ONLY use data from the current year (2026). Anything from 2025 or earlier is OUTDATED.
- If search results contain old dates (2023, 2024, 2025), IGNORE those results completely.
- If all search results are outdated, say: "I couldn't find verified current data for this query. Please check [NDMA](https://ndma.gov.in) or [IMD](https://mausam.imd.gov.in) for the latest updates."
- Always mention the specific date of the event when available.
- Prioritize results with the most recent dates.

## Rules
- Only mention helpline numbers (112, 108, 101, 1091) if the user specifically asks
- Do NOT add filler like "Stay safe" or "Let me know if you need more"
- Do NOT ask for more details if the provided search data already answers the question
- Answer in the same language the user asks in
- Be specific: name locations, dates, magnitudes, casualty counts when available
"""


def build_search_instruction() -> str:
    current_date = datetime.now().strftime("%B %d, %Y")
    current_year = datetime.now().year

    return f"""You have been provided with real-time web search results for TODAY's date: {current_date}.

## CRITICAL INSTRUCTIONS
- ONLY use search results dated {current_year}. Ignore anything from {current_year - 1} or earlier.
- The search query has already been filtered to {current_year} data. If results still contain old dates, discard them.
- If no valid {current_year} results remain, respond with: "I couldn't find verified current data for this query. Please check [NDMA](https://ndma.gov.in) or [IMD](https://mausam.imd.gov.in) for the latest updates."

## Response Format
1. Start with a brief summary sentence
2. Use "##" headers to organize by region or topic
3. Use bullet points with **bold names** for each affected area
4. Include specific data: casualty counts, displacement numbers, districts affected, dates
5. Cite sources using [Source Name](url) at the end of bullet points where applicable
6. If multiple regions are affected, list each one separately

REAL-TIME WEB SEARCH RESULTS:
"""


async def search_if_needed(query: str) -> str:
    search_keywords = [
        "today", "current", "latest", "now", "right now", "recent",
        "happening", "breaking", "live", "update", "alert",
        "earthquake", "flood", "cyclone", "tsunami", "landslide",
        "disaster", "emergency", "rescue", "where", "when",
    ]
    query_lower = query.lower()
    if any(kw in query_lower for kw in search_keywords):
        search_query = query
        if "india" not in query_lower:
            search_query = query + " India"
        results = await search_disaster_info(search_query, max_results=5)
        if results:
            context = ""
            for i, r in enumerate(results, 1):
                title = r.get("title", "")
                content = r.get("content", "")[:500]
                url = r.get("url", "")
                context += f"Source {i}: {title}\nURL: {url}\nContent: {content}\n\n"
            return context
    return ""


@router.post("/chat", response_model=ChatResponse)
async def chat(req: ChatRequest, user: dict = Depends(get_current_user)):
    if not req.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty")

    search_context = await search_if_needed(req.message)

    messages = [{"role": "system", "content": SYSTEM_PROMPT}]

    for msg in req.history[-10:]:
        messages.append({"role": msg.role, "content": msg.content})

    if search_context:
        user_msg = f"{build_search_instruction()}{search_context}\nUser question: {req.message}"
    else:
        user_msg = req.message
    messages.append({"role": "user", "content": user_msg})

    try:
        reply = await chat_completion(messages)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI service error: {str(e)}")

    sources = []
    if search_context:
        sources.append({"type": "web_search", "note": "Recent web results were used to supplement the response"})

    return ChatResponse(reply=reply, sources=sources)
