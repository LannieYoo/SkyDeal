import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Airport } from '../types';
import { airports } from '../data/airports';
import { useLanguage } from '../contexts/LanguageContext';

// Custom SVG Icons (Wow factor, completely reliable)
const largeIcon = new L.DivIcon({
  className: 'custom-airport-icon-large',
  html: `<div style="background-color: #9333ea; width: 28px; height: 28px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 8px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; z-index: 100;">
          <div style="background-color: white; width: 8px; height: 8px; border-radius: 50%;"></div>
         </div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
  popupAnchor: [0, -14],
});

const mediumIcon = new L.DivIcon({
  className: 'custom-airport-icon-medium',
  html: `<div style="background-color: #0ea5e9; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.25); display: flex; align-items: center; justify-content: center; z-index: 50;">
          <div style="background-color: white; width: 5px; height: 5px; border-radius: 50%;"></div>
         </div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
  popupAnchor: [0, -10],
});

interface MapModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (airport: Airport) => void;
}

import { getLocalizedCity, getLocalizedName } from '../utils/langUtils';

function MapSizeFix() {
  const map = useMap();
  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 150);
    return () => clearTimeout(timer);
  }, [map]);
  return null;
}

function MapDynamicMarkers({ airports, onSelect, onClose, showRegional, lang }: { airports: Airport[], onSelect: (a: Airport) => void, onClose: () => void, showRegional: boolean, lang: string }) {
  const map = useMap();
  const [bounds, setBounds] = useState<L.LatLngBounds | null>(null);

  useEffect(() => {
    // Initialize bounds after a slight delay so size is computed
    const t = setTimeout(() => {
      setBounds(map.getBounds().pad(1));
    }, 200);

    const updateBounds = () => {
      setBounds(map.getBounds().pad(1));
    };

    map.on('moveend', updateBounds);
    map.on('zoomend', updateBounds);
    return () => {
      clearTimeout(t);
      map.off('moveend', updateBounds);
      map.off('zoomend', updateBounds);
    };
  }, [map]);

  if (!bounds) return null;
  
  const visibleMarkers = airports.flatMap((airport) => {
    if (!airport.lat || !airport.lng) return [];
    
    // Strict definition to prevent map clutter and only show TRUE international hubs initially
    const isStrictlyMajor = airport.type === 'large' && 
      (airport.name.toLowerCase().includes('international') || 
       airport.name.toLowerCase().includes('intl') || 
       ['seoul','incheon','tokyo','paris','london','new york','beijing','shanghai','sydney','los angeles','frankfurt'].includes(airport.city.toLowerCase()));
    
    const effectiveType = isStrictlyMajor ? 'large' : 'medium';

    if (!showRegional && effectiveType === 'medium') return [];
    
    // Create clones for infinite dateline panning
    const clones = [
      { ...airport, type: effectiveType, copyId: `${airport.code}-main`, displayLng: airport.lng },
      { ...airport, type: effectiveType, copyId: `${airport.code}-east`, displayLng: airport.lng + 360 },
      { ...airport, type: effectiveType, copyId: `${airport.code}-west`, displayLng: airport.lng - 360 }
    ];

    // Keep only clones visible inside the padded viewport
    return clones.filter(c => {
      try {
        const p = L.latLng(c.lat!, c.displayLng);
        return bounds.contains(p);
      } catch (e) {
        return false;
      }
    });
  });

  return (
    <>
      {visibleMarkers.map((airport) => (
        <Marker key={airport.copyId} position={[airport.lat!, airport.displayLng]} icon={airport.type === 'large' ? largeIcon : mediumIcon}>
          <Popup className="rounded-2xl overflow-hidden shadow-xl border border-gray-100">
            <div className="text-center p-3 min-w-[160px]">
              <div className="font-extrabold text-lg text-purple-700 leading-tight block truncate max-w-[200px]" title={getLocalizedCity(airport.city, lang)}>
                {getLocalizedCity(airport.city, lang)}
              </div>
              <div className="text-sm font-bold text-gray-600 bg-gray-100 rounded-md inline-block px-2.5 py-0.5 mt-1.5 mb-2.5 border border-gray-200">
                {airport.code}
              </div>
              <div className="text-xs text-gray-500 mb-4 truncate max-w-[200px]" title={getLocalizedName(airport.name, lang)}>
                {getLocalizedName(airport.name, lang)}
              </div>
              <button
                onClick={() => {
                  onSelect(airport as Airport);
                  onClose();
                }}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-purple-600 to-ora-500 hover:from-purple-500 hover:to-ora-400 text-white rounded-xl text-sm font-bold shadow-md transition-all active:scale-95"
              >
                {lang === 'ko' ? '해당 공항 선택' : (lang === 'en' ? 'Select Airport' : '选择机场')}
              </button>
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
}

export default function MapModal({ isOpen, onClose, onSelect }: MapModalProps) {
  const lang = useLanguage();
  const [showRegional, setShowRegional] = useState(false);

  if (!isOpen) return null;

  // Render the modal directly to document.body to avoid being trapped by parent styling (like filter: blur or transforms)
  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-8 bg-black/60 backdrop-blur-md animate-fade-in pointer-events-auto" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
      <div className="bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] w-full max-w-5xl h-[85vh] max-h-[800px] flex flex-col relative border border-gray-200 overflow-hidden">
        
        {/* Header - Z-[1000] completely protects it from being overlapped by Leaflet */}
        <div className="relative z-[1000] flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white/95 backdrop-blur shrink-0 shadow-sm">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-purple-50 flex items-center justify-center border border-purple-100">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-purple-600">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
              </svg>
            </div>
            {lang === 'ko' ? '지도에서 공항 선택' : (lang === 'en' ? 'Select Airport on Map' : '在地图上选择机场')}
          </h2>
          
          <div className="flex items-center gap-6">
            <div 
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => setShowRegional(!showRegional)}
            >
              <span className="text-sm font-semibold text-gray-700 select-none group-hover:text-purple-600 transition-colors">
                {lang === 'ko' ? '지역 공항 포함' : (lang === 'en' ? 'Show Regional' : '显示区域机场')}
              </span>
              <button 
                className={`w-12 h-6 rounded-full flex items-center transition-colors px-1 ${showRegional ? 'bg-purple-600' : 'bg-gray-300'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-300 ${showRegional ? 'translate-x-6' : 'translate-x-0'}`}></div>
              </button>
            </div>

            <div className="w-px h-6 bg-gray-200"></div>

            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {/* Map Body - Use absolute inset-0 to prevent Leaflet from exploding the parent container */}
        <div className="flex-1 relative z-0 bg-gray-50">
          <div className="absolute inset-0">
            {/* Legend Overlay */}
            <div className="absolute bottom-6 right-6 z-[1000] bg-white/90 backdrop-blur-md rounded-xl shadow-lg p-3.5 flex flex-col gap-2.5 border border-gray-200 pointer-events-none">
              <div className="flex items-center gap-2.5">
                <div className="w-4 h-4 rounded-full bg-[#9333ea] border-2 border-white shadow-sm"></div>
                <span className="text-xs font-bold text-gray-700">{lang === 'ko' ? '국제 / 대형 공항' : (lang === 'en' ? 'Intl / Large Airport' : '国际 / 大型机场')}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-3.5 h-3.5 rounded-full bg-[#0ea5e9] border-[1.5px] border-white shadow-sm opacity-90"></div>
                <span className={`text-xs font-bold ${showRegional ? 'text-gray-600' : 'text-gray-400'}`}>
                  {lang === 'ko' ? '지역 / 중형 공항' : (lang === 'en' ? 'Regional / Medium' : '区域 / 中型机场')}
                  {!showRegional && (lang === 'ko' ? ' (숨김)' : (lang === 'en' ? ' (Hidden)' : ' (隐藏)'))}
                </span>
              </div>
            </div>

            <MapContainer
              center={[30, 120]} 
              zoom={4}
              style={{ height: '100%', width: '100%', zIndex: 0 }}
              minZoom={2}
              worldCopyJump={true}
            >
              <MapSizeFix />
              <TileLayer
                attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
              />
              <MapDynamicMarkers airports={airports} onSelect={onSelect} onClose={onClose} showRegional={showRegional} lang={lang} />
            </MapContainer>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
