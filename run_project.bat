@echo off
setlocal

cd /d "%~dp0"

echo ==========================================
echo   SkillGap AI - One Click Launcher
echo ==========================================
echo.

where python >nul 2>&1
if errorlevel 1 (
  echo [ERROR] Python is not installed or not in PATH.
  echo Install Python and try again.
  pause
  exit /b 1
)

where npm >nul 2>&1
if errorlevel 1 (
  echo [ERROR] Node.js/npm is not installed or not in PATH.
  echo Install Node.js LTS and try again.
  pause
  exit /b 1
)

if not exist ".venv\Scripts\python.exe" (
  echo [INFO] Creating virtual environment at .venv ...
  python -m venv .venv
)

echo [INFO] Installing/updating backend dependencies ...
call ".venv\Scripts\activate.bat"
python -m pip install --upgrade pip
pip install -r "Backend\requirements.txt"

if not exist "Frontend\node_modules" (
  echo [INFO] Installing frontend dependencies ...
  cd /d "%~dp0Frontend"
  npm install
  cd /d "%~dp0"
)

echo.
echo [INFO] Starting backend on http://localhost:8000
start "SkillGap Backend" /D "%~dp0Backend" cmd /k "call "%~dp0.venv\Scripts\activate.bat" ^& uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"

echo [INFO] Starting frontend on http://localhost:5173
start "SkillGap Frontend" /D "%~dp0Frontend" cmd /k "npm run dev"

echo.
echo [DONE] Project started in two new terminals.
echo Open: http://localhost:5173
echo.
pause
