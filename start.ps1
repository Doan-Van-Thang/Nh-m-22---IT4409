# Tank Game - Auto Start Script
# Automatically starts Server and Client

Write-Host ""
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host "  TANK GAME - REFACTORED VERSION" -ForegroundColor Yellow
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host ""

# Check MongoDB
Write-Host "[1/4] Checking MongoDB..." -ForegroundColor Green
$mongoProcess = Get-Process -Name "mongod" -ErrorAction SilentlyContinue
if ($null -eq $mongoProcess) {
    Write-Host "WARNING: MongoDB is not running!" -ForegroundColor Red
    Write-Host "Please start MongoDB first:" -ForegroundColor Yellow
    Write-Host "   mongod" -ForegroundColor White
    Write-Host ""
    $continue = Read-Host "Continue anyway? (y/n)"
    if ($continue -ne "y") {
        exit
    }
} else {
    Write-Host "OK: MongoDB is running" -ForegroundColor Green
}

Write-Host ""

# Check port 5174
Write-Host "[2/4] Checking port 5174..." -ForegroundColor Green
$portInUse = Get-NetTCPConnection -LocalPort 5174 -ErrorAction SilentlyContinue
if ($null -ne $portInUse) {
    Write-Host "WARNING: Port 5174 is in use" -ForegroundColor Yellow
    $kill = Read-Host "Kill the process? (y/n)"
    if ($kill -eq "y") {
        $process = $portInUse | Select-Object -ExpandProperty OwningProcess -Unique
        Stop-Process -Id $process -Force
        Write-Host "OK: Stopped process on port 5174" -ForegroundColor Green
        Start-Sleep -Seconds 1
    }
} else {
    Write-Host "OK: Port 5174 is available" -ForegroundColor Green
}

Write-Host ""

# Start Server
Write-Host "[3/4] Starting Server..." -ForegroundColor Green
$serverPath = "d:\WEB\BTL\Main\server"
Write-Host "   Path: $serverPath" -ForegroundColor Gray

# Create new terminal for server
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$serverPath'; Write-Host '=== SERVER STARTING ===' -ForegroundColor Cyan; npm start"
Write-Host "OK: Server is starting in new terminal" -ForegroundColor Green
Start-Sleep -Seconds 3

Write-Host ""

# Start Client
Write-Host "[4/4] Starting Client..." -ForegroundColor Green
$clientPath = "d:\WEB\BTL\Main\client"
Write-Host "   Path: $clientPath" -ForegroundColor Gray

# Create new terminal for client
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$clientPath'; Write-Host '=== CLIENT STARTING ===' -ForegroundColor Cyan; npm run dev"
Write-Host "OK: Client is starting in new terminal" -ForegroundColor Green

Write-Host ""
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host "  STARTUP COMPLETE!" -ForegroundColor Green
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Instructions:" -ForegroundColor Yellow
Write-Host "   - Server: http://localhost:5174" -ForegroundColor White
Write-Host "   - Client: http://localhost:5173" -ForegroundColor White
Write-Host "   - Open browser and go to Client URL" -ForegroundColor White
Write-Host ""
Write-Host "Debug:" -ForegroundColor Yellow
Write-Host "   - Check logs in the opened terminals" -ForegroundColor White
Write-Host "   - Server logs have [INFO], [DEBUG], [ERROR] prefix" -ForegroundColor White
Write-Host ""
Write-Host "Documentation:" -ForegroundColor Yellow
Write-Host "   - HUONG_DAN_FULL_MIGRATION.md" -ForegroundColor White
Write-Host "   - QUICKSTART.md" -ForegroundColor White
Write-Host "   - REFACTORING.md" -ForegroundColor White
Write-Host ""
Write-Host "Press Enter to close this window..." -ForegroundColor Gray
Read-Host
