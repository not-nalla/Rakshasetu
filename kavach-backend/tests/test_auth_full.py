import urllib.request, json

BASE = "http://localhost:8000"

def post(path, data, headers=None):
    h = {"Content-Type": "application/json"}
    if headers:
        h.update(headers)
    req = urllib.request.Request(f"{BASE}{path}", data=json.dumps(data).encode(), headers=h)
    try:
        r = urllib.request.urlopen(req)
        return r.status, json.loads(r.read())
    except urllib.error.HTTPError as e:
        return e.code, json.loads(e.read())

def get(path, token=None):
    h = {}
    if token:
        h["Authorization"] = f"Bearer {token}"
    req = urllib.request.Request(f"{BASE}{path}", headers=h)
    try:
        r = urllib.request.urlopen(req)
        return r.status, json.loads(r.read())
    except urllib.error.HTTPError as e:
        return e.code, json.loads(e.read())

print("=== Testing Kavach Auth ===\n")

# 1. Health
code, body = get("/health")
print(f"[{'OK' if code==200 else 'FAIL'}] Health: {body}")

# 2. Signup
code, body = post("/auth/signup", {
    "name": "Rahul Verma",
    "email": "rahul@kavach.com",
    "password": "test123",
    "role": "citizen",
    "district": "Pune",
    "language": "en"
})
print(f"[{'OK' if code==200 else 'FAIL'}] Signup: {code} - {body.get('user',{}).get('name','')} | {body.get('user',{}).get('email','')}")
token = body.get("access_token")

# 3. Duplicate signup
code2, body2 = post("/auth/signup", {
    "name": "Rahul Verma",
    "email": "rahul@kavach.com",
    "password": "test123",
    "role": "citizen",
    "district": "Pune",
    "language": "en"
})
print(f"[{'OK' if code2==400 else 'FAIL'}] Duplicate signup rejected: {code2}")

# 4. Login with email
code, body = post("/auth/login-email", {"email": "rahul@kavach.com", "password": "test123"})
print(f"[{'OK' if code==200 else 'FAIL'}] Email login: {body.get('user',{}).get('name','')} | provider: {body.get('user',{}).get('auth_provider','')}")
token = body.get("access_token")

# 5. Wrong password
code, body = post("/auth/login-email", {"email": "rahul@kavach.com", "password": "wrong"})
print(f"[{'OK' if code==401 else 'FAIL'}] Wrong password rejected: {code}")

# 6. Get /me with token
code, body = get("/auth/me", token)
print(f"[{'OK' if code==200 else 'FAIL'}] /me: {body.get('name','')} | role: {body.get('role','')} | district: {body.get('district','')}")

# 7. Get /me without token
code, body = get("/auth/me")
print(f"[{'OK' if code in (401,403) else 'FAIL'}] /me no token rejected: {code}")

# 8. Events with token
code, body = get("/events", token)
print(f"[{'OK' if code==200 else 'FAIL'}] Events: {len(body)} events returned")

# 9. Events without token
code, body = get("/events")
print(f"[{'OK' if code in (401,403) else 'FAIL'}] Events no token rejected: {code}")

# 10. Alerts with token
code, body = get("/alerts/active", token)
print(f"[{'OK' if code==200 else 'FAIL'}] Active alert: {body.get('title', 'None') if body else 'None'}")

# 11. Authorities with token
code, body = get("/authorities", token)
print(f"[{'OK' if code==200 else 'FAIL'}] Authorities: {len(body)} returned")

# 12. Disasters with token
code, body = get("/disasters", token)
print(f"[{'OK' if code==200 else 'FAIL'}] Disasters: {len(body)} returned")

# 13. Shelters with token
code, body = get("/shelters", token)
print(f"[{'OK' if code==200 else 'FAIL'}] Shelters: {len(body)} returned")

# 14. Home stats
code, body = get("/home/stats", token)
print(f"[{'OK' if code==200 else 'FAIL'}] Home stats: {body}")

print("\n=== All tests done ===")
