@echo off
REM ================================================================
REM CareerPilot AI - Stop Services & Cleanup
REM ================================================================

setlocal enabledelayedexpansion
cd /d "%~dp0"

echo.
echo ================================================================
echo   CareerPilot AI - Stop Services & Cleanup
echo ================================================================
echo.

REM Kill existing services
echo Stopping services...
echo.

REM Kill Node.js processes (Frontend)
taskkill /F /IM node.exe >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [OK] Stopped Node.js (Frontend)
) else (
    echo [INFO] No Node.js process found
)

REM Kill Python processes (Backend)  
taskkill /F /IM python.exe >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [OK] Stopped Python (Backend)
) else (
    echo [INFO] No Python process found
)

echo.
echo ================================================================
echo Optional Cleanup Options
echo ================================================================
echo.

set /p cleanup="Do you want to perform full cleanup (y/n)? "

if /i "%cleanup%"=="y" (
    echo.
    echo This will delete:
    echo   1. Frontend node_modules folder
    echo   2. Backend virtual environment folder
    echo   3. Node cache files
    echo.
    
    set /p confirm="Continue with cleanup (y/n)? "
    
    if /i "%confirm%"=="y" (
        echo.
        echo Cleaning up...
        
        if exist "frontend\node_modules" (
            echo Removing frontend node_modules...
            rmdir /s /q "frontend\node_modules"
            echo [OK] Removed frontend node_modules
        )
        
        if exist "backend\venv" (
            echo Removing backend virtual environment...
            rmdir /s /q "backend\venv"
            echo [OK] Removed backend venv
        )
        
        REM Clean Node.js cache
        if exist "frontend\.next" (
            rmdir /s /q "frontend\.next"
            echo [OK] Removed Next.js build
        )
        
        echo.
        echo [CLEANUP COMPLETE]
        echo To reinstall, run: RUN_PROJECT.bat
    ) else (
        echo Cleanup cancelled.
    )
) else (
    echo No cleanup performed.
)

echo.
echo ================================================================
echo All services stopped
echo ================================================================
echo.

pause

endlocal
