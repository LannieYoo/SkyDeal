// ===== Flight Search Types =====

export interface Airport {
  code: string;
  name: string;
  city: string;
  country: string;
  lat?: number;
  lng?: number;
  type?: 'large' | 'medium';
}

export interface SearchParams {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate: string;
  flexibleDates: boolean;
  flexibleRange: number;
  passengers: number;
  cabinClass: CabinClass;
}

export type CabinClass = 'ECONOMY' | 'PREMIUM_ECONOMY' | 'BUSINESS' | 'FIRST';

export interface FlightSegment {
  departureAirport: string;
  departureCity: string;
  arrivalAirport: string;
  arrivalCity: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;        // e.g., "PT2H30M"
  airline: string;
  airlineCode: string;
  airlineLogo: string;
  flightNumber: string;
  aircraft: string;
}

export interface Layover {
  airport: string;
  airportCode: string;
  city: string;
  duration: string;        // e.g., "PT3H15M"
  durationMinutes: number;
}

export interface FlightItinerary {
  segments: FlightSegment[];
  layovers: Layover[];
  totalDuration: string;
  totalDurationMinutes: number;
  stops: number;
}

export interface FlightOffer {
  id: string;
  price: number;
  currency: string;
  outbound: FlightItinerary;
  inbound: FlightItinerary;
  airlines: string[];
  airlineCodes: string[];
  bookingUrl?: string;
  seatsRemaining?: number;
  departureDate: string;
  returnDate: string;
}

export interface AirlineFilter {
  code: string;
  name: string;
  logo: string;
  checked: boolean;
  count: number;
  minPrice: number;
}

export type SortOption = 'price' | 'duration' | 'departure' | 'arrival';

export interface FlexibleDateResult {
  departureDate: string;
  returnDate: string;
  minPrice: number;
  currency: string;
}
