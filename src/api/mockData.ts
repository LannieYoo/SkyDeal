import { FlightOffer, FlightItinerary, FlightSegment, Layover, SearchParams, FlexibleDateResult } from '../types';
import { getAirlineLogo } from '../data/airlines';
import { airports } from '../data/airports';

// Realistic route definitions
interface RouteTemplate {
  airlines: string[];
  basePriceKRW: number;
  directDurationMin: number;
  hasDirectFlights: boolean;
  layoverAirports?: string[];
}

const routeTemplates: Record<string, RouteTemplate> = {
  'ICN-NRT': { airlines: ['KE', 'OZ', 'JL', 'NH', '7C', 'TW', 'LJ'], basePriceKRW: 250000, directDurationMin: 150, hasDirectFlights: true },
  'ICN-KIX': { airlines: ['KE', 'OZ', 'JL', '7C', 'TW', 'LJ', 'MM'], basePriceKRW: 220000, directDurationMin: 130, hasDirectFlights: true },
  'ICN-HND': { airlines: ['KE', 'OZ', 'NH', 'JL'], basePriceKRW: 280000, directDurationMin: 145, hasDirectFlights: true },
  'ICN-FUK': { airlines: ['KE', 'OZ', '7C', 'TW', 'LJ', 'BX'], basePriceKRW: 180000, directDurationMin: 90, hasDirectFlights: true },
  'ICN-CTS': { airlines: ['KE', 'OZ', '7C', 'TW'], basePriceKRW: 300000, directDurationMin: 195, hasDirectFlights: true },
  'ICN-OKA': { airlines: ['KE', 'OZ', '7C', 'TW', 'LJ'], basePriceKRW: 270000, directDurationMin: 160, hasDirectFlights: true },
  'ICN-BKK': { airlines: ['KE', 'OZ', 'TG', '7C', 'TW', 'LJ'], basePriceKRW: 350000, directDurationMin: 360, hasDirectFlights: true },
  'ICN-SGN': { airlines: ['KE', 'OZ', 'VN', 'VJ', '7C'], basePriceKRW: 380000, directDurationMin: 330, hasDirectFlights: true },
  'ICN-DAD': { airlines: ['KE', 'OZ', 'VN', 'VJ', '7C', 'TW'], basePriceKRW: 300000, directDurationMin: 300, hasDirectFlights: true },
  'ICN-HAN': { airlines: ['KE', 'OZ', 'VN', 'VJ', '7C', 'TW'], basePriceKRW: 320000, directDurationMin: 280, hasDirectFlights: true },
  'ICN-SIN': { airlines: ['KE', 'OZ', 'SQ', '7C'], basePriceKRW: 400000, directDurationMin: 390, hasDirectFlights: true },
  'ICN-MNL': { airlines: ['KE', 'OZ', '7C', 'TW'], basePriceKRW: 320000, directDurationMin: 250, hasDirectFlights: true },
  'ICN-CEB': { airlines: ['KE', '7C', 'TW', 'LJ'], basePriceKRW: 280000, directDurationMin: 270, hasDirectFlights: true },
  'ICN-DPS': { airlines: ['KE', 'OZ', '7C'], basePriceKRW: 500000, directDurationMin: 420, hasDirectFlights: true, layoverAirports: ['SIN', 'MNL'] },
  'ICN-HKG': { airlines: ['KE', 'OZ', 'CX', '7C', 'TW'], basePriceKRW: 300000, directDurationMin: 240, hasDirectFlights: true },
  'ICN-PVG': { airlines: ['KE', 'OZ', 'MU', 'CA'], basePriceKRW: 250000, directDurationMin: 130, hasDirectFlights: true },
  'ICN-PEK': { airlines: ['KE', 'OZ', 'CA', 'CZ'], basePriceKRW: 280000, directDurationMin: 140, hasDirectFlights: true },
  'ICN-LAX': { airlines: ['KE', 'OZ', 'AA', 'UA', 'DL', 'YP'], basePriceKRW: 800000, directDurationMin: 660, hasDirectFlights: true, layoverAirports: ['NRT', 'HND'] },
  'ICN-JFK': { airlines: ['KE', 'OZ', 'AA', 'UA', 'DL'], basePriceKRW: 950000, directDurationMin: 840, hasDirectFlights: true, layoverAirports: ['NRT', 'LAX', 'ORD'] },
  'ICN-SFO': { airlines: ['KE', 'OZ', 'UA', 'AA'], basePriceKRW: 850000, directDurationMin: 630, hasDirectFlights: true, layoverAirports: ['NRT'] },
  'ICN-SEA': { airlines: ['KE', 'DL', 'AA'], basePriceKRW: 820000, directDurationMin: 600, hasDirectFlights: true, layoverAirports: ['NRT'] },
  'ICN-HNL': { airlines: ['KE', 'OZ', '7C'], basePriceKRW: 700000, directDurationMin: 510, hasDirectFlights: true },
  'ICN-YVR': { airlines: ['KE', 'AC'], basePriceKRW: 850000, directDurationMin: 600, hasDirectFlights: true, layoverAirports: ['NRT'] },
  'ICN-YYZ': { airlines: ['KE', 'AC', 'OZ'], basePriceKRW: 1000000, directDurationMin: 780, hasDirectFlights: true, layoverAirports: ['YVR', 'NRT'] },
  'ICN-LHR': { airlines: ['KE', 'OZ', 'BA'], basePriceKRW: 900000, directDurationMin: 720, hasDirectFlights: true, layoverAirports: ['NRT', 'FRA'] },
  'ICN-CDG': { airlines: ['KE', 'OZ', 'AF'], basePriceKRW: 880000, directDurationMin: 720, hasDirectFlights: true, layoverAirports: ['FRA'] },
  'ICN-FCO': { airlines: ['KE', 'OZ'], basePriceKRW: 900000, directDurationMin: 750, hasDirectFlights: true, layoverAirports: ['FRA', 'IST'] },
  'ICN-IST': { airlines: ['KE', 'OZ', 'TK'], basePriceKRW: 750000, directDurationMin: 660, hasDirectFlights: true },
  'ICN-YOW': { airlines: ['KE', 'AC', 'UA'], basePriceKRW: 2400000, directDurationMin: 860, hasDirectFlights: false, layoverAirports: ['YYZ', 'YVR', 'ORD', 'SFO'] },
  'ICN-SYD': { airlines: ['KE', 'OZ', 'SQ'], basePriceKRW: 800000, directDurationMin: 620, hasDirectFlights: true, layoverAirports: ['SIN', 'HKG'] },
  'ICN-GUM': { airlines: ['KE', 'OZ', '7C', 'TW'], basePriceKRW: 400000, directDurationMin: 260, hasDirectFlights: true },
  'ICN-SPN': { airlines: ['7C', 'TW', 'OZ'], basePriceKRW: 380000, directDurationMin: 250, hasDirectFlights: true },
  'GMP-HND': { airlines: ['KE', 'OZ', 'NH', 'JL'], basePriceKRW: 300000, directDurationMin: 140, hasDirectFlights: true },
  'GMP-KIX': { airlines: ['KE', 'OZ'], basePriceKRW: 240000, directDurationMin: 125, hasDirectFlights: true },
  'PUS-NRT': { airlines: ['KE', 'OZ', '7C', 'BX'], basePriceKRW: 220000, directDurationMin: 140, hasDirectFlights: true },
  'PUS-FUK': { airlines: ['KE', 'BX', '7C'], basePriceKRW: 150000, directDurationMin: 70, hasDirectFlights: true },
  'PUS-KIX': { airlines: ['KE', 'BX', '7C', 'OZ'], basePriceKRW: 180000, directDurationMin: 105, hasDirectFlights: true },
};

