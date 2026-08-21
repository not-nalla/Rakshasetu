import httpx
from datetime import datetime
from app.config import get_settings
from app.database import get_database

settings = get_settings()

SACHET_CAP_URL = "https://sachet.ndma.gov.in/cap.xml"


async def fetch_sachet_alerts():
    try:
        async with httpx.AsyncClient(timeout=30) as client:
            response = await client.get(SACHET_CAP_URL)
            response.raise_for_status()
            return parse_cap_xml(response.text)
    except Exception:
        return []


def parse_cap_xml(xml_content: str) -> list:
    import xml.etree.ElementTree as ET

    alerts = []
    try:
        root = ET.fromstring(xml_content)
        ns = {"cap": "urn:oasis:names:tc:emergency:cap:1.2"}

        for info in root.findall(".//cap:info", ns):
            headline = info.findtext("cap:headline", "", ns)
            description = info.findtext("cap:description", "", ns)
            severity = info.findtext("cap:severity", "info", ns).lower()
            area = info.findtext("cap:areaDesc", "Unknown", ns)

            if headline:
                alerts.append({
                    "title": headline,
                    "message": description or headline,
                    "severity": severity if severity in ("critical", "warning", "info") else "info",
                    "district": area,
                    "active": True,
                    "createdAt": datetime.utcnow(),
                })
    except ET.ParseError:
        pass

    return alerts
