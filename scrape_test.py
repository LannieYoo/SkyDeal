import asyncio
from playwright.async_api import async_playwright
import json

async def scrape_google_flights(src, dst, date1, date2):
    url = f"https://www.google.com/travel/flights?q=Flights%20to%20{dst}%20from%20{src}%20on%20{date1}%20through%20{date2}&hl=en&curr=KRW"
    print(f"Loading {url}")
    
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        
        # Navigate and wait for results
        await page.goto(url, wait_until="networkidle")
        
        # Wait for flight rows to render
        try:
            await page.wait_for_selector('div[role="search"]', timeout=10000)
            await page.wait_for_timeout(3000) # give JS time
        except Exception as e:
            print("Timeout waiting for list", e)
        
        # Extract text from all list items
        results = []
        try:
            # The list of best flights is typically inside an 'ul' or a series of divs
            # We'll just grab any elements that look like a flight row.
            # Usually they are li elements with text containing AM/PM and stops.
            elements = await page.query_selector_all('li')
            for el in elements:
                text = await el.inner_text()
                if "min" in text and ("AM" in text or "PM" in text) and "₩" in text:
                    results.append(text)
        except Exception as e:
            print("Error parsing", e)
            
        await browser.close()
        
        return results

if __name__ == "__main__":
    res = asyncio.run(scrape_google_flights("YOW", "ICN", "2026-04-28", "2026-05-24"))
    with open("scrape_res.txt", "w", encoding="utf-8") as f:
        f.write(json.dumps(res, ensure_ascii=False, indent=2))