function getRouteKey(origin: string, destination: string): string | null {
  const key = `${origin}-${destination}`;
  if (routeTemplates[key]) return key;
  // Check reverse
  const reverseKey = `${destination}-${origin}`;
  if (routeTemplates[reverseKey]) return reverseKey;
  return null;
}

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getAirportCity(code: string): string {
  return airports.find(a => a.code === code)?.city || code;
}

function generateDepartureTime(): string {
  const hour = getRandomInt(6, 22);
  const minute = [0, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55][getRandomInt(0, 10)];
  return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
}

function addMinutesToTime(date: string, time: string, minutes: number): { date: string; time: string } {
  const dt = new Date(`${date}T${time}:00`);
  dt.setMinutes(dt.getMinutes() + minutes);
  const newDate = dt.toISOString().split('T')[0];
  const newTime = `${dt.getHours().toString().padStart(2, '0')}:${dt.getMinutes().toString().padStart(2, '0')}`;
  return { date: newDate, time: newTime };
}

function createDirectSegment(
  origin: string,
  destination: string,
  date: string,
  airline: string,
  durationMin: number,
): FlightSegment {
  const depTime = generateDepartureTime();
  const arrival = addMinutesToTime(date, depTime, durationMin);
  const flightNum = `${airline}${getRandomInt(100, 999)}`;

  return {
    departureAirport: origin,
    departureCity: getAirportCity(origin),
    arrivalAirport: destination,
    arrivalCity: getAirportCity(destination),
    departureTime: `${date}T${depTime}:00`,
    arrivalTime: `${arrival.date}T${arrival.time}:00`,
    duration: `PT${Math.floor(durationMin / 60)}H${durationMin % 60}M`,
    airline: airline,
    airlineCode: airline,
    airlineLogo: getAirlineLogo(airline),
    flightNumber: flightNum,
    aircraft: ['A321', 'B737-800', 'B777-300ER', 'A330-300', 'A350-900', 'B787-9'][getRandomInt(0, 5)],
  };
}

