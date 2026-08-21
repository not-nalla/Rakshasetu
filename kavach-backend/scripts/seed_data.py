import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime

MONGO_URI = "mongodb://localhost:27017/kavach"

EVENTS = [
    {
        "title": "Earthquake Preparedness Drill",
        "type": "Mock Drill",
        "description": "A comprehensive earthquake simulation drill covering drop-cover-hold techniques, evacuation procedures, and first aid responses for earthquake scenarios.",
        "date": "2026-08-25",
        "time": "10:00 AM",
        "location": "Community Hall, Sector 12",
        "district": "Pune",
        "lat": 18.5204,
        "lng": 73.8567,
        "status": "upcoming",
        "enrolledCount": 147,
        "maxCapacity": 200,
        "tags": ["Earthquake", "Safety"],
    },
    {
        "title": "Flood Response Workshop",
        "type": "SSP",
        "description": "Interactive workshop on flood preparedness including sandbag techniques, emergency kit preparation, and safe evacuation routes.",
        "date": "2026-08-28",
        "time": "2:00 PM",
        "location": "District Collector Office",
        "district": "Mumbai",
        "lat": 19.076,
        "lng": 72.8777,
        "status": "upcoming",
        "enrolledCount": 89,
        "maxCapacity": 150,
        "tags": ["Flood", "Workshop"],
    },
    {
        "title": "Fire Safety Certification",
        "type": "CAP",
        "description": "Fire safety training covering fire extinguisher usage, building evacuation plans, and emergency communication protocols.",
        "date": "2026-09-01",
        "time": "9:00 AM",
        "location": "Fire Station, Main Road",
        "district": "Nagpur",
        "lat": 21.1458,
        "lng": 79.0882,
        "status": "upcoming",
        "enrolledCount": 62,
        "maxCapacity": 100,
        "tags": ["Fire", "Certification"],
    },
    {
        "title": "Cyclone Awareness Camp",
        "type": "Mock Drill",
        "description": "Full-day cyclone preparedness camp with simulation exercises, shelter identification, and emergency supply distribution.",
        "date": "2026-09-05",
        "time": "8:00 AM",
        "location": "Coastal Community Center",
        "district": "Mumbai",
        "lat": 19.0596,
        "lng": 72.8295,
        "status": "upcoming",
        "enrolledCount": 203,
        "maxCapacity": 250,
        "tags": ["Cyclone", "Camp"],
    },
    {
        "title": "First Aid Training Session",
        "type": "SSP",
        "description": "Basic first aid and CPR training for disaster response volunteers.",
        "date": "2026-09-10",
        "time": "11:00 AM",
        "location": "Red Cross Building",
        "district": "Pune",
        "lat": 18.5309,
        "lng": 73.8475,
        "status": "upcoming",
        "enrolledCount": 34,
        "maxCapacity": 60,
        "tags": ["First Aid", "Training"],
    },
    {
        "title": "Tsunami Evacuation Drill",
        "type": "Mock Drill",
        "description": "Coastal evacuation drill simulating tsunami warning and safe zone relocation for beachside communities.",
        "date": "2026-09-15",
        "time": "7:00 AM",
        "location": "Juhu Beach Access Point",
        "district": "Mumbai",
        "lat": 19.0948,
        "lng": 72.8267,
        "status": "upcoming",
        "enrolledCount": 178,
        "maxCapacity": 300,
        "tags": ["Tsunami", "Evacuation"],
    },
]

AUTHORITIES = [
    {"name": "Dr. Rajesh Patil", "role": "District Disaster Management Officer", "department": "DDMA Pune", "phone": "+91-20-25501001", "email": "ddma.pune@gov.in", "district": "Pune"},
    {"name": "Sunita Sharma", "role": "Fire Safety Director", "department": "Mumbai Fire Brigade", "phone": "+91-22-23001010", "email": "fire.brigade@mumbai.gov.in", "district": "Mumbai"},
    {"name": "Amit Deshmukh", "role": "NDRF Team Leader", "department": "National Disaster Response Force", "phone": "+91-712-2550200", "email": "ndrf.nagpur@gov.in", "district": "Nagpur"},
    {"name": "Priya Kulkarni", "role": "Revenue Officer (Disaster)", "department": "Collector Office Pune", "phone": "+91-20-25501500", "email": "revenue.pune@gov.in", "district": "Pune"},
    {"name": "Vikram Joshi", "role": "SDRF Coordinator", "department": "State Disaster Response Fund", "phone": "+91-22-22025000", "email": "sdrf.maharashtra@gov.in", "district": "Mumbai"},
    {"name": "Meena Raut", "role": "Medical Officer (Emergency)", "department": "District Hospital Nagpur", "phone": "+91-712-2550300", "email": "medical.nagpur@gov.in", "district": "Nagpur"},
]

