export type Language = 'ko' | 'en' | 'zh';

export interface LanguageInfo {
  code: Language;
  label: string;
  flag: string;
}

export const languages: LanguageInfo[] = [
  { code: 'ko', label: '한국어', flag: '🇰🇷' },
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'zh', label: '中文', flag: '🇨🇳' },
];

const translations = {
  // Header
  'header.subtitle': {
    ko: '항공권 최저가 검색',
    en: 'Best Flight Deals',
    zh: '最低价机票搜索',
  },
  'header.currency': {
    ko: '통화:',
    en: 'Currency:',
    zh: '货币:',
  },

  // Hero
  'hero.title': {
    ko: '최저가 항공권을',
    en: 'Find the Best',
    zh: '最低价机票',
  },
  'hero.highlight': {
    ko: '한눈에',
    en: 'Flight Deals',
    zh: '一目了然',
  },
  'hero.subtitle': {
    ko: '유연한 날짜 검색으로 가장 저렴한 항공편을 찾아보세요',
    en: 'Search flexible dates to find the cheapest flights',
    zh: '灵活日期搜索，找到最便宜的航班',
  },

  // Search Form
  'search.roundTrip': {
    ko: '왕복',
    en: 'Round Trip',
    zh: '往返',
  },
  'search.oneWay': {
    ko: '편도',
    en: 'One Way',
    zh: '单程',
  },
  'search.origin': {
    ko: '출발지',
    en: 'From',
    zh: '出发地',
  },
  'search.destination': {
    ko: '도착지',
    en: 'To',
    zh: '目的地',
  },
  'search.placeholder': {
    ko: '도시 또는 공항코드',
    en: 'City or airport code',
    zh: '城市或机场代码',
  },
  'search.departure': {
    ko: '가는 날',
    en: 'Departure',
    zh: '去程日期',
  },
  'search.return': {
    ko: '오는 날',
    en: 'Return',
    zh: '回程日期',
  },
  'search.flexibleDates': {
    ko: '유연한 날짜',
    en: 'Flexible Dates',
    zh: '弹性日期',
  },
  'search.flexibleAuto': {
    ko: '최저가 자동 탐색',
    en: 'Auto find cheapest',
    zh: '自动查找最低价',
  },
  'search.passengers': {
    ko: '성인',
    en: 'Adult',
    zh: '成人',
  },
  'search.passengerUnit': {
    ko: '명',
    en: '',
    zh: '人',
  },
  'search.economy': {
    ko: '이코노미',
    en: 'Economy',
    zh: '经济舱',
  },
  'search.premiumEconomy': {
    ko: '프리미엄 이코노미',
    en: 'Premium Economy',
    zh: '高端经济舱',
  },
  'search.business': {
    ko: '비즈니스',
    en: 'Business',
    zh: '商务舱',
  },
  'search.first': {
    ko: '퍼스트',
    en: 'First',
    zh: '头等舱',
  },
  'search.preparing': {
    ko: '준비 중',
    en: 'Coming soon',
    zh: '即将推出',
  },
  'search.swapTooltip': {
    ko: '출발지/도착지 교환',
    en: 'Swap origin/destination',
    zh: '交换出发地/目的地',
  },

  // Flexible dates grid
  'flex.title': {
    ko: '유연한 날짜 검색 결과',
    en: 'Flexible Date Results',
    zh: '弹性日期搜索结果',
  },
  'flex.cheapest': {
    ko: '최저가:',
    en: 'Cheapest:',
    zh: '最低价:',
  },
  'flex.notice': {
    ko: '클릭 시 구글 항공권의 실제 실시간 가격으로 결과가 갱신됩니다.',
    en: 'Click a date to fetch actual real-time prices.',
    zh: '点击日期以获取实际实时价格。',
  },
  'flex.depLabel': {
    ko: '가는날 ↓ / 오는날 →',
    en: 'Dep ↓ / Ret →',
    zh: '去程 ↓ / 回程 →',
  },
  'flex.lowest': {
    ko: '최저',
    en: 'Low',
    zh: '最低',
  },
  'flex.priceRange': {
    ko: '가격대:',
    en: 'Price:',
    zh: '价格:',
  },
  'flex.cheap': {
    ko: '저렴',
    en: 'Low',
    zh: '低',
  },
  'flex.medium': {
    ko: '보통',
    en: 'Mid',
    zh: '中',
  },
  'flex.expensive': {
    ko: '비쌈',
    en: 'High',
    zh: '高',
  },

  // Results
  'results.title': {
    ko: '검색 결과',
    en: 'Search Results',
    zh: '搜索结果',
  },
  'results.count': {
    ko: '건',
    en: 'flights',
    zh: '个航班',
  },
  'results.cheapestFrom': {
    ko: '부터',
    en: 'from',
    zh: '起',
  },
  'results.lowestPrice': {
    ko: '최저가',
    en: 'Lowest',
    zh: '最低价',
  },
  'results.sort': {
    ko: '정렬:',
    en: 'Sort:',
    zh: '排序:',
  },
  'results.sortPrice': {
    ko: '가격순',
    en: 'Price',
    zh: '价格',
  },
  'results.sortDuration': {
    ko: '시간순',
    en: 'Duration',
    zh: '时间',
  },
  'results.sortDeparture': {
    ko: '출발시간순',
    en: 'Departure',
    zh: '出发时间',
  },
  'results.noResults': {
    ko: '검색 결과가 없습니다',
    en: 'No results found',
    zh: '未找到结果',
  },
  'results.noResultsHint': {
    ko: '필터 설정을 변경하거나 다른 날짜로 검색해 보세요',
    en: 'Try changing filters or search different dates',
    zh: '请尝试更改筛选条件或搜索其他日期',
  },

  // Flight Card
  'flight.outbound': {
    ko: '가는편',
    en: 'Outbound',
    zh: '去程',
  },
  'flight.inbound': {
    ko: '오는편',
    en: 'Return',
    zh: '回程',
  },
  'flight.cheapest': {
    ko: '최저가',
    en: 'Cheapest',
    zh: '最低价',
  },
  'flight.perPerson': {
    ko: '1인 왕복 기준',
    en: 'per person, round trip',
    zh: '每人往返',
  },
  'flight.seatsLeft': {
    ko: '잔여',
    en: '',
    zh: '剩余',
  },
  'flight.seats': {
    ko: '석',
    en: 'seats left',
    zh: '座',
  },
  'flight.details': {
    ko: '상세 정보 보기',
    en: 'View details',
    zh: '查看详情',
  },
  'flight.book': {
    ko: '결제하기',
    en: 'Book now',
    zh: '立即预订',
  },
  'flight.hideDetails': {
    ko: '상세 정보 접기',
    en: 'Hide details',
    zh: '收起详情',
  },
  'flight.outboundDetail': {
    ko: '가는편 상세',
    en: 'Outbound Details',
    zh: '去程详情',
  },
  'flight.inboundDetail': {
    ko: '오는편 상세',
    en: 'Return Details',
    zh: '回程详情',
  },
  'flight.flightNo': {
    ko: '항공편',
    en: 'Flight',
    zh: '航班号',
  },
  'flight.aircraft': {
    ko: '기종',
    en: 'Aircraft',
    zh: '机型',
  },
  'flight.departureLabel': {
    ko: '출발',
    en: 'Departure',
    zh: '出发',
  },
  'flight.arrivalLabel': {
    ko: '도착',
    en: 'Arrival',
    zh: '到达',
  },
  'flight.duration': {
    ko: '소요시간',
    en: 'Duration',
    zh: '飞行时间',
  },
  'flight.layover': {
    ko: '경유',
    en: 'Layover',
    zh: '转机',
  },
  'flight.layoverCount': {
    ko: '회',
    en: 'stop(s)',
    zh: '次',
  },
  'flight.waitAt': {
    ko: '에서',
    en: 'at',
    zh: '在',
  },
  'flight.waiting': {
    ko: '대기',
    en: 'layover',
    zh: '停留',
  },
  'flight.longWait': {
    ko: '⚠ 장시간 대기',
    en: '⚠ Long layover',
    zh: '⚠ 长时间转机',
  },
  'flight.shortWait': {
    ko: '⚡ 짧은 경유',
    en: '⚡ Short layover',
    zh: '⚡ 短暂转机',
  },
  'flight.transitAt': {
    ko: '경유 ·',
    en: 'transit ·',
    zh: '转机 ·',
  },

  // Airline filter
  'filter.title': {
    ko: '항공사 필터',
    en: 'Airline Filter',
    zh: '航空公司筛选',
  },
  'filter.selectAll': {
    ko: '전체 선택',
    en: 'Select all',
    zh: '全选',
  },
  'filter.deselectAll': {
    ko: '전체 해제',
    en: 'Deselect all',
    zh: '取消全选',
  },
  'filter.stops': {
    ko: '경유 횟수',
    en: 'Stops',
    zh: '经停次数',
  },
  'filter.direct': {
    ko: '직항',
    en: 'Direct only',
    zh: '直飞',
  },
  'filter.1stop': {
    ko: '1회 경유 이하',
    en: '1 stop or direct',
    zh: '1次经停以内',
  },
  'filter.anyStops': {
    ko: '모든 경유',
    en: 'Any stops',
    zh: '任何次数',
  },

  // Loading
  'loading.searching': {
    ko: '최저가 항공편 검색 중...',
    en: 'Searching for best deals...',
    zh: '正在搜索最低价航班...',
  },

  // Footer
  'footer.copyright': {
    ko: '© 2026 SkyDeal · 항공권 최저가 검색 서비스',
    en: '© 2026 SkyDeal · Best Flight Deal Search',
    zh: '© 2026 SkyDeal · 最低价机票搜索服务',
  },
  'footer.disclaimer': {
    ko: '표시된 가격은 참고용이며 실제 가격과 다를 수 있습니다',
    en: 'Prices shown are for reference only and may differ from actual prices',
    zh: '显示价格仅供参考，可能与实际价格不同',
  },

  // Duration formatting
  'time.hours': {
    ko: '시간',
    en: 'h',
    zh: '小时',
  },
  'time.minutes': {
    ko: '분',
    en: 'm',
    zh: '分',
  },

  // Search History
  'history.title': {
    ko: '최근 검색 기록',
    en: 'Recent Searches',
    zh: '最近搜索',
  },
  'history.empty': {
    ko: '최근 검색 기록이 없습니다.',
    en: 'No recent searches.',
    zh: '没有最近搜索记录。',
  },
  'history.clear': {
    ko: '전체 삭제',
    en: 'Clear all',
    zh: '清空历史记录',
  },
} as const;

