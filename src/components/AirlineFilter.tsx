import { AirlineFilter } from '../types';
import { Currency, formatCurrencyPrice } from '../utils/currency';
import { useLanguage } from '../contexts/LanguageContext';
import { t } from '../utils/i18n';

interface AirlineFilterComponentProps {
  filters: AirlineFilter[];
  onToggle: (code: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  stops: number | null; // null = any, 0 = direct, 1 = max 1 stop
  onStopsChange: (val: number | null) => void;
  currency: Currency;
}

export default function AirlineFilterComponent({
  filters,
  onToggle,
  onSelectAll,
  onDeselectAll,
  stops,
  onStopsChange,
  currency,
}: AirlineFilterComponentProps) {
  const lang = useLanguage();

  return (
    <div className="flex flex-col gap-4">
      {/* Stops Filter */}
      <div className="glass rounded-xl p-4">
        <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-3">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400">
            <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z"/><path d="M12 7v5l3 3"/>
          </svg>
          {t('filter.stops', lang)}
        </h3>
        
        <div className="flex flex-col gap-1">
          {[
            { value: null, label: t('filter.anyStops', lang) },
            { value: 0, label: t('filter.direct', lang) },
            { value: 1, label: t('filter.1stop', lang) },
          ].map((option) => (
            <button
              key={option.value === null ? 'any' : option.value}
              onClick={() => onStopsChange(option.value)}
              className={`flex items-center justify-between p-2.5 rounded-lg text-sm transition-all duration-200
                ${stops === option.value 
                  ? 'bg-purple-100/70 border border-purple-200 text-purple-700 shadow-sm' 
                  : 'hover:bg-gray-50 text-gray-500 border border-transparent'}`}
            >
              <span>{option.label}</span>
              {stops === option.value && (
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Airlines Filter */}
      <div className="glass rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
            </svg>
            {t('filter.title', lang)}
          </h3>
          <div className="flex gap-2 text-xs">
            <button
              onClick={onSelectAll}
              className="text-purple-500 hover:text-purple-700 transition-colors font-medium"
              id="select-all-airlines"
            >
              {t('filter.selectAll', lang)}
            </button>
            <span className="text-gray-300">|</span>
            <button
              onClick={onDeselectAll}
              className="text-ora-500 hover:text-ora-700 transition-colors font-medium"
              id="deselect-all-airlines"
            >
              {t('filter.deselectAll', lang)}
            </button>
          </div>
        </div>

        <div className="space-y-1 max-h-[400px] overflow-y-auto pr-1">
          {filters.map(filter => (
            <label
              key={filter.code}
              className={`flex items-center gap-2.5 p-2 rounded-lg cursor-pointer transition-all duration-200 group
                ${filter.checked ? 'bg-purple-50/60 hover:bg-purple-50' : 'hover:bg-gray-50 opacity-50'}`}
              htmlFor={`airline-filter-${filter.code}`}
            >
              <input
                id={`airline-filter-${filter.code}`}
                type="checkbox"
                checked={filter.checked}
                onChange={() => onToggle(filter.code)}
                className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-400 accent-purple-500"
              />

              <img
                src={filter.logo}
                alt={filter.name}
                className="w-6 h-6 rounded object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />

              <span className={`text-sm flex-1 truncate transition-colors
                ${filter.checked ? 'text-gray-700' : 'text-gray-400'}`}>
                {filter.name}
              </span>

              <div className="text-right shrink-0">
                <div className="text-xs font-medium text-ora-600">
                  {formatCurrencyPrice(filter.minPrice, currency)}~
                </div>
                <div className="text-[10px] text-gray-400">
                  {filter.count}{lang === 'en' ? ' flights' : lang === 'zh' ? '个' : '건'}
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
