export type Currency = 'KRW' | 'USD' | 'CAD' | 'CNY';

export interface CurrencyInfo {
  code: Currency;
  symbol: string;
  name: string;
  nameKo: string;
  rate: number; // rate from KRW to this currency
}

// Approximate exchange rates from KRW (as of 2026)
export const currencies: Record<Currency, CurrencyInfo> = {
  KRW: { code: 'KRW', symbol: '₩', name: 'Korean Won', nameKo: '원 (KRW)', rate: 1 },
  USD: { code: 'USD', symbol: '$', name: 'US Dollar', nameKo: '달러 (USD)', rate: 0.00072 },
  CAD: { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', nameKo: '캐나다 달러 (CAD)', rate: 0.00099 },
  CNY: { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', nameKo: '위안 (CNY)', rate: 0.0052 },
};

export function convertPrice(priceKRW: number, targetCurrency: Currency): number {
  return priceKRW * currencies[targetCurrency].rate;
}

export function formatCurrencyPrice(priceKRW: number, currency: Currency): string {
  const converted = convertPrice(priceKRW, currency);
  
  switch (currency) {
    case 'KRW':
      return new Intl.NumberFormat('ko-KR', {
        style: 'currency',
        currency: 'KRW',
        maximumFractionDigits: 0,
      }).format(converted);
    case 'USD':
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
      }).format(converted);
    case 'CAD':
      return new Intl.NumberFormat('en-CA', {
        style: 'currency',
        currency: 'CAD',
        maximumFractionDigits: 0,
      }).format(converted);
    case 'CNY':
      return new Intl.NumberFormat('zh-CN', {
        style: 'currency',
        currency: 'CNY',
        maximumFractionDigits: 0,
      }).format(converted);
    default:
      return `${converted}`;
  }
}

export function formatShortPrice(priceKRW: number, currency: Currency): string {
  const converted = convertPrice(priceKRW, currency);
  const info = currencies[currency];
  
  switch (currency) {
    case 'KRW':
      const man = converted / 10000;
      if (man < 1000) {
        return `${man.toFixed(1)}만`;
      }
      return `${Math.round(man)}만`;
    case 'USD':
    case 'CAD':
      return `${info.symbol}${Math.round(converted)}`;
    case 'CNY':
      return `${info.symbol}${Math.round(converted)}`;
    default:
      return `${Math.round(converted)}`;
  }
}
