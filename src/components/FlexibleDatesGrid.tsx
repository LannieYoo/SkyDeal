import { FlexibleDateResult } from '../types';
import { Currency, formatCurrencyPrice, formatShortPrice } from '../utils/currency';
import { useLanguage } from '../contexts/LanguageContext';
import { t } from '../utils/i18n';

interface FlexibleDatesGridProps {
  results: FlexibleDateResult[];
  selectedDep: string;
  selectedRet: string;
  onSelectDate: (dep: string, ret: string) => void;
  currency: Currency;
}

function getShortDate(dateStr: string): string {
  const date = new Date(dateStr);
  return `${date.getMonth() + 1}/${date.getDate()}`;
}

export default function FlexibleDatesGrid({
  results,
  selectedDep,
  selectedRet,
  onSelectDate,
  currency,
}: FlexibleDatesGridProps) {
  const lang = useLanguage();

  if (results.length === 0) return null;

  const depDates = [...new Set(results.map(r => r.departureDate))].sort();
  const retDates = [...new Set(results.map(r => r.returnDate))].sort();

  const prices = results.map(r => r.minPrice);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  const getPriceColor = (price: number): string => {
    const ratio = (price - minPrice) / (maxPrice - minPrice || 1);
    if (ratio < 0.2) return 'bg-green-600 text-white border-green-700 hover:bg-green-500 shadow-sm';
    if (ratio < 0.4) return 'bg-green-50 text-green-800 border-green-200 hover:bg-green-100';
    if (ratio < 0.6) return 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100';
    if (ratio < 0.8) return 'bg-ora-50 text-ora-700 border-ora-200 hover:bg-ora-100';
    return 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100';
  };

  const cheapestResult = results.reduce((min, r) => r.minPrice < min.minPrice ? r : min, results[0]);

  return (
    <div className="glass rounded-xl p-5 mb-6 animate-slide-up w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-2">
        <div>
          <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            {t('flex.title', lang)}
          </h3>
          <p className="text-[11px] text-gray-400 mt-1.5 ml-6">
            ✨ {t('flex.notice', lang)}
          </p>
        </div>
        <div className="text-xs text-gray-400 self-end md:self-auto">
          {t('flex.cheapest', lang)} <span className="text-purple-600 font-bold">{formatCurrencyPrice(cheapestResult.minPrice, currency)}</span>
          <span className="text-gray-300 ml-1">({getShortDate(cheapestResult.departureDate)} ~ {getShortDate(cheapestResult.returnDate)})</span>
        </div>
      </div>

      <div className="overflow-x-auto w-full">
        <table className="w-full table-fixed min-w-[800px]">
          <thead>
            <tr>
              <th className="text-xs text-gray-400 p-2 text-left font-normal">{t('flex.depLabel', lang)}</th>
              {retDates.map(ret => (
                <th key={ret} className="text-xs text-gray-500 p-2 text-center font-medium">{getShortDate(ret)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {depDates.map(dep => (
              <tr key={dep}>
                <td className="text-xs text-gray-500 font-medium p-2">{getShortDate(dep)}</td>
                {retDates.map(ret => {
                  const result = results.find(r => r.departureDate === dep && r.returnDate === ret);
                  if (!result) return <td key={ret} className="p-1"><div className="h-10" /></td>;

                  const isSelected = dep === selectedDep && ret === selectedRet;
                  const isCheap = result.minPrice === minPrice;

                  return (
                    <td key={ret} className="p-1">
                      <button
                        onClick={() => onSelectDate(dep, ret)}
                        className={`w-full h-11 rounded-lg text-xs font-medium transition-all duration-200 border-2
                          ${isSelected
                            ? 'border-purple-500 ring-2 ring-purple-200 shadow-md scale-[1.03] z-10 relative'
                            : 'border-transparent shadow-sm'
                          } ${getPriceColor(result.minPrice)}`}
                        title={`${getShortDate(dep)} ~ ${getShortDate(ret)}: ${formatCurrencyPrice(result.minPrice, currency)}`}
                      >
                        <div className="flex flex-col items-center justify-center leading-tight">
                          <span>{formatShortPrice(result.minPrice, currency)}</span>
                          {isCheap && (
                            <div className="text-[9px] font-extrabold mt-0.5 uppercase tracking-tighter">
                              {t('flex.lowest', lang)}
                            </div>
                          )}
                        </div>
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center gap-4 text-[11px] text-gray-500">
        <span className="font-medium">{t('flex.priceRange', lang)}</span>
        <span className="flex items-center gap-1.5"><span className="w-3.5 h-3.5 rounded bg-green-600 border border-green-700 shadow-sm" /> <span className="w-3.5 h-3.5 rounded bg-green-50 border border-green-200" /> {t('flex.cheap', lang)}</span>
        <span className="flex items-center gap-1.5"><span className="w-3.5 h-3.5 rounded bg-yellow-50 border border-yellow-200" /> {t('flex.medium', lang)}</span>
        <span className="flex items-center gap-1.5"><span className="w-3.5 h-3.5 rounded bg-ora-50 border border-ora-200" /><span className="w-3.5 h-3.5 rounded bg-red-50 border border-red-200" /> {t('flex.expensive', lang)}</span>
      </div>
    </div>
  );
}
