@echo off
:: SplitCompare - Windows Quick Launch Script
:: Runs dev server and opens default web browser

chcp 65001 >nul
title SplitCompare - Local Launch
echo ========================================================
echo               SplitCompare Local Server
echo ========================================================
echo.

:: Verify Node.js and npm availability
echo Checking Node.js runtime...
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not found! Please install Node.js from https://nodejs.org
    pause
    exit /b
)

:: Launch browser and start dev server
echo Starting dev-server at http://localhost:3000...
start "" "http://localhost:3000"
npm run dev
pause

