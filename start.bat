@echo off
setlocal enabledelayedexpansion
title SpamShield AI Launcher
cd /d "%~dp0"

echo ==============================================================
echo                    SPAMSHIELD AI LAUNCHER
echo      Indian Cyber Scam & Phishing Intelligence Platform
echo ==============================================================
echo.

:: 1. Check Python
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python is not installed or not in your system PATH.
    echo Please install Python 3.10+ from https://www.python.org/
    pause
    exit /b 1
)

:: 2. Check Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not installed or not in your system PATH.
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

:: 3. Setup Virtual Environment
if not exist "backend\.venv\Scripts\activate.bat" (
    echo [1/5] Creating Python virtual environment in backend\.venv...
    python -m venv backend\.venv
)

echo [2/5] Activating virtual environment & installing dependencies...
call backend\.venv\Scripts\activate.bat
python -m pip install --upgrade pip >nul 2>&1
pip install -r backend\requirements.txt

:: 4. Initialize Database and seed CSV data
echo [3/5] Initializing SQLite database and verifying dataset...
cd backend
python -c "import database, models, dataset_import; database.Base.metadata.create_all(bind=database.engine); s=database.SessionLocal(); dataset_import.import_dataset_if_empty(s); s.close()"
cd ..

:: 5. Install Frontend Dependencies
echo [4/5] Checking frontend dependencies...
cd frontend
if not exist "node_modules" (
    echo Installing frontend packages with npm...
    call npm install
)
cd ..

:: 6. Start Services
echo [5/5] Starting Backend (Port 8000) and Frontend (Port 5173)...

:: Start backend in separate background window
start "SpamShield-Backend" cmd /c "cd /d "%~dp0backend" && call .venv\Scripts\activate.bat && uvicorn main:app --host 127.0.0.1 --port 8000 --reload"

:: Start frontend in separate background window
start "SpamShield-Frontend" cmd /c "cd /d "%~dp0frontend" && npm run dev"

:: Wait 3 seconds for servers to bind
timeout /t 3 /nobreak >nul

:: Automatically open browser
start http://localhost:5173

echo.
echo ==============================================================
echo              SPAMSHIELD AI IS NOW ONLINE!
echo ==============================================================
echo   Frontend Dashboard:  http://localhost:5173
echo   Backend API:         http://127.0.0.1:8000
echo   Interactive API:     http://127.0.0.1:8000/docs
echo ==============================================================
echo   Both services are running in background processes.
echo   To stop all services cleanly, run: stop.bat
echo ==============================================================
echo.
pause