function createItinerary(
  origin: string,
  destination: string,
  date: string,
  airline: string,
  baseDurationMin: number,
  isDirect: boolean,
  layoverAirport?: string,
): FlightItinerary {
  if (isDirect) {
    const durationVariation = getRandomInt(-15, 20);
    const duration = baseDurationMin + durationVariation;
    const segment = createDirectSegment(origin, destination, date, airline, duration);
    return {
      segments: [segment],
      layovers: [],
      totalDuration: segment.duration,
      totalDurationMinutes: duration,
      stops: 0,
    };
  }

  // Connecting flight
  const layoverCode = layoverAirport || 'NRT';
  const firstLegDuration = getRandomInt(Math.floor(baseDurationMin * 0.3), Math.floor(baseDurationMin * 0.5));
  const layoverDuration = getRandomInt(60, 300);
  const secondLegDuration = baseDurationMin - firstLegDuration + getRandomInt(-20, 40);

  const seg1 = createDirectSegment(origin, layoverCode, date, airline, firstLegDuration);
  const layoverEnd = addMinutesToTime(
    seg1.arrivalTime.split('T')[0],
    seg1.arrivalTime.split('T')[1].substring(0, 5),
    layoverDuration,
  );
  
  // Second segment airline (sometimes different)
  const seg2Airline = Math.random() > 0.7 ? airline : airline;
  const seg2DepTime = `${layoverEnd.date}T${layoverEnd.time}:00`;
  const seg2ArrTime = addMinutesToTime(layoverEnd.date, layoverEnd.time, secondLegDuration);

  const seg2: FlightSegment = {
    departureAirport: layoverCode,
    departureCity: getAirportCity(layoverCode),
    arrivalAirport: destination,
    arrivalCity: getAirportCity(destination),
    departureTime: seg2DepTime,
    arrivalTime: `${seg2ArrTime.date}T${seg2ArrTime.time}:00`,
    duration: `PT${Math.floor(secondLegDuration / 60)}H${secondLegDuration % 60}M`,
    airline: seg2Airline,
    airlineCode: seg2Airline,
    airlineLogo: getAirlineLogo(seg2Airline),
    flightNumber: `${seg2Airline}${getRandomInt(100, 999)}`,
    aircraft: ['A321', 'B737-800', 'B777-300ER', 'A330-300'][getRandomInt(0, 3)],
  };

  const totalDuration = firstLegDuration + layoverDuration + secondLegDuration;

  const layover: Layover = {
    airport: airports.find(a => a.code === layoverCode)?.name || layoverCode,
    airportCode: layoverCode,
    city: getAirportCity(layoverCode),
    duration: `PT${Math.floor(layoverDuration / 60)}H${layoverDuration % 60}M`,
    durationMinutes: layoverDuration,
  };

  return {
    segments: [seg1, seg2],
    layovers: [layover],
    totalDuration: `PT${Math.floor(totalDuration / 60)}H${totalDuration % 60}M`,
    totalDurationMinutes: totalDuration,
    stops: 1,
  };
}

function generateFlightsForRoute(
  origin: string,
  destination: string,
  departDate: string,
  returnDate: string,
  template: RouteTemplate,
): FlightOffer[] {
  const offers: FlightOffer[] = [];

  template.airlines.forEach((airline) => {
    // Direct flights
    if (template.hasDirectFlights) {
      const numDirect = getRandomInt(1, 3);
      for (let i = 0; i < numDirect; i++) {
        const priceVariation = 1 + (Math.random() - 0.5) * 0.6;
        const price = Math.round(template.basePriceKRW * priceVariation / 1000) * 1000;

        const outbound = createItinerary(origin, destination, departDate, airline, template.directDurationMin, true);
        const inbound = createItinerary(destination, origin, returnDate, airline, template.directDurationMin, true);

        offers.push({
          id: `${airline}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          price,
          currency: 'KRW',
          outbound,
          inbound,
          airlines: [airline],
          airlineCodes: [airline],
          departureDate: departDate,
          returnDate,
          seatsRemaining: getRandomInt(1, 9),
        });
      }
    }

    // Connecting flights (occasionally, or always if no direct flights exist)
    if (template.layoverAirports && template.layoverAirports.length > 0 && (!template.hasDirectFlights || Math.random() > 0.4)) {
      const numConnecting = template.hasDirectFlights ? 1 : getRandomInt(1, 3);
      for (let i = 0; i < numConnecting; i++) {
        const layoverAirport = template.layoverAirports[getRandomInt(0, template.layoverAirports.length - 1)];
        const priceVariation = (!template.hasDirectFlights ? 1 + (Math.random() - 0.5) * 0.6 : 0.65 + Math.random() * 0.25);
        const price = Math.round(template.basePriceKRW * priceVariation / 1000) * 1000;

        const outbound = createItinerary(origin, destination, departDate, airline, template.directDurationMin, false, layoverAirport);
        const inbound = createItinerary(destination, origin, returnDate, airline, template.directDurationMin, false, layoverAirport);

        offers.push({
          id: `${airline}-connect-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          price,
          currency: 'KRW',
          outbound,
          inbound,
          airlines: [airline],
          airlineCodes: [airline],
          departureDate: departDate,
          returnDate,
          seatsRemaining: getRandomInt(1, 9),
        });
      }
    }
  });

  return offers.sort((a, b) => a.price - b.price);
}

