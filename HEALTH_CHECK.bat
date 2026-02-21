@echo off
REM ================================================================
REM CareerPilot AI - Health Check
REM ================================================================

setlocal enabledelayedexpansion
cd /d "%~dp0"

echo.
echo ================================================================
echo   CareerPilot AI - Service Health Check
echo ================================================================
echo.

REM Check if curl is available
where curl >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [WARNING] curl command not found
    echo Installing curl via Windows is recommended
    echo Attempting to use bitsadmin as fallback...
)

echo Checking Backend Health...
echo.

REM Try to connect to backend
timeout /t 1 /nobreak >nul

if exist "C:\Windows\System32\curl.exe" (
    curl -s http://localhost:8000/health
) else (
    REM Fallback: check with Python
    python -c "import urllib.request; print(urllib.request.urlopen('http://localhost:8000/health').read().decode())" 2>nul
    if !ERRORLEVEL! NEQ 0 (
        echo [ERROR] Could not reach backend at http://localhost:8000/health
        echo Make sure backend is running: Start backend from 'CareerPilot Backend' window
    )
)

echo.
echo ================================================================
echo.
echo Checking Frontend...
echo Frontend should be accessible at: http://localhost:3000
echo.
echo Backend API Docs: http://localhost:8000/docs
echo Backend ReDoc: http://localhost:8000/redoc
echo.
echo ================================================================
echo.

pause

endlocal
