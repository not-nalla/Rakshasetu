import subprocess, time, urllib.request, json, sys

# Start server
proc = subprocess.Popen(
    [sys.executable, "-m", "uvicorn", "app.main:app", "--port", "8000"],
    cwd=r"C:\Users\vighn\OneDrive\Desktop\Kavach\kavach-backend",
    stdout=subprocess.PIPE,
    stderr=subprocess.STDOUT,
    text=True
)

time.sleep(5)

BASE = "http://localhost:8000"
results = []

def post(path, data):
    try:
        req = urllib.request.Request(f"{BASE}{path}", json.dumps(data).encode(), headers={"Content-Type": "application/json"})
        r = urllib.request.urlopen(req)
        return r.status, json.loads(r.read())
    except urllib.error.HTTPError as e:
        body = e.read().decode()
        try:
            return e.code, json.loads(body)
        except:
            return e.code, body

def get(path, token=None):
    h = {}
    if token: h["Authorization"] = f"Bearer {token}"
    try:
        req = urllib.request.Request(f"{BASE}{path}", headers=h)
        r = urllib.request.urlopen(req)
        return r.status, json.loads(r.read())
    except urllib.error.HTTPError as e:
        body = e.read().decode()
        try:
            return e.code, json.loads(body)
        except:
            return e.code, body

print("=== AUTH TESTS ===")

# Signup
code, body = post("/auth/signup", {"name":"Test User","email":"testx@kavach.com","password":"test12345","role":"citizen","district":"Pune","language":"en"})
print(f"1. Signup: {code}")
if code == 200:
    token = body.get("access_token")
    print(f"   user={body['user']['name']} provider={body['user']['auth_provider']}")
    print(f"   token={token[:30]}...")
    
    # /me
    code2, body2 = get("/auth/me", token)
    print(f"2. /me: {code2} name={body2.get('name')} role={body2.get('role')} district={body2.get('district')}")
    
    # Login
    code3, body3 = post("/auth/login-email", {"email":"testx@kavach.com","password":"test12345"})
    print(f"3. Login: {code3} name={body3.get('user',{}).get('name','?')}")
    
    t2 = body3.get("access_token", token)
    
    # Protected endpoints
    for path, name in [("/events","Events"),("/alerts/active","Alert"),("/authorities","Auths"),("/disasters","Disasters"),("/shelters","Shelters"),("/home/stats","Stats")]:
        c, b = get(path, t2)
        if isinstance(b, list):
            print(f"   {name}: {c} count={len(b)}")
        else:
            print(f"   {name}: {c} data={str(b)[:80]}")
else:
    print(f"   Error: {body}")

# Wrong password
code, body = post("/auth/login-email", {"email":"testx@kavach.com","password":"wrong"})
print(f"4. Wrong pw: {code}")

# No token
code, body = get("/auth/me")
print(f"5. No token /me: {code}")

# Duplicate signup
code, body = post("/auth/signup", {"name":"Test User","email":"testx@kavach.com","password":"test12345","role":"citizen","district":"Pune","language":"en"})
print(f"6. Dup signup: {code}")

proc.terminate()
print("\n=== DONE ===")
