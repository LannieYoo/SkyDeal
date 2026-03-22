import { useState, useCallback, useEffect } from 'react';
import { SearchParams, CabinClass } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { t, formatPassengers } from '../utils/i18n';
import AirportInput from './AirportInput';
import MapModal from './MapModal';
import { airports } from '../data/airports';
import { getLocalizedCity } from '../utils/langUtils';

function getToday() {
  return new Date().toISOString().split('T')[0];
}

function getDateFromNow(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

// SVG Icons
function PlaneDepart() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 22h20"/><path d="M6.36 17.4 4 17l-2-4 1.1-.55a2 2 0 0 1 1.8 0l.17.1a2 2 0 0 0 1.8 0L8 12 5 6l.9-.45a2 2 0 0 1 2.09.2l4.02 3a2 2 0 0 0 2.1.2L22 5l-1.97 10.7a2 2 0 0 1-1.55 1.55L6.36 17.4z"/>
    </svg>
  );
}

function PlaneLand() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 22h20"/><path d="M3.77 10.77 2 9l2-4.5 1.1.55c.55.28.9.84.9 1.45s.35 1.17.9 1.45L8 8l1-6 1.1.55a2 2 0 0 1 1.1 1.8v3.15a2 2 0 0 0 .9 1.67l3.4 2.27a2 2 0 0 1 .6 2.56l-2 3.5-2.6-1.3-3.17-6.3-5.46-2.63z"/>
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="18" x="3" y="4" rx="2" /><path d="M16 2v4" /><path d="M8 2v4" /><path d="M3 10h18" />
    </svg>
  );
}

function SwapIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 16V4m0 0L3 8m4-4 4 4" /><path d="M17 8v12m0 0 4-4m-4 4-4-4" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
  );
}

interface SearchFormProps {
  onSearch: (params: SearchParams) => void;
  isLoading: boolean;
  prefill?: {
    origin: string;
    destination: string;
    departureDate: string;
    returnDate: string;
    timestamp?: number;
  } | null;
}

