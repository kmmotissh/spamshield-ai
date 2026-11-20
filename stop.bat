@echo off
title Stop SpamShield AI
cd /d "%~dp0"

echo ==============================================================
echo                 STOPPING SPAMSHIELD AI SERVICES
echo ==============================================================

echo Terminating backend services on port 8000...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":8000" ^| findstr "LISTENING"') do (
    taskkill /F /PID %%a >nul 2>&1
)

echo Terminating frontend services on port 5173...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5173" ^| findstr "LISTENING"') do (
    taskkill /F /PID %%a >nul 2>&1
)

echo Closing any remaining service console windows...
taskkill /FI "WINDOWTITLE eq SpamShield-Backend*" /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq SpamShield-Frontend*" /F >nul 2>&1

echo.
echo ==============================================================
echo      All SpamShield AI services stopped successfully.
echo ==============================================================
echo.
pause
