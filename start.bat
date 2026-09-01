@echo off
chcp 65001 >nul
title SplitCompare - Local Launch
echo ========================================================
echo               SplitCompare Local Server
echo ========================================================
echo.
echo Checking Node.js...
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not found! Please install it from https://nodejs.org
    pause
    exit /b
)
echo Starting dev-server at http://localhost:3000...
start "" "http://localhost:3000"
npm run dev
pause
