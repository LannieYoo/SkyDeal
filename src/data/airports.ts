import { Airport } from '../types';

export const airports: Airport[] = [
  // Korea
  { code: 'ICN', name: '인천국제공항', city: '서울/인천', country: '대한민국' },
  { code: 'GMP', name: '김포국제공항', city: '서울', country: '대한민국' },
  { code: 'PUS', name: '김해국제공항', city: '부산', country: '대한민국' },
  { code: 'CJU', name: '제주국제공항', city: '제주', country: '대한민국' },
  { code: 'TAE', name: '대구국제공항', city: '대구', country: '대한민국' },
  
  // Japan
  { code: 'NRT', name: 'Narita International Airport', city: '도쿄(나리타)', country: '일본' },
  { code: 'HND', name: 'Haneda Airport', city: '도쿄(하네다)', country: '일본' },
  { code: 'KIX', name: 'Kansai International Airport', city: '오사카', country: '일본' },
  { code: 'FUK', name: 'Fukuoka Airport', city: '후쿠오카', country: '일본' },
  { code: 'CTS', name: 'New Chitose Airport', city: '삿포로', country: '일본' },
  { code: 'OKA', name: 'Naha Airport', city: '오키나와', country: '일본' },
  
  // China
  { code: 'PEK', name: 'Beijing Capital Int\'l Airport', city: '베이징', country: '중국' },
  { code: 'PVG', name: 'Pudong International Airport', city: '상하이', country: '중국' },
  { code: 'HKG', name: 'Hong Kong Int\'l Airport', city: '홍콩', country: '중국' },
  
  // Southeast Asia
  { code: 'BKK', name: 'Suvarnabhumi Airport', city: '방콕', country: '태국' },
  { code: 'SGN', name: 'Tan Son Nhat Int\'l Airport', city: '호치민', country: '베트남' },
  { code: 'HAN', name: 'Noi Bai International Airport', city: '하노이', country: '베트남' },
  { code: 'DAD', name: 'Da Nang International Airport', city: '다낭', country: '베트남' },
  { code: 'SIN', name: 'Changi Airport', city: '싱가포르', country: '싱가포르' },
  { code: 'MNL', name: 'Ninoy Aquino Int\'l Airport', city: '마닐라', country: '필리핀' },
  { code: 'CEB', name: 'Mactan-Cebu Int\'l Airport', city: '세부', country: '필리핀' },
  { code: 'DPS', name: 'Ngurah Rai International Airport', city: '발리', country: '인도네시아' },
  { code: 'KUL', name: 'Kuala Lumpur Int\'l Airport', city: '쿠알라룸푸르', country: '말레이시아' },
  
  // USA
  { code: 'LAX', name: 'Los Angeles Int\'l Airport', city: '로스앤젤레스', country: '미국' },
  { code: 'JFK', name: 'John F. Kennedy Int\'l Airport', city: '뉴욕', country: '미국' },
  { code: 'SFO', name: 'San Francisco Int\'l Airport', city: '샌프란시스코', country: '미국' },
  { code: 'ORD', name: 'O\'Hare International Airport', city: '시카고', country: '미국' },
  { code: 'ATL', name: 'Hartsfield-Jackson Atlanta Int\'l', city: '애틀랜타', country: '미국' },
  { code: 'SEA', name: 'Seattle-Tacoma Int\'l Airport', city: '시애틀', country: '미국' },
  { code: 'HNL', name: 'Daniel K. Inouye Int\'l Airport', city: '호놀룰루', country: '미국' },
  { code: 'LAS', name: 'Harry Reid Int\'l Airport', city: '라스베이거스', country: '미국' },
  { code: 'YVR', name: 'Vancouver Int\'l Airport', city: '밴쿠버', country: '캐나다' },
  { code: 'YYZ', name: 'Toronto Pearson Int\'l Airport', city: '토론토', country: '캐나다' },
  { code: 'YOW', name: 'Ottawa Macdonald-Cartier Airport', city: '오타와', country: '캐나다' },
  
  // Europe
  { code: 'LHR', name: 'London Heathrow Airport', city: '런던', country: '영국' },
  { code: 'CDG', name: 'Charles de Gaulle Airport', city: '파리', country: '프랑스' },
  { code: 'FCO', name: 'Leonardo da Vinci Airport', city: '로마', country: '이탈리아' },
  { code: 'FRA', name: 'Frankfurt Airport', city: '프랑크푸르트', country: '독일' },
  { code: 'BCN', name: 'Barcelona-El Prat Airport', city: '바르셀로나', country: '스페인' },
  { code: 'AMS', name: 'Amsterdam Schiphol Airport', city: '암스테르담', country: '네덜란드' },
  { code: 'IST', name: 'Istanbul Airport', city: '이스탄불', country: '터키' },
  
  // Oceania
  { code: 'SYD', name: 'Sydney Kingsford Smith Airport', city: '시드니', country: '호주' },
  { code: 'GUM', name: 'Antonio B. Won Pat Int\'l Airport', city: '괌', country: '미국령 괌' },
  { code: 'SPN', name: 'Saipan International Airport', city: '사이판', country: '미국령 북마리아나 제도' },
];

export function searchAirports(query: string): Airport[] {
  if (!query || query.length < 1) return [];
  const q = query.toLowerCase();
  return airports.filter(
    (a) =>
      a.code.toLowerCase().includes(q) ||
      a.name.toLowerCase().includes(q) ||
      a.city.toLowerCase().includes(q) ||
      a.country.toLowerCase().includes(q)
  ).slice(0, 8);
}
