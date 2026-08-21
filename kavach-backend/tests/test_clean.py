import urllib.request, json

BASE = "http://localhost:8000"

def post(path, data, headers=None):
    h = {"Content-Type": "application/json"}
    if headers: h.update(headers)
    req = urllib.request.Request(f"{BASE}{path}", json.dumps(data).encode(), headers=h)
    try:
        r = urllib.request.urlopen(req)
        return r.status, json.loads(r.read())
    except urllib.error.HTTPError as e:
        return e.code, json.loads(e.read())

def get(path, token=None):
    h = {}
    if token: h["Authorization"] = f"Bearer {token}"
    req = urllib.request.Request(f"{BASE}{path}", headers=h)
    try:
        r = urllib.request.urlopen(req)
        return r.status, json.loads(r.read())
    except urllib.error.HTTPError as e:
        return e.code, json.loads(e.read())

print("=== FRESH SIGNUP TEST ===")
code, body = post("/auth/signup", {
    "name": "Sneha Patel",
    "email": "sneha@kavach.com",
    "password": "pass123",
    "role": "student",
    "district": "Chennai",
    "language": "hi"
})
print(f"Signup: {code}")
print(f"  User: {body.get('user', {})}")
token = body.get("access_token")
print(f"  Token: {token[:30]}...")

code, body = get("/auth/me", token)
print(f"\n/me: {code}")
print(f"  name={body.get('name')}, role={body.get('role')}, district={body.get('district')}, lang={body.get('language')}, provider={body.get('auth_provider')}")

code, body = post("/auth/login-email", {"email": "sneha@kavach.com", "password": "pass123"})
print(f"\nLogin: {code}")
print(f"  user={body.get('user',{}).get('name')}, provider={body.get('user',{}).get('auth_provider')}")
token2 = body.get("access_token")
print(f"  Token: {token2[:30]}...")

code, body = get("/events", token2)
print(f"\nEvents: {code} - {len(body)} events")

code, body = get("/alerts/active", token2)
print(f"Alerts: {code} - {body.get('title','none') if isinstance(body,dict) else body}")

code, body = get("/authorities", token2)
print(f"Authorities: {code} - {len(body)} returned")

code, body = get("/disasters", token2)
print(f"Disasters: {code} - {len(body)} returned")

code, body = get("/shelters", token2)
print(f"Shelters: {code} - {len(body)} returned")

code, body = get("/home/stats", token2)
print(f"Home stats: {code} - {body}")
