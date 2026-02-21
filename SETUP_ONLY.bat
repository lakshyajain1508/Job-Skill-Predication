@echo off
REM ================================================================
REM CareerPilot AI - First Time Setup Only
REM ================================================================

setlocal enabledelayedexpansion
cd /d "%~dp0"

echo.
echo ================================================================
echo   CareerPilot AI - SETUP ONLY (Does not start services)
echo ================================================================
echo.

REM Check Python
echo Checking Python...
python --version >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Python not found. Please install Python 3.10+
    pause
    exit /b 1
)
echo [OK] Python is installed

REM Check Node.js
echo Checking Node.js...
node --version >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js not found. Please install Node.js
    pause
    exit /b 1
)
echo [OK] Node.js is installed

echo.
echo ================================================================
echo Setting up Frontend...
echo ================================================================
echo.

cd frontend
echo Installing npm dependencies...
call npm install

if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to install frontend dependencies
    pause
    exit /b 1
)

echo [OK] Frontend setup complete
cd ..

echo.
echo ================================================================
echo Setting up Backend...
echo ================================================================
echo.

cd backend

REM Create virtual environment
echo Creating Python virtual environment...
python -m venv venv

if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to create virtual environment
    cd ..
    pause
    exit /b 1
)

REM Activate and install
call venv\Scripts\activate.bat
echo Installing Python dependencies...
pip install -r requirements.txt

if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to install backend dependencies
    cd ..
    pause
    exit /b 1
)

echo [OK] Backend setup complete

REM Create dataset directory
if not exist "dataset" (
    mkdir dataset
    echo [OK] Created dataset directory
)

cd ..

echo.
echo ================================================================
echo Environment Configuration
echo ================================================================
echo.

if not exist "frontend\.env.local" (
    (
        echo NEXT_PUBLIC_API_BASE=http://localhost:8000
        echo NEXT_PUBLIC_API_TIMEOUT=10000
    ) > frontend\.env.local
    echo [OK] Created frontend\.env.local
)

if not exist "backend\.env" (
    (
        echo API_HOST=0.0.0.0
        echo API_PORT=8000
        echo DEBUG=True
        echo DATASET_DIR=./dataset
        echo CORS_ORIGINS=http://localhost:3000,http://localhost:3001
        echo LOG_LEVEL=info
    ) > backend\.env
    echo [OK] Created backend\.env
)

echo.
echo ================================================================
echo SETUP COMPLETE!
echo ================================================================
echo.
echo Next steps:
echo   1. Review the created .env files (frontend\.env.local, backend\.env)
echo   2. Add CSV dataset files to backend\dataset\ folder (optional)
echo   3. Run RUN_PROJECT.bat to start both services
echo.
echo For more information, check:
echo   - backend\README.md
echo   - backend\SETUP.md
echo   - frontend\README.md
echo.
echo ================================================================
echo.

pause

endlocal
