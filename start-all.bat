@echo off
echo ========================================
echo   Starting TempMail + NoteMail System
echo ========================================
echo.

echo [1/3] Starting TempMail Backend (Port 5000)...
start "TempMail Backend" cmd /k "cd backend && node server.js"

timeout /t 2 /nobreak >nul

echo [2/3] Starting NoteMail Backend (Port 5001)...
start "NoteMail Backend" cmd /k "cd backend && node notemail.js"

timeout /t 2 /nobreak >nul

echo [3/3] Starting Frontend (Port 5173)...
start "Frontend Dev Server" cmd /k "cd frontend && npm run dev"

timeout /t 5 /nobreak >nul

echo.
echo ========================================
echo   All Services Started Successfully!
echo ========================================
echo.
echo TempMail:     http://localhost:5173
echo NoteMail:     http://localhost:5173/notemail
echo.
echo Backend APIs:
echo - TempMail:   http://localhost:5000
echo - NoteMail:   http://localhost:5001
echo.
echo Press any key to open TempMail in browser...
pause >nul

start http://localhost:5173

echo.
echo All services are running in separate windows.
echo Close those windows to stop the services.
echo.
pause
