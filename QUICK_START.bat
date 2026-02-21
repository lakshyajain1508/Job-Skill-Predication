@echo off
REM ================================================================
REM CareerPilot AI - Quick Start (for subsequent runs)
REM ================================================================

setlocal enabledelayedexpansion
cd /d "%~dp0"

echo.
echo ================================================================
echo   CareerPilot AI - Quick Start
echo ================================================================
echo.

REM Check if services are already running
tasklist | find /i "node" >nul
if %ERRORLEVEL% EQU 0 (
    echo [WARNING] Node.js process already running
    echo.
)

tasklist | find /i "python" >nul
if %ERRORLEVEL% EQU 0 (
    echo [WARNING] Python process already running
    echo.
)

echo Starting Backend...
start "CareerPilot Backend" cmd /k "cd /d %CD%\backend && venv\Scripts\activate.bat && python run.py"

echo Waiting for backend to start...
timeout /t 2 /nobreak

echo Starting Frontend...
start "CareerPilot Frontend" cmd /k "cd /d %CD%\frontend && npm run dev"

echo.
echo ================================================================
echo Services are starting...
echo.
echo Frontend: http://localhost:3000
echo Backend: http://localhost:8000
echo ================================================================
echo.
pause

endlocal
