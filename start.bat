@echo off
echo ========================================================
echo   Starting KisanSetu: AI Direct Farm-to-Market Platform
echo ========================================================
echo.

start "KisanSetu AI Microservice (:5001)" cmd /k "cd ai-service && python app.py"
start "KisanSetu Backend API (:5000)" cmd /k "cd backend && node server.js"
start "KisanSetu Frontend (:3000)" cmd /k "cd frontend && npm run dev"

echo All services are launching!
echo Frontend will be available at: http://localhost:3000
echo Backend will be available at: http://localhost:5000
echo AI Microservice will be available at: http://localhost:5001
echo.
pause