export default function SearchForm({ onSearch, isLoading, prefill }: SearchFormProps) {
  const lang = useLanguage();
  const [origin, setOrigin] = useState('');
  const [originDisplay, setOriginDisplay] = useState('');
  const [destination, setDestination] = useState('');
  const [destinationDisplay, setDestinationDisplay] = useState('');
  const [departureDate, setDepartureDate] = useState(getDateFromNow(14));
  const [returnDate, setReturnDate] = useState(getDateFromNow(21));
  const [flexibleDates, setFlexibleDates] = useState(false);
  const [flexibleRange, setFlexibleRange] = useState(3);
  const [passengers, setPassengers] = useState(1);
  const [cabinClass, setCabinClass] = useState<CabinClass>('ECONOMY');
  const [mapTarget, setMapTarget] = useState<'origin' | 'destination' | null>(null);

  useEffect(() => {
    if (prefill) {
      setOrigin(prefill.origin);
      setDestination(prefill.destination);
      if (prefill.departureDate) setDepartureDate(prefill.departureDate);
      if (prefill.returnDate) setReturnDate(prefill.returnDate);
      
      const originAirport = airports.find(a => a.code === prefill.origin);
      setOriginDisplay(originAirport ? `${getLocalizedCity(originAirport.city, lang)} (${originAirport.code})` : prefill.origin);
      
      const destAirport = airports.find(a => a.code === prefill.destination);
      setDestinationDisplay(destAirport ? `${getLocalizedCity(destAirport.city, lang)} (${destAirport.code})` : prefill.destination);
    }
  }, [prefill, lang]);

  useEffect(() => {
    if (origin) {
      const originAirport = airports.find(a => a.code === origin);
      if (originAirport) setOriginDisplay(`${getLocalizedCity(originAirport.city, lang)} (${originAirport.code})`);
    }
    if (destination) {
      const destAirport = airports.find(a => a.code === destination);
      if (destAirport) setDestinationDisplay(`${getLocalizedCity(destAirport.city, lang)} (${destAirport.code})`);
    }
  }, [lang, origin, destination]);

  const handleSwap = useCallback(() => {
    const tempCode = origin;
    const tempDisplay = originDisplay;
    setOrigin(destination);
    setOriginDisplay(destinationDisplay);
    setDestination(tempCode);
    setDestinationDisplay(tempDisplay);
  }, [origin, originDisplay, destination, destinationDisplay]);

  const handleSearch = useCallback(() => {
    if (!origin || !destination) return;
    onSearch({
      origin,
      destination,
      departureDate,
      returnDate,
      flexibleDates,
      flexibleRange,
      passengers,
      cabinClass,
    });
  }, [origin, destination, departureDate, returnDate, flexibleDates, flexibleRange, passengers, cabinClass, onSearch]);

  const cabinOptions = [
    { value: 'ECONOMY', label: t('search.economy', lang) },
    { value: 'PREMIUM_ECONOMY', label: t('search.premiumEconomy', lang) },
    { value: 'BUSINESS', label: t('search.business', lang) },
    { value: 'FIRST', label: t('search.first', lang) },
  ];

  return (
    <div className="glass rounded-2xl p-6 md:p-8">
      {/* Trip type tabs */}
      <div className="flex items-center gap-4 mb-6">
        <button className="px-4 py-2 bg-purple-100 text-purple-600 rounded-lg text-sm font-medium border border-purple-200">
          {t('search.roundTrip', lang)}
        </button>
        <button className="px-4 py-2 text-gray-400 rounded-lg text-sm font-medium hover:text-gray-600 transition-colors cursor-not-allowed" title={t('search.preparing', lang)}>
          {t('search.oneWay', lang)}
        </button>
      </div>

      {/* Main search fields */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
        {/* Origin */}
        <div className="md:col-span-3">
          <AirportInput
            id="origin-input"
            label={t('search.origin', lang)}
            placeholder={t('search.placeholder', lang)}
            value={originDisplay}
            icon={<PlaneDepart />}
            onMapClick={() => setMapTarget('origin')}
            onSelect={(airport) => {
              setOrigin(airport.code);
              setOriginDisplay(`${getLocalizedCity(airport.city, lang)} (${airport.code})`);
            }}
          />
        </div>

        {/* Swap button */}
        <div className="md:col-span-1 flex justify-center">
          <button
            onClick={handleSwap}
            className="p-2 rounded-full bg-surface-100 hover:bg-purple-100 text-gray-400 hover:text-purple-500 transition-all duration-200 hover:rotate-180 border border-gray-200"
            title={t('search.swapTooltip', lang)}
            id="swap-airports-btn"
          >
            <SwapIcon />
          </button>
        </div>

        {/* Destination */}
        <div className="md:col-span-3">
          <AirportInput
            id="destination-input"
            label={t('search.destination', lang)}
            placeholder={t('search.placeholder', lang)}
            value={destinationDisplay}
            icon={<PlaneLand />}
            onMapClick={() => setMapTarget('destination')}
            onSelect={(airport) => {
              setDestination(airport.code);
              setDestinationDisplay(`${getLocalizedCity(airport.city, lang)} (${airport.code})`);
            }}
          />
        </div>

        {/* Departure Date */}
        <div className="md:col-span-2">
          <label htmlFor="departure-date" className="block text-sm font-medium text-gray-400 mb-1.5">
            {t('search.departure', lang)}
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400">
              <CalendarIcon />
            </span>
            <input
              id="departure-date"
              type="date"
              value={departureDate}
              min={getToday()}
              onChange={(e) => {
                setDepartureDate(e.target.value);
                if (e.target.value > returnDate) {
                  const newReturn = new Date(e.target.value);
                  newReturn.setDate(newReturn.getDate() + 7);
                  setReturnDate(newReturn.toISOString().split('T')[0]);
                }
              }}
              className="w-full pl-10 pr-3 py-3 bg-white border border-gray-200 rounded-xl text-gray-800 transition-all duration-200"
            />
          </div>
        </div>

        {/* Return Date */}
        <div className="md:col-span-2">
          <label htmlFor="return-date" className="block text-sm font-medium text-gray-400 mb-1.5">
            {t('search.return', lang)}
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400">
              <CalendarIcon />
            </span>
            <input
              id="return-date"
              type="date"
              value={returnDate}
              min={departureDate}
              onChange={(e) => setReturnDate(e.target.value)}
              className="w-full pl-10 pr-3 py-3 bg-white border border-gray-200 rounded-xl text-gray-800 transition-all duration-200"
            />
          </div>
        </div>

        {/* Search button - icon centered */}
        <div className="md:col-span-1">
          <button
            id="search-flights-btn"
            onClick={handleSearch}
            disabled={isLoading || !origin || !destination}
            className="btn-primary w-full py-3 bg-gradient-to-r from-purple-500 to-ora-500 hover:from-purple-400 hover:to-ora-400 text-white rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/25 flex items-center justify-center"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <SearchIcon />
            )}
          </button>
        </div>
      </div>

      {/* Secondary options */}
      <div className="flex flex-wrap items-center gap-4 md:gap-6 mt-5 pt-5 border-t border-gray-100">
        {/* Flexible dates toggle */}
        <label className="flex items-center gap-2.5 cursor-pointer group" htmlFor="flexible-dates-toggle">
          <div className="relative">
            <input
              id="flexible-dates-toggle"
              type="checkbox"
              checked={flexibleDates}
              onChange={(e) => setFlexibleDates(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-10 h-5 bg-gray-200 rounded-full peer-checked:bg-purple-500 transition-colors duration-300" />
            <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-300 peer-checked:translate-x-5" />
          </div>
          <span className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors">
            {t('search.flexibleDates', lang)}
          </span>
          {flexibleDates && (
            <>
              <select
                id="flexible-range-select"
                value={flexibleRange}
                onChange={(e) => setFlexibleRange(Number(e.target.value))}
                className="bg-white border border-purple-200 rounded-lg px-2 py-1 text-sm text-purple-600 focus:border-purple-400 transition-all"
                onClick={(e) => e.stopPropagation()}
              >
                <option value={1}>±1{lang === 'en' ? ' day' : lang === 'zh' ? '天' : '일'}</option>
                <option value={2}>±2{lang === 'en' ? ' days' : lang === 'zh' ? '天' : '일'}</option>
                <option value={3}>±3{lang === 'en' ? ' days' : lang === 'zh' ? '天' : '일'}</option>
                <option value={5}>±5{lang === 'en' ? ' days' : lang === 'zh' ? '天' : '일'}</option>
                <option value={7}>±7{lang === 'en' ? ' days' : lang === 'zh' ? '天' : '일'}</option>
              </select>
              <span className="text-xs text-ora-600 bg-ora-50 px-2.5 py-1 rounded-full font-medium border border-ora-200">
                {t('search.flexibleAuto', lang)}
              </span>
            </>
          )}
        </label>

        {/* Passengers */}
        <div className="flex items-center gap-2">
          <UserIcon />
          <select
            id="passengers-select"
            value={passengers}
            onChange={(e) => setPassengers(Number(e.target.value))}
            className="bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-700 focus:border-purple-400 transition-all"
          >
            {[1, 2, 3, 4, 5, 6].map(n => (
              <option key={n} value={n}>{formatPassengers(n, lang)}</option>
            ))}
          </select>
        </div>

        {/* Cabin class */}
        <select
          id="cabin-class-select"
          value={cabinClass}
          onChange={(e) => setCabinClass(e.target.value as CabinClass)}
          className="bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-700 focus:border-purple-400 transition-all"
        >
          {cabinOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* Map Modal */}
      <MapModal
        isOpen={mapTarget !== null}
        onClose={() => setMapTarget(null)}
        onSelect={(airport) => {
          if (mapTarget === 'origin') {
            setOrigin(airport.code);
            setOriginDisplay(`${airport.city} (${airport.code})`);
          } else if (mapTarget === 'destination') {
            setDestination(airport.code);
            setDestinationDisplay(`${airport.city} (${airport.code})`);
          }
        }}
      />
    </div>
  );
}
