# ✈️ SkyDeal: Real-Time Flight Deal Search & Booking

SkyDeal is a modern, responsive web application designed to help users search, compare, and instantly book the best flight deals. The application is built with a powerful React (TypeScript + Vite) frontend and a FastAPI (Python + Playwright) backend that scrapes live flight data directly from Google Flights.

## ✨ Features

- 🕒 **Real-Time Data Scraper**: Scrapes live flight prices, durations, stopovers, and routes directly from Google Flights using headless Playwright.
- 🎨 **Beautiful & Modern UI**: Built with a sleek, interactive glass-morphism aesthetic featuring smooth CSS micro-animations and color gradients. 
- 📅 **Flexible Dates Estimation**: Estimates flexible dates to give you a quick overview of prices around your selected travel time. 
- 🔗 **Direct Booking Link**: Select a flight and proceed immediately to the booking/checkout screen prepopulated with your exact flight details.
- 🌍 **Internationalization (i18n)**: Instantly toggle the interface language between English, Korean, and Chinese with localized currency and date formatting.
- ✨ **Search History**: Convenient one-click access to recent searches directly from the homepage.
- 🧹 **Robust Airline Filter**: Allows filtering results by airline dynamically based on actual scraped results.

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS (Custom Theme Variables)
- **Backend / Scraper**: Python 3, FastAPI, Playwright (Async Chrome/Chromium API)
- **Development Tooling**: ESLint, Uvicorn 

## 🚀 Getting Started

To run the full stack effortlessly on a local environment, use the provided batch script `run_skydeal.bat` (Windows only) or run both environments manually.

**Prerequisites:**
- Node.js & npm installed
- Python 3.9+ & pip installed
- Playwright browsers installed (`playwright install`)

### Option 1: One-Click Run (Windows)
```bash
# In the root project directory, double click the file or run it in terminal
.\run_skydeal.bat
# Wait for the servers to initialize and visit http://localhost:5173
```

### Option 2: Running Manually

**1. Start the FastAPI Backend**
```bash
pip install fastapi uvicorn playwright
playwright install
uvicorn api_server:app --port 8000 --host 0.0.0.0
```

**2. Start the React Frontend**
```bash
npm install
npm run dev
# App will be accessible at http://localhost:5173
```

## 📝 Usage

1. Open the UI and select your `Origin` and `Destination`.
2. Choose your travel dates (Departure and Return). 
3. Click **Search**. The backend will take roughly 10-15 seconds to parse real-time elements directly from Google Flights. 
4. View the flight results, which are accurately mapped with total duration, layovers, price, CO2 emissions, etc.
5. Click **Book Now (결제하기)** to proceed seamlessly to the Google Flights booking page for that exact itinerary.

## 📜 License
© 2026 SkyDeal All rights reserved.
