@echo off
echo Starting SkyDeal Application...
echo.
echo [1/2] Starting Python FastAPI Backend...
start cmd /k "python api_server.py"

echo.
echo [2/2] Starting React Frontend...
start cmd /k "npm run dev"

echo.
echo SkyDeal Application is starting! 
echo Python backend is running on http://localhost:8000
echo React frontend is running on http://localhost:5173
echo Please wait a moment and then open your browser at http://localhost:5173
