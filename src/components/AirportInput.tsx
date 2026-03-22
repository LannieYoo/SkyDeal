import { useState, useRef, useEffect, useCallback } from 'react';
import { Airport } from '../types';
import { searchAirports } from '../data/airports';
import { useLanguage } from '../contexts/LanguageContext';
import { getLocalizedCity, getLocalizedName } from '../utils/langUtils';

interface AirportInputProps {
  label: string;
  placeholder: string;
  value: string;
  icon: React.ReactNode;
  onSelect: (airport: Airport) => void;
  onMapClick?: () => void;
  id: string;
}

export default function AirportInput({ label, placeholder, value, icon, onSelect, onMapClick, id }: AirportInputProps) {
  const lang = useLanguage();
  const [query, setQuery] = useState(value);
  const [results, setResults] = useState<Airport[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    const found = searchAirports(val);
    setResults(found);
    setIsOpen(found.length > 0);
    setHighlightIndex(-1);
  }, []);

  const handleSelect = useCallback((airport: Airport) => {
    setQuery(`${getLocalizedCity(airport.city, lang)} (${airport.code})`);
    onSelect(airport);
    setIsOpen(false);
  }, [onSelect, lang]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!isOpen) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightIndex(prev => Math.min(prev + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && highlightIndex >= 0) {
      e.preventDefault();
      handleSelect(results[highlightIndex]);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  }, [isOpen, highlightIndex, results, handleSelect]);

  return (
    <div className="relative" ref={dropdownRef}>
      <label htmlFor={id} className="block text-sm font-medium text-gray-400 mb-1.5">
        {label}
      </label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400">
          {icon}
        </span>
        <input
          ref={inputRef}
          id={id}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (query) {
              const found = searchAirports(query);
              setResults(found);
              setIsOpen(found.length > 0);
            }
          }}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-3 bg-white border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 transition-all duration-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
          autoComplete="off"
        />
        {onMapClick && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              onMapClick();
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-500 transition-colors bg-white hover:bg-purple-50 rounded-full p-1"
            title="지도에서 선택"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
            </svg>
          </button>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden animate-fade-in">
          {results.map((airport, idx) => (
            <button
              key={airport.code}
              onClick={() => handleSelect(airport)}
              className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors duration-150
                ${idx === highlightIndex ? 'bg-purple-50' : 'hover:bg-gray-50'}`}
            >
              <span className="text-purple-500 font-bold text-sm w-10 shrink-0">
                {airport.code}
              </span>
              <div className="min-w-0">
                <div className="text-gray-800 text-sm truncate">{getLocalizedCity(airport.city, lang)}</div>
                <div className="text-gray-500 text-xs truncate">{getLocalizedName(airport.name, lang)}</div>
              </div>
              <span className="ml-auto text-gray-500 text-xs shrink-0">{airport.country}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
