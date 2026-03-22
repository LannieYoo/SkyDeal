export interface AirlineInfo {
  code: string;
  name: string;
  nameKo: string;
  color: string;
}

export const airlines: Record<string, AirlineInfo> = {
  'KE': { code: 'KE', name: 'Korean Air', nameKo: '대한항공', color: '#00256C' },
  'OZ': { code: 'OZ', name: 'Asiana Airlines', nameKo: '아시아나항공', color: '#C8102E' },
  'LJ': { code: 'LJ', name: 'Jin Air', nameKo: '진에어', color: '#FF6B00' },
  'TW': { code: 'TW', name: 'T\'way Air', nameKo: '티웨이항공', color: '#E60012' },
  '7C': { code: '7C', name: 'Jeju Air', nameKo: '제주항공', color: '#FF6C00' },
  'BX': { code: 'BX', name: 'Air Busan', nameKo: '에어부산', color: '#6ECFDF' },
  'RS': { code: 'RS', name: 'Air Seoul', nameKo: '에어서울', color: '#003D6B' },
  'ZE': { code: 'ZE', name: 'Eastar Jet', nameKo: '이스타항공', color: '#ED1C24' },
  'YP': { code: 'YP', name: 'Air Premia', nameKo: '에어프레미아', color: '#1B3A5C' },
  'RF': { code: 'RF', name: 'Aero K', nameKo: '에어로케이', color: '#003DA5' },
  
  'NH': { code: 'NH', name: 'All Nippon Airways', nameKo: '전일본공수', color: '#003399' },
  'JL': { code: 'JL', name: 'Japan Airlines', nameKo: '일본항공', color: '#CC0000' },
  'MM': { code: 'MM', name: 'Peach Aviation', nameKo: '피치항공', color: '#FF69B4' },
  
  'CX': { code: 'CX', name: 'Cathay Pacific', nameKo: '캐세이퍼시픽', color: '#006564' },
  'SQ': { code: 'SQ', name: 'Singapore Airlines', nameKo: '싱가포르항공', color: '#FDB813' },
  'TG': { code: 'TG', name: 'Thai Airways', nameKo: '타이항공', color: '#6B2C91' },
  'VN': { code: 'VN', name: 'Vietnam Airlines', nameKo: '베트남항공', color: '#00538B' },
  'VJ': { code: 'VJ', name: 'VietJet Air', nameKo: '비엣젯', color: '#E30613' },
  
  'UA': { code: 'UA', name: 'United Airlines', nameKo: '유나이티드항공', color: '#002244' },
  'AA': { code: 'AA', name: 'American Airlines', nameKo: '아메리칸항공', color: '#0078D2' },
  'DL': { code: 'DL', name: 'Delta Air Lines', nameKo: '델타항공', color: '#003366' },
  'AC': { code: 'AC', name: 'Air Canada', nameKo: '에어캐나다', color: '#F01428' },
  
  'BA': { code: 'BA', name: 'British Airways', nameKo: '영국항공', color: '#075AAA' },
  'LH': { code: 'LH', name: 'Lufthansa', nameKo: '루프트한자', color: '#05164D' },
  'AF': { code: 'AF', name: 'Air France', nameKo: '에어프랑스', color: '#002157' },
  'TK': { code: 'TK', name: 'Turkish Airlines', nameKo: '터키항공', color: '#C8102E' },
  'EK': { code: 'EK', name: 'Emirates', nameKo: '에미레이트', color: '#D71A20' },
  
  'CA': { code: 'CA', name: 'Air China', nameKo: '중국국제항공', color: '#CC0000' },
  'MU': { code: 'MU', name: 'China Eastern Airlines', nameKo: '중국동방항공', color: '#003DA5' },
  'CZ': { code: 'CZ', name: 'China Southern Airlines', nameKo: '중국남방항공', color: '#003DA5' },
  'CI': { code: 'CI', name: 'China Airlines', nameKo: '중화항공', color: '#003F87' },
  'BR': { code: 'BR', name: 'EVA Air', nameKo: '에바항공', color: '#006747' },
};

export function getAirlineName(code: string): string {
  return airlines[code]?.nameKo || airlines[code]?.name || code;
}

export function getAirlineColor(code: string): string {
  return airlines[code]?.color || '#6B7280';
}

export function getAirlineLogo(code: string): string {
  // Use a placeholder logo service
  return `https://pics.avs.io/60/60/${code}.png`;
}
