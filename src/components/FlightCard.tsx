import { useState } from 'react';
import { FlightOffer, FlightItinerary } from '../types';
import { formatTime, getDayDiff, getLayoverClass } from '../utils/helpers';
import { getAirlineName, getAirlineLogo, getAirlineColor } from '../data/airlines';
import { Currency, formatCurrencyPrice } from '../utils/currency';
import { useLanguage } from '../contexts/LanguageContext';
import { t, formatDurationByLang, minutesToDurationByLang, formatDateByLang } from '../utils/i18n';

interface FlightCardProps {
  offer: FlightOffer;
  index: number;
  isCheapest?: boolean;
  currency: Currency;
}

function ItineraryRow({ itinerary, label, date }: { itinerary: FlightItinerary; label: string; date: string }) {
  const lang = useLanguage();
  const firstSeg = itinerary.segments[0];
  const lastSeg = itinerary.segments[itinerary.segments.length - 1];
  const dayDiff = getDayDiff(firstSeg.departureTime, lastSeg.arrivalTime);

  const isOutbound = label === t('flight.outbound', lang);

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <span className={`text-xs font-semibold px-2 py-0.5 rounded ${isOutbound ? 'bg-purple-100 text-purple-600' : 'bg-ora-100 text-ora-600'}`}>
          {label}
        </span>
        <span className="text-xs text-gray-400">{formatDateByLang(date, lang)}</span>
      </div>

      {/* Flight summary */}
      <div className="flex items-center gap-4">
        {/* Airline logo + info */}
        <div className="flex items-center gap-2 w-28 shrink-0">
          <img
            src={getAirlineLogo(firstSeg.airlineCode)}
            alt={firstSeg.airline}
            className="w-8 h-8 rounded object-contain"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
          <div>
            <div className="text-sm font-medium text-gray-800">{getAirlineName(firstSeg.airlineCode)}</div>
            <div className="text-xs text-gray-400">{itinerary.segments.map(s => s.flightNumber).join(', ')}</div>
          </div>
        </div>

        {/* Time + route visualization */}
        <div className="flex-1 flex items-center gap-3">
          {/* Departure time */}
          <div className="text-right shrink-0">
            <div className="text-lg font-bold text-gray-800">{formatTime(firstSeg.departureTime)}</div>
            <div className="text-xs text-gray-400">{firstSeg.departureAirport}</div>
          </div>

          {/* Route line */}
          <div className="flex-1 relative py-2">
            <div className="h-px bg-gray-200 w-full relative">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-purple-400" />
              {itinerary.layovers.map((_, i) => (
                <div
                  key={i}
                  className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-ora-400"
                  style={{ left: `${((i + 1) / (itinerary.segments.length)) * 100}%` }}
                />
              ))}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-purple-400" />
              
              <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-purple-400 rotate-90">
                  <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z"/>
                </svg>
              </div>
            </div>

            <div className="flex justify-center mt-1.5">
              <span className="text-xs text-gray-400">
                {formatDurationByLang(itinerary.totalDuration, lang)}
                {itinerary.stops > 0 && (
                  <span className="text-ora-500 ml-1">· {t('flight.layover', lang)} {itinerary.stops}{t('flight.layoverCount', lang)}</span>
                )}
              </span>
            </div>
          </div>

          {/* Arrival time */}
          <div className="shrink-0">
            <div className="text-lg font-bold text-gray-800">
              {formatTime(lastSeg.arrivalTime)}
              {dayDiff > 0 && (
                <sup className="text-xs text-ora-500 ml-0.5">+{dayDiff}</sup>
              )}
            </div>
            <div className="text-xs text-gray-400">{lastSeg.arrivalAirport}</div>
          </div>
        </div>
      </div>

      {/* Layover details */}
      {itinerary.layovers.map((layover, i) => {
        const layoverClass = getLayoverClass(layover.durationMinutes);
        const colorMap = {
          short: 'text-green-600 bg-green-50 border-green-200',
          medium: 'text-ora-600 bg-ora-50 border-ora-200',
          long: 'text-red-600 bg-red-50 border-red-200',
        };
        return (
          <div key={i} className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${colorMap[layoverClass]} text-xs`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
            </svg>
            <span className="font-medium">
              {layover.city} ({layover.airportCode})
            </span>
            <span>{t('flight.waitAt', lang)}</span>
            <span className="font-bold">{minutesToDurationByLang(layover.durationMinutes, lang)}</span>
            <span>{t('flight.waiting', lang)}</span>
            {layoverClass === 'long' && (
              <span className="ml-1">{t('flight.longWait', lang)}</span>
            )}
            {layoverClass === 'short' && (
              <span className="ml-1">{t('flight.shortWait', lang)}</span>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function FlightCard({ offer, index, isCheapest, currency }: FlightCardProps) {
  const lang = useLanguage();
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="animate-slide-up glass rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg group"
      style={{ animationDelay: `${index * 80}ms`, animationFillMode: 'both' }}
    >
      {/* Cheapest badge */}
      {isCheapest && (
        <div className="badge-cheapest px-4 py-1.5 text-xs font-bold text-white flex items-center gap-1.5">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          {t('flight.cheapest', lang)}
        </div>
      )}

      <div className="p-5">
        <div className="flex flex-col lg:flex-row lg:items-center gap-5">
          {/* Flight details */}
          <div className="flex-1 space-y-4">
            <ItineraryRow itinerary={offer.outbound} label={t('flight.outbound', lang)} date={offer.departureDate} />
            <div className="border-t border-gray-100" />
            <ItineraryRow itinerary={offer.inbound} label={t('flight.inbound', lang)} date={offer.returnDate} />
          </div>

          {/* Price section */}
          <div className="lg:border-l lg:border-gray-100 lg:pl-5 lg:w-48 shrink-0">
            <div className="flex flex-row lg:flex-col items-center lg:items-end gap-2">
              <div className="mb-2">
                <div className="text-2xl font-bold text-purple-700">
                  {formatCurrencyPrice(offer.price, currency)}
                </div>
                <div className="text-xs text-gray-400 text-right">{t('flight.perPerson', lang)}</div>
              </div>
              
              <div className="flex flex-col items-end gap-2 w-full lg:w-36">
                {offer.seatsRemaining && offer.seatsRemaining <= 5 && (
                  <span className="text-xs text-red-500 bg-red-50 px-2 py-0.5 rounded-full border border-red-100">
                    {t('flight.seatsLeft', lang)} {offer.seatsRemaining}{t('flight.seats', lang)}
                  </span>
                )}
                <button
                  onClick={() => {
                    if (offer.bookingUrl) {
                      window.open(offer.bookingUrl, '_blank');
                    } else {
                      const firstOutbound = offer.outbound.segments[0].departureAirport;
                      const lastOutbound = offer.outbound.segments[offer.outbound.segments.length - 1].arrivalAirport;
                      const url = `https://www.google.com/travel/flights?q=Flights%20to%20${lastOutbound}%20from%20${firstOutbound}%20on%20${offer.departureDate}%20through%20${offer.returnDate}`;
                      window.open(url, '_blank');
                    }
                  }}
                  className="w-full py-2 bg-gradient-to-r from-purple-600 to-ora-500 hover:from-purple-500 hover:to-ora-400 text-white rounded-lg font-bold text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5 hover:shadow-lg"
                >
                  <span>{t('flight.book', lang)}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Expand button */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-4 w-full text-xs text-gray-400 hover:text-purple-500 flex items-center justify-center gap-1 transition-colors py-1"
          id={`expand-flight-${index}`}
        >
          {expanded ? t('flight.hideDetails', lang) : t('flight.details', lang)}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        {/* Expanded details */}
        {expanded && (
          <div className="mt-4 pt-4 border-t border-gray-100 animate-fade-in space-y-6">
            {[
              { itinerary: offer.outbound, label: t('flight.outboundDetail', lang), date: offer.departureDate },
              { itinerary: offer.inbound, label: t('flight.inboundDetail', lang), date: offer.returnDate },
            ].map(({ itinerary, label }, idx) => (
              <div key={idx}>
                <h4 className="text-sm font-semibold text-gray-800 mb-3">{label}</h4>
                <div className="space-y-3">
                  {itinerary.segments.map((seg, segIdx) => (
                    <div key={segIdx} className="relative">
                      {segIdx < itinerary.segments.length - 1 && (
                        <div className="absolute left-4 top-full w-px h-6 bg-gray-200 z-0" />
                      )}
                      
                      <div className="flex items-start gap-3 bg-surface-100 rounded-lg p-3">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-white text-xs font-bold"
                          style={{ backgroundColor: getAirlineColor(seg.airlineCode) }}
                        >
                          {seg.airlineCode}
                        </div>
                        <div className="flex-1 grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-gray-400">{t('flight.flightNo', lang)}</span>
                            <div className="text-gray-800 font-medium">{seg.flightNumber}</div>
                          </div>
                          <div>
                            <span className="text-gray-400">{t('flight.aircraft', lang)}</span>
                            <div className="text-gray-700">{seg.aircraft}</div>
                          </div>
                          <div>
                            <span className="text-gray-400">{t('flight.departureLabel', lang)}</span>
                            <div className="text-gray-800">
                              {formatTime(seg.departureTime)} · {seg.departureCity} ({seg.departureAirport})
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-400">{t('flight.arrivalLabel', lang)}</span>
                            <div className="text-gray-800">
                              {formatTime(seg.arrivalTime)} · {seg.arrivalCity} ({seg.arrivalAirport})
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-400">{t('flight.duration', lang)}</span>
                            <div className="text-gray-700">{formatDurationByLang(seg.duration, lang)}</div>
                          </div>
                        </div>
                      </div>

                      {segIdx < itinerary.layovers.length && (
                        <div className="my-2 ml-4 pl-4 border-l-2 border-dashed border-ora-300 py-2">
                          <div className="flex items-center gap-2 text-xs text-ora-600">
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                            </svg>
                            <span>
                              {itinerary.layovers[segIdx].city} ({itinerary.layovers[segIdx].airportCode}) {t('flight.transitAt', lang)}{' '}
                              <strong>{minutesToDurationByLang(itinerary.layovers[segIdx].durationMinutes, lang)}</strong> {t('flight.waiting', lang)}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
