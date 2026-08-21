import pandas as pd
from app.database import get_database


async def ingest_data_gov_csv(csv_path: str):
    db = get_database()
    try:
        df = pd.read_csv(csv_path)

        df.columns = df.columns.str.strip().str.lower().str.replace(" ", "_")

        disasters = []
        for _, row in df.iterrows():
            disaster = {
                "name": str(row.get("event_name", row.get("disaster_name", "Unknown"))),
                "type": str(row.get("disaster_type", "Unknown")),
                "date": str(row.get("date", row.get("year", "2024-01-01"))),
                "district": str(row.get("district", "Unknown")),
                "casualties": int(row.get("casualties", 0) or 0),
                "displaced": int(row.get("displaced", 0) or 0),
                "damageEstimate": str(row.get("damage", "Unknown")),
                "summary": str(row.get("description", row.get("summary", ""))),
            }
            disasters.append(disaster)

        if disasters:
            await db.disasters.insert_many(disasters)

        return len(disasters)
    except Exception:
        return 0