export type TranslationKey = keyof typeof translations;

export function t(key: TranslationKey, lang: Language): string {
  const entry = translations[key];
  if (!entry) return key;
  return entry[lang] || entry['ko'];
}

// Format passenger label based on language
export function formatPassengers(count: number, lang: Language): string {
  switch (lang) {
    case 'ko':
      return `성인 ${count}명`;
    case 'en':
      return `${count} Adult${count > 1 ? 's' : ''}`;
    case 'zh':
      return `${count}位成人`;
  }
}

// Format date for display based on language
export function formatDateByLang(dateStr: string, lang: Language): string {
  const date = new Date(dateStr);
  const days = {
    ko: ['일', '월', '화', '수', '목', '금', '토'],
    en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    zh: ['日', '一', '二', '三', '四', '五', '六'],
  };

  const month = date.getMonth() + 1;
  const day = date.getDate();
  const dayOfWeek = days[lang][date.getDay()];

  switch (lang) {
    case 'ko':
      return `${month}월 ${day}일 (${dayOfWeek})`;
    case 'en':
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return `${monthNames[date.getMonth()]} ${day} (${dayOfWeek})`;
    case 'zh':
      return `${month}月${day}日 (周${dayOfWeek})`;
  }
}

// Format duration by language
export function formatDurationByLang(duration: string, lang: Language): string {
  const match = duration.match(/PT(\d+)H(?:(\d+)M)?/);
  if (!match) return duration;
  const hours = parseInt(match[1]);
  const minutes = parseInt(match[2] || '0');
  
  switch (lang) {
    case 'ko':
      return minutes > 0 ? `${hours}시간 ${minutes}분` : `${hours}시간`;
    case 'en':
      return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
    case 'zh':
      return minutes > 0 ? `${hours}小时${minutes}分` : `${hours}小时`;
  }
}

export function minutesToDurationByLang(minutes: number, lang: Language): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  
  switch (lang) {
    case 'ko':
      return m > 0 ? `${h}시간 ${m}분` : `${h}시간`;
    case 'en':
      return m > 0 ? `${h}h ${m}m` : `${h}h`;
    case 'zh':
      return m > 0 ? `${h}小时${m}分` : `${h}小时`;
  }
}
