/**
 * Parse ISO 8601 duration string to human readable format
 * e.g., "PT2H30M" -> "2시간 30분"
 */
export function formatDuration(duration: string): string {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  if (!match) return duration;
  const hours = match[1] ? parseInt(match[1]) : 0;
  const minutes = match[2] ? parseInt(match[2]) : 0;
  if (hours === 0) return `${minutes}분`;
  if (minutes === 0) return `${hours}시간`;
  return `${hours}시간 ${minutes}분`;
}

/**
 * Parse ISO 8601 duration to total minutes
 */
export function durationToMinutes(duration: string): number {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  if (!match) return 0;
  const hours = match[1] ? parseInt(match[1]) : 0;
  const minutes = match[2] ? parseInt(match[2]) : 0;
  return hours * 60 + minutes;
}

/**
 * Format minutes to human readable duration
 */
export function minutesToDuration(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours === 0) return `${minutes}분`;
  if (minutes === 0) return `${hours}시간`;
  return `${hours}시간 ${minutes}분`;
}

/**
 * Format price with currency
 */
export function formatPrice(price: number, currency: string = 'KRW'): string {
  if (currency === 'KRW') {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
      maximumFractionDigits: 0,
    }).format(price);
  }
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency,
  }).format(price);
}

/**
 * Format datetime string to time only
 * e.g., "2024-06-15T14:30:00" -> "14:30"
 */
export function formatTime(datetime: string): string {
  const date = new Date(datetime);
  return date.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

/**
 * Format date to Korean format
 * e.g., "2024-06-15" -> "6월 15일 (토)"
 */
export function formatDateKo(dateStr: string): string {
  const date = new Date(dateStr);
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const dayOfWeek = days[date.getDay()];
  return `${month}월 ${day}일 (${dayOfWeek})`;
}

/**
 * Format date to short format
 */
export function formatDateShort(dateStr: string): string {
  const date = new Date(dateStr);
  return `${date.getMonth() + 1}/${date.getDate()}`;
}

/**
 * Check if arrival is next day
 */
export function isNextDay(departure: string, arrival: string): boolean {
  const depDate = new Date(departure);
  const arrDate = new Date(arrival);
  return arrDate.getDate() !== depDate.getDate();
}

/**
 * Get day difference between departure and arrival
 */
export function getDayDiff(departure: string, arrival: string): number {
  const depDate = new Date(departure);
  const arrDate = new Date(arrival);
  const depDay = new Date(depDate.getFullYear(), depDate.getMonth(), depDate.getDate());
  const arrDay = new Date(arrDate.getFullYear(), arrDate.getMonth(), arrDate.getDate());
  return Math.round((arrDay.getTime() - depDay.getTime()) / (1000 * 60 * 60 * 24));
}

/**
 * Generate date range array
 */
export function getDateRange(startDate: string, endDate: string): string[] {
  const dates: string[] = [];
  const current = new Date(startDate);
  const end = new Date(endDate);
  while (current <= end) {
    dates.push(current.toISOString().split('T')[0]);
    current.setDate(current.getDate() + 1);
  }
  return dates;
}

/**
 * Classify layover duration
 */
export function getLayoverClass(minutes: number): 'short' | 'medium' | 'long' {
  if (minutes < 90) return 'short';
  if (minutes < 240) return 'medium';
  return 'long';
}

/**
 * Get today's date string (YYYY-MM-DD)
 */
export function getToday(): string {
  return new Date().toISOString().split('T')[0];
}

/**
 * Get date N days from now
 */
export function getDateFromNow(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
}
