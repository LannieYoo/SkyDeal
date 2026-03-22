import { useState, useMemo, useCallback } from 'react';
import { SearchParams, FlightOffer, AirlineFilter as AirlineFilterType, SortOption, FlexibleDateResult } from './types';
import { searchFlights, searchFlexibleDates } from './api/mockData';
import { getAirlineName, getAirlineLogo } from './data/airlines';
import { Currency, currencies, formatCurrencyPrice } from './utils/currency';
import { Language, languages, t } from './utils/i18n';
import { LanguageContext } from './contexts/LanguageContext';
import SearchForm from './components/SearchForm';
import FlightCard from './components/FlightCard';
import AirlineFilterComponent from './components/AirlineFilter';
import FlexibleDatesGrid from './components/FlexibleDatesGrid';
import LoadingSkeleton from './components/LoadingSkeleton';

interface SearchHistoryEntry {
  id: string;
  origin: string;
  destination: string;
  departureDate: string;
  returnDate: string;
  timestamp: number;
}

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [offers, setOffers] = useState<FlightOffer[]>([]);
  const [dateGrid, setDateGrid] = useState<FlexibleDateResult[]>([]);
  const [airlineFilters, setAirlineFilters] = useState<AirlineFilterType[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('price');
  const [hasSearched, setHasSearched] = useState(false);
  const [searchInfo, setSearchInfo] = useState<{ origin: string; destination: string; flexible: boolean } | null>(null);
  const [selectedFlexDep, setSelectedFlexDep] = useState('');
  const [selectedFlexRet, setSelectedFlexRet] = useState('');
  const [currency, setCurrency] = useState<Currency>('KRW');
  const [lang, setLang] = useState<Language>('ko');
  const [stopsFilter, setStopsFilter] = useState<number | null>(null);
  const [searchFormPrefill, setSearchFormPrefill] = useState<{ origin: string; destination: string; departureDate: string; returnDate: string; timestamp: number } | null>(null);
  const [searchHistory, setSearchHistory] = useState<SearchHistoryEntry[]>(() => {
    try {
      const saved = localStorage.getItem('skydeal_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const buildAirlineFilters = useCallback((flightOffers: FlightOffer[]): AirlineFilterType[] => {
    const map = new Map<string, { count: number; minPrice: number }>();
    flightOffers.forEach(offer => {
      offer.airlineCodes.forEach(code => {
        const existing = map.get(code);
        if (existing) {
          existing.count++;
          existing.minPrice = Math.min(existing.minPrice, offer.price);
        } else {
          map.set(code, { count: 1, minPrice: offer.price });
        }
      });
    });

    return Array.from(map.entries())
      .map(([code, data]) => ({
        code,
        name: getAirlineName(code),
        logo: getAirlineLogo(code),
        checked: true,
        count: data.count,
        minPrice: data.minPrice,
      }))
      .sort((a, b) => a.minPrice - b.minPrice);
  }, []);

  const handleSearch = useCallback(async (params: SearchParams) => {
    setIsLoading(true);
    setHasSearched(true);
    setSearchInfo({ origin: params.origin, destination: params.destination, flexible: params.flexibleDates });
    setSelectedFlexDep(params.departureDate);
    setSelectedFlexRet(params.returnDate);
    setDateGrid([]);
    
    // Save to history
    setSearchHistory(prev => {
      const newEntry: SearchHistoryEntry = {
        id: `${params.origin}-${params.destination}-${params.departureDate}-${params.returnDate}-${Date.now()}`,
        origin: params.origin,
        destination: params.destination,
        departureDate: params.departureDate,
        returnDate: params.returnDate,
        timestamp: Date.now(),
      };
      const filtered = prev.filter(h => !(h.origin === params.origin && h.destination === params.destination && h.departureDate === params.departureDate && h.returnDate === params.returnDate));
      const newHistory = [newEntry, ...filtered].slice(0, 5);
      localStorage.setItem('skydeal_history', JSON.stringify(newHistory));
      return newHistory;
    });

    try {
      if (params.flexibleDates) {
        const result = await searchFlexibleDates(params);
        setOffers(result.offers);
        setDateGrid(result.dateGrid);
        setAirlineFilters(buildAirlineFilters(result.offers));
      } else {
        const result = await searchFlights(params);
        setOffers(result);
        setAirlineFilters(buildAirlineFilters(result));
      }
    } catch {
      console.error('Search failed');
    } finally {
      setIsLoading(false);
    }
  }, [buildAirlineFilters]);

  const handleFlexDateSelect = useCallback(async (dep: string, ret: string) => {
    if (!searchInfo) return;
    setSelectedFlexDep(dep);
    setSelectedFlexRet(ret);
    setIsLoading(true);

    try {
      const result = await searchFlights({
        origin: searchInfo.origin,
        destination: searchInfo.destination,
        departureDate: dep,
        returnDate: ret,
        flexibleDates: false,
        flexibleRange: 3,
        passengers: 1,
        cabinClass: 'ECONOMY',
      });
      
      setOffers(prev => {
        const otherOffers = prev.filter(o => o.departureDate !== dep || o.returnDate !== ret);
        return [...result, ...otherOffers];
      });
      setAirlineFilters(buildAirlineFilters([...offers, ...result]));
    } catch {
      console.error('Flexible date search failed');
    } finally {
      setIsLoading(false);
    }
  }, [searchInfo, offers, buildAirlineFilters]);

  const toggleAirlineFilter = useCallback((code: string) => {
    setAirlineFilters(prev =>
      prev.map(f => f.code === code ? { ...f, checked: !f.checked } : f)
    );
  }, []);

  const selectAllAirlines = useCallback(() => {
    setAirlineFilters(prev => prev.map(f => ({ ...f, checked: true })));
  }, []);

  const deselectAllAirlines = useCallback(() => {
    setAirlineFilters(prev => prev.map(f => ({ ...f, checked: false })));
  }, []);

  const filteredOffers = useMemo(() => {
    const checkedCodes = new Set(airlineFilters.filter(f => f.checked).map(f => f.code));
    
    let filtered = offers.filter(offer =>
      offer.airlineCodes.some(code => checkedCodes.has(code))
    );

    if (stopsFilter !== null) {
      filtered = filtered.filter(o => 
        o.outbound.stops <= stopsFilter && o.inbound.stops <= stopsFilter
      );
    }

    if (dateGrid.length > 0 && selectedFlexDep && selectedFlexRet) {
      filtered = filtered.filter(o => o.departureDate === selectedFlexDep && o.returnDate === selectedFlexRet);
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return a.price - b.price;
        case 'duration':
          return (a.outbound.totalDurationMinutes + a.inbound.totalDurationMinutes) -
                 (b.outbound.totalDurationMinutes + b.inbound.totalDurationMinutes);
        case 'departure':
          return a.outbound.segments[0].departureTime.localeCompare(b.outbound.segments[0].departureTime);
        case 'arrival':
          return a.outbound.segments[a.outbound.segments.length - 1].arrivalTime.localeCompare(
            b.outbound.segments[b.outbound.segments.length - 1].arrivalTime
          );
        default:
          return 0;
      }
    });

    return filtered;
  }, [offers, airlineFilters, sortBy, dateGrid, selectedFlexDep, selectedFlexRet, stopsFilter]);

  const cheapestPrice = filteredOffers.length > 0 ? filteredOffers[0].price : 0;

  return (
    <LanguageContext.Provider value={lang}>
      <div className="flex flex-col min-h-screen bg-animated">
        {/* Header */}
        <header className="border-b border-purple-100/60 backdrop-blur-md bg-white/70 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-ora-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="white">
                  <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z"/>
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold gradient-text">SkyDeal</h1>
                <p className="text-xs text-gray-400">{t('header.subtitle', lang)}</p>
              </div>
            </div>

            {/* Language + Currency selectors */}
            <div className="flex items-center gap-3">
              {/* Language selector */}
              <div className="flex items-center gap-1 bg-surface-100 rounded-lg p-0.5">
                {languages.map(l => (
                  <button
                    key={l.code}
                    onClick={() => setLang(l.code)}
                    className={`px-2 py-1 rounded-md text-xs font-medium transition-all duration-200
                      ${lang === l.code
                        ? 'bg-white text-purple-600 shadow-sm'
                        : 'text-gray-400 hover:text-gray-600'
                      }`}
                    id={`lang-${l.code}`}
                    title={l.label}
                  >
                    {l.flag} {l.label}
                  </button>
                ))}
              </div>

              {/* Currency selector */}
              <select
                id="currency-select"
                value={currency}
                onChange={(e) => setCurrency(e.target.value as Currency)}
                className="bg-white border border-purple-200 rounded-lg px-3 py-1.5 text-sm text-gray-700 focus:border-purple-400 transition-all shadow-sm"
              >
                {Object.values(currencies).map(c => (
                  <option key={c.code} value={c.code}>
                    {c.symbol} {c.nameKo}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </header>

        {/* Hero + Search */}
        <main className="flex-1 flex flex-col">
          <section className="relative overflow-hidden shrink-0">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-300/10 rounded-full blur-3xl" />
              <div className="absolute top-20 -left-20 w-72 h-72 bg-ora-300/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-40 right-40 w-80 h-80 bg-purple-200/10 rounded-full blur-3xl" />
            </div>

            <div className="max-w-7xl mx-auto px-4 pt-8 pb-6 relative z-10">
              {!hasSearched && (
                <div className="text-center mb-8 animate-fade-in">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
                    {t('hero.title', lang)} <span className="gradient-text">{t('hero.highlight', lang)}</span>
                  </h2>
                  <p className="text-gray-500 text-lg">
                    {t('hero.subtitle', lang)}
                  </p>
                </div>
              )}

              <SearchForm onSearch={handleSearch} isLoading={isLoading} prefill={searchFormPrefill} />
            </div>
          </section>

          {/* Results section */}
          {hasSearched && (
            <section className="max-w-7xl mx-auto px-4 w-full py-6">
              {isLoading ? (
                <LoadingSkeleton />
              ) : (
                <>
                  {/* Flexible dates grid */}
                  {dateGrid.length > 0 && (
                    <FlexibleDatesGrid
                      results={dateGrid}
                      selectedDep={selectedFlexDep}
                      selectedRet={selectedFlexRet}
                      onSelectDate={handleFlexDateSelect}
                      currency={currency}
                    />
                  )}

                  {/* Results header */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-800">
                        {t('results.title', lang)}
                        <span className="text-purple-500 ml-2 text-sm font-normal">
                          {filteredOffers.length}{t('results.count', lang)}
                        </span>
                      </h2>
                      {cheapestPrice > 0 && (
                        <p className="text-sm text-gray-500 mt-0.5">
                          {t('results.lowestPrice', lang)} <span className="text-ora-600 font-semibold">{formatCurrencyPrice(cheapestPrice, currency)}</span> {t('results.cheapestFrom', lang)}
                        </p>
                      )}
                    </div>

                    {/* Sort options */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">{t('results.sort', lang)}</span>
                      {([
                        { key: 'price', label: t('results.sortPrice', lang) },
                        { key: 'duration', label: t('results.sortDuration', lang) },
                        { key: 'departure', label: t('results.sortDeparture', lang) },
                      ] as { key: SortOption; label: string }[]).map(option => (
                        <button
                          key={option.key}
                          onClick={() => setSortBy(option.key)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200
                            ${sortBy === option.key
                              ? 'bg-purple-100 text-purple-700 border border-purple-200'
                              : 'text-gray-500 hover:text-gray-700 border border-transparent hover:bg-gray-100'
                            }`}
                          id={`sort-${option.key}`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Main content area */}
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Airline filter sidebar */}
                    {airlineFilters.length > 0 && (
                      <aside className="lg:w-64 shrink-0">
                        <div className="lg:sticky lg:top-20">
                          <AirlineFilterComponent
                            filters={airlineFilters}
                            onToggle={toggleAirlineFilter}
                            onSelectAll={selectAllAirlines}
                            onDeselectAll={deselectAllAirlines}
                            stops={stopsFilter}
                            onStopsChange={setStopsFilter}
                            currency={currency}
                          />
                        </div>
                      </aside>
                    )}

                    {/* Flight results */}
                    <div className="flex-1 space-y-3">
                      {filteredOffers.length === 0 ? (
                        <div className="glass rounded-xl p-12 text-center">
                          <div className="text-6xl mb-4">✈️</div>
                          <h3 className="text-lg font-semibold text-gray-700 mb-2">{t('results.noResults', lang)}</h3>
                          <p className="text-gray-400 text-sm">
                            {t('results.noResultsHint', lang)}
                          </p>
                        </div>
                      ) : (
                        filteredOffers.map((offer, index) => (
                          <FlightCard
                            key={offer.id}
                            offer={offer}
                            index={index}
                            isCheapest={index === 0 && sortBy === 'price'}
                            currency={currency}
                          />
                        ))
                      )}
                    </div>
                  </div>
                </>
              )}
            </section>
          )}

          {/* Search History */}
          {!hasSearched && searchHistory.length > 0 && (
            <section className="max-w-7xl mx-auto px-4 w-full mt-4 mb-12 animate-fade-in shrink-0">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400">
                    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                  </svg>
                  {t('history.title', lang)}
                </h3>
                <button
                  onClick={() => {
                    setSearchHistory([]);
                    localStorage.removeItem('skydeal_history');
                  }}
                  className="text-xs text-gray-400 hover:text-red-500 transition-colors"
                >
                  {t('history.clear', lang)}
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {searchHistory.map(item => {
                  const depDate = item.departureDate ? new Date(item.departureDate) : null;
                  const retDate = item.returnDate ? new Date(item.returnDate) : null;
                  const shortDep = depDate ? `${depDate.getMonth() + 1}/${depDate.getDate()}` : '';
                  const shortRet = retDate ? `${retDate.getMonth() + 1}/${retDate.getDate()}` : '';
                  
                  return (
                    <div 
                      key={item.id} 
                      onClick={() => {
                        setSearchFormPrefill({
                          origin: item.origin,
                          destination: item.destination,
                          departureDate: item.departureDate,
                          returnDate: item.returnDate,
                          timestamp: Date.now()
                        });
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="glass px-3 py-1.5 rounded-full flex items-center gap-2 text-sm text-gray-600 hover:bg-purple-50 hover:border-purple-200 hover:shadow-md cursor-pointer transition-all active:scale-95"
                    >
                      <span className="font-medium text-purple-700">{item.origin}</span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                        <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
                      </svg>
                      <span className="font-medium text-purple-700">{item.destination}</span>
                      {shortDep && shortRet && (
                        <>
                          <span className="text-gray-300 mx-0.5">|</span>
                          <span className="text-xs text-gray-500">{shortDep} ~ {shortRet}</span>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-purple-100/40 mt-auto py-8 bg-white/40 shrink-0">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-gray-400 text-sm">
              {t('footer.copyright', lang)}
            </p>
            <p className="text-gray-300 text-xs mt-1">
              {t('footer.disclaimer', lang)}
            </p>
          </div>
        </footer>
      </div>
    </LanguageContext.Provider>
  );
}

export default App;
