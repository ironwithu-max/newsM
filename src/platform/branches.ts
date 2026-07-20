// 협력 보험사 전국 지점 데이터 (데모용 예시 — 실제 주소·연락처와 무관)

export interface Branch {
  id: string;
  insurerId: string;
  region: string;
  name: string;
  address: string;
  phone: string;
}

// 지역 구분 (표시 순서)
export const regions = [
  '서울',
  '경기·인천',
  '강원',
  '대전·충청',
  '광주·전라',
  '대구·경북',
  '부산·경남',
  '제주',
] as const;

export const branches: Branch[] = [
  // 한울손해보험
  { id: 'br-hanul-seoul', insurerId: 'ins-hanul', region: '서울', name: '한울손해보험 본사(강남)', address: '서울 강남구 테헤란로 152', phone: '02-1500-1001' },
  { id: 'br-hanul-gyeongin', insurerId: 'ins-hanul', region: '경기·인천', name: '한울손해보험 수원지점', address: '경기 수원시 영통구 광교로 45', phone: '031-215-1001' },
  { id: 'br-hanul-busan', insurerId: 'ins-hanul', region: '부산·경남', name: '한울손해보험 부산지점', address: '부산 부산진구 중앙대로 668', phone: '051-802-1001' },

  // 다온생명
  { id: 'br-daon-seoul', insurerId: 'ins-daon', region: '서울', name: '다온생명 본사(여의도)', address: '서울 영등포구 국제금융로 10', phone: '02-3700-2002' },
  { id: 'br-daon-daegu', insurerId: 'ins-daon', region: '대구·경북', name: '다온생명 대구지점', address: '대구 중구 국채보상로 537', phone: '053-421-2002' },
  { id: 'br-daon-gwangju', insurerId: 'ins-daon', region: '광주·전라', name: '다온생명 광주지점', address: '광주 서구 상무중앙로 84', phone: '062-372-2002' },

  // 미래로화재
  { id: 'br-miraero-seoul', insurerId: 'ins-miraero', region: '서울', name: '미래로화재 본사(을지로)', address: '서울 중구 을지로 100', phone: '02-6200-3003' },
  { id: 'br-miraero-gyeongin', insurerId: 'ins-miraero', region: '경기·인천', name: '미래로화재 인천지점', address: '인천 남동구 예술로 152', phone: '032-430-3003' },
  { id: 'br-miraero-daejeon', insurerId: 'ins-miraero', region: '대전·충청', name: '미래로화재 대전지점', address: '대전 서구 둔산중로 78', phone: '042-483-3003' },
  { id: 'br-miraero-busan', insurerId: 'ins-miraero', region: '부산·경남', name: '미래로화재 창원지점', address: '경남 창원시 성산구 중앙대로 89', phone: '055-264-3003' },

  // 새롬손해보험
  { id: 'br-saerom-seoul', insurerId: 'ins-saerom', region: '서울', name: '새롬손해보험 본사(광화문)', address: '서울 종로구 새문안로 68', phone: '02-2100-4004' },
  { id: 'br-saerom-gangwon', insurerId: 'ins-saerom', region: '강원', name: '새롬손해보험 춘천지점', address: '강원 춘천시 중앙로 23', phone: '033-256-4004' },
  { id: 'br-saerom-jeju', insurerId: 'ins-saerom', region: '제주', name: '새롬손해보험 제주지점', address: '제주 제주시 첨단로 213', phone: '064-720-4004' },

  // 하나로생명
  { id: 'br-hana-seoul', insurerId: 'ins-hana', region: '서울', name: '하나로생명 본사(잠실)', address: '서울 송파구 올림픽로 300', phone: '02-1644-5005' },
  { id: 'br-hana-busan', insurerId: 'ins-hana', region: '부산·경남', name: '하나로생명 부산지점', address: '부산 해운대구 센텀중앙로 79', phone: '051-780-5005' },
  { id: 'br-hana-daegu', insurerId: 'ins-hana', region: '대구·경북', name: '하나로생명 포항지점', address: '경북 포항시 남구 중앙로 21', phone: '054-273-5005' },
];

export function branchesByRegion(region: string): Branch[] {
  return branches.filter((b) => b.region === region);
}

export function countByRegion(region: string): number {
  return branches.reduce((n, b) => (b.region === region ? n + 1 : n), 0);
}
