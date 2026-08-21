$root = Split-Path -Parent $MyInvocation.MyCommand.Path

function Ensure-PortFree {
    param([int]$Port)
    $conn = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue
    if ($conn) {
        Write-Host "Port $Port in use by PID $($conn.OwningProcess). Stopping..." -ForegroundColor Yellow
        $conn | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }
        Start-Sleep -Seconds 2
    }
}

Write-Host "=== Kavach Startup ===" -ForegroundColor Cyan

Ensure-PortFree -Port 8000
Ensure-PortFree -Port 5173

if (Test-Path "$root\kavach-backend\.env") {
    Write-Host "Backend .env found" -ForegroundColor Green
} else {
    Write-Host "WARNING: kavach-backend\.env missing. Copy .env.example to .env" -ForegroundColor Yellow
}

Start-Process -FilePath "uvicorn" -ArgumentList "app.main:app","--port","8000" -WorkingDirectory "$root\kavach-backend" -WindowStyle Hidden
Write-Host "Backend starting on http://localhost:8000 ..." -ForegroundColor Green

Start-Process -FilePath "npm.cmd" -ArgumentList "run","dev" -WorkingDirectory "$root\kavach-frontend" -WindowStyle Hidden
Write-Host "Frontend starting on http://localhost:5173 ..." -ForegroundColor Green

$backend = $false
$frontend = $false
for ($i = 0; $i -lt 30; $i++) {
    Start-Sleep -Seconds 1
    if (-not $backend) {
        try { Invoke-RestMethod -Uri http://localhost:8000/health -TimeoutSec 2 | Out-Null; $backend = $true; Write-Host "Backend is UP (health OK)" -ForegroundColor Green } catch {}
    }
    if (-not $frontend) {
        try { Invoke-WebRequest -Uri http://localhost:5173 -TimeoutSec 2 -UseBasicParsing | Out-Null; $frontend = $true; Write-Host "Frontend is UP (HTTP 200)" -ForegroundColor Green } catch {}
    }
    if ($backend -and $frontend) { break }
}

if ($backend -and $frontend) {
    Write-Host ""
    Write-Host "=== All services running ===" -ForegroundColor Cyan
    Write-Host "Frontend: http://localhost:5173" -ForegroundColor Green
    Write-Host "Backend:  http://localhost:8000  (docs: /docs)" -ForegroundColor Green
    Write-Host "Open http://localhost:5173 in your browser" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "Some services did not start. Check the logs below." -ForegroundColor Red
    if (-not $backend) { Write-Host "  - Backend failed. Is MongoDB running? Is uvicorn installed?" -ForegroundColor Yellow }
    if (-not $frontend) { Write-Host "  - Frontend failed. Run 'npm install' in kavach-frontend first." -ForegroundColor Yellow }
}