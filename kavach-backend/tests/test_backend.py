import sys
sys.path.insert(0, '.')
from app.main import app
print(f'FastAPI app loaded: {app.title} v{app.version}')
route_count = len([r for r in app.routes if hasattr(r, 'methods')])
print(f'API routes: {route_count}')
for route in app.routes:
    if hasattr(route, 'methods'):
        for method in route.methods:
            print(f'  {method:6} {route.path}')
print('All OK!')
