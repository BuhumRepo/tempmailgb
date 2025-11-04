@echo off
echo ========================================
echo   Starting NoteMail System
echo ========================================
echo.

echo Starting NoteMail Backend (Port 5001)...
start "NoteMail Backend" cmd /k "cd backend && node notemail.js"

timeout /t 3 /nobreak >nul

echo.
echo Starting TempMail Backend (Port 5000)...
start "TempMail Backend" cmd /k "cd backend && node server.js"

timeout /t 3 /nobreak >nul

echo.
echo Starting Frontend (Port 5173)...
start "Frontend" cmd /k "cd frontend && npm run dev"

timeout /t 5 /nobreak >nul

echo.
echo ========================================
echo   All Services Started!
echo ========================================
echo.
echo TempMail:  http://localhost:5173
echo NoteMail:  http://localhost:5173/notemail
echo.
echo Press any key to open browser...
pause >nul

start http://localhost:5173/notemail

echo.
echo Services are running in separate windows.
echo Close those windows to stop the services.
echo.
pause
