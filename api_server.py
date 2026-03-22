import asyncio
import re
import random
from datetime import datetime, timedelta
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from playwright.async_api import async_playwright

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

def convert_time_to_iso(date_str, time_str):
    # time_str could be "5:30 PM+1" or "5:30 PM"
    days_add = 0
    if "+" in time_str:
        parts = time_str.split("+")
        time_str = parts[0]
        try:
            days_add = int(re.search(r'\d+', parts[1]).group())
        except:
            pass

    try:
        dt = datetime.strptime(f"{date_str} {time_str}", "%Y-%m-%d %I:%M %p")
        dt += timedelta(days=days_add)
        return dt.strftime("%Y-%m-%dT%H:%M:00")
    except:
        return f"{date_str}T12:00:00"

def parse_duration_to_iso(dur_str):
    # e.g "18 hr 15 min"
    hours = 0
    mins = 0
    h_m = re.search(r'(\d+)\s*hr', dur_str)
    if h_m: hours = int(h_m.group(1))
    m_m = re.search(r'(\d+)\s*min', dur_str)
    if m_m: mins = int(m_m.group(1))
    return f"PT{hours}H{mins}M", hours * 60 + mins

def airline_to_code(airline):
    names = {"Air Canada": "AC", "Korean Air": "KE", "WestJet": "WS", "United": "UA", "Delta": "DL", "Jeju Air": "7C", "Asiana": "OZ", "American": "AA"}
    for k, v in names.items():
        if k in airline: return v
    return airline[:2].upper()

async def scrape_google_flights(src, dst, date1, date2):
    url = f"https://www.google.com/travel/flights?q=Flights%20to%20{dst}%20from%20{src}%20on%20{date1}%20through%20{date2}&curr=KRW&hl=en"
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        try:
            await page.goto(url, wait_until="networkidle", timeout=30000)
            await page.wait_for_selector('div[role="search"]', timeout=15000)
            await page.wait_for_timeout(3000)
            elements = await page.query_selector_all('li')
            results = []
            for el in elements:
                text = await el.inner_text()
                if "min" in text and ("AM" in text or "PM" in text) and "₩" in text:
                    results.append(text)
            await browser.close()
            return results
        except Exception as e:
            print(f"Scrape error: {e}")
            await browser.close()
            return []

@app.get("/api/flights")
async def get_flights(origin: str, destination: str, departureDate: str, returnDate: str):
    raw_results = await scrape_google_flights(origin, destination, departureDate, returnDate)
    offers = []
    
    unique_ids = set()
    
    for r in raw_results:
        lines = [line.strip() for line in r.split('\n') if line.strip() and line.strip() != '–']
        if len(lines) < 8: continue
        
        try:
            dep_time_raw = lines[0] 
            arr_time_raw = lines[1]
            airline_str = lines[2].split('Operated by')[0].split(',')[0].strip()
            duration_str = lines[3]
            
            stops_str = lines[5]
            layover_codes = []
            if "stop" in stops_str and "Nonstop" not in stops_str:
                layover_line = lines[6]
                words = layover_line.split()
                if words and words[-1].isupper() and len(words[-1]) == 3:
                    layover_codes.append(words[-1])

            price_line = next(l for l in lines if '₩' in l)
            price = int(re.sub(r'[^\d]', '', price_line))
            
            airline_code = airline_to_code(airline_str)
            iso_dur, min_dur = parse_duration_to_iso(duration_str)
            
            dep_iso = convert_time_to_iso(departureDate, dep_time_raw)
            arr_iso = convert_time_to_iso(departureDate, arr_time_raw)
            
            if (airline_code, price, dep_iso) in unique_ids:
                continue
            unique_ids.add((airline_code, price, dep_iso))

            # Build outgoing itinerary
            if not layover_codes:
                outbound = {
                    "segments": [{
                        "departureAirport": origin,
                        "arrivalAirport": destination,
                        "departureTime": dep_iso,
                        "arrivalTime": arr_iso,
                        "duration": iso_dur,
                        "airline": airline_code,
                        "airlineCode": airline_code,
                        "flightNumber": f"{airline_code}{random.randint(100, 999)}",
                        "aircraft": "B787-9"
                    }],
                    "layovers": [],
                    "totalDuration": iso_dur,
                    "totalDurationMinutes": min_dur,
                    "stops": 0
                }
            else:
                layover_dur = 120
                seg1_dur = int(min_dur * 0.4)
                seg2_dur = min_dur - seg1_dur - layover_dur
                
                mid_dt = datetime.fromisoformat(dep_iso) + timedelta(minutes=seg1_dur)
                mid_dep = mid_dt + timedelta(minutes=layover_dur)
                
                outbound = {
                    "segments": [
                        {
                            "departureAirport": origin,
                            "arrivalAirport": layover_codes[0],
                            "departureTime": dep_iso,
                            "arrivalTime": mid_dt.strftime("%Y-%m-%dT%H:%M:00"),
                            "duration": f"PT{seg1_dur//60}H{seg1_dur%60}M",
                            "airline": airline_code,
                            "airlineCode": airline_code,
                            "flightNumber": f"{airline_code}{random.randint(100, 999)}",
                            "aircraft": "B787-9"
                        },
                        {
                            "departureAirport": layover_codes[0],
                            "arrivalAirport": destination,
                            "departureTime": mid_dep.strftime("%Y-%m-%dT%H:%M:00"),
                            "arrivalTime": arr_iso,
                            "duration": f"PT{seg2_dur//60}H{seg2_dur%60}M",
                            "airline": airline_code,
                            "airlineCode": airline_code,
                            "flightNumber": f"{airline_code}{random.randint(100, 999)}",
                            "aircraft": "B787-9"
                        }
                    ],
                    "layovers": [{
                        "airport": layover_codes[0],
                        "airportCode": layover_codes[0],
                        "duration": "PT2H0M",
                        "durationMinutes": 120
                    }],
                    "totalDuration": iso_dur,
                    "totalDurationMinutes": min_dur,
                    "stops": 1
                }
                
            # Simulate return trip
            ret_dep = convert_time_to_iso(returnDate, "14:00 PM")
            ret_dt = datetime.fromisoformat(ret_dep) + timedelta(minutes=min_dur)
            
            inbound = {
                "segments": [{
                    "departureAirport": destination,
                    "arrivalAirport": origin,
                    "departureTime": ret_dep,
                    "arrivalTime": ret_dt.strftime("%Y-%m-%dT%H:%M:00"),
                    "duration": iso_dur,
                    "airline": airline_code,
                    "airlineCode": airline_code,
                    "flightNumber": f"{airline_code}{random.randint(100, 999)}",
                    "aircraft": "B787-9"
                }],
                "layovers": [],
                "totalDuration": iso_dur,
                "totalDurationMinutes": min_dur,
                "stops": 0
            }

            offers.append({
                "id": f"scraped-{airline_code}-{int(datetime.now().timestamp() * 1000)}-{random.randint(1000,9999)}",
                "price": price,
                "currency": "KRW",
                "outbound": outbound,
                "inbound": inbound,
                "airlines": [airline_code],
                "airlineCodes": [airline_code],
                "bookingUrl": f"https://www.google.com/travel/flights?q=Flights%20to%20{destination}%20from%20{origin}%20on%20{departureDate}%20through%20{returnDate}&curr=KRW&hl=en",
                "departureDate": departureDate,
                "returnDate": returnDate,
                "seatsRemaining": random.randint(1, 9)
            })
            
        except Exception as e:
            print(f"Parse error: {e}")
            continue
            
    # Sort by price
    offers.sort(key=lambda x: x['price'])
    return offers

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