SHELTERS = [
    {"name": "Pune Municipal School Shelter", "distance": "2.3 km", "occupancy": 45, "status": "Available", "lat": 18.524, "lng": 73.853},
    {"name": "Sector 12 Community Hall", "distance": "0.8 km", "occupancy": 72, "status": "Filling", "lat": 18.519, "lng": 73.859},
    {"name": "St. Marys High School", "distance": "3.1 km", "occupancy": 20, "status": "Available", "lat": 18.528, "lng": 73.85},
    {"name": "District Sports Complex", "distance": "4.5 km", "occupancy": 90, "status": "Nearly Full", "lat": 18.515, "lng": 73.862},
]

DISASTERS = [
    {"name": "Maharashtra Floods 2023", "type": "Flood", "date": "2023-07-15", "district": "Kokana", "casualties": 42, "displaced": 12500, "damageEstimate": "₹850 Cr", "summary": "Severe flooding caused by heavy monsoon rains led to widespread displacement and infrastructure damage across western Maharashtra."},
    {"name": "Latur Earthquake 2024", "type": "Earthquake", "date": "2024-03-22", "district": "Latur", "casualties": 8, "displaced": 3200, "damageEstimate": "₹220 Cr", "summary": "A 5.4 magnitude earthquake struck Latur district, causing structural damage to older buildings."},
    {"name": "Cyclone Tauktae Impact", "type": "Cyclone", "date": "2024-05-18", "district": "Mumbai", "casualties": 3, "displaced": 8500, "damageEstimate": "₹1200 Cr", "summary": "Severe cyclone brought wind speeds of 150km/h and heavy rainfall to the Mumbai coast."},
    {"name": "Nagpur Wildfires", "type": "Fire", "date": "2025-04-10", "district": "Nagpur", "casualties": 0, "displaced": 1200, "damageEstimate": "₹45 Cr", "summary": "Forest fires in the Vidarbha region threatened residential areas on the outskirts of Nagpur."},
    {"name": "Konkan Landslides", "type": "Landslide", "date": "2025-07-22", "district": "Raigad", "casualties": 15, "displaced": 4800, "damageEstimate": "₹380 Cr", "summary": "Torrential rainfall triggered multiple landslides in hilly terrain, cutting off several villages."},
    {"name": "Pune Industrial Accident", "type": "Industrial", "date": "2025-11-05", "district": "Pune", "casualties": 5, "displaced": 2000, "damageEstimate": "₹150 Cr", "summary": "Chemical leak at an industrial estate prompted mass evacuation of surrounding neighborhoods."},
]

ALERTS = [
    {"title": "Heavy Rainfall Warning", "message": "IMD issues red alert for Mumbai district. Expected rainfall 200mm+ in 24 hours. Avoid coastal areas and low-lying regions.", "severity": "critical", "district": "Mumbai", "active": True, "createdAt": datetime(2026, 8, 19, 6, 0, 0), "expiresAt": "2026-08-21T06:00:00Z"},
    {"title": "Heatwave Advisory", "message": "Temperature expected to exceed 42°C in Nagpur district. Stay hydrated, avoid outdoor activities between 12-4 PM.", "severity": "warning", "district": "Nagpur", "active": True, "createdAt": datetime(2026, 8, 18, 8, 0, 0), "expiresAt": "2026-08-20T18:00:00Z"},
]


async def seed():
    client = AsyncIOMotorClient(MONGO_URI)
    db = client.kavach

    await db.events.delete_many({})
    await db.authorities.delete_many({})
    await db.shelters.delete_many({})
    await db.disasters.delete_many({})
    await db.alerts.delete_many({})

    await db.events.insert_many(EVENTS)
    await db.authorities.insert_many(AUTHORITIES)
    await db.shelters.insert_many(SHELTERS)
    await db.disasters.insert_many(DISASTERS)
    await db.alerts.insert_many(ALERTS)

    print(f"Seeded: {len(EVENTS)} events, {len(AUTHORITIES)} authorities, {len(SHELTERS)} shelters, {len(DISASTERS)} disasters, {len(ALERTS)} alerts")
    client.close()


if __name__ == "__main__":
    asyncio.run(seed())