function generateGenericRoute(
  origin: string,
  destination: string,
  departDate: string,
  returnDate: string,
): FlightOffer[] {
  const genericAirlines = ['KE', 'OZ', 'AA', 'UA', 'EK', 'TK', 'SQ'];
  const baseDuration = getRandomInt(400, 900);
  const basePrice = getRandomInt(600000, 1800000);

  const template: RouteTemplate = {
    airlines: genericAirlines.slice(0, getRandomInt(3, 6)),
    basePriceKRW: basePrice,
    directDurationMin: baseDuration,
    hasDirectFlights: true,
    layoverAirports: ['NRT', 'SIN', 'IST', 'FRA'].slice(0, getRandomInt(1, 3)),
  };

  return generateFlightsForRoute(origin, destination, departDate, returnDate, template);
}

export async function searchFlights(params: SearchParams): Promise<FlightOffer[]> {
  const { origin, destination, departureDate, returnDate } = params;
  try {
    const res = await fetch(`http://localhost:8000/api/flights?origin=${origin}&destination=${destination}&departureDate=${departureDate}&returnDate=${returnDate}`);
    if (res.ok) {
      const data = await res.json();
      return data;
    }
    console.error("API error", res.status);
    return [];
  } catch (e) {
    console.error("Failed to fetch from python API", e);
    // Fallback to generic mock if backend is not running
    return generateGenericRoute(origin, destination, departureDate, returnDate);
  }
}

export async function searchFlexibleDates(params: SearchParams): Promise<{
  offers: FlightOffer[];
  dateGrid: FlexibleDateResult[];
}> {
  const { origin, destination, departureDate, returnDate, flexibleRange } = params;
  
  try {
    const range = flexibleRange || 3;
    const res = await fetch(`http://localhost:8000/api/flexible-dates?origin=${origin}&destination=${destination}&departureDate=${departureDate}&returnDate=${returnDate}&flexibleRange=${range}`);
    
    if (res.ok) {
      const data = await res.json();
      if (data.offers && data.offers.length > 0) {
        return {
          offers: data.offers,
          dateGrid: data.dateGrid || []
        };
      }
    }
    console.error("API returned empty or failed:", res.status);
    throw new Error('Fallback trigger');
  } catch (e) {
    console.error("Failed to fetch flexible dates from python API, using fallback logic", e);
    // Fallback if backend is not running or scraped 0 flights for a complex route
    const fallbackOffers = generateGenericRoute(origin, destination, departureDate, returnDate);
    const dateGrid: FlexibleDateResult[] = [];
    const baseDate = new Date(departureDate);
    const baseRet = new Date(returnDate);
    const range = flexibleRange || 3;
    const basePrice = fallbackOffers.length > 0 ? fallbackOffers[0].price : 1200000;
    
    for (let d = -range; d <= range; d++) {
      for (let r = -range; r <= range; r++) {
        const dd = new Date(baseDate); dd.setDate(dd.getDate() + d);
        const rr = new Date(baseRet); rr.setDate(rr.getDate() + r);
        if (dd >= rr || dd < new Date()) continue;
        
        // Deterministic price variation based on days
        const diff = Math.abs(d) + Math.abs(r);
        let multiplier = 1.0;
        if (dd.getDay() === 0 || dd.getDay() === 6) multiplier += 0.15;
        if (rr.getDay() === 0 || rr.getDay() === 6) multiplier += 0.15;
        multiplier += (diff * 0.05); // slightly more expensive as you move away

        // Hash for deterministic pseudo-random price variation
        const hash = (dd.getDate() * 11 + rr.getDate() * 17) % 15;
        const adjustedPrice = Math.floor(basePrice * multiplier) + (hash * 5000);
        
        dateGrid.push({
          departureDate: dd.toISOString().split('T')[0],
          returnDate: rr.toISOString().split('T')[0],
          minPrice: adjustedPrice,
          currency: 'KRW'
        });
      }
    }
    
    return { offers: fallbackOffers, dateGrid };
  }
}

