@echo off
REM ================================================================
REM CareerPilot AI - Full Stack Project Runner
REM ================================================================
REM This script sets up and runs both Frontend (Next.js) and Backend (FastAPI)
REM ================================================================

setlocal enabledelayedexpansion
cd /d "%~dp0"

echo.
echo ================================================================
echo   CareerPilot AI - Complete Setup & Launch
echo ================================================================
echo.

REM Colors for output (Windows doesn't support ANSI colors in batch easily)
REM Using visual separators instead

REM ================================================================
REM 1. CHECK PREREQUISITES
REM ================================================================
echo [1/6] Checking Prerequisites...
echo.

where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] npm is not installed or not in PATH
    pause
    exit /b 1
)

where python >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Python is not installed or not in PATH
    echo Please install Python 3.10+ from https://www.python.org/
    pause
    exit /b 1
)

echo [OK] Node.js found: 
node --version

echo [OK] npm found:
npm --version

echo [OK] Python found:
python --version

echo.
echo ================================================================
REM ================================================================
REM 2. SETUP FRONTEND
REM ================================================================
echo [2/6] Setting up Frontend (Next.js)...
echo.

if not exist "frontend\" (
    echo [ERROR] Frontend folder not found!
    echo Please ensure the project structure is correct:
    echo   e:\JobSkills\frontend\
    echo   e:\JobSkills\backend\
    pause
    exit /b 1
)

cd frontend

REM Check if node_modules exists
if not exist "node_modules\" (
    echo Installing Frontend dependencies (this may take 2-3 minutes)...
    call npm install
    if !ERRORLEVEL! NEQ 0 (
        echo [ERROR] Failed to install frontend dependencies
        pause
        exit /b 1
    )
) else (
    echo [OK] Frontend dependencies already installed
)

cd ..
echo.

REM ================================================================
REM 3. SETUP BACKEND
REM ================================================================
echo [3/6] Setting up Backend (FastAPI)...
echo.

if not exist "backend\" (
    echo [ERROR] Backend folder not found!
    pause
    exit /b 1
)

cd backend

REM Check if virtual environment exists
if not exist "venv\" (
    echo Creating Python virtual environment...
    python -m venv venv
    if !ERRORLEVEL! NEQ 0 (
        echo [ERROR] Failed to create virtual environment
        pause
        exit /b 1
    )
)

REM Activate virtual environment
call venv\Scripts\activate.bat
if !ERRORLEVEL! NEQ 0 (
    echo [ERROR] Failed to activate virtual environment
    pause
    exit /b 1
)

REM Check if requirements are installed
pip show fastapi >nul 2>nul
if !ERRORLEVEL! NEQ 0 (
    echo Installing Backend dependencies (this may take 1-2 minutes)...
    pip install -r requirements.txt
    if !ERRORLEVEL! NEQ 0 (
        echo [ERROR] Failed to install backend dependencies
        pause
        exit /b 1
    )
) else (
    echo [OK] Backend dependencies already installed
)

REM Create dataset directory if it doesn't exist
if not exist "dataset\" (
    echo Creating dataset directory...
    mkdir dataset
)

cd ..
echo.

REM ================================================================
REM 4. VERIFY CONFIGURATION FILES
REM ================================================================
echo [4/6] Verifying configuration files...
echo.

if not exist "frontend\.env.local" (
    echo Creating frontend environment configuration...
    (
        echo NEXT_PUBLIC_API_BASE=http://localhost:8000
        echo NEXT_PUBLIC_API_TIMEOUT=10000
    ) > frontend\.env.local
    echo [OK] Created frontend\.env.local
) else (
    echo [OK] Frontend configuration exists
)

if not exist "backend\.env" (
    echo Creating backend environment configuration...
    (
        echo API_HOST=0.0.0.0
        echo API_PORT=8000
        echo DEBUG=True
        echo DATASET_DIR=./dataset
        echo CORS_ORIGINS=http://localhost:3000,http://localhost:3001
        echo LOG_LEVEL=info
    ) > backend\.env
    echo [OK] Created backend\.env
) else (
    echo [OK] Backend configuration exists
)

echo.

REM ================================================================
REM 5. DISPLAY STARTUP INFORMATION
REM ================================================================
echo [5/6] Preparing to launch services...
echo.
echo ================================================================
echo   STARTUP INFORMATION
echo ================================================================
echo.
echo Frontend (Next.js):
echo   URL: http://localhost:3000
echo   Status: Will start in a new window
echo   Logs: Check the window titled "CareerPilot Frontend"
echo.
echo Backend (FastAPI):
echo   URL: http://localhost:8000
echo   API Docs: http://localhost:8000/docs
echo   Status: Will start in a new window
echo   Logs: Check the window titled "CareerPilot Backend"
echo.
echo ================================================================
echo.
echo Press ANY key to start the services...
echo.
pause >nul

REM ================================================================
REM 6. START SERVICES
REM ================================================================
echo [6/6] Launching services...
echo.

REM Start Backend in a new window
echo Starting Backend (FastAPI)...
start "CareerPilot Backend" cmd /k "cd /d %CD%\backend && venv\Scripts\activate.bat && python run.py"

REM Give backend time to start
timeout /t 3 /nobreak

REM Start Frontend in a new window
echo Starting Frontend (Next.js)...
start "CareerPilot Frontend" cmd /k "cd /d %CD%\frontend && npm run dev"

echo.
echo ================================================================
echo   STARTUP COMPLETE!
echo ================================================================
echo.
echo Services are starting in separate windows:
echo.
echo   1. CareerPilot Frontend - Next.js development server
echo   2. CareerPilot Backend - FastAPI development server
echo.
echo Available URLs:
echo   Frontend:     http://localhost:3000
echo   Backend:      http://localhost:8000
echo   API Docs:     http://localhost:8000/docs
echo   Backend ReDoc: http://localhost:8000/redoc
echo.
echo IMPORTANT NOTES:
echo   - Keep the two service windows open while developing
echo   - Frontend will auto-reload on code changes
echo   - Backend will auto-reload on code changes (with --reload flag)
echo   - Check each window for errors or logs
echo   - To stop: Close the service windows
echo.
echo First time setup may take a few minutes.
echo Refresh http://localhost:3000 in your browser once both services are running.
echo.
echo ================================================================
echo.

REM Keep this window open
echo This window will remain open. Close it to end the session.
pause

endlocal
