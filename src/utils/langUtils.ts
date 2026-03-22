const cityKoMap: Record<string, string> = {
  'seoul': '서울', 'incheon': '인천', 'gimpo': '김포', 'jeju': '제주', 'gimhae': '부산', 'daegu': '대구', 'cheongju': '청주',
  'ottawa': '오타와', 'montreal': '몬트리올', 'quebec': '퀘벡', 'calgary': '캘거리', 
  'edmonton': '에드먼턴', 'halifax': '핼리팩스', 'winnipeg': '위니펙', 'toronto': '토론토', 
  'vancouver': '밴쿠버', 'new york': '뉴욕', 'los angeles': '로스앤젤레스', 'chicago': '시카고',
  'san francisco': '샌프란시스코', 'seattle': '시애틀', 'atlanta': '애틀랜타', 'dallas': '댈러스',
  'miami': '마이애미', 'tokyo': '도쿄', 'narita': '도쿄(나리타)', 'haneda': '도쿄(하네다)', 'osaka': '오사카',
  'kansai': '오사카(간사이)', 'fukuoka': '후쿠오카', 'sapporo': '삿포로', 'london': '런던', 'paris': '파리',
  'rome': '로마', 'frankfurt': '프랑크푸르트', 'beijing': '베이징', 'shanghai': '상하이', 'guangzhou': '광저우',
  'hong kong': '홍콩', 'taipei': '타이페이', 'bangkok': '방콕', 'phuket': '푸껫', 'ho chi minh': '호치민',
  'hanoi': '하노이', 'da nang': '다낭', 'singapore': '싱가포르', 'manila': '마닐라', 'cebu': '세부',
  'bali': '발리', 'jakarta': '자카르타', 'kuala lumpur': '쿠알라룸푸르', 'sydney': '시드니',
  'melbourne': '멜버른', 'auckland': '오클랜드', 'guam': '괌', 'saipan': '사이판', 'honolulu': '호놀룰루',
  'las vegas': '라스베이거스', 'cancun': '칸쿤', 'dubai': '두바이',
  'macau': '마카오', 'taoyuan': '타오위안', 'kaohsiung': '가오슝', 'chiang mai': '치앙마이',
  'new delhi': '뉴델리', 'delhi': '뉴델리', 'mumbai': '뭄바이', 'cairo': '카이로', 'johannesburg': '요하네스버그'
};

const cityZhMap: Record<string, string> = {
  'seoul': '首尔', 'incheon': '仁川', 'gimpo': '金浦', 'jeju': '济州',
  'ottawa': '渥太华', 'new york': '纽约', 'los angeles': '洛杉矶', 'chicago': '芝加哥',
  'san francisco': '旧金山', 'seattle': '西雅图',
  'tokyo': '东京', 'osaka': '大阪', 'london': '伦敦', 'paris': '巴黎',
  'beijing': '北京', 'shanghai': '上海', 'guangzhou': '广州',
  'hong kong': '香港', 'taipei': '台北', 'bangkok': '曼谷',
  'singapore': '新加坡', 'sydney': '悉尼', 'melbourne': '墨尔本', 'dubai': '迪拜'
};

export function getLocalizedCity(city: string, lang: string) {
  const c = city.toLowerCase();
  if (lang === 'ko' && cityKoMap[c]) return cityKoMap[c];
  if (lang === 'zh' && cityZhMap[c]) return cityZhMap[c];
  return city;
}

export function getLocalizedName(name: string, lang: string) {
  if (lang === 'ko') {
    return name.replace(/international airport/i, '국제공항')
               .replace(/airport/i, '공항')
               .replace(/int'l/i, '국제공항')
               .replace(/intl/i, '국제공항');
  }
  if (lang === 'zh') {
    return name.replace(/international airport/i, '国际机场')
               .replace(/airport/i, '机场')
               .replace(/int'l/i, '国际机场')
               .replace(/intl/i, '国际机场');
  }
  return name;
}
